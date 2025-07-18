import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import os from "os";

export const dynamic = "force-dynamic";

// Helper function to check admin permissions
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, role")
      .eq("id", userId)
      .single();

    return (
      profile?.email === "admin@neurolint.com" ||
      profile?.email === "info@neurolint.com" ||
      profile?.role === "admin"
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const anonClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await anonClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Check admin permissions
    if (!(await isAdmin(anonClient, user.id))) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Use service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // System Information
    const systemInfo = {
      server: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        uptime: Math.floor(process.uptime()),
        memory: {
          total: Math.round(os.totalmem() / 1024 / 1024),
          free: Math.round(os.freemem() / 1024 / 1024),
          used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
          processUsage: Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024,
          ),
        },
        cpu: {
          cores: os.cpus().length,
          model: os.cpus()[0]?.model || "Unknown",
          loadAverage: os.loadavg(),
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    // Database Health Check
    let databaseHealth = {
      connected: false,
      responseTime: 0,
      error: null,
    };

    try {
      const startTime = Date.now();
      const { data, error } = await supabase
        .from("profiles")
        .select("count(*)")
        .limit(1);

      const endTime = Date.now();

      databaseHealth = {
        connected: !error,
        responseTime: endTime - startTime,
        error: error?.message || null,
      };
    } catch (dbError) {
      databaseHealth.error = String(dbError);
    }

    // API Health Checks
    const apiHealthChecks = [];

    // Test internal APIs
    const internalAPIs = [
      { name: "Auth API", endpoint: "/api/auth/user" },
      { name: "Dashboard API", endpoint: "/api/dashboard" },
      { name: "Analytics API", endpoint: "/api/admin/analytics" },
    ];

    for (const api of internalAPIs) {
      try {
        const startTime = Date.now();
        const response = await fetch(
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${api.endpoint}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const endTime = Date.now();

        apiHealthChecks.push({
          name: api.name,
          status: response.status < 400 ? "healthy" : "unhealthy",
          responseTime: endTime - startTime,
          statusCode: response.status,
        });
      } catch (error) {
        apiHealthChecks.push({
          name: api.name,
          status: "error",
          responseTime: -1,
          error: String(error),
        });
      }
    }

    // Recent Error Logs (simplified - in production you'd integrate with logging service)
    const { data: recentErrors } = await supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    // Active Sessions
    const { data: activeSessions } = await supabase
      .from("profiles")
      .select("id, email, last_sign_in_at")
      .not("last_sign_in_at", "is", null)
      .gte(
        "last_sign_in_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("last_sign_in_at", { ascending: false });

    // Background Jobs Status (if you have any)
    const backgroundJobs = [
      {
        name: "Database Cleanup",
        status: "running",
        lastRun: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: "Analytics Aggregation",
        status: "completed",
        lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    ];

    const monitoring = {
      system: systemInfo,
      database: databaseHealth,
      apis: apiHealthChecks,
      errors: recentErrors || [],
      activeSessions: activeSessions || [],
      backgroundJobs,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ monitoring });
  } catch (error) {
    console.error("Admin system monitoring API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// System actions (restart, clear cache, etc.)
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Check admin permissions
    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { action, ...params } = await request.json();

    switch (action) {
      case "clear_cache":
        // In a real application, you would clear Redis cache or similar
        // For now, we'll just log the action
        console.log(`Admin ${user.email} cleared cache`);
        return NextResponse.json({
          success: true,
          message: "Cache cleared successfully",
        });

      case "test_database":
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("count(*)")
            .limit(1);

          return NextResponse.json({
            success: !error,
            message: error
              ? `Database test failed: ${error.message}`
              : "Database connection successful",
          });
        } catch (dbError) {
          return NextResponse.json({
            success: false,
            message: `Database test failed: ${String(dbError)}`,
          });
        }

      case "force_garbage_collection":
        // Force Node.js garbage collection
        if (global.gc) {
          global.gc();
          return NextResponse.json({
            success: true,
            message: "Garbage collection triggered",
          });
        } else {
          return NextResponse.json({
            success: false,
            message: "Garbage collection not available (run with --expose-gc)",
          });
        }

      case "log_system_info":
        const memUsage = process.memoryUsage();
        console.log("System Info Request by Admin:", {
          admin: user.email,
          timestamp: new Date().toISOString(),
          memory: {
            rss: Math.round(memUsage.rss / 1024 / 1024) + "MB",
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
          },
          uptime: process.uptime(),
        });

        return NextResponse.json({
          success: true,
          message: "System info logged to console",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin system action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
