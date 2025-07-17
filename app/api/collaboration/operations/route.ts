import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, operation } = body;
    const userId = request.headers.get("x-user-id");

    if (!userId || !sessionId || !operation) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // Verify user is active participant
    const { data: participant, error: participantError } = await supabase
      .from("collaboration_participants")
      .select("is_active, is_host")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (participantError || !participant) {
      return NextResponse.json(
        { error: "Not an active participant" },
        { status: 403 },
      );
    }

    // Check if session is locked (only host can edit)
    const { data: session } = await supabase
      .from("collaboration_sessions")
      .select("is_locked, host_user_id")
      .eq("id", sessionId)
      .single();

    if (session?.is_locked && session.host_user_id !== userId) {
      return NextResponse.json(
        { error: "Session is locked by host" },
        { status: 403 },
      );
    }

    // Validate operation
    const validationError = validateOperation(operation);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Get current revision
    const { data: lastOp } = await supabase
      .from("collaboration_operations")
      .select("revision")
      .eq("session_id", sessionId)
      .order("revision", { ascending: false })
      .limit(1)
      .single();

    const currentRevision = lastOp?.revision || 0;
    const newRevision = currentRevision + 1;

    // Apply operational transform if needed
    const transformedOperation = await applyOperationalTransform(
      operation,
      sessionId,
      operation.base_revision || currentRevision,
    );

    // Store operation
    const { data: newOperation, error: opError } = await supabase
      .from("collaboration_operations")
      .insert({
        session_id: sessionId,
        user_id: userId,
        operation_type: transformedOperation.type,
        position: transformedOperation.position,
        content: transformedOperation.content,
        length: transformedOperation.length,
        old_length: transformedOperation.old_length,
        base_revision: transformedOperation.base_revision || currentRevision,
        revision: newRevision,
        metadata: transformedOperation.metadata || {},
      })
      .select()
      .single();

    if (opError) {
      console.error("Operation storage error:", opError);
      return NextResponse.json(
        { error: "Failed to store operation" },
        { status: 500 },
      );
    }

    // Apply operation to document
    const { data: currentSession } = await supabase
      .from("collaboration_sessions")
      .select("document_content")
      .eq("id", sessionId)
      .single();

    if (currentSession) {
      const newContent = applyOperationToContent(
        currentSession.document_content,
        transformedOperation,
      );

      // Update session document
      await supabase
        .from("collaboration_sessions")
        .update({
          document_content: newContent,
          updated_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    return NextResponse.json({
      operation: newOperation,
      revision: newRevision,
      success: true,
    });
  } catch (error) {
    console.error("Operations API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const sinceRevision = parseInt(searchParams.get("since") || "0");
    const userId = request.headers.get("x-user-id");

    if (!userId || !sessionId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify user is participant
    const { data: participant } = await supabase
      .from("collaboration_participants")
      .select("is_active")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "Not an active participant" },
        { status: 403 },
      );
    }

    // Get operations since revision
    const { data: operations, error } = await supabase
      .from("collaboration_operations")
      .select(
        `
        *,
        collaboration_participants!user_id(user_name, user_color)
      `,
      )
      .eq("session_id", sessionId)
      .gt("revision", sinceRevision)
      .order("revision", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch operations" },
        { status: 500 },
      );
    }

    return NextResponse.json({ operations: operations || [] });
  } catch (error) {
    console.error("Get operations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function validateOperation(operation: any): string | null {
  if (
    !operation.type ||
    !["insert", "delete", "replace"].includes(operation.type)
  ) {
    return "Invalid operation type";
  }

  if (typeof operation.position !== "number" || operation.position < 0) {
    return "Invalid position";
  }

  if (operation.type === "insert" || operation.type === "replace") {
    if (typeof operation.content !== "string") {
      return "Content required for insert/replace operations";
    }
    if (operation.content.length > 10000) {
      return "Content too large";
    }
  }

  if (operation.type === "delete" || operation.type === "replace") {
    if (typeof operation.length !== "number" || operation.length <= 0) {
      return "Length required for delete operations";
    }
  }

  return null;
}

async function applyOperationalTransform(
  operation: any,
  sessionId: string,
  baseRevision: number,
): Promise<any> {
  // Get concurrent operations
  const { data: concurrentOps } = await supabase
    .from("collaboration_operations")
    .select("*")
    .eq("session_id", sessionId)
    .gt("revision", baseRevision)
    .order("revision", { ascending: true });

  if (!concurrentOps || concurrentOps.length === 0) {
    return operation;
  }

  let transformedOp = { ...operation };

  // Transform against each concurrent operation
  for (const concurrentOp of concurrentOps) {
    transformedOp = transformOperations(transformedOp, concurrentOp);
  }

  return transformedOp;
}

function transformOperations(op1: any, op2: any): any {
  // Simple operational transform implementation
  if (op1.type === "insert" && op2.type === "insert") {
    if (op1.position <= op2.position) {
      return op1;
    } else {
      return {
        ...op1,
        position: op1.position + (op2.content?.length || 0),
      };
    }
  }

  if (op1.type === "delete" && op2.type === "insert") {
    if (op1.position <= op2.position) {
      return op1;
    } else {
      return {
        ...op1,
        position: op1.position + (op2.content?.length || 0),
      };
    }
  }

  if (op1.type === "insert" && op2.type === "delete") {
    if (op1.position <= op2.position) {
      return op1;
    } else if (op1.position >= op2.position + op2.length) {
      return {
        ...op1,
        position: op1.position - op2.length,
      };
    } else {
      return {
        ...op1,
        position: op2.position,
      };
    }
  }

  if (op1.type === "delete" && op2.type === "delete") {
    if (op1.position >= op2.position + op2.length) {
      return {
        ...op1,
        position: op1.position - op2.length,
      };
    } else if (op1.position + op1.length <= op2.position) {
      return op1;
    } else {
      // Overlapping deletes - adjust length
      const start1 = op1.position;
      const end1 = op1.position + op1.length;
      const start2 = op2.position;
      const end2 = op2.position + op2.length;

      if (start1 >= start2 && end1 <= end2) {
        // op1 is encompassed by op2
        return { ...op1, length: 0 };
      } else if (start1 < start2 && end1 > end2) {
        // op1 encompasses op2
        return { ...op1, length: op1.length - op2.length };
      } else {
        // Partial overlap
        const newStart = Math.max(
          start1,
          start2 - Math.max(0, start2 - start1),
        );
        const newEnd = Math.min(end1, start2);
        return {
          ...op1,
          position: newStart,
          length: Math.max(0, newEnd - newStart),
        };
      }
    }
  }

  return op1;
}

function applyOperationToContent(content: string, operation: any): string {
  try {
    switch (operation.type) {
      case "insert":
        return (
          content.slice(0, operation.position) +
          operation.content +
          content.slice(operation.position)
        );

      case "delete":
        return (
          content.slice(0, operation.position) +
          content.slice(operation.position + operation.length)
        );

      case "replace":
        return (
          content.slice(0, operation.position) +
          operation.content +
          content.slice(
            operation.position + (operation.old_length || operation.length),
          )
        );

      default:
        return content;
    }
  } catch (error) {
    console.error("Failed to apply operation to content:", error);
    return content;
  }
}
