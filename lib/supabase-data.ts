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

// Data service functions
export const dataService = {
  // Analysis History
  async saveAnalysisHistory(
    userId: string,
    analysisData: Omit<
      AnalysisHistory,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ): Promise<AnalysisHistory | null> {
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .insert({
          user_id: userId,
          ...analysisData,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving analysis history:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in saveAnalysisHistory:", error);
      return null;
    }
  },

  async getAnalysisHistory(
    userId: string,
    limit = 50,
  ): Promise<AnalysisHistory[]> {
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching analysis history:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getAnalysisHistory:", error);
      return [];
    }
  },

  async deleteAnalysisHistory(
    userId: string,
    historyId: string,
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("analysis_history")
        .delete()
        .eq("id", historyId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting analysis history:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteAnalysisHistory:", error);
      return false;
    }
  },

  async clearAnalysisHistory(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("analysis_history")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error clearing analysis history:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in clearAnalysisHistory:", error);
      return false;
    }
  },

  // Projects
  async saveProject(
    userId: string,
    projectData: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: userId,
          ...projectData,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving project:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in saveProject:", error);
      return null;
    }
  },

  async getProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getProjects:", error);
      return [];
    }
  },

  async updateProject(
    userId: string,
    projectId: string,
    updates: Partial<Omit<Project, "id" | "user_id" | "created_at">>,
  ): Promise<Project | null> {
    try {
      const { data, error } = await supabase
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
        console.error("Error updating project:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in updateProject:", error);
      return null;
    }
  },

  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting project:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteProject:", error);
      return false;
    }
  },

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No settings found, return default settings
          return {
            id: "",
            user_id: userId,
            default_layers: [],
            auto_save: true,
            notifications: true,
            theme: "dark",
          };
        }
        console.error("Error fetching user settings:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserSettings:", error);
      return null;
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
      const { data, error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving user settings:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in saveUserSettings:", error);
      return null;
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
      const localHistory = JSON.parse(
        localStorage.getItem("neurolint-history") || "[]",
      );
      const newItem = {
        id: Date.now().toString(),
        ...analysisData,
        timestamp: analysisData.timestamp || new Date().toISOString(),
      };
      const updatedHistory = [newItem, ...localHistory].slice(0, 50);
      localStorage.setItem("neurolint-history", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    // If user is authenticated, also save to Supabase
    if (userId) {
      try {
        await this.saveAnalysisHistory(userId, analysisData);
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        // Continue execution - localStorage backup is available
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
            localStorage.setItem(
              "neurolint-history",
              JSON.stringify(supabaseHistory),
            );
          } catch (error) {
            console.error("Error updating localStorage:", error);
          }
          return supabaseHistory;
        }
      } catch (error) {
        console.error(
          "Error fetching from Supabase, falling back to localStorage:",
          error,
        );
      }
    }

    // Fallback to localStorage
    try {
      const localHistory = JSON.parse(
        localStorage.getItem("neurolint-history") || "[]",
      );
      return localHistory;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },
};

export default dataService;
