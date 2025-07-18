import { NextRequest } from "next/server";
import { dataStore } from "../../../../lib/data-store";

// WebSocket connections store
const connections = new Map<string, Set<WebSocket>>();
const userSessions = new Map<string, string>(); // userId -> sessionId

export async function GET(request: NextRequest) {
  // Check if request is WebSocket upgrade
  const upgrade = request.headers.get("upgrade");
  if (upgrade !== "websocket") {
    return new Response("Expected WebSocket upgrade", { status: 426 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName") || "Anonymous";

    if (!sessionId || !userId) {
      return new Response("Missing sessionId or userId", { status: 400 });
    }

    // Verify session exists
    const session = dataStore.collaborationSessions.get(sessionId);
    if (!session) {
      return new Response("Session not found", { status: 404 });
    }

    // Create WebSocket connection
    const { socket, response } = upgradeWebSocket(request);

    socket.onopen = () => {
      console.log(`[WS] User ${userId} connected to session ${sessionId}`);

      // Add to connections
      if (!connections.has(sessionId)) {
        connections.set(sessionId, new Set());
      }
      connections.get(sessionId)!.add(socket);
      userSessions.set(userId, sessionId);

      // Send initial session state
      socket.send(
        JSON.stringify({
          type: "session_state",
          data: {
            session,
            participants: getActiveParticipants(sessionId),
            recentActivity: getRecentActivity(sessionId, 10),
          },
        }),
      );

      // Broadcast user joined
      broadcastToSession(
        sessionId,
        {
          type: "user_joined",
          data: { userId, userName, timestamp: new Date().toISOString() },
        },
        userId,
      );

      // Update presence
      updatePresence(sessionId, userId, userName, "online");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(sessionId, userId, userName, message, socket);
      } catch (error) {
        console.error("[WS] Invalid message format:", error);
        socket.send(
          JSON.stringify({
            type: "error",
            data: { message: "Invalid message format" },
          }),
        );
      }
    };

    socket.onclose = () => {
      console.log(`[WS] User ${userId} disconnected from session ${sessionId}`);

      // Remove from connections
      connections.get(sessionId)?.delete(socket);
      if (connections.get(sessionId)?.size === 0) {
        connections.delete(sessionId);
      }
      userSessions.delete(userId);

      // Broadcast user left
      broadcastToSession(sessionId, {
        type: "user_left",
        data: { userId, userName, timestamp: new Date().toISOString() },
      });

      // Update presence
      updatePresence(sessionId, userId, userName, "offline");
    };

    socket.onerror = (error) => {
      console.error(`[WS] Error for user ${userId}:`, error);
    };

    return response;
  } catch (error) {
    console.error("[WS] Connection error:", error);
    return new Response("WebSocket connection failed", { status: 500 });
  }
}

function handleWebSocketMessage(
  sessionId: string,
  userId: string,
  userName: string,
  message: any,
  socket: WebSocket,
) {
  const { type, data } = message;

  switch (type) {
    case "document_update":
      handleDocumentUpdate(sessionId, userId, userName, data, socket);
      break;

    case "cursor_position":
      broadcastToSession(
        sessionId,
        {
          type: "cursor_update",
          data: { userId, userName, ...data },
        },
        userId,
      );
      break;

    case "selection_change":
      broadcastToSession(
        sessionId,
        {
          type: "selection_update",
          data: { userId, userName, ...data },
        },
        userId,
      );
      break;

    case "analysis_request":
      handleAnalysisRequest(sessionId, userId, userName, data, socket);
      break;

    case "ping":
      socket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
      updatePresence(sessionId, userId, userName, "online");
      break;

    default:
      socket.send(
        JSON.stringify({
          type: "error",
          data: { message: `Unknown message type: ${type}` },
        }),
      );
  }
}

function handleDocumentUpdate(
  sessionId: string,
  userId: string,
  userName: string,
  data: any,
  socket: WebSocket,
) {
  try {
    const session = dataStore.collaborationSessions.get(sessionId);
    if (!session) {
      socket.send(
        JSON.stringify({
          type: "error",
          data: { message: "Session not found" },
        }),
      );
      return;
    }

    if (session.is_locked && session.host_user_id !== userId) {
      socket.send(
        JSON.stringify({
          type: "error",
          data: { message: "Session is locked" },
        }),
      );
      return;
    }

    // Implement conflict resolution
    const conflict = detectConflict(
      session.document_content,
      data.content,
      data.version,
    );

    if (conflict.hasConflict) {
      // Send conflict resolution request
      socket.send(
        JSON.stringify({
          type: "conflict_detected",
          data: {
            conflictId: conflict.id,
            serverVersion: session.document_content,
            userChanges: data.content,
            conflictRanges: conflict.ranges,
          },
        }),
      );
      return;
    }

    // Update document
    session.document_content = data.content;
    session.updated_at = new Date().toISOString();
    session.last_activity = new Date().toISOString();
    dataStore.collaborationSessions.set(sessionId, session);

    // Broadcast update to other participants
    broadcastToSession(
      sessionId,
      {
        type: "document_updated",
        data: {
          content: data.content,
          updatedBy: userId,
          updatedByName: userName,
          timestamp: new Date().toISOString(),
          version: data.version + 1,
        },
      },
      userId,
    );

    // Track activity
    trackActivity(sessionId, "document_edited", userId, userName, {
      changeSize: Math.abs(
        data.content.length - session.document_content.length,
      ),
    });
  } catch (error) {
    console.error("[WS] Document update error:", error);
    socket.send(
      JSON.stringify({
        type: "error",
        data: { message: "Failed to update document" },
      }),
    );
  }
}

async function handleAnalysisRequest(
  sessionId: string,
  userId: string,
  userName: string,
  data: any,
  socket: WebSocket,
) {
  try {
    // Broadcast analysis started
    broadcastToSession(sessionId, {
      type: "analysis_started",
      data: { userId, userName, layers: data.layers },
    });

    // Call analysis API with enhanced options
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/collaboration/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
          "x-user-name": userName,
        },
        body: JSON.stringify({
          sessionId,
          layers: data.layers,
          dryRun: data.dryRun,
          collaborative: true,
          realTimeUpdates: true,
          participantId: userId,
          sessionLocking: data.sessionLocking || false,
          conflictResolution: data.conflictResolution || "merge",
        }),
      },
    );

    if (response.ok) {
      const result = await response.json();

      // Broadcast analysis completed
      broadcastToSession(sessionId, {
        type: "analysis_completed",
        data: {
          ...result.result,
          triggeredBy: userId,
          triggeredByName: userName,
        },
      });

      // Track activity
      trackActivity(sessionId, "analysis_run", userId, userName, {
        layers: data.layers,
        success: result.result.success,
        issuesFound: result.result.analysis?.detectedIssues?.length || 0,
      });
    } else {
      const error = await response.json();
      broadcastToSession(sessionId, {
        type: "analysis_failed",
        data: { error: error.error, triggeredBy: userId },
      });
    }
  } catch (error) {
    console.error("[WS] Analysis request error:", error);
    broadcastToSession(sessionId, {
      type: "analysis_failed",
      data: { error: "Analysis request failed", triggeredBy: userId },
    });
  }
}

