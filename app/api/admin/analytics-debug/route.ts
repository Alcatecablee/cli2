import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Comprehensive debug information
    const debugInfo: any = {
      environment: {
        supabaseUrl: !!process.env.SUPABASE_URL,
        supabaseUrlValue: process.env.SUPABASE_URL ? "SET" : "NOT_SET",
        supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseServiceKeyValue: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? "SET"
          : "NOT_SET",
        supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
        supabaseAnonKeyValue: process.env.SUPABASE_ANON_KEY ? "SET" : "NOT_SET",
        nodeEnv: process.env.NODE_ENV,
      },
      headers: {
        authorization: !!request.headers.get("authorization"),
        authorizationValue: request.headers.get("authorization")
          ? "SET"
          : "NOT_SET",
      },
      request: {
        url: request.url,
        method: request.method,
      },
    };

    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: "Service configuration error",
          debug: debugInfo,
          missingConfig: {
            supabaseUrl: !supabaseUrl,
            supabaseServiceKey: !supabaseServiceKey,
          },
        },
        { status: 500 },
      );
    }

    // Check auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Authentication required",
          debug: debugInfo,
          authIssue: "Missing or invalid authorization header",
        },
        { status: 401 },
      );
    }

    try {
      const token = authHeader.substring(7);

      // Test Supabase client creation
      const anonClient = createClient(
        supabaseUrl,
        process.env.SUPABASE_ANON_KEY!,
        {
          global: { headers: { Authorization: `Bearer ${token}` } },
        },
      );

      debugInfo.clientCreation = "SUCCESS";

      // Test user authentication
      const {
        data: { user },
        error: userError,
      } = await anonClient.auth.getUser();

      if (userError) {
        return NextResponse.json(
          {
            error: "User authentication failed",
            debug: debugInfo,
            authError: userError.message,
          },
          { status: 401 },
        );
      }

      if (!user) {
        return NextResponse.json(
          {
            error: "No user found",
            debug: debugInfo,
            authError: "User object is null",
          },
          { status: 401 },
        );
      }

      debugInfo.user = {
        id: user.id,
        email: user.email,
        found: true,
      };

      // Test service role client
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Simple test query
      const { data: testData, error: testError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      debugInfo.databaseTest = {
        success: !testError,
        error: testError?.message,
        dataFound: testData ? testData.length > 0 : false,
      };

      return NextResponse.json({
        message: "Debug analytics API working",
        debug: debugInfo,
        success: true,
      });
    } catch (clientError) {
      return NextResponse.json(
        {
          error: "Client creation or operation failed",
          debug: debugInfo,
          clientError:
            clientError instanceof Error
              ? clientError.message
              : String(clientError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Debug analytics API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
