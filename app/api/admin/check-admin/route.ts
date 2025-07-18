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

    // Check if profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "profiles");

    const profilesTableExists = tables && tables.length > 0;

    let profile = null;
    let profileError = null;

    if (profilesTableExists) {
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("email, role, id")
        .eq("id", user.id)
        .single();

      profile = profileData;
      profileError = profileErr?.message;
    }

    const isAdmin =
      profile?.email === "admin@neurolint.com" ||
      profile?.email === "info@neurolint.com" ||
      profile?.role === "admin";

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      profile,
      profileError,
      profilesTableExists,
      isAdmin,
      adminChecks: {
        isAdminEmail: profile?.email === "admin@neurolint.com",
        isInfoEmail: profile?.email === "info@neurolint.com",
        hasAdminRole: profile?.role === "admin",
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
