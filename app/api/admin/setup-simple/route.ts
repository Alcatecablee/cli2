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

    // Instead of creating tables with raw SQL, we'll verify existing tables
    // and create some initial admin configurations
    const results = [];

    try {
      // Check if profiles table has the role column
      const { data: profileColumns, error: profileError } = await supabase
        .rpc("get_table_columns", { table_name: "profiles" })
        .catch(() => ({ data: null, error: null }));

      if (!profileError && profileColumns) {
        results.push({
          operation: "Check profiles table",
          success: true,
          details: "Profiles table exists",
        });
      } else {
        results.push({
          operation: "Check profiles table",
          success: false,
          error: "Could not verify profiles table structure",
        });
      }
    } catch (error) {
      results.push({
        operation: "Check profiles table",
        success: false,
        error: String(error),
      });
    }

    // Set up initial admin configuration
    try {
      const adminConfigs = [
        {
          key: "admin_dashboard_initialized",
          value: "true",
          description: "Admin dashboard setup completed",
          updated_by: user.id,
        },
        {
          key: "setup_timestamp",
          value: new Date().toISOString(),
          description: "When the admin dashboard was set up",
          updated_by: user.id,
        },
        {
          key: "admin_features_enabled",
          value: JSON.stringify([
            "user_management",
            "analytics",
            "system_monitoring",
          ]),
          description: "Enabled admin features",
          updated_by: user.id,
        },
      ];

      // Try to create admin_config table by inserting data
      // If the table doesn't exist, Supabase will return an error
      for (const config of adminConfigs) {
        try {
          const { error } = await supabase
            .from("admin_config")
            .upsert(config, { onConflict: "key" });

          if (error) {
            // If table doesn't exist, this is expected
            if (error.code === "42P01") {
              results.push({
                operation: `Setup admin config: ${config.key}`,
                success: false,
                error:
                  "Admin config table needs to be created manually in Supabase dashboard",
              });
            } else {
              results.push({
                operation: `Setup admin config: ${config.key}`,
                success: false,
                error: error.message,
              });
            }
          } else {
            results.push({
              operation: `Setup admin config: ${config.key}`,
              success: true,
            });
          }
        } catch (configError) {
          results.push({
            operation: `Setup admin config: ${config.key}`,
            success: false,
            error: String(configError),
          });
        }
      }
    } catch (error) {
      results.push({
        operation: "Setup admin configurations",
        success: false,
        error: String(error),
      });
    }

    // Update user role to admin if not already set
    try {
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);

      if (roleError) {
        if (roleError.code === "42703") {
          results.push({
            operation: "Set admin role",
            success: false,
            error: "Role column needs to be added to profiles table manually",
          });
        } else {
          results.push({
            operation: "Set admin role",
            success: false,
            error: roleError.message,
          });
        }
      } else {
        results.push({
          operation: "Set admin role",
          success: true,
        });
      }
    } catch (error) {
      results.push({
        operation: "Set admin role",
        success: false,
        error: String(error),
      });
    }

    // Check analysis_history table
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("id")
        .limit(1);

      if (!error) {
        results.push({
          operation: "Check analysis_history table",
          success: true,
          details: `Found ${data?.length || 0} records`,
        });
      } else {
        results.push({
          operation: "Check analysis_history table",
          success: false,
          error: error.message,
        });
      }
    } catch (error) {
      results.push({
        operation: "Check analysis_history table",
        success: false,
        error: String(error),
      });
    }

    // Check projects table
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id")
        .limit(1);

      if (!error) {
        results.push({
          operation: "Check projects table",
          success: true,
          details: `Found ${data?.length || 0} records`,
        });
      } else {
        results.push({
          operation: "Check projects table",
          success: false,
          error: error.message,
        });
      }
    } catch (error) {
      results.push({
        operation: "Check projects table",
        success: false,
        error: String(error),
      });
    }

    // Check user_settings table
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("id")
        .limit(1);

      if (!error) {
        results.push({
          operation: "Check user_settings table",
          success: true,
          details: `Found ${data?.length || 0} records`,
        });
      } else {
        results.push({
          operation: "Check user_settings table",
          success: false,
          error: error.message,
        });
      }
    } catch (error) {
      results.push({
        operation: "Check user_settings table",
        success: false,
        error: String(error),
      });
    }

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Admin setup completed: ${successCount}/${totalCount} operations successful`,
      results,
      instructions: {
        message:
          "For full admin functionality, you may need to manually create some tables in your Supabase dashboard:",
        tables: [
          "admin_config (key TEXT PRIMARY KEY, value TEXT, description TEXT, updated_by UUID, updated_at TIMESTAMPTZ)",
          "admin_audit_log (id UUID PRIMARY KEY, admin_user_id UUID, action TEXT, target_type TEXT, details JSONB, created_at TIMESTAMPTZ)",
          "api_keys (id UUID PRIMARY KEY, name TEXT, key TEXT, user_id UUID, rate_limit INTEGER, is_active BOOLEAN, created_at TIMESTAMPTZ)",
          "error_logs (id UUID PRIMARY KEY, level TEXT, message TEXT, details JSONB, user_id UUID, created_at TIMESTAMPTZ)",
        ],
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      {
        error: "Failed to setup admin dashboard",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
