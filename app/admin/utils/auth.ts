import { useAuth } from "../../../lib/auth-context";

// Enhanced admin authentication utility
export const useAdminAuth = () => {
  const { user, session, loading } = useAuth();

  const isAdmin = (user: any): boolean => {
    if (!user) return false;
    return (
      user.email === "admin@neurolint.com" ||
      user.email === "info@neurolint.com" ||
      user.role === "admin"
    );
  };

  const getAuthToken = (): string | null => {
    if (!session?.access_token) {
      // Fallback to localStorage if session not available
      try {
        const savedSession = localStorage.getItem("supabase_session");
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          return sessionData.access_token;
        }
      } catch (e) {
        console.error("Failed to get auth token from localStorage:", e);
      }
      return null;
    }
    return session.access_token;
  };

  const createAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  const adminFetch = async (
    url: string,
    options: RequestInit = {},
  ): Promise<Response> => {
    const headers = createAuthHeaders();

    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  };

  return {
    user,
    session,
    loading,
    isAdmin: isAdmin(user),
    getAuthToken,
    createAuthHeaders,
    adminFetch,
  };
};

// Audit logging utility
export const logAdminAction = async (
  action: string,
  targetType?: string,
  targetId?: string,
  details?: any,
) => {
  try {
    const authHeaders = {
      Authorization: `Bearer ${localStorage.getItem("supabase_session") ? JSON.parse(localStorage.getItem("supabase_session")!).access_token : ""}`,
      "Content-Type": "application/json",
    };

    await fetch("/api/admin/audit", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      }),
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
};

// Error reporting utility
export const reportError = async (
  error: Error | string,
  level: "error" | "warning" | "info" = "error",
  context?: any,
) => {
  try {
    const authHeaders = {
      Authorization: `Bearer ${localStorage.getItem("supabase_session") ? JSON.parse(localStorage.getItem("supabase_session")!).access_token : ""}`,
      "Content-Type": "application/json",
    };

    await fetch("/api/admin/error-log", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        level,
        message: error instanceof Error ? error.message : String(error),
        details: {
          stack: error instanceof Error ? error.stack : undefined,
          context,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (reportingError) {
    console.error("Failed to report error:", reportingError);
  }
};
