import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "../../../../lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userName } = body;
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 },
      );
    }

    // Get session
    const session = dataStore.collaborationSessions.get(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if session is locked
    if (session.is_locked) {
      return NextResponse.json({ error: "Session is locked" }, { status: 403 });
    }

    // Check if session has expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Session has expired" },
        { status: 410 },
      );
    }

    // Check participant count
    let participantCount = 0;
    for (const [
      key,
      participant,
    ] of dataStore.collaborationParticipants.entries()) {
      if (key.startsWith(`${sessionId}_`) && participant.is_active) {
        participantCount++;
      }
    }

    if (participantCount >= session.max_participants) {
      return NextResponse.json({ error: "Session is full" }, { status: 403 });
    }

    // Check if user is already a participant
    const participantKey = `${sessionId}_${userId}`;
    let participant = dataStore.collaborationParticipants.get(participantKey);

    if (participant) {
      // Reactivate existing participant
      participant.is_active = true;
      participant.last_seen_at = new Date().toISOString();
      participant.user_name = userName || participant.user_name;
    } else {
      // Create new participant
      participant = {
        id: `participant_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        session_id: sessionId,
        user_id: userId,
        user_name: userName || "Anonymous",
        user_color: generateUserColor(userId),
        user_avatar: null,
        joined_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        is_active: true,
        is_host: false,
      };
    }

    dataStore.collaborationParticipants.set(participantKey, participant);

    // Update session activity
    session.last_activity = new Date().toISOString();
    dataStore.collaborationSessions.set(sessionId, session);

    // Get all active participants
    const participants = [];
    for (const [key, p] of dataStore.collaborationParticipants.entries()) {
      if (key.startsWith(`${sessionId}_`) && p.is_active) {
        participants.push(p);
      }
    }

    return NextResponse.json({
      session: {
        ...session,
        participants,
      },
    });
  } catch (error) {
    console.error("Join session error:", error);
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

    // Deactivate participant
    const participantKey = `${sessionId}_${userId}`;
    const participant = dataStore.collaborationParticipants.get(participantKey);

    if (participant) {
      participant.is_active = false;
      participant.last_seen_at = new Date().toISOString();
      dataStore.collaborationParticipants.set(participantKey, participant);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave session error:", error);
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
