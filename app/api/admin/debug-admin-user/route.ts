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

    // Use service role to check database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users in database with admin email
    const { data: usersByEmail, error: emailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "admin@neurolint.com");

    // Get user by current user ID
    const { data: userById, error: idError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get all users in database (for debugging)
    const { data: allUsers, error: allError } = await supabase
      .from("users")
      .select("id, email, plan_type");

    return NextResponse.json({
      currentAuthUser: {
        id: user.id,
        email: user.email,
      },
      usersByEmail: usersByEmail || [],
      emailError: emailError?.message,
      userById: userById || null,
      idError: idError?.message,
      allUsers: allUsers || [],
      allError: allError?.message,
      adminChecks: {
        emailMatch: userById?.email === "admin@neurolint.com",
        planTypeMatch: userById?.plan_type === "admin",
        userExists: !!userById,
      },
    });
  } catch (error) {
    console.error("Debug admin user API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
