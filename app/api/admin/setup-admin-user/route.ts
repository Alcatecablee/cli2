import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

    // Use service role client for full access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const adminEmail = "admin@neurolint.com";

    // First, check if users table exists
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "users");

    if (!tables || tables.length === 0) {
      return NextResponse.json(
        { error: "Users table does not exist" },
        { status: 500 },
      );
    }

    // Check current users in the table
    const { data: allUsers, error: listError } = await supabase
      .from("users")
      .select("id, email, plan_type");

    console.log("Current users:", allUsers);

    // Try to find admin user
    const { data: adminUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", adminEmail)
      .maybeSingle();

    if (adminUser) {
      // Update existing user
      const { data: updateResult, error: updateError } = await supabase
        .from("users")
        .update({
          plan_type: "admin",
          updated_at: new Date().toISOString(),
        })
        .eq("email", adminEmail)
        .select();

      return NextResponse.json({
        success: true,
        message: `Updated ${adminEmail} to admin`,
        operation: "update",
        user: updateResult?.[0],
        allUsers: allUsers,
      });
    } else {
      // Get all auth users to find the UUID for admin@neurolint.com
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const adminAuthUser = authUsers?.users?.find(
        (u) => u.email === adminEmail,
      );

      if (!adminAuthUser) {
        return NextResponse.json({
          error: "Admin user not found in auth system",
          message: "Please sign up with admin@neurolint.com first",
          allUsers: allUsers,
          authUsers:
            authUsers?.users?.map((u) => ({ id: u.id, email: u.email })) || [],
        });
      }

      // Insert new admin user
      const { data: insertResult, error: insertError } = await supabase
        .from("users")
        .insert({
          id: adminAuthUser.id,
          email: adminEmail,
          plan_type: "admin",
          full_name: "Admin User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (insertError) {
        return NextResponse.json({
          error: "Failed to insert admin user",
          details: insertError.message,
          allUsers: allUsers,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Created admin user for ${adminEmail}`,
        operation: "insert",
        user: insertResult?.[0],
        allUsers: allUsers,
      });
    }
  } catch (error) {
    console.error("Setup admin user error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
