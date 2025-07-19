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

// Safe table check function
async function checkTable(supabase: any, tableName: string) {
  try {
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    return {
      exists: !error,
      error: error?.message,
      hasData: data && data.length > 0,
    };
  } catch (error) {
    return {
      exists: false,
      error: String(error),
      hasData: false,
    };
  }
}

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
    const results = [];

    // Check core tables
    const coreTables = [
      { name: "profiles", description: "User profiles" },
      { name: "analysis_history", description: "Analysis records" },
      { name: "projects", description: "User projects" },
      { name: "user_settings", description: "User preferences" },
    ];

    for (const table of coreTables) {
      const check = await checkTable(supabase, table.name);
      results.push({
        operation: `Check ${table.description}`,
        success: check.exists,
        details: check.exists
          ? `Table exists${check.hasData ? " with data" : " (empty)"}`
          : `Table missing: ${check.error}`,
        error: check.exists ? undefined : check.error,
      });
    }

    // Check optional admin tables
    const adminTables = [
      { name: "admin_config", description: "Admin configuration" },
      { name: "admin_audit_log", description: "Admin audit log" },
      { name: "api_keys", description: "API keys" },
      { name: "error_logs", description: "Error logs" },
    ];

    for (const table of adminTables) {
      const check = await checkTable(supabase, table.name);
      results.push({
        operation: `Check ${table.description}`,
        success: check.exists,
        details: check.exists
          ? `Optional table exists${check.hasData ? " with data" : " (empty)"}`
          : "Optional table missing (can be created manually)",
        error: check.exists ? undefined : "Table not found (this is OK)",
      });
    }

    // Try to set current user as admin
    try {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (currentProfile) {
        if (currentProfile.role !== "admin") {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", user.id);

          if (updateError) {
            results.push({
              operation: "Set admin role",
              success: false,
              error: updateError.message,
            });
          } else {
            results.push({
              operation: "Set admin role",
              success: true,
              details: "User role updated to admin",
            });
          }
        } else {
          results.push({
            operation: "Check admin role",
            success: true,
            details: "User already has admin role",
          });
        }
      } else {
        results.push({
          operation: "Check user profile",
          success: false,
          error: "User profile not found",
        });
      }
    } catch (error) {
      results.push({
        operation: "Set admin role",
        success: false,
        error: `Role column may not exist: ${String(error)}`,
      });
    }

    // Check environment configuration
    const envChecks = [
      { key: "SUPABASE_URL", value: !!process.env.SUPABASE_URL },
      { key: "SUPABASE_ANON_KEY", value: !!process.env.SUPABASE_ANON_KEY },
      {
        key: "SUPABASE_SERVICE_ROLE_KEY",
        value: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    ];

    for (const env of envChecks) {
      results.push({
        operation: `Check ${env.key}`,
        success: env.value,
        details: env.value
          ? "Environment variable configured"
          : "Environment variable missing",
        error: env.value ? undefined : "Required environment variable not set",
      });
    }

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;
    const isBasicallyWorking = successCount >= totalCount * 0.6; // 60% success rate

    return NextResponse.json({
      success: isBasicallyWorking,
      message: `Setup verification completed: ${successCount}/${totalCount} checks passed`,
      results,
      summary: {
        totalChecks: totalCount,
        passed: successCount,
        failed: totalCount - successCount,
        recommendation: isBasicallyWorking
          ? "Your admin dashboard should work with basic functionality!"
          : "Some manual setup may be required for full functionality.",
      },
      instructions: {
        message:
          "If you need full admin functionality, create these tables manually in Supabase:",
        tables: [
          "admin_config: For storing admin configuration",
          "admin_audit_log: For tracking admin actions",
          "api_keys: For API key management",
          "error_logs: For system error tracking",
        ],
        note: "The admin dashboard will work with basic features even without these optional tables.",
      },
    });
  } catch (error) {
    console.error("Admin setup verification error:", error);
    return NextResponse.json(
      {
        error: "Setup verification failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
