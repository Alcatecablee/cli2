import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

// Get current environment variables (sanitized)
export async function GET(request: NextRequest) {
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

    // Return sanitized environment variables
    const envVars = {
      // Database
      SUPABASE_URL: process.env.SUPABASE_URL || "",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "[SET]" : "[NOT SET]",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "[SET]"
        : "[NOT SET]",

      // Authentication
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "[SET]" : "[NOT SET]",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",

      // Payment
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? "[SET]" : "[NOT SET]",
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET
        ? "[SET]"
        : "[NOT SET]",

      // GitHub Integration
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? "[SET]" : "[NOT SET]",
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
        ? "[SET]"
        : "[NOT SET]",

      // Application
      NODE_ENV: process.env.NODE_ENV || "development",
      PORT: process.env.PORT || "3000",

      // Custom NeuroLint
      NEUROLINT_API_URL: process.env.NEUROLINT_API_URL || "",
      NEUROLINT_API_KEY: process.env.NEUROLINT_API_KEY ? "[SET]" : "[NOT SET]",

      // Email
      SMTP_HOST: process.env.SMTP_HOST || "",
      SMTP_PORT: process.env.SMTP_PORT || "",
      SMTP_USER: process.env.SMTP_USER ? "[SET]" : "[NOT SET]",
      SMTP_PASS: process.env.SMTP_PASS ? "[SET]" : "[NOT SET]",
    };

    return NextResponse.json({ environment: envVars });
  } catch (error) {
    console.error("Admin environment API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Update environment variables
export async function PUT(request: NextRequest) {
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

    const { updates } = await request.json();

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Updates object is required" },
        { status: 400 },
      );
    }

    // For production environments, we'll store these in a secure config table
    // rather than trying to modify the actual .env file
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json(
        { error: "Service key not configured" },
        { status: 500 },
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceKey);

    // Store environment updates in admin_config table
    const configUpdates = Object.entries(updates).map(([key, value]) => ({
      key,
      value: String(value),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await adminSupabase
      .from("admin_config")
      .upsert(configUpdates, { onConflict: "key" });

    if (upsertError) {
      console.error("Error updating config:", upsertError);
      return NextResponse.json(
        { error: "Failed to update configuration" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Configuration updated. Restart required for some changes to take effect.",
    });
  } catch (error) {
    console.error("Admin environment update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Get system configuration
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

    const { action } = await request.json();

    switch (action) {
      case "test_database":
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("count(*)")
            .limit(1);

          return NextResponse.json({
            database: {
              connected: !error,
              error: error?.message,
            },
          });
        } catch (dbError) {
          return NextResponse.json({
            database: {
              connected: false,
              error: String(dbError),
            },
          });
        }

      case "test_auth":
        try {
          const testResult = await supabase.auth.getSession();
          return NextResponse.json({
            auth: {
              configured: true,
              session_valid: !!testResult.data.session,
            },
          });
        } catch (authError) {
          return NextResponse.json({
            auth: {
              configured: false,
              error: String(authError),
            },
          });
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin environment test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
