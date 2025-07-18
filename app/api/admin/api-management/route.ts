import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

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

    // Get API keys with user information
    const { data: apiKeys, error: keysError } = await supabase
      .from("api_keys")
      .select(
        `
        *,
        profiles!inner(email)
      `,
      )
      .order("created_at", { ascending: false });

    if (keysError) {
      console.error("Error fetching API keys:", keysError);
      return NextResponse.json(
        { error: "Failed to fetch API keys" },
        { status: 500 },
      );
    }

    // Format API keys data
    const formattedApiKeys = (apiKeys || []).map((key) => ({
      ...key,
      user_email: key.profiles?.email || "Unknown",
    }));

    // Get rate limits (mock data for now, you'd implement this based on your rate limiting system)
    const rateLimits = [
      { endpoint: "/api/analyze", limit: 100, window: 3600, current_usage: 45 },
      {
        endpoint: "/api/dashboard",
        limit: 1000,
        window: 3600,
        current_usage: 234,
      },
      { endpoint: "/api/auth/*", limit: 50, window: 3600, current_usage: 12 },
      { endpoint: "/api/admin/*", limit: 200, window: 3600, current_usage: 8 },
    ];

    // Calculate statistics
    const totalKeys = formattedApiKeys.length;
    const activeKeys = formattedApiKeys.filter((key) => key.is_active).length;
    const totalRequests = formattedApiKeys.reduce(
      (sum, key) => sum + (key.usage_count || 0),
      0,
    );

    // Calculate requests today (you'd implement this based on your logging system)
    const requestsToday = Math.floor(totalRequests * 0.1); // Mock calculation

    const stats = {
      totalKeys,
      activeKeys,
      totalRequests,
      requestsToday,
    };

    return NextResponse.json({
      apiKeys: formattedApiKeys,
      rateLimits,
      stats,
    });
  } catch (error) {
    console.error("Admin API management GET error:", error);
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

    const { action, ...params } = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case "create_key":
        const { name, userId, rateLimit, expiresAt } = params;

        if (!name || !userId || !rateLimit) {
          return NextResponse.json(
            { error: "Name, userId, and rateLimit are required" },
            { status: 400 },
          );
        }

        // Generate API key
        const apiKey = `nlp_${crypto.randomBytes(32).toString("hex")}`;

        const { data: newKey, error: createError } = await supabase
          .from("api_keys")
          .insert({
            name,
            key: apiKey,
            user_id: userId,
            rate_limit: rateLimit,
            expires_at: expiresAt || null,
            is_active: true,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating API key:", createError);
          return NextResponse.json(
            { error: "Failed to create API key" },
            { status: 500 },
          );
        }

        return NextResponse.json({ apiKey: newKey });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin API management POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { action, keyId, updates } = await request.json();

    if (action !== "update_key" || !keyId || !updates) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: updatedKey, error: updateError } = await supabase
      .from("api_keys")
      .update({
        name: updates.name,
        rate_limit: updates.rate_limit,
        is_active: updates.is_active,
        expires_at: updates.expires_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", keyId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating API key:", updateError);
      return NextResponse.json(
        { error: "Failed to update API key" },
        { status: 500 },
      );
    }

    return NextResponse.json({ apiKey: updatedKey });
  } catch (error) {
    console.error("Admin API management PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { action, keyId } = await request.json();

    if (action !== "delete_key" || !keyId) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: deleteError } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", keyId);

    if (deleteError) {
      console.error("Error deleting API key:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete API key" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API management DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
