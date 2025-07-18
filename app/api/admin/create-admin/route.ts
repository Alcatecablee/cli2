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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const adminEmail = "admin@neurolint.com";

    // First, check if there's any user with admin@neurolint.com in auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const adminAuthUser = authUsers?.users?.find((u) => u.email === adminEmail);

    if (!adminAuthUser) {
      return NextResponse.json({
        error: "Admin user not found in authentication system",
        message: `Please sign up with ${adminEmail} first`,
        authUsers:
          authUsers?.users?.map((u) => ({ id: u.id, email: u.email })) || [],
      });
    }

    // Try to create users table (if it doesn't exist, this will fail gracefully)
    try {
      await supabase.from("users").select("id").limit(1);
    } catch {
      // Table might not exist, that's okay for now
    }

    // Try to insert/update the admin user directly
    const { data: insertResult, error: insertError } = await supabase
      .from("users")
      .upsert(
        {
          id: adminAuthUser.id,
          clerk_id: adminAuthUser.id, // Use the same ID for clerk_id
          email: adminEmail,
          plan_type: "admin",
          full_name: "Admin User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      )
      .select();

    if (insertError) {
      // If insert fails, try creating a simple user record without the extra columns
      const { data: simpleInsert, error: simpleError } = await supabase
        .from("users")
        .upsert(
          {
            id: adminAuthUser.id,
            clerk_id: adminAuthUser.id,
            email: adminEmail,
            plan_type: "admin",
          },
          {
            onConflict: "id",
          },
        )
        .select();

      if (simpleError) {
        return NextResponse.json({
          error: "Failed to create admin user",
          insertError: insertError.message,
          simpleError: simpleError.message,
          adminUser: adminAuthUser,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully created admin user ${adminEmail}`,
        user: simpleInsert?.[0],
        operation: "simple_insert",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created admin user ${adminEmail}`,
      user: insertResult?.[0],
      operation: "full_insert",
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
