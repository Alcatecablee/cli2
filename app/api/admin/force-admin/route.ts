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

    // Use service role for guaranteed access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Delete any existing record for this user ID
    await supabase.from("users").delete().eq("id", user.id);

    // Step 2: Insert fresh admin record
    const { data: insertResult, error: insertError } = await supabase
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

    if (insertError) {
      return NextResponse.json(
        {
          error: "Failed to create admin record",
          details: insertError.message,
          user: { id: user.id, email: user.email },
        },
        { status: 500 },
      );
    }

    // Step 3: Verify the record was created correctly
    const { data: verifyRecord, error: verifyError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    // Step 4: Test the admin check logic
    const isAdminEmail = verifyRecord?.email === "admin@neurolint.com";
    const isInfoEmail = verifyRecord?.email === "info@neurolint.com";
    const hasAdminRole = verifyRecord?.plan_type === "admin";
    const isAdmin = isAdminEmail || isInfoEmail || hasAdminRole;

    return NextResponse.json({
      success: true,
      message: `Force-granted admin access to ${user.email}`,
      currentAuthUser: {
        id: user.id,
        email: user.email,
      },
      dbRecord: verifyRecord,
      verifyError: verifyError?.message,
      adminChecks: {
        isAdminEmail,
        isInfoEmail,
        hasAdminRole,
        isAdmin,
      },
    });
  } catch (error) {
    console.error("Force admin API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
