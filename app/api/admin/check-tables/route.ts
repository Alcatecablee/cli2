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

    // Get all tables in the public schema using raw SQL
    const { data: tables, error } = await supabase.rpc("execute_sql", {
      query:
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch tables",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Also check auth users
    const { data: authUsers } = await supabase.auth.admin.listUsers();

    return NextResponse.json({
      tables: tables || [],
      authUsers:
        authUsers?.users?.map((u) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
        })) || [],
    });
  } catch (error) {
    console.error("Check tables error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
