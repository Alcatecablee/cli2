import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for database objects
export interface AnalysisHistory {
  id: string;
  user_id: string;
  filename: string;
  timestamp: string;
  result: any;
  layers: number[];
  execution_time: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  files: string[];
  created_at: string;
  updated_at?: string;
  last_analyzed?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  default_layers: number[];
  auto_save: boolean;
  notifications: boolean;
  theme: "dark" | "light";
  created_at?: string;
  updated_at?: string;
}

// Enhanced error formatting function
function formatError(error: any): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === "object" && error !== null) {
    // Try to extract meaningful error information
    const errorObj: any = {};

    // Extract common Supabase error properties
    if (error.message) errorObj.message = error.message;
    if (error.details) errorObj.details = error.details;
    if (error.hint) errorObj.hint = error.hint;
    if (error.code) errorObj.code = error.code;
    if (error.status) errorObj.status = error.status;
    if (error.statusText) errorObj.statusText = error.statusText;

    // If we have meaningful properties, format them nicely
    if (Object.keys(errorObj).length > 0) {
      return Object.entries(errorObj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }

    // Fallback to JSON stringify with error handling
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return "[Complex object - unable to stringify]";
    }
  }

  return String(error);
}

// Helper function to get auth session
async function getAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Get session from Supabase auth
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.warn("Error getting auth session:", formatError(error));
      return null;
    }

    return session;
  } catch (error) {
    console.warn("Failed to get auth session:", formatError(error));
    return null;
  }
}

