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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create required tables for admin dashboard
    const sqlCommands = [
      // API Keys table
      `CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        key TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        usage_count INTEGER DEFAULT 0,
        rate_limit INTEGER DEFAULT 1000,
        last_used TIMESTAMPTZ,
        expires_at TIMESTAMPTZ,
        is_active BOOLEAN DEFAULT true,
        permissions JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,

      // Error Logs table
      `CREATE TABLE IF NOT EXISTS error_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        level TEXT NOT NULL DEFAULT 'error',
        message TEXT NOT NULL,
        details JSONB,
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        endpoint TEXT,
        method TEXT,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,

      // Admin Configuration table
      `CREATE TABLE IF NOT EXISTS admin_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updated_by UUID REFERENCES auth.users(id),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,

      // Admin Audit Log table
      `CREATE TABLE IF NOT EXISTS admin_audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        target_type TEXT,
        target_id TEXT,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,

      // System Health Log table
      `CREATE TABLE IF NOT EXISTS system_health_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        metric_name TEXT NOT NULL,
        metric_value NUMERIC,
        metric_unit TEXT,
        details JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,

      // Notification Queue table
      `CREATE TABLE IF NOT EXISTS notification_queue (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL,
        recipient TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        details JSONB,
        status TEXT DEFAULT 'pending',
        attempts INTEGER DEFAULT 0,
        max_attempts INTEGER DEFAULT 3,
        scheduled_for TIMESTAMPTZ DEFAULT NOW(),
        sent_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,

      // Indexes for performance
      `CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active)`,
      `CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_log_admin_user_id ON admin_audit_log(admin_user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON admin_audit_log(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_health_log_metric_name ON system_health_log(metric_name)`,
      `CREATE INDEX IF NOT EXISTS idx_health_log_created_at ON system_health_log(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_notification_status ON notification_queue(status)`,

      // RLS Policies
      `ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE system_health_log ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY`,

      // Admin-only access policies
      `DROP POLICY IF EXISTS "Admin access to api_keys" ON api_keys`,
      `CREATE POLICY "Admin access to api_keys" ON api_keys FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.role = 'admin' OR profiles.email IN ('admin@neurolint.com', 'info@neurolint.com'))
        )
      )`,

      `DROP POLICY IF EXISTS "Admin access to error_logs" ON error_logs`,
      `CREATE POLICY "Admin access to error_logs" ON error_logs FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.role = 'admin' OR profiles.email IN ('admin@neurolint.com', 'info@neurolint.com'))
        )
      )`,

      `DROP POLICY IF EXISTS "Admin access to admin_config" ON admin_config`,
      `CREATE POLICY "Admin access to admin_config" ON admin_config FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.role = 'admin' OR profiles.email IN ('admin@neurolint.com', 'info@neurolint.com'))
        )
      )`,

      `DROP POLICY IF EXISTS "Admin access to admin_audit_log" ON admin_audit_log`,
      `CREATE POLICY "Admin access to admin_audit_log" ON admin_audit_log FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.role = 'admin' OR profiles.email IN ('admin@neurolint.com', 'info@neurolint.com'))
        )
      )`,

      `DROP POLICY IF EXISTS "Admin access to system_health_log" ON system_health_log`,
      `CREATE POLICY "Admin access to system_health_log" ON system_health_log FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.role = 'admin' OR profiles.email IN ('admin@neurolint.com', 'info@neurolint.com'))
        )
      )`,

      `DROP POLICY IF EXISTS "Admin access to notification_queue" ON notification_queue`,
      `CREATE POLICY "Admin access to notification_queue" ON notification_queue FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND (profiles.role = 'admin' OR profiles.email IN ('admin@neurolint.com', 'info@neurolint.com'))
        )
      )`,

      // Add role column to profiles if it doesn't exist
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'`,

      // Update function for timestamps
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql'`,

      // Triggers for updated_at
      `DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys`,
      `CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

      `DROP TRIGGER IF EXISTS update_admin_config_updated_at ON admin_config`,
      `CREATE TRIGGER update_admin_config_updated_at BEFORE UPDATE ON admin_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    ];

    const results = [];
    for (const sql of sqlCommands) {
      try {
        const { error } = await supabase.rpc("exec_sql", { sql_query: sql });
        if (error) {
          console.error(`SQL Error for: ${sql.substring(0, 50)}...`, error);
          results.push({
            sql: sql.substring(0, 50) + "...",
            error: error.message,
          });
        } else {
          results.push({ sql: sql.substring(0, 50) + "...", success: true });
        }
      } catch (e) {
        console.error(`Exception for: ${sql.substring(0, 50)}...`, e);
        results.push({ sql: sql.substring(0, 50) + "...", error: String(e) });
      }
    }

    // Log the setup action
    try {
      await supabase.from("admin_audit_log").insert({
        admin_user_id: user.id,
        action: "setup_database_schema",
        target_type: "system",
        details: { results },
        ip_address:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip"),
        user_agent: request.headers.get("user-agent"),
      });
    } catch (auditError) {
      console.error("Failed to log audit entry:", auditError);
    }

    return NextResponse.json({
      success: true,
      message: "Database schema setup completed",
      results,
    });
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup database schema" },
      { status: 500 },
    );
  }
}
