import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "../../../../lib/data-store";

interface PresenceInfo {
  userId: string;
  userName: string;
  userColor: string;
  sessionId?: string;
  status: "online" | "away" | "offline";
  lastSeen: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

// In-memory presence store (would use Redis or similar in production)
const presenceStore = new Map<string, PresenceInfo>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let presenceData: PresenceInfo[] = [];

    if (sessionId) {
      // Get presence for specific session
      for (const presence of presenceStore.values()) {
        if (presence.sessionId === sessionId && presence.status !== "offline") {
          presenceData.push(presence);
        }
      }
    } else {
      // Get all online users
      for (const presence of presenceStore.values()) {
        if (presence.status !== "offline") {
          presenceData.push(presence);
        }
      }
    }

    // Clean up stale presence (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    for (const [key, presence] of presenceStore.entries()) {
      if (new Date(presence.lastSeen) < fiveMinutesAgo) {
        presenceStore.delete(key);
      }
    }

    return NextResponse.json({ presence: presenceData });
  } catch (error) {
    console.error("Presence API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {\n    const body = await request.json();\n    const { sessionId, status, cursor, selection } = body;\n    const userId = request.headers.get(\"x-user-id\");\n    const userName = request.headers.get(\"x-user-name\") || \"Anonymous\";\n\n    if (!userId) {\n      return NextResponse.json(\n        { error: \"Authentication required\" },\n        { status: 401 }\n      );\n    }\n\n    // Generate consistent color for user\n    const userColor = generateUserColor(userId);\n\n    const presenceKey = sessionId ? `${sessionId}_${userId}` : userId;\n    const presence: PresenceInfo = {\n      userId,\n      userName,\n      userColor,\n      sessionId,\n      status: status || \"online\",\n      lastSeen: new Date().toISOString(),\n      cursor,\n      selection,\n    };\n\n    presenceStore.set(presenceKey, presence);\n\n    // Broadcast presence update to other participants\n    const otherParticipants: PresenceInfo[] = [];\n    if (sessionId) {\n      for (const [key, p] of presenceStore.entries()) {\n        if (key.startsWith(`${sessionId}_`) && p.userId !== userId && p.status !== \"offline\") {\n          otherParticipants.push(p);\n        }\n      }\n    }\n\n    return NextResponse.json({ \n      presence,\n      otherParticipants \n    });\n  } catch (error) {\n    console.error(\"Presence update error:\", error);\n    return NextResponse.json(\n      { error: \"Internal server error\" },\n      { status: 500 }\n    );\n  }\n}\n\nexport async function DELETE(request: NextRequest) {\n  try {\n    const { searchParams } = new URL(request.url);\n    const sessionId = searchParams.get(\"sessionId\");\n    const userId = request.headers.get(\"x-user-id\");\n\n    if (!userId) {\n      return NextResponse.json(\n        { error: \"Authentication required\" },\n        { status: 401 }\n      );\n    }\n\n    const presenceKey = sessionId ? `${sessionId}_${userId}` : userId;\n    \n    // Mark as offline instead of deleting\n    const presence = presenceStore.get(presenceKey);\n    if (presence) {\n      presence.status = \"offline\";\n      presence.lastSeen = new Date().toISOString();\n      presenceStore.set(presenceKey, presence);\n    }\n\n    return NextResponse.json({ success: true });\n  } catch (error) {\n    console.error(\"Presence deletion error:\", error);\n    return NextResponse.json(\n      { error: \"Internal server error\" },\n      { status: 500 }\n    );\n  }\n}\n\nfunction generateUserColor(userId: string): string {\n  const colors = [\n    \"#2196f3\",\n    \"#4caf50\",\n    \"#ff9800\",\n    \"#e91e63\",\n    \"#9c27b0\",\n    \"#00bcd4\",\n    \"#ff5722\",\n    \"#795548\",\n    \"#607d8b\",\n    \"#f44336\",\n    \"#cddc39\",\n    \"#ffc107\",\n  ];\n\n  const hash = userId\n    .split(\"\")\n    .reduce((acc, char) => acc + char.charCodeAt(0), 0);\n  return colors[hash % colors.length];\n}