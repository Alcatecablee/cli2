import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "../../../../lib/data-store";

interface ActivityEvent {
  id: string;
  type:
    | "session_created"
    | "session_joined"
    | "session_left"
    | "document_edited"
    | "comment_added"
    | "analysis_run"
    | "member_invited"
    | "member_joined";
  session_id?: string;
  team_id?: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  timestamp: string;
  details: any;
}

// In-memory activity store (would be database in production)
const activityStore = new Map<string, ActivityEvent>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get("x-user-id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sessionId = searchParams.get("sessionId");
    const teamId = searchParams.get("teamId");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get relevant activities
    let activities: ActivityEvent[] = [];

    for (const activity of activityStore.values()) {
      // Include activity if:
      // 1. User is involved directly
      // 2. User is in the same session
      // 3. User is in the same team
      // 4. No specific filter is applied (show all user's related activities)

      let includeActivity = false;

      if (activity.user_id === userId) {
        includeActivity = true;
      } else if (sessionId && activity.session_id === sessionId) {
        // Check if user is participant in this session
        const participantKey = `${sessionId}_${userId}`;
        const isParticipant =
          dataStore.collaborationParticipants.has(participantKey);
        includeActivity = isParticipant;
      } else if (teamId && activity.team_id === teamId) {
        // Check if user is member of this team
        const memberKey = `${teamId}_${userId}`;
        const isMember = dataStore.teamMembers.has(memberKey);
        includeActivity = isMember;
      } else if (!sessionId && !teamId) {
        // For general feed, include activities from sessions where user participates
        if (activity.session_id) {
          const participantKey = `${activity.session_id}_${userId}`;
          const isParticipant =
            dataStore.collaborationParticipants.has(participantKey);
          includeActivity = isParticipant;
        }

        // Or activities from teams where user is member
        if (activity.team_id) {
          const memberKey = `${activity.team_id}_${userId}`;
          const isMember = dataStore.teamMembers.has(memberKey);
          includeActivity = includeActivity || isMember;
        }
      }

      if (includeActivity) {
        activities.push(activity);
      }
    }

    // Sort by timestamp (newest first)
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // Apply limit
    activities = activities.slice(0, limit);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Activity API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, sessionId, teamId, details } = body;
    const userId = request.headers.get("x-user-id");
    const userName = request.headers.get("x-user-name") || "Anonymous";

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Activity type is required" },
        { status: 400 },
      );
    }

    // Create activity event
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const activity: ActivityEvent = {
      id: activityId,
      type,
      session_id: sessionId,
      team_id: teamId,
      user_id: userId,
      user_name: userName,
      timestamp: new Date().toISOString(),
      details: details || {},
    };

    activityStore.set(activityId, activity);

    // Clean up old activities (keep last 1000)
    if (activityStore.size > 1000) {
      const sortedActivities = Array.from(activityStore.values()).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      // Keep newest 800 activities
      const toKeep = sortedActivities.slice(0, 800);
      activityStore.clear();

      for (const activity of toKeep) {
        activityStore.set(activity.id, activity);
      }
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Activity creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
