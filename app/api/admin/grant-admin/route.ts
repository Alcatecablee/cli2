import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

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
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!anonKey) {
      return NextResponse.json(
        { error: "Supabase anonymous key not configured" },
        { status: 500 },
      );
    }

    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await anonClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Invalid session",
          userError: userError?.message,
        },
        { status: 401 },
      );
    }

    // Use service role to update user in existing users table
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if users table exists (it should based on the schema)
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "users");

    const usersTableExists = tables && tables.length > 0;

    if (!usersTableExists) {
      return NextResponse.json(
        { error: "Users table not found. Please run database setup first." },
        { status: 500 },
      );
    }

    // Try to find existing user
    const { data: existingUser, error: userFindError } = await supabase
      .from("users")
      .select("id, email, plan_type")
      .eq("id", user.id)
      .single();

    let result;
    if (existingUser) {
      // Update existing user to admin plan
      const { data, error } = await supabase
        .from("users")
        .update({
          plan_type: "admin",
          email: user.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select();

      result = { data, error, operation: "update" };
    } else {
      // Insert new user with admin plan
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          plan_type: "admin",
          full_name:
            user.user_metadata?.full_name ||
            `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
            user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      result = { data, error, operation: "insert" };
    }

    if (result.error) {
      return NextResponse.json(
        {
          error: "Failed to grant admin access",
          details: result.error.message,
          operation: result.operation,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin access granted successfully",
      user: {
        id: user.id,
        email: user.email,
      },
      profile: result.data?.[0],
      operation: result.operation,
    });
  } catch (error) {
    console.error("Grant admin API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
