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

    // Use service role to update profile
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First check if profiles table exists, if not create it
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "profiles");

    const profilesTableExists = tables && tables.length > 0;

    if (!profilesTableExists) {
      // Create profiles table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users ON DELETE CASCADE,
          email TEXT,
          role TEXT DEFAULT 'user',
          first_name TEXT,
          last_name TEXT,
          plan TEXT DEFAULT 'free',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          PRIMARY KEY (id)
        );

        -- Enable RLS
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY "Enable insert for authenticated users only" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
      `;

      try {
        await supabase.rpc("exec_sql", { sql_query: createTableSQL });
      } catch (rpcError) {
        // If RPC doesn't work, we'll continue and try direct operations
        console.log("RPC failed, will try direct operations");
      }
    }

    // Try to find existing profile
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", user.id)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile to admin
      const { data, error } = await supabase
        .from("profiles")
        .update({
          role: "admin",
          email: user.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select();

      result = { data, error, operation: "update" };
    } else {
      // Insert new profile with admin role
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          role: "admin",
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          plan: "admin",
        })
        .select();

      result = { data, error, operation: "insert" };
    }

    if (result.error) {
      return NextResponse.json(
        {
          error: "Failed to grant admin access",
          details: result.error.message,
          operation: result.operation,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin access granted successfully",
      user: {
        id: user.id,
        email: user.email,
      },
      profile: result.data?.[0],
      operation: result.operation,
    });
  } catch (error) {
    console.error("Grant admin API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
