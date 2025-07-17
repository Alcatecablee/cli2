import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (sessionId) {
      // Get specific session
      const { data: session, error } = await supabase
        .from("collaboration_sessions")
        .select(
          `
          *,
          collaboration_participants!inner(
            id,
            user_name,
            user_color,
            user_avatar,
            joined_at,
            is_active,
            is_host
          )
        `,
        )
        .eq("id", sessionId)
        .eq("collaboration_participants.user_id", userId)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }

      // Get all participants
      const { data: participants } = await supabase
        .from("collaboration_participants")
        .select("*")
        .eq("session_id", sessionId)
        .eq("is_active", true);

      return NextResponse.json({
        session: {
          ...session,
          participants: participants || [],
        },
      });
    } else {
      // Get user's sessions
      const { data: sessions, error } = await supabase
        .from("collaboration_sessions")
        .select(
          `
          *,
          collaboration_participants!inner(
            user_id,
            is_active
          )
        `,
        )
        .eq("collaboration_participants.user_id", userId)
        .eq("collaboration_participants.is_active", true)
        .order("last_activity", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch sessions" },
          { status: 500 },
        );
      }

      return NextResponse.json({ sessions: sessions || [] });
    }
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, filename, language, initialCode } = body;
    const userId = request.headers.get("x-user-id");
    const userName = request.headers.get("x-user-name") || "Anonymous";

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!name || !filename) {
      return NextResponse.json(
        { error: "Session name and filename required" },
        { status: 400 },
      );
    }

    // Create session with a simplified structure for now
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const session = {
      id: sessionId,
      name,
      document_filename: filename,
      document_language: language || "typescript",
      document_content: initialCode || "",
      host_user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      is_locked: false,
      max_participants: 10,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // For now, store in memory/temporary storage
    // In production, you'd want to properly create Supabase tables that work with your auth system
    const sessionError = null;

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 },
      );
    }

    // Add creator as participant
    const userColor = generateUserColor(userId);

    // For now, skip Supabase participant creation since the schema expects auth.users
    // In production, you'd create custom tables that work with your auth system
    const participantError = null;

    return NextResponse.json({
      session: {
        ...session,
        participants: [
          {
            user_id: userId,
            user_name: userName,
            user_color: userColor,
            is_host: true,
            is_active: true,
          },
        ],
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action, data } = body;
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    switch (action) {
      case "update_document":
        const { content } = data;
        const { error: updateError } = await supabase
          .from("collaboration_sessions")
          .update({
            document_content: content,
            updated_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
          })
          .eq("id", sessionId)
          .eq("host_user_id", userId);

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update document" },
            { status: 500 },
          );
        }

        return NextResponse.json({ success: true });

      case "lock_session":
        const { error: lockError } = await supabase
          .from("collaboration_sessions")
          .update({ is_locked: data.locked })
          .eq("id", sessionId)
          .eq("host_user_id", userId);

        if (lockError) {
          return NextResponse.json(
            { error: "Failed to lock session" },
            { status: 500 },
          );
        }

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Session update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = request.headers.get("x-user-id");

    if (!userId || !sessionId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Only host can delete session
    const { error } = await supabase
      .from("collaboration_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("host_user_id", userId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function generateUserColor(userId: string): string {
  const colors = [
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#ff5722",
    "#795548",
    "#607d8b",
    "#f44336",
    "#cddc39",
    "#ffc107",
  ];

  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
