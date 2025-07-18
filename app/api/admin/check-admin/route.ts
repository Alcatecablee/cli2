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

    // Use service role to check profile
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if users table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "users");

    const usersTableExists = tables && tables.length > 0;

    let userRecord = null;
    let userError = null;

    if (usersTableExists) {
      const { data: userData, error: userErr } = await supabase
        .from("users")
        .select("email, plan_type, id")
        .eq("id", user.id)
        .single();

      userRecord = userData;
      userError = userErr?.message;
    }

    const isAdmin =
      userRecord?.email === "admin@neurolint.com" ||
      userRecord?.email === "info@neurolint.com" ||
      userRecord?.plan_type === "admin";

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      userRecord,
      userError,
      usersTableExists,
      isAdmin,
      adminChecks: {
        isAdminEmail: userRecord?.email === "admin@neurolint.com",
        isInfoEmail: userRecord?.email === "info@neurolint.com",
        hasAdminRole: userRecord?.plan_type === "admin",
      },
    });
  } catch (error) {
    console.error("Admin check API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
