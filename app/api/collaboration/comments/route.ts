import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, content, lineNumber, commentType = "comment" } = body;
    const userId = request.headers.get("x-user-id");
    const userName = request.headers.get("x-user-name") || "Anonymous";

    if (!userId || !sessionId || !content) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // Verify user is active participant
    const { data: participant, error: participantError } = await supabase
      .from("collaboration_participants")
      .select("is_active")
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

    // Add comment
    const { data: newComment, error: commentError } = await supabase
      .from("collaboration_comments")
      .insert({
        session_id: sessionId,
        user_id: userId,
        author_name: userName,
        content: content.trim(),
        line_number: lineNumber || 0,
        comment_type: commentType,
      })
      .select()
      .single();

    if (commentError) {
      console.error("Comment creation error:", commentError);
      return NextResponse.json(
        { error: "Failed to add comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("Comments API error:", error);
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
    const limit = parseInt(searchParams.get("limit") || "50");
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

    // Get comments
    const { data: comments, error } = await supabase
      .from("collaboration_comments")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 },
      );
    }

    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action } = body;
    const userId = request.headers.get("x-user-id");

    if (!userId || !commentId || !action) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    switch (action) {
      case "resolve":
        const { error: resolveError } = await supabase
          .from("collaboration_comments")
          .update({
            is_resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: userId,
          })
          .eq("id", commentId)
          .eq("user_id", userId); // Only author can resolve their own comments

        if (resolveError) {
          return NextResponse.json(
            { error: "Failed to resolve comment" },
            { status: 500 },
          );
        }

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Update comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    const userId = request.headers.get("x-user-id");

    if (!commentId || !userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Only author can delete their comment
    const { error } = await supabase
      .from("collaboration_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
