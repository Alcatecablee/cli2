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

    // Use service role to fix the user record
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, check if user already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    let result;

    if (existingUser) {
      // Update existing user to have admin plan_type
      const { data, error } = await supabase
        .from("users")
        .update({
          plan_type: "admin",
          email: user.email, // Make sure email is correct
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select();

      result = { data, error, operation: "update_existing" };
    } else {
      // Insert new user record
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: user.id,
          clerk_id: user.id,
          email: user.email,
          plan_type: "admin",
          full_name: user.user_metadata?.full_name || "Admin User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      result = { data, error, operation: "insert_new" };
    }

    if (result.error) {
      return NextResponse.json(
        {
          error: "Failed to fix admin user",
          details: result.error.message,
          operation: result.operation,
          existingUser: existingUser,
        },
        { status: 500 },
      );
    }

    // Verify the fix worked
    const { data: verifyUser, error: verifyError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      success: true,
      message: `Successfully fixed admin user for ${user.email}`,
      currentAuthUser: {
        id: user.id,
        email: user.email,
      },
      operation: result.operation,
      dbUser: result.data?.[0],
      verifyUser: verifyUser,
      verifyError: verifyError?.message,
    });
  } catch (error) {
    console.error("Fix admin user API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
