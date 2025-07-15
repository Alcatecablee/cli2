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
      const savedUser = localStorage.getItem("user_data");

      if (savedSession && savedUser) {
        const sessionData = JSON.parse(savedSession);
        const userData = JSON.parse(savedUser);

        // Verify session is still valid
        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
        });

        if (response.ok) {
          const { user: currentUser } = await response.json();
          setUser(currentUser);
          setSession(sessionData);
        } else {
          // Session invalid, clear storage
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
    localStorage.removeItem("supabase_session");
    localStorage.removeItem("user_data");
    setUser(null);
    setSession(null);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.session?.access_token) {
        localStorage.setItem("supabase_session", JSON.stringify(data.session));
        localStorage.setItem("user_data", JSON.stringify(data.user));
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
