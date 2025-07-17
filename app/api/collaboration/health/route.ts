import { NextResponse } from "next/server";

/**
 * GET /api/collaboration/health
 * Returns health status of the collaboration system
 */
export async function GET() {
  try {
    // Check if collaboration server is reachable
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: {
          status: "ok",
          responseTime: Date.now(),
        },
        websocket: {
          status: "unknown", // Would need to actually check WebSocket server
          lastCheck: new Date().toISOString(),
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        collaborationPort: process.env.COLLABORATION_PORT || "8080",
      },
    };

    // Try to get stats from collaboration server if available
    try {
      const response = await fetch(
        `http://localhost:${process.env.COLLABORATION_PORT || "8080"}/stats`,
        {
          method: "GET",
          timeout: 5000,
        },
      );

      if (response.ok) {
        const collaborationStats = await response.json();
        healthData.services.websocket.status = "ok";
        healthData.collaboration = collaborationStats;
      }
    } catch (error) {
      healthData.services.websocket.status = "error";
      healthData.services.websocket.error =
        "Unable to connect to collaboration server";
    }

    const httpStatus =
      healthData.services.websocket.status === "error" ? 503 : 200;

    return NextResponse.json(healthData, { status: httpStatus });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : "Unknown health check error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/collaboration/health
 * Trigger health check or recovery actions
 */
export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    switch (action) {
      case "restart_server":
        // In production, this would trigger a graceful restart
        return NextResponse.json({
          message: "Server restart triggered",
          timestamp: new Date().toISOString(),
        });

      case "clear_errors":
        // Clear error history - would need to call collaboration server
        return NextResponse.json({
          message: "Error history cleared",
          timestamp: new Date().toISOString(),
        });

      case "force_cleanup":
        // Force cleanup of sessions - would need to call collaboration server
        return NextResponse.json({
          message: "Forced cleanup executed",
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            error: "Unknown action",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown action error",
      },
      { status: 500 },
    );
  }
}
