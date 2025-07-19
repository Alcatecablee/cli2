import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Track if token refresh is in progress to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Create the main Supabase client with auto token refresh disabled to prevent conflicts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Disable auto refresh to prevent conflicts
    persistSession: false, // Disable auto persistence to handle manually
    detectSessionInUrl: false, // Disable URL session detection
  },
});

// Helper function to set session from localStorage
export async function setSupabaseSession(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const storedSessionStr = localStorage.getItem("supabase_session");
    if (!storedSessionStr) {
      console.log("No stored session found");
      return false;
    }

    const storedSession = JSON.parse(storedSessionStr);

    // Check if session is not expired
    if (
      storedSession.expires_at &&
      storedSession.expires_at * 1000 <= Date.now()
    ) {
      console.log("Stored session has expired");
      localStorage.removeItem("supabase_session");
      localStorage.removeItem("user_data");
      return false;
    }

    // Set the session on Supabase client
    const { error } = await supabase.auth.setSession({
      access_token: storedSession.access_token,
      refresh_token: storedSession.refresh_token,
    });

    if (error) {
      console.error("Error setting Supabase session:", error.message);
      return false;
    }

    console.log("Successfully set Supabase session");
    return true;
  } catch (error) {
    console.error("Error in setSupabaseSession:", error);
    return false;
  }
}

// Helper function to get authenticated user
export async function getAuthenticatedUser() {
  // First try to set session from localStorage
  await setSupabaseSession();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("No authenticated user found");
    return null;
  }

  return user;
}

// Helper function to ensure authentication before DB operations
export async function ensureAuthenticated(
  expectedUserId?: string,
): Promise<boolean> {
  const user = await getAuthenticatedUser();

  if (!user) {
    console.error("User not authenticated");
    return false;
  }

  if (expectedUserId && user.id !== expectedUserId) {
    console.error(
      `User ID mismatch: expected ${expectedUserId}, got ${user.id}`,
    );
    return false;
  }

  return true;
}

export default supabase;