function broadcastToSession(
  sessionId: string,
  message: any,
  excludeUserId?: string,
) {
  const sessionConnections = connections.get(sessionId);
  if (!sessionConnections) return;

  const messageStr = JSON.stringify(message);
  sessionConnections.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(messageStr);
    }
  });
}

function detectConflict(
  serverContent: string,
  userContent: string,
  userVersion: number,
): {
  hasConflict: boolean;
  id?: string;
  ranges?: Array<{
    start: number;
    end: number;
    type: "added" | "deleted" | "modified";
  }>;
} {
  // Simple conflict detection - in production, use more sophisticated diff algorithm
  const serverLines = serverContent.split("\n");
  const userLines = userContent.split("\n");

  // For now, detect conflicts based on significant differences
  const lineDifference = Math.abs(serverLines.length - userLines.length);
  const hasConflict =
    lineDifference > 5 ||
    (serverContent.length > 0 &&
      userContent.length > 0 &&
      Math.abs(serverContent.length - userContent.length) > 100);

  if (hasConflict) {
    return {
      hasConflict: true,
      id: `conflict_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      ranges: [{ start: 0, end: userContent.length, type: "modified" }],
    };
  }

  return { hasConflict: false };
}

function updatePresence(
  sessionId: string,
  userId: string,
  userName: string,
  status: string,
) {
  // Update presence in data store for persistence
  const presenceKey = `${sessionId}_${userId}`;
  const presence = {
    userId,
    userName,
    sessionId,
    status,
    lastSeen: new Date().toISOString(),
    userColor: generateUserColor(userId),
  };

  if (!dataStore.collaborationPresence) {
    dataStore.collaborationPresence = new Map();
  }
  dataStore.collaborationPresence.set(presenceKey, presence);
}

function getActiveParticipants(sessionId: string): any[] {
  const participants = [];
  for (const [
    key,
    participant,
  ] of dataStore.collaborationParticipants.entries()) {
    if (key.startsWith(`${sessionId}_`) && participant.is_active) {
      participants.push(participant);
    }
  }
  return participants;
}

function getRecentActivity(sessionId: string, limit: number): any[] {
  // Implementation for getting recent activity
  return [];
}

function trackActivity(
  sessionId: string,
  type: string,
  userId: string,
  userName: string,
  details: any,
) {
  // Track activity for the activity feed
  const activityId = `activity_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const activity = {
    id: activityId,
    type,
    session_id: sessionId,
    user_id: userId,
    user_name: userName,
    timestamp: new Date().toISOString(),
    details,
  };

  if (!dataStore.collaborationActivity) {
    dataStore.collaborationActivity = new Map();
  }
  dataStore.collaborationActivity.set(activityId, activity);
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

// Placeholder for WebSocket upgrade - in production, use appropriate WebSocket library
function upgradeWebSocket(request: NextRequest): {
  socket: WebSocket;
  response: Response;
} {
  // This is a simplified placeholder - in production use 'ws' library or similar
  throw new Error("WebSocket upgrade not implemented in this demo");
}
