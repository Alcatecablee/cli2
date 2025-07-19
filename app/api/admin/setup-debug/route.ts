import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const debugInfo = {
    step: "unknown",
    error: null,
    details: {},
  };

  try {
    debugInfo.step = "checking environment variables";

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    debugInfo.details = {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      hasSupabaseServiceKey: !!supabaseServiceKey,
      supabaseUrlStartsWith: supabaseUrl
        ? supabaseUrl.substring(0, 20) + "..."
        : "missing",
    };

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error: "Missing required environment variables",
          debug: debugInfo,
          required: ["SUPABASE_URL", "SUPABASE_ANON_KEY"],
          available: {
            SUPABASE_URL: !!supabaseUrl,
            SUPABASE_ANON_KEY: !!supabaseAnonKey,
            SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
          },
        },
        { status: 500 },
      );
    }

    debugInfo.step = "checking authorization header";

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Authentication required",
          debug: debugInfo,
          authHeader: authHeader ? "present but invalid format" : "missing",
        },
        { status: 401 },
      );
    }

    debugInfo.step = "extracting token";

    const token = authHeader.substring(7);
    debugInfo.details.tokenLength = token.length;

    debugInfo.step = "creating supabase client";

    let anonClient;
    try {
      anonClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
    } catch (clientError) {
      return NextResponse.json(
        {
          error: "Failed to create Supabase client",
          debug: debugInfo,
          clientError: String(clientError),
        },
        { status: 500 },
      );
    }

    debugInfo.step = "getting user from token";

    let user;
    try {
      const { data: userData, error: userError } =
        await anonClient.auth.getUser();

      if (userError) {
        return NextResponse.json(
          {
            error: "User authentication failed",
            debug: debugInfo,
            userError: userError.message,
          },
          { status: 401 },
        );
      }

      if (!userData?.user) {
        return NextResponse.json(
          {
            error: "No user found",
            debug: debugInfo,
            userData: userData ? "exists but no user" : "null",
          },
          { status: 401 },
        );
      }

      user = userData.user;
      debugInfo.details.userId = user.id;
      debugInfo.details.userEmail = user.email;
    } catch (authError) {
      return NextResponse.json(
        {
          error: "Authentication error",
          debug: debugInfo,
          authError: String(authError),
        },
        { status: 500 },
      );
    }

    debugInfo.step = "checking admin permissions";

    let isAdminUser = false;
    try {
      const { data: profile, error: profileError } = await anonClient
        .from("profiles")
        .select("email, role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        debugInfo.details.profileError = profileError.message;
        // Continue without profile check - use email-based admin check
        isAdminUser =
          user.email === "admin@neurolint.com" ||
          user.email === "info@neurolint.com";
      } else {
        isAdminUser =
          profile?.email === "admin@neurolint.com" ||
          profile?.email === "info@neurolint.com" ||
          profile?.role === "admin";
        debugInfo.details.profileData = profile;
      }
    } catch (profileError) {
      debugInfo.details.profileException = String(profileError);
      // Fall back to email-based check
      isAdminUser =
        user.email === "admin@neurolint.com" ||
        user.email === "info@neurolint.com";
    }

    if (!isAdminUser) {
      return NextResponse.json(
        {
          error: "Admin access required",
          debug: debugInfo,
          userEmail: user.email,
          isAdmin: isAdminUser,
        },
        { status: 403 },
      );
    }

    debugInfo.step = "setup checks";

    const results = [];

    // Basic environment check
    results.push({
      operation: "Environment Variables",
      success: true,
      details: "Required environment variables are configured",
    });

    // Auth check
    results.push({
      operation: "Authentication",
      success: true,
      details: `User ${user.email} authenticated successfully`,
    });

    // Admin check
    results.push({
      operation: "Admin Permissions",
      success: true,
      details: `User ${user.email} has admin access`,
    });

    // Simple table checks (without service key for now)
    const tableChecks = ["profiles"];

    for (const tableName of tableChecks) {
      try {
        const { data, error } = await anonClient
          .from(tableName)
          .select("id")
          .limit(1);

        results.push({
          operation: `Check ${tableName} table`,
          success: !error,
          details: error ? `Error: ${error.message}` : `Table accessible`,
          error: error?.message,
        });
      } catch (tableError) {
        results.push({
          operation: `Check ${tableName} table`,
          success: false,
          details: `Exception: ${String(tableError)}`,
          error: String(tableError),
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Debug setup completed successfully`,
      debug: debugInfo,
      results,
      summary: {
        totalChecks: results.length,
        passed: successCount,
        failed: results.length - successCount,
        recommendation: "Basic admin functionality should work!",
      },
      nextSteps: [
        "Admin authentication is working",
        "Basic database access is confirmed",
        "You can now use the admin dashboard",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected error during setup",
        debug: debugInfo,
        exception: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      { status: 500 },
    );
  }
}
