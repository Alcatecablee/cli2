import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

// Get error logs
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const level = searchParams.get("level");
    const since = searchParams.get("since"); // hours

    let query = supabase
      .from("error_logs")
      .select(
        `
        *,
        profiles(email, full_name)
      `,
      )
      .order("created_at", { ascending: false });

    if (level) {
      query = query.eq("level", level);
    }

    if (since) {
      const hoursAgo = new Date(Date.now() - parseInt(since) * 60 * 60 * 1000);
      query = query.gte("created_at", hoursAgo.toISOString());
    }

    const {
      data: errorLogs,
      error,
      count,
    } = await query.range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error("Error fetching error logs:", error);
      return NextResponse.json(
        { error: "Failed to fetch error logs" },
        { status: 500 },
      );
    }

    // Get error statistics
    const { data: errorStats } = await supabase
      .from("error_logs")
      .select("level")
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      );

    const stats = (errorStats || []).reduce((acc: any, log: any) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      errorLogs: errorLogs || [],
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin error log GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Log error
export async function POST(request: NextRequest) {
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
      // Allow anonymous error reporting for system errors
      console.warn("Anonymous error logging attempt");
    }

    const { level, message, details, endpoint, method } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("error_logs")
      .insert({
        level: level || "error",
        message,
        details,
        user_id: user?.id || null,
        endpoint,
        method,
        ip_address:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip"),
        user_agent: request.headers.get("user-agent"),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating error log:", error);
      return NextResponse.json(
        { error: "Failed to create error log" },
        { status: 500 },
      );
    }

    // If this is a critical error, trigger notifications
    if (level === "error" || level === "critical") {
      try {
        await supabase.from("notification_queue").insert({
          type: "admin_alert",
          recipient: "admin@neurolint.com",
          subject: `[NeuroLint] ${level.toUpperCase()}: ${message.substring(0, 50)}...`,
          message: `Error logged at ${new Date().toISOString()}\n\nMessage: ${message}\n\nDetails: ${JSON.stringify(details, null, 2)}`,
          details: {
            error_log_id: data.id,
            level,
            user_id: user?.id,
            endpoint,
          },
        });
      } catch (notificationError) {
        console.error("Failed to queue notification:", notificationError);
      }
    }

    return NextResponse.json({ errorLog: data });
  } catch (error) {
    console.error("Admin error log POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Clear old error logs
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const olderThanDays = parseInt(searchParams.get("olderThanDays") || "30");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const cutoffDate = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );

    const { error } = await supabase
      .from("error_logs")
      .delete()
      .lt("created_at", cutoffDate.toISOString());

    if (error) {
      console.error("Error deleting old error logs:", error);
      return NextResponse.json(
        { error: "Failed to delete old error logs" },
        { status: 500 },
      );
    }

    // Log the cleanup action
    await supabase.from("admin_audit_log").insert({
      admin_user_id: user.id,
      action: "cleanup_error_logs",
      target_type: "system",
      details: { olderThanDays, cutoffDate },
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin error log DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
