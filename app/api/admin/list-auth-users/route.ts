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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // List all auth users
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to list users",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Also check users in the database table
    const { data: dbUsers, error: dbError } = await supabase
      .from("users")
      .select("id, email, plan_type");

    return NextResponse.json({
      authUsers:
        authUsers?.users?.map((u) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          email_confirmed_at: u.email_confirmed_at,
        })) || [],
      dbUsers: dbUsers || [],
      dbError: dbError?.message,
    });
  } catch (error) {
    console.error("List auth users error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