// Helper function to validate user authentication for RLS
async function validateUserAuth(userId: string): Promise<boolean> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("User not authenticated:", formatError(error));
      return false;
    }

    if (user.id !== userId) {
      console.error(
        `User ID mismatch: authenticated user ${user.id}, requested ${userId}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating user auth:", formatError(error));
    return false;
  }
}

// Helper function to create authenticated Supabase client
async function createAuthenticatedClient() {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    console.warn("Running in server environment - using service role client");
    return supabase;
  }

  try {
    // Get current session from Supabase auth
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", formatError(error));
      return supabase;
    }

    if (!session) {
      console.warn("No active session found - user may not be logged in");
      return supabase;
    }

    // Verify the session is valid and user exists
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Invalid session or user not found:",
        formatError(userError),
      );
      return supabase;
    }

    console.log("Authenticated user found:", user.id);
    return supabase;
  } catch (error) {
    console.error("Error in createAuthenticatedClient:", formatError(error));
    return supabase;
  }
}

// Data service functions
export const dataService = {
  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const client = await createAuthenticatedClient();
      const { data, error } = await client
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No settings found, return default settings without logging error
          console.log(
            `No user settings found for user ${userId}, using defaults`,
          );
          return {
            id: "",
            user_id: userId,
            default_layers: [],
            auto_save: true,
            notifications: true,
            theme: "dark",
          };
        }

        // Log other errors but don't throw
        console.error("Error fetching user settings:", formatError(error));

        // Return default settings as fallback
        return {
          id: "",
          user_id: userId,
          default_layers: [],
          auto_save: true,
          notifications: true,
          theme: "dark",
        };
      }

      return data;
    } catch (error) {
      console.error("Error in getUserSettings:", formatError(error));

      // Return default settings as ultimate fallback
      return {
        id: "",
        user_id: userId,
        default_layers: [],
        auto_save: true,
        notifications: true,
        theme: "dark",
      };
    }
  },

  async saveUserSettings(
    userId: string,
    settings: Omit<
      UserSettings,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ): Promise<UserSettings | null> {
    try {
      const client = await createAuthenticatedClient();
      const { data, error } = await client
        .from("user_settings")
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving user settings:", formatError(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in saveUserSettings:", formatError(error));
      return null;
    }
  },

  // Analysis History
  async saveAnalysisHistory(
    userId: string,
    analysisData: Omit<
      AnalysisHistory,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ): Promise<AnalysisHistory | null> {
    try {
      const client = await createAuthenticatedClient();

      const { data, error } = await client
        .from("analysis_history")
        .insert({
          user_id: userId,
          ...analysisData,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving analysis history:", formatError(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in saveAnalysisHistory:", formatError(error));
      return null;
    }
  },

  async getAnalysisHistory(
    userId: string,
    limit = 50,
  ): Promise<AnalysisHistory[]> {
    try {
      const client = await createAuthenticatedClient();
      const { data, error } = await client
        .from("analysis_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching analysis history:", formatError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getAnalysisHistory:", formatError(error));
      return [];
    }
  },

  async deleteAnalysisHistory(
    userId: string,
    historyId: string,
  ): Promise<boolean> {
    try {
      const client = await createAuthenticatedClient();
      const { error } = await client
        .from("analysis_history")
        .delete()
        .eq("id", historyId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting analysis history:", formatError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteAnalysisHistory:", formatError(error));
      return false;
    }
  },

  async clearAnalysisHistory(userId: string): Promise<boolean> {
    try {
      const client = await createAuthenticatedClient();
      const { error } = await client
        .from("analysis_history")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error clearing analysis history:", formatError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in clearAnalysisHistory:", formatError(error));
      return false;
    }
  },

  // Projects
  async saveProject(
    userId: string,
    projectData: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Project | null> {
    try {
      // Validate user authentication
      const isAuthenticated = await validateUserAuth(userId);
      if (!isAuthenticated) {
        console.error("User authentication failed for saveProject");
        return null;
      }

      const client = await createAuthenticatedClient();

      console.log("Attempting to save project for user:", userId);
      const { data, error } = await client
        .from("projects")
        .insert({
          user_id: userId,
          ...projectData,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving project:", formatError(error));
        return null;
      }

      console.log("Project saved successfully:", data.id);
      return data;
    } catch (error) {
      console.error("Error in saveProject:", formatError(error));
      return null;
    }
  },

  async getProjects(userId: string): Promise<Project[]> {
    try {
      const client = await createAuthenticatedClient();
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", formatError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getProjects:", formatError(error));
      return [];
    }
  },

  async updateProject(
    userId: string,
    projectId: string,
    updates: Partial<Omit<Project, "id" | "user_id" | "created_at">>,
  ): Promise<Project | null> {
    try {
      const client = await createAuthenticatedClient();
      const { data, error } = await client
        .from("projects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating project:", formatError(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in updateProject:", formatError(error));
      return null;
    }
  },

  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    try {
      const client = await createAuthenticatedClient();
      const { error } = await client
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting project:", formatError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteProject:", formatError(error));
      return false;
    }
  },

  // Hybrid approach: try Supabase first, fallback to localStorage
  async saveAnalysisHistoryHybrid(
    userId: string | null,
    analysisData: Omit<
      AnalysisHistory,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ): Promise<void> {
    // Always save to localStorage for immediate access
    try {
      if (typeof window !== "undefined") {
        const localHistory = JSON.parse(
          localStorage.getItem("neurolint-history") || "[]",
        );
        const newItem = {
          id: Date.now().toString(),
          ...analysisData,
          timestamp: analysisData.timestamp || new Date().toISOString(),
        };
        const updatedHistory = [newItem, ...localHistory].slice(0, 50);
        localStorage.setItem(
          "neurolint-history",
          JSON.stringify(updatedHistory),
        );
      }
    } catch (error) {
      console.error("Error saving to localStorage:", formatError(error));
    }

    // If user is authenticated, also save to Supabase
    if (userId) {
      try {
        const result = await this.saveAnalysisHistory(userId, analysisData);
        if (result) {
          console.log("Successfully saved analysis history to Supabase");
        }
      } catch (error) {
        console.error("Error saving to Supabase:", formatError(error));
      }
    }
  },

  async getAnalysisHistoryHybrid(userId: string | null): Promise<any[]> {
    // If user is authenticated, try Supabase first
    if (userId) {
      try {
        const supabaseHistory = await this.getAnalysisHistory(userId);
        if (supabaseHistory.length > 0) {
          // Also update localStorage with Supabase data
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "neurolint-history",
                JSON.stringify(supabaseHistory),
              );
            }
          } catch (error) {
            console.error("Error updating localStorage:", formatError(error));
          }
          return supabaseHistory;
        }
      } catch (error) {
        console.error(
          "Error fetching from Supabase, falling back to localStorage:",
          formatError(error),
        );
      }
    }

    // Fallback to localStorage
    try {
      if (typeof window !== "undefined") {
        const localHistory = JSON.parse(
          localStorage.getItem("neurolint-history") || "[]",
        );
        return localHistory;
      }
      return [];
    } catch (error) {
      console.error("Error reading from localStorage:", formatError(error));
      return [];
    }
  },
};

export default dataService;
