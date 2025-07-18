import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Helper function to check admin permissions
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("email, plan_type")
      .eq("id", userId)
      .single();

    return (
      user?.email === "admin@neurolint.com" ||
      user?.email === "info@neurolint.com" ||
      user?.plan_type === "admin"
    );
  } catch {
    return false;
  }
}

// Safe query function that handles missing tables
async function safeQuery(
  supabase: any,
  tableName: string,
  query: string,
  filter?: any,
) {
  try {
    let queryBuilder = supabase.from(tableName).select(query);

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        queryBuilder = queryBuilder.gte(key, value);
      });
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.warn(`Table ${tableName} query failed:`, error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.warn(`Table ${tableName} not accessible:`, error);
    return { data: null, error };
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    // Handle both naming conventions for service role key
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: "Service configuration error",
          details: {
            supabaseUrl: !!supabaseUrl,
            supabaseServiceKey: !!supabaseServiceKey,
            available: {
              SUPABASE_URL: !!process.env.SUPABASE_URL,
              SUPABASE_SERVICE_ROLE_KEY:
                !!process.env.SUPABASE_SERVICE_ROLE_KEY,
              SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
              SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
            },
          },
        },
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
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Check admin permissions
    if (!(await isAdmin(anonClient, user.id))) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Use service role key for admin analytics
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d

    // Calculate date range
    const now = new Date();
    const daysBack = period === "90d" ? 90 : period === "30d" ? 30 : 7;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Initialize default analytics data
    let analytics = {
      overview: {
        totalUsers: 0,
        activeUsers: 0,
        totalAnalyses: 0,
        avgExecutionTime: 0,
        errorRate: 0,
      },
      planDistribution: { free: 0 },
      layerUsage: {},
      dailyAnalytics: [],
      topIssues: [],
      apiUsage: {
        totalKeys: 0,
        activeKeys: 0,
        totalRequests: 0,
      },
    };

    // Get user statistics
    const { data: userStats } = await safeQuery(
      supabase,
      "profiles",
      "plan, created_at, last_sign_in_at",
      { created_at: startDate.toISOString() },
    );

    if (userStats) {
      analytics.overview.totalUsers = userStats.length;
      analytics.overview.activeUsers = userStats.filter((u: any) => {
        if (!u.last_sign_in_at) return false;
        const lastSignIn = new Date(u.last_sign_in_at);
        const daysSinceLastSignIn =
          (now.getTime() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastSignIn <= 7;
      }).length;

      analytics.planDistribution = userStats.reduce((acc: any, user: any) => {
        const plan = user.plan || "free";
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {});
    }

    // Get analysis statistics
    const { data: analysisStats } = await safeQuery(
      supabase,
      "analysis_history",
      "created_at, execution_time, layers, result",
      { created_at: startDate.toISOString() },
    );

    if (analysisStats) {
      analytics.overview.totalAnalyses = analysisStats.length;
      analytics.overview.avgExecutionTime = analysisStats.length
        ? analysisStats.reduce(
            (sum: number, a: any) => sum + (a.execution_time || 0),
            0,
          ) / analysisStats.length
        : 0;

      // Layer usage statistics
      analytics.layerUsage = analysisStats.reduce((acc: any, analysis: any) => {
        if (analysis.layers && Array.isArray(analysis.layers)) {
          analysis.layers.forEach((layer: number) => {
            acc[layer] = (acc[layer] || 0) + 1;
          });
        }
        return acc;
      }, {});

      // Error rates
      const successfulAnalyses = analysisStats.filter(
        (a: any) => a.result && a.result.success !== false,
      ).length;
      analytics.overview.errorRate =
        analytics.overview.totalAnalyses > 0
          ? ((analytics.overview.totalAnalyses - successfulAnalyses) /
              analytics.overview.totalAnalyses) *
            100
          : 0;

      // Top issues detected
      const issueTypes = analysisStats.reduce((acc: any, analysis: any) => {
        if (analysis.result?.analysis?.detectedIssues) {
          analysis.result.analysis.detectedIssues.forEach((issue: any) => {
            acc[issue.type] = (acc[issue.type] || 0) + 1;
          });
        }
        return acc;
      }, {});

      analytics.topIssues = Object.entries(issueTypes)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([type, count]) => ({ type, count }));
    }

    // Get API key usage (if table exists)
    const { data: apiKeyStats } = await safeQuery(
      supabase,
      "api_keys",
      "created_at, last_used, usage_count",
      { created_at: startDate.toISOString() },
    );

    if (apiKeyStats) {
      analytics.apiUsage = {
        totalKeys: apiKeyStats.length,
        activeKeys: apiKeyStats.filter((k: any) => {
          if (!k.last_used) return false;
          const lastUsed = new Date(k.last_used);
          const daysSinceLastUse =
            (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceLastUse <= 7;
        }).length,
        totalRequests: apiKeyStats.reduce(
          (sum: number, k: any) => sum + (k.usage_count || 0),
          0,
        ),
      };
    }

    // Daily analytics for charts
    const dailyAnalytics = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const dayUsers =
        userStats?.filter((u: any) => u.created_at.startsWith(dateStr))
          .length || 0;

      const dayAnalyses =
        analysisStats?.filter((a: any) => a.created_at.startsWith(dateStr))
          .length || 0;

      dailyAnalytics.push({
        date: dateStr,
        users: dayUsers,
        analyses: dayAnalyses,
      });
    }

    analytics.dailyAnalytics = dailyAnalytics;

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Admin analytics API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
