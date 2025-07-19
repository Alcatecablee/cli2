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

    // Use service role to directly update the users table
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const adminEmail = "admin@neurolint.com";

    // Check if user with admin email exists in auth.users
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    let adminAuthUser = null;
    if (authUsers?.users) {
      adminAuthUser = authUsers.users.find((user) => user.email === adminEmail);
    }

    if (!adminAuthUser) {
      return NextResponse.json(
        {
          error: "Admin user not found in authentication system",
          message: "Please create an account with admin@neurolint.com first",
        },
        { status: 404 },
      );
    }

    // Check if user exists in users table
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id, email, plan_type")
      .eq("email", adminEmail)
      .single();

    let result;
    if (existingUser) {
      // Update existing user to admin
      const { data, error } = await supabase
        .from("users")
        .update({
          plan_type: "admin",
          updated_at: new Date().toISOString(),
        })
        .eq("email", adminEmail)
        .select();

      result = { data, error, operation: "update" };
    } else {
      // Insert new user record with admin privileges
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: adminAuthUser.id,
          email: adminEmail,
          plan_type: "admin",
          full_name: adminAuthUser.user_metadata?.full_name || "Admin User",
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
      message: `Successfully made ${adminEmail} an admin`,
      user: result.data?.[0],
      operation: result.operation,
    });
  } catch (error) {
    console.error("Make admin API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
