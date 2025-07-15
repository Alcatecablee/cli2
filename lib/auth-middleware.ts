import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  plan: string;
  emailConfirmed: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

export async function authenticateRequest(
  request: NextRequest,
): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        error: "No valid authorization header provided",
      };
    }

    const token = authHeader.substring(7);

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      },
    );

    // Verify the token and get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Invalid or expired session token",
      };
    }

    // Get user profile for additional data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email!,
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        plan: profile?.plan || "free",
        emailConfirmed: user.email_confirmed_at !== null,
      },
    };
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return {
      success: false,
      error: "Authentication failed",
    };
  }
}

export function createAuthenticatedHandler<T = any>(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser,
    ...args: any[]
  ) => Promise<NextResponse>,
  options: { requireEmailConfirmed?: boolean } = {},
) {
  return async (
    request: NextRequest,
    ...args: any[]
  ): Promise<NextResponse> => {
    const authResult = await authenticateRequest(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Authentication required" },
        { status: 401 },
      );
    }

    if (options.requireEmailConfirmed && !authResult.user.emailConfirmed) {
      return NextResponse.json(
        { error: "Email confirmation required" },
        { status: 403 },
      );
    }

    return handler(request, authResult.user, ...args);
  };
}

// Rate limiting utility for authenticated users
export function createRateLimitedHandler<T = any>(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser,
    ...args: any[]
  ) => Promise<NextResponse>,
  options: {
    requireEmailConfirmed?: boolean;
    rateLimit?: {
      free: { requestsPerHour: number; requestsPerDay: number };
      pro: { requestsPerHour: number; requestsPerDay: number };
      enterprise: { requestsPerHour: number; requestsPerDay: number };
    };
  } = {},
) {
  const defaultRateLimit = {
    free: { requestsPerHour: 10, requestsPerDay: 50 },
    pro: { requestsPerHour: 100, requestsPerDay: 1000 },
    enterprise: { requestsPerHour: 1000, requestsPerDay: 10000 },
  };

  const rateLimit = options.rateLimit || defaultRateLimit;

  return createAuthenticatedHandler(
    async (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => {
      // Check rate limits based on user plan
      const userLimits =
        rateLimit[user.plan as keyof typeof rateLimit] || rateLimit.free;

      // TODO: Implement actual rate limiting with Redis or database
      // For now, just proceed with the request

      return handler(request, user, ...args);
    },
    options,
  );
}
