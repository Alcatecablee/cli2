import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "../../../../lib/data-store";

// Initialize collaboration data stores if not exists
if (!dataStore.collaborationSessions) {
  dataStore.collaborationSessions = new Map();
  dataStore.collaborationParticipants = new Map();
  dataStore.collaborationComments = new Map();
  dataStore.collaborationAnalysis = new Map();
}

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
      const session = dataStore.collaborationSessions.get(sessionId);

      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }

      // Check if user is a participant
      const participantKey = `${sessionId}_${userId}`;
      const isParticipant =
        dataStore.collaborationParticipants.has(participantKey);

      if (!isParticipant) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      // Get all active participants for this session
      const participants = [];
      for (const [
        key,
        participant,
      ] of dataStore.collaborationParticipants.entries()) {
        if (key.startsWith(`${sessionId}_`) && participant.is_active) {
          participants.push(participant);
        }
      }

      return NextResponse.json({
        session: {
          ...session,
          participants,
        },
      });
    } else {
      // Get user's sessions
      const userSessions = [];

      for (const [
        sessionId,
        session,
      ] of dataStore.collaborationSessions.entries()) {
        const participantKey = `${sessionId}_${userId}`;
        const participant =
          dataStore.collaborationParticipants.get(participantKey);

        if (participant && participant.is_active) {
          userSessions.push(session);
        }
      }

      // Sort by last activity
      userSessions.sort(
        (a, b) =>
          new Date(b.last_activity).getTime() -
          new Date(a.last_activity).getTime(),
      );

      return NextResponse.json({ sessions: userSessions });
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

    // Create session
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

    // Store session in data store
    dataStore.collaborationSessions.set(sessionId, session);
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
