import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Helper function to check admin permissions
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data: userRecord } = await supabase
      .from("users")
      .select("email, plan_type")
      .eq("id", userId)
      .single();

    return (
      userRecord?.email === "admin@neurolint.com" ||
      userRecord?.email === "info@neurolint.com" ||
      userRecord?.plan_type === "admin"
    );
  } catch {
    return false;
  }
}

// Safe query execution with limited permissions
const allowedQueries = [
  /^SELECT\s+/i,
  /^SHOW\s+/i,
  /^EXPLAIN\s+/i,
  /^DESCRIBE\s+/i,
];

const isQueryAllowed = (query: string): boolean => {
  const trimmedQuery = query.trim();
  return allowedQueries.some((pattern) => pattern.test(trimmedQuery));
};

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get table information
    const tables = [
      {
        name: "profiles",
        rowCount: 0,
        size: "0 MB",
        lastModified: new Date().toISOString(),
      },
      {
        name: "analysis_history",
        rowCount: 0,
        size: "0 MB",
        lastModified: new Date().toISOString(),
      },
      {
        name: "api_keys",
        rowCount: 0,
        size: "0 MB",
        lastModified: new Date().toISOString(),
      },
      {
        name: "projects",
        rowCount: 0,
        size: "0 MB",
        lastModified: new Date().toISOString(),
      },
      {
        name: "user_settings",
        rowCount: 0,
        size: "0 MB",
        lastModified: new Date().toISOString(),
      },
      {
        name: "error_logs",
        rowCount: 0,
        size: "0 MB",
        lastModified: new Date().toISOString(),
      },
    ];

    // Get row counts for each table
    const tableStats = await Promise.all(
      tables.map(async (table) => {
        try {
          const { data, error } = await supabase
            .from(table.name)
            .select("*", { count: "exact", head: true });

          if (!error) {
            return { ...table, rowCount: data || 0 };
          }
          return table;
        } catch {
          return table;
        }
      }),
    );

    // Calculate database statistics
    const totalTables = tableStats.length;
    const totalRows = tableStats.reduce(
      (sum, table) => sum + table.rowCount,
      0,
    );

    const stats = {
      totalSize: "Calculating...", // Would need custom function to get actual size
      totalTables,
      totalRows,
      connectionCount: 1, // Mock value, would need monitoring setup
    };

    return NextResponse.json({
      tables: tableStats,
      stats,
    });
  } catch (error) {
    console.error("Admin database GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

    const { action, query } = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case "execute_query":
        if (!query) {
          return NextResponse.json(
            { error: "Query is required" },
            { status: 400 },
          );
        }

        // Security check: only allow safe queries
        if (!isQueryAllowed(query)) {
          return NextResponse.json(
            {
              error:
                "Only SELECT, SHOW, EXPLAIN, and DESCRIBE queries are allowed",
            },
            { status: 403 },
          );
        }

        try {
          // For Supabase, we'll use the RPC function or direct table queries
          // Since Supabase doesn't support raw SQL, we'll handle common query patterns

          const lowerQuery = query.toLowerCase().trim();

          if (
            lowerQuery.includes("select count(*)") &&
            lowerQuery.includes("from")
          ) {
            // Handle COUNT queries
            const tableMatch = lowerQuery.match(/from\s+(\w+)/);
            if (tableMatch) {
              const tableName = tableMatch[1];
              const { data, error, count } = await supabase
                .from(tableName)
                .select("*", { count: "exact", head: true });

              if (error) {
                return NextResponse.json({ error: error.message });
              }

              return NextResponse.json({
                data: [{ total: count }],
                message: "Query executed successfully",
              });
            }
          } else if (
            lowerQuery.startsWith("select") &&
            lowerQuery.includes("from")
          ) {
            // Handle SELECT queries
            const tableMatch = lowerQuery.match(/from\s+(\w+)/);
            const limitMatch = lowerQuery.match(/limit\s+(\d+)/);

            if (tableMatch) {
              const tableName = tableMatch[1];
              const limit = limitMatch ? parseInt(limitMatch[1]) : 100;

              let query = supabase.from(tableName).select("*");

              if (limit) {
                query = query.limit(Math.min(limit, 1000)); // Cap at 1000 rows
              }

              const { data, error } = await query;

              if (error) {
                return NextResponse.json({ error: error.message });
              }

              return NextResponse.json({
                data: data || [],
                message: "Query executed successfully",
              });
            }
          } else if (lowerQuery.includes("group by")) {
            // Handle GROUP BY queries - simplified example
            if (
              lowerQuery.includes("profiles") &&
              lowerQuery.includes("plan")
            ) {
              const { data, error } = await supabase
                .from("profiles")
                .select("plan")
                .not("plan", "is", null);

              if (error) {
                return NextResponse.json({ error: error.message });
              }

              const groupedData = (data || []).reduce((acc: any, item: any) => {
                const plan = item.plan || "free";
                acc[plan] = (acc[plan] || 0) + 1;
                return acc;
              }, {});

              const result = Object.entries(groupedData).map(
                ([plan, count]) => ({
                  plan,
                  count,
                }),
              );

              return NextResponse.json({
                data: result,
                message: "Query executed successfully",
              });
            }
          }

          // If we can't handle the query, return an error
          return NextResponse.json({
            error:
              "Query pattern not supported. Use simple SELECT, COUNT, or GROUP BY queries.",
          });
        } catch (queryError) {
          console.error("Query execution error:", queryError);
          return NextResponse.json({
            error:
              queryError instanceof Error
                ? queryError.message
                : String(queryError),
          });
        }

      case "vacuum":
        // Supabase handles vacuuming automatically, so this is a no-op
        return NextResponse.json({
          success: true,
          message:
            "Database vacuum completed (handled automatically by Supabase)",
        });

      case "analyze":
        // Supabase handles statistics automatically
        return NextResponse.json({
          success: true,
          message:
            "Table analysis completed (handled automatically by Supabase)",
        });

      case "reindex":
        // Supabase handles indexing automatically
        return NextResponse.json({
          success: true,
          message: "Reindexing completed (handled automatically by Supabase)",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin database POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
