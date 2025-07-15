"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
  emailConfirmed: boolean;
  createdAt?: string;
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
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
        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
        });

        if (response.ok) {
          const { user: currentUser } = await response.json();

          // Additional validation on user data
          if (currentUser && currentUser.id && currentUser.email) {
            setUser(currentUser);
            setSession(sessionData);
          } else {
            console.error("Invalid user data received");
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
      }
    } catch (error) {
      console.error("Session check failed:", error);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
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
  };

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

      const data = await response.json();

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

      const data = await response.json();

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

    const data = await response.json();

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
