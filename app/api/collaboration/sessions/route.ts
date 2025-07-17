import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "../../../../lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = request.headers.get("x-user-id");

    console.log("[COLLAB GET] Request:", {
      sessionId,
      userId,
      hasDataStore: !!dataStore,
    });

    if (!userId) {
      console.log("[COLLAB GET] No user ID provided");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (sessionId) {
      // Get specific session
      console.log("[COLLAB GET] Looking for session:", sessionId);
      console.log(
        "[COLLAB GET] Available sessions:",
        Array.from(dataStore.collaborationSessions.keys()),
      );

      const session = dataStore.collaborationSessions.get(sessionId);

      if (!session) {
        console.log("[COLLAB GET] Session not found:", sessionId);
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
    const participant = {
      id: `participant_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      session_id: sessionId,
      user_id: userId,
      user_name: userName,
      user_color: userColor,
      user_avatar: null,
      joined_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      is_active: true,
      is_host: true,
    };

    // Store participant in data store
    const participantKey = `${sessionId}_${userId}`;
    dataStore.collaborationParticipants.set(participantKey, participant);
    const participantError = null;

    return NextResponse.json({
      session: {
        ...session,
        participants: [participant],
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

    const session = dataStore.collaborationSessions.get(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    switch (action) {
      case "update_document":
        const { content } = data;

        // Check if user is host or participant
        const participantKey = `${sessionId}_${userId}`;
        const participant =
          dataStore.collaborationParticipants.get(participantKey);

        if (!participant || !participant.is_active) {
          return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Update session document
        session.document_content = content;
        session.updated_at = new Date().toISOString();
        session.last_activity = new Date().toISOString();

        dataStore.collaborationSessions.set(sessionId, session);

        return NextResponse.json({ success: true });

      case "lock_session":
        // Only host can lock session
        if (session.host_user_id !== userId) {
          return NextResponse.json(
            { error: "Only host can lock session" },
            { status: 403 },
          );
        }

        session.is_locked = data.locked;
        session.updated_at = new Date().toISOString();
        dataStore.collaborationSessions.set(sessionId, session);

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

    const session = dataStore.collaborationSessions.get(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Only host can delete session
    if (session.host_user_id !== userId) {
      return NextResponse.json(
        { error: "Only host can delete session" },
        { status: 403 },
      );
    }

    // Remove session and all related data
    dataStore.collaborationSessions.delete(sessionId);

    // Remove all participants
    for (const [key] of dataStore.collaborationParticipants.entries()) {
      if (key.startsWith(`${sessionId}_`)) {
        dataStore.collaborationParticipants.delete(key);
      }
    }

    // Remove all comments
    for (const [key] of dataStore.collaborationComments.entries()) {
      if (key.startsWith(`${sessionId}_`)) {
        dataStore.collaborationComments.delete(key);
      }
    }

    // Remove all analysis
    for (const [key] of dataStore.collaborationAnalysis.entries()) {
      if (key.startsWith(`${sessionId}_`)) {
        dataStore.collaborationAnalysis.delete(key);
      }
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
