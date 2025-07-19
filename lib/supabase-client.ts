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

// Helper function to safely set session with refresh token conflict prevention
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

    // Check if session is not expired (with 5 minute buffer)
    const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (
      storedSession.expires_at &&
      storedSession.expires_at * 1000 <= Date.now() + expirationBuffer
    ) {
      console.log(
        "Stored session has expired or will expire soon, attempting refresh",
      );

      // If already refreshing, wait for that operation
      if (isRefreshing && refreshPromise) {
        console.log("Token refresh already in progress, waiting...");
        return await refreshPromise;
      }

      // Start refresh process
      isRefreshing = true;
      refreshPromise = refreshToken(storedSession.refresh_token);

      try {
        const refreshResult = await refreshPromise;
        return refreshResult;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Set the session on Supabase client (only if not expired)
    const { error } = await supabase.auth.setSession({
      access_token: storedSession.access_token,
      refresh_token: storedSession.refresh_token,
    });

    if (error) {
      console.error("Error setting Supabase session:", error.message);

      // If error is about invalid refresh token, clear storage and try refresh
      if (
        error.message.includes("Invalid Refresh Token") ||
        error.message.includes("Already Used")
      ) {
        console.log("Refresh token invalid, clearing storage");
        localStorage.removeItem("supabase_session");
        localStorage.removeItem("user_data");
        return false;
      }

      return false;
    }

    console.log("Successfully set Supabase session");
    return true;
  } catch (error) {
    console.error("Error in setSupabaseSession:", error);
    return false;
  }
}

// Helper function to refresh tokens safely
async function refreshToken(refreshToken: string): Promise<boolean> {
  try {
    console.log("Attempting to refresh token...");

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Token refresh failed:", error.message);

      // Clear invalid sessions
      localStorage.removeItem("supabase_session");
      localStorage.removeItem("user_data");
      return false;
    }

    if (data.session) {
      console.log("Token refreshed successfully");

      // Update localStorage with new session
      localStorage.setItem("supabase_session", JSON.stringify(data.session));

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error during token refresh:", error);
    localStorage.removeItem("supabase_session");
    localStorage.removeItem("user_data");
    return false;
  }
}

// Safe session initialization that avoids conflicts
export async function initializeSession(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const storedSessionStr = localStorage.getItem("supabase_session");
    if (!storedSessionStr) {
      return false;
    }

    const storedSession = JSON.parse(storedSessionStr);

    // Only initialize if we have valid tokens and session isn't expired
    if (storedSession.access_token && storedSession.refresh_token) {
      const expirationBuffer = 5 * 60 * 1000; // 5 minutes buffer
      const isExpiringSoon =
        storedSession.expires_at &&
        storedSession.expires_at * 1000 <= Date.now() + expirationBuffer;

      if (!isExpiringSoon) {
        // Session is still valid, use it
        return await setSupabaseSession();
      } else {
        // Session is expiring soon, trigger refresh
        console.log("Session expiring soon, will refresh on next API call");
        return true; // Return true but let API calls handle refresh
      }
    }

    return false;
  } catch (error) {
    console.error("Error initializing session:", error);
    return false;
  }
}

// Helper function to get authenticated user
export async function getAuthenticatedUser() {
  // Initialize session if needed
  await initializeSession();

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
