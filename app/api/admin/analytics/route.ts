import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Helper function to check admin permissions
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, role")
      .eq("id", userId)
      .single();

    return (
      profile?.email === "admin@neurolint.com" ||
      profile?.email === "info@neurolint.com" ||
      profile?.role === "admin"
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    const anonClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      },
    );

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

    // Get user statistics
    const { data: userStats } = await supabase
      .from("profiles")
      .select("plan, created_at, last_sign_in_at")
      .gte("created_at", startDate.toISOString());

    // Get analysis statistics
    const { data: analysisStats } = await supabase
      .from("analysis_history")
      .select("created_at, execution_time, layers, result")
      .gte("created_at", startDate.toISOString());

    // Get API key usage
    const { data: apiKeyStats } = await supabase
      .from("api_keys")
      .select("created_at, last_used, usage_count")
      .gte("created_at", startDate.toISOString());

    // Calculate metrics
    const totalUsers = userStats?.length || 0;
    const activeUsers =
      userStats?.filter((u) => {
        if (!u.last_sign_in_at) return false;
        const lastSignIn = new Date(u.last_sign_in_at);
        const daysSinceLastSignIn =
          (now.getTime() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastSignIn <= 7;
      }).length || 0;

    const planDistribution =
      userStats?.reduce((acc: any, user: any) => {
        const plan = user.plan || "free";
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {}) || {};

    const totalAnalyses = analysisStats?.length || 0;
    const avgExecutionTime = analysisStats?.length
      ? analysisStats.reduce((sum, a) => sum + (a.execution_time || 0), 0) /
        analysisStats.length
      : 0;

    // Layer usage statistics
    const layerUsage =
      analysisStats?.reduce((acc: any, analysis: any) => {
        if (analysis.layers && Array.isArray(analysis.layers)) {
          analysis.layers.forEach((layer: number) => {
            acc[layer] = (acc[layer] || 0) + 1;
          });
        }
        return acc;
      }, {}) || {};

    // Daily analytics for charts
    const dailyAnalytics = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const dayUsers =
        userStats?.filter((u) => u.created_at.startsWith(dateStr)).length || 0;

      const dayAnalyses =
        analysisStats?.filter((a) => a.created_at.startsWith(dateStr)).length ||
        0;

      dailyAnalytics.push({
        date: dateStr,
        users: dayUsers,
        analyses: dayAnalyses,
      });
    }

    // Error rates
    const successfulAnalyses =
      analysisStats?.filter((a) => a.result && a.result.success !== false)
        .length || 0;
    const errorRate =
      totalAnalyses > 0
        ? ((totalAnalyses - successfulAnalyses) / totalAnalyses) * 100
        : 0;

    // Top issues detected
    const issueTypes =
      analysisStats?.reduce((acc: any, analysis: any) => {
        if (analysis.result?.analysis?.detectedIssues) {
          analysis.result.analysis.detectedIssues.forEach((issue: any) => {
            acc[issue.type] = (acc[issue.type] || 0) + 1;
          });
        }
        return acc;
      }, {}) || {};

    const analytics = {
      overview: {
        totalUsers,
        activeUsers,
        totalAnalyses,
        avgExecutionTime: Math.round(avgExecutionTime),
        errorRate: Math.round(errorRate * 100) / 100,
      },
      planDistribution,
      layerUsage,
      dailyAnalytics,
      topIssues: Object.entries(issueTypes)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([type, count]) => ({ type, count })),
      apiUsage: {
        totalKeys: apiKeyStats?.length || 0,
        activeKeys:
          apiKeyStats?.filter((k) => {
            if (!k.last_used) return false;
            const lastUsed = new Date(k.last_used);
            const daysSinceLastUse =
              (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceLastUse <= 7;
          }).length || 0,
        totalRequests:
          apiKeyStats?.reduce((sum, k) => sum + (k.usage_count || 0), 0) || 0,
      },
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Admin analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Get detailed system metrics
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    const anonClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      },
    );

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

    const { action } = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case "database_size":
        try {
          // Get table sizes (PostgreSQL specific)
          const { data: tableStats } = await supabase.rpc("get_table_sizes"); // This would need to be created as a DB function

          return NextResponse.json({ tableStats });
        } catch (error) {
          return NextResponse.json({
            tableStats: [],
            error: "Database size query failed",
          });
        }

      case "performance_metrics":
        // Get recent performance data
        const { data: recentAnalyses } = await supabase
          .from("analysis_history")
          .select("execution_time, created_at")
          .gte(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          )
          .order("created_at", { ascending: false })
          .limit(1000);

        const performanceMetrics = {
          avgResponseTime: recentAnalyses?.length
            ? recentAnalyses.reduce(
                (sum, a) => sum + (a.execution_time || 0),
                0,
              ) / recentAnalyses.length
            : 0,
          p95ResponseTime: recentAnalyses?.length
            ? recentAnalyses.sort(
                (a, b) => (b.execution_time || 0) - (a.execution_time || 0),
              )[Math.floor(recentAnalyses.length * 0.05)]?.execution_time || 0
            : 0,
          requestsLast24h: recentAnalyses?.length || 0,
        };

        return NextResponse.json({ performanceMetrics });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin analytics detailed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
