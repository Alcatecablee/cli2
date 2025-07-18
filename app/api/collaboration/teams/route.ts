import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "../../../../lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get teams where user is a member
    const userTeams = [];
    for (const [teamId, team] of dataStore.teams.entries()) {
      const memberKey = `${teamId}_${userId}`;
      const membership = dataStore.teamMembers.get(memberKey);

      if (membership) {
        // Get all team members
        const members = [];
        for (const [key, member] of dataStore.teamMembers.entries()) {
          if (key.startsWith(`${teamId}_`)) {
            members.push({
              ...member,
              status:
                Math.random() > 0.3
                  ? "online"
                  : Math.random() > 0.5
                    ? "away"
                    : "offline",
              lastSeen: new Date(Date.now() - Math.random() * 86400000), // Random within last day
            });
          }
        }

        userTeams.push({
          ...team,
          members,
          userRole: membership.role,
        });
      }
    }

    return NextResponse.json({ teams: userTeams });
  } catch (error) {
    console.error("Teams API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const userId = request.headers.get("x-user-id");
    const userName = request.headers.get("x-user-name") || "Anonymous";

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 },
      );
    }

    // Create team
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const team = {
      id: teamId,
      name: name.trim(),
      description: description?.trim() || "",
      owner_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings: {
        default_permissions: "write",
        allow_invites: true,
        require_approval: false,
      },
    };

    dataStore.teams.set(teamId, team);

    // Add creator as owner
    const memberKey = `${teamId}_${userId}`;
    const membership = {
      id: `member_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      team_id: teamId,
      user_id: userId,
      user_name: userName,
      user_email: "", // Would get from user profile in production
      role: "owner" as const,
      joined_at: new Date().toISOString(),
      status: "active" as const,
    };

    dataStore.teamMembers.set(memberKey, membership);

    return NextResponse.json({
      team: {
        ...team,
        members: [{ ...membership, status: "online", lastSeen: new Date() }],
        userRole: "owner",
      },
    });
  } catch (error) {
    console.error("Team creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const userId = request.headers.get("x-user-id");

    if (!userId || !teamId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const team = dataStore.teams.get(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Only owner can delete team
    if (team.owner_id !== userId) {
      return NextResponse.json(
        { error: "Only team owner can delete team" },
        { status: 403 },
      );
    }

    // Remove team and all related data
    dataStore.teams.delete(teamId);

    // Remove all team members
    for (const [key] of dataStore.teamMembers.entries()) {
      if (key.startsWith(`${teamId}_`)) {
        dataStore.teamMembers.delete(key);
      }
    }

    // Remove team projects
    for (const [key] of dataStore.teamProjects.entries()) {
      if (key.startsWith(`${teamId}_`)) {
        dataStore.teamProjects.delete(key);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
