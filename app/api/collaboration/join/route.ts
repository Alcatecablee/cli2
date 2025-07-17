import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userName } = body;
    const userId = request.headers.get("x-user-id") || generateUserId();

    if (!sessionId || !userName) {
      return NextResponse.json(
        { error: "Session ID and user name required" },
        { status: 400 },
      );
    }

    // Check if session exists and is not expired
    const { data: session, error: sessionError } = await supabase
      .from("collaboration_sessions")
      .select("*")
      .eq("id", sessionId)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 404 },
      );
    }

    // Check if session is locked
    if (session.is_locked) {
      return NextResponse.json(
        { error: "Session is locked by host" },
        { status: 403 },
      );
    }

    // Check participant limit
    const { count: participantCount } = await supabase
      .from("collaboration_participants")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .eq("is_active", true);

    if (participantCount && participantCount >= session.max_participants) {
      return NextResponse.json({ error: "Session is full" }, { status: 403 });
    }

    // Check if user is already in session
    const { data: existingParticipant } = await supabase
      .from("collaboration_participants")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .single();

    if (existingParticipant) {
      // Reactivate existing participant
      const { error: updateError } = await supabase
        .from("collaboration_participants")
        .update({
          is_active: true,
          last_seen_at: new Date().toISOString(),
          user_name: userName,
        })
        .eq("id", existingParticipant.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to rejoin session" },
          { status: 500 },
        );
      }

      // Get updated session data
      const { data: updatedSession } = await supabase
        .from("collaboration_sessions")
        .select(
          `
          *,
          collaboration_participants(
            user_id,
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
        .single();

      return NextResponse.json({
        session: updatedSession,
        userId,
        isRejoining: true,
      });
    }

    // Add new participant
    const userColor = generateUserColor(userId);
    const { error: participantError } = await supabase
      .from("collaboration_participants")
      .insert({
        session_id: sessionId,
        user_id: userId,
        user_name: userName,
        user_color: userColor,
        is_host: false,
        is_active: true,
      });

    if (participantError) {
      console.error("Participant creation error:", participantError);
      return NextResponse.json(
        { error: "Failed to join session" },
        { status: 500 },
      );
    }

    // Update session activity
    await supabase
      .from("collaboration_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("id", sessionId);

    // Get updated session data with all participants
    const { data: updatedSession } = await supabase
      .from("collaboration_sessions")
      .select(
        `
        *,
        collaboration_participants(
          user_id,
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
      .single();

    // Add system message about user joining
    await supabase.from("collaboration_comments").insert({
      session_id: sessionId,
      user_id: userId,
      author_name: "System",
      content: `${userName} joined the session`,
      line_number: 0,
      comment_type: "system",
    });

    return NextResponse.json({
      session: updatedSession,
      userId,
      isRejoining: false,
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

    if (!sessionId || !userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Mark participant as inactive
    const { error } = await supabase
      .from("collaboration_participants")
      .update({
        is_active: false,
        last_seen_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to leave session" },
        { status: 500 },
      );
    }

    // Add system message about user leaving
    const { data: participant } = await supabase
      .from("collaboration_participants")
      .select("user_name")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .single();

    if (participant) {
      await supabase.from("collaboration_comments").insert({
        session_id: sessionId,
        user_id: userId,
        author_name: "System",
        content: `${participant.user_name} left the session`,
        line_number: 0,
        comment_type: "system",
      });
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

function generateUserId(): string {
  return (
    "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  );
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
