"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
  emailConfirmed: boolean;
  createdAt?: string;
  trialPlan?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  trialUsed?: boolean;
  isOnTrial?: boolean;
  trialDaysRemaining?: number;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // During SSR or if provider is not ready, return safe default values
    if (typeof window === "undefined") {
      return {
        user: null,
        session: null,
        loading: true,
        signIn: async () => {},
        signUp: async () => {},
        signOut: async () => {},
        updateProfile: async () => {},
      };
    }
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem("supabase_session");
      localStorage.removeItem("user_data");
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error clearing session:", error);
      // Still clear state even if localStorage fails
      setUser(null);
      setSession(null);
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      // Check if we're in a browser environment
      if (
        typeof window === "undefined" ||
        typeof localStorage === "undefined"
      ) {
        return;
      }

      const savedSession = localStorage.getItem("supabase_session");

      if (savedSession) {
        let sessionData;
        try {
          sessionData = JSON.parse(savedSession);
        } catch (e) {
          console.error("Invalid session data in localStorage");
          clearSession();
          return;
        }

        // Check if session has expired
        if (
          sessionData.expires_at &&
          sessionData.expires_at * 1000 < Date.now()
        ) {
          console.log("Session expired");
          clearSession();
          return;
        }

        // Validate session structure
        if (!sessionData.access_token || !sessionData.refresh_token) {
          console.error("Invalid session structure");
          clearSession();
          return;
        }

        // Verify session is still valid with server
        try {
          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch("/api/auth/user", {
            headers: {
              Authorization: `Bearer ${sessionData.access_token}`,
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            try {
              // Clone the response to avoid body stream issues
              const responseClone = response.clone();
              const { user: currentUser } = await responseClone.json();

              // Additional validation on user data
              if (currentUser && currentUser.id && currentUser.email) {
                console.log("[AUTH] Setting user and session");
                setUser(currentUser);
                setSession(sessionData);
              } else {
                console.error("Invalid user data received", currentUser);
                clearSession();
              }
            } catch (jsonError) {
              console.error("Failed to parse user data:", jsonError);
              clearSession();
            }
          } else if (response.status === 401) {
            // Session invalid, try to refresh or clear
            console.log("Session invalid, clearing storage");
            clearSession();
          } else {
            console.error("Session validation failed:", response.status);
            clearSession();
          }
        } catch (fetchError) {
          console.warn("Session validation network error:", fetchError);

          // Check if it's a network/timeout error
          const isNetworkError =
            fetchError instanceof TypeError &&
            (fetchError.message.includes("fetch") ||
              fetchError.message.includes("Failed to fetch") ||
              fetchError.name === "AbortError");

          if (
            isNetworkError &&
            sessionData.access_token &&
            sessionData.refresh_token
          ) {
            console.log("Using cached session due to network error");
            // Try to get cached user data
            const cachedUserData = localStorage.getItem("user_data");
            if (cachedUserData) {
              try {
                const userData = JSON.parse(cachedUserData);
                if (userData && userData.id && userData.email) {
                  setUser(userData);
                  setSession(sessionData);

                  // Schedule a retry in 30 seconds
                  setTimeout(() => {
                    console.log("Retrying session validation...");
                    checkSession();
                  }, 30000);

                  return; // Exit early with cached data
                }
              } catch (e) {
                console.error("Invalid cached user data");
              }
            }
          }

          // If we can't use cached data or it's not a network error, clear session
          clearSession();
        }
      }
    } catch (error) {
      console.error("Session check failed:", error);

      // Only clear session if it's not a network error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn(
          "Network error during session check, will retry on next page load",
        );
        // Don't clear session for network errors - user might be offline
      } else {
        clearSession();
      }
    } finally {
      console.log("[AUTH] checkSession setting loading to false");
      setLoading(false);
    }
  }, [clearSession]); // Include clearSession in dependencies

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.warn("[AUTH] Forcing loading state to false after 15 seconds");
      setLoading(false);
    }, 15000);

    return () => clearTimeout(fallbackTimeout);
  }, [checkSession]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Input validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // Clone the response to avoid body stream issues
      const responseClone = response.clone();

      let data;
      try {
        data = await responseClone.json();
      } catch (jsonError) {
        console.error("Failed to parse login response:", jsonError);
        // Try to get error text if JSON parsing fails
        try {
          const errorText = await response.text();
          console.error("Response text:", errorText);
          throw new Error("Server returned invalid response");
        } catch (textError) {
          throw new Error("Unable to read server response");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Validate response data
      if (!data.session?.access_token || !data.user?.id) {
        throw new Error("Invalid response from server");
      }

      try {
        localStorage.setItem("supabase_session", JSON.stringify(data.session));
        localStorage.setItem("user_data", JSON.stringify(data.user));
        setUser(data.user);
        setSession(data.session);
      } catch (storageError) {
        console.error("Failed to save session to localStorage:", storageError);
        // Still set state even if localStorage fails
        setUser(data.user);
        setSession(data.session);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      // Clone the response to avoid body stream issues
      const responseClone = response.clone();

      let data;
      try {
        data = await responseClone.json();
      } catch (jsonError) {
        console.error("Failed to parse signup response:", jsonError);
        // Try to get error text if JSON parsing fails
        try {
          const errorText = await response.text();
          console.error("Response text:", errorText);
          throw new Error("Server returned invalid response");
        } catch (textError) {
          throw new Error("Unable to read server response");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      if (data.session?.access_token) {
        localStorage.setItem("supabase_session", JSON.stringify(data.session));
        localStorage.setItem("user_data", JSON.stringify(data.user));
        setUser(data.user);
        setSession(data.session);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (session?.access_token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearSession();
      setLoading(false);
      router.push("/");
    }
  };

  const updateProfile = async (firstName: string, lastName: string) => {
    if (!session?.access_token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("/api/auth/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    // Clone the response to avoid body stream issues
    const responseClone = response.clone();

    let data;
    try {
      data = await responseClone.json();
    } catch (jsonError) {
      console.error("Failed to parse profile update response:", jsonError);
      // Try to get error text if JSON parsing fails
      try {
        const errorText = await response.text();
        console.error("Response text:", errorText);
        throw new Error("Server returned invalid response");
      } catch (textError) {
        throw new Error("Unable to read server response");
      }
    }

    if (!response.ok) {
      throw new Error(data.error || "Profile update failed");
    }

    setUser(data.user);
    localStorage.setItem("user_data", JSON.stringify(data.user));
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
