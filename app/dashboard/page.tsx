"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dataService from "../../lib/supabase-data-unified";
import "./dashboard.css";
import "./integrations.css";
import "./collaboration-styles.css";
import "./collaboration-enhanced.css";
import GitHubIntegrationFixed from "./components/GitHubIntegrationFixed";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ApiKeysManager from "./components/ApiKeysManager";
import SystemStatus from "./components/SystemStatus";
import ErrorBoundary from "./components/ErrorBoundary";
import Overview from "./components/Overview";
import CodeAnalysis from "./components/CodeAnalysis";
import CollaborationDashboard from "./components/CollaborationDashboard";

// Import the same result interfaces from the demo
interface DemoResult {
  success?: boolean;
  dryRun?: boolean;
  analysis?: {
    recommendedLayers: number[];
    detectedIssues: Array<{
      type: string;
      severity: string;
      description: string;
      fixedByLayer: number;
      pattern: string;
      count?: number;
    }>;
    reasoning?: string[];
    confidence: number;
    estimatedImpact: {
      level: string;
      description: string;
      estimatedFixTime: string;
    };
  };
  transformed?: string;
  originalCode?: string;
  layers?: Array<{
    layerId: number;
    success: boolean;
    improvements?: string[];
    executionTime: number;
    changeCount?: number;
    revertReason?: string;
  }>;
  states?: string[];
  totalExecutionTime?: number;
  successfulLayers?: number;
  error?: string;
  metadata?: {
    requestId: string;
    processingTimeMs: number;
    timestamp: string;
    version: string;
  };
}

interface AnalysisHistory {
  id: string;
  filename: string;
  timestamp: Date;
  result: DemoResult;
  layers: number[];
  executionTime: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  files: string[];
  createdAt: Date;
  lastAnalyzed?: Date;
}

interface UserSettings {
  defaultLayers: number[];
  autoSave: boolean;
  notifications: boolean;
  theme: "dark" | "light";
  apiKey?: string;
}

interface SubscriptionData {
  subscriptions: any[];
  currentPlan: string;
  loading: boolean;
  error: string | null;
}

interface CollaborationTeam {
  id: string;
  name: string;
  description: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: "owner" | "admin" | "member";
    avatar?: string;
    status: "online" | "offline" | "away";
    lastSeen: Date;
  }>;
  settings: {
    defaultPermissions: "read" | "write" | "admin";
    allowInvites: boolean;
    requireApproval: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CollaborationActivity {
  id: string;
  type:
    | "session_created"
    | "session_joined"
    | "session_left"
    | "document_edited"
    | "comment_added"
    | "analysis_run"
    | "member_invited"
    | "member_joined";
  sessionId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  details: any;
}

interface DashboardState {
  isLoading: boolean;
  currentFile: string | null;
  result: DemoResult | null;
  showResults: boolean;
  selectedLayers: number[];
  applyFixes: boolean;
  sidebarCollapsed: boolean;
  activeSection: string;
  analysisHistory: AnalysisHistory[];
  projects: Project[];
  settings: UserSettings;
  progressStatus: string;
  uploadProgress: number;
  subscriptionData: SubscriptionData;
  collaborationSessions: any[];
  loadingSessions: boolean;
  collaborationTeams: CollaborationTeam[];
  collaborationActivity: CollaborationActivity[];
  loadingTeams: boolean;
  loadingActivity: boolean;
}

const sampleFiles = {
  "component-issues": {
    filename: "ProductCard.tsx",
    code: `import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const handleClick = () => {
    console.log('Adding to cart:', product.id);
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button type="button">Add to Cart</button>
    </div>
  );
}`,
  },
  "ssr-hydration": {
    filename: "UserProfile.tsx",
    code: `import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  if (!isClient) return null;

  return (
    <div className="user-profile">
      <h1>Welcome {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <div className="user-avatar">
        {user?.avatar && <img src={user.avatar} alt="User avatar" />}
      </div>
      {window.innerWidth > 768 && (
        <div className="desktop-only">
          <p>Screen width: {window.innerWidth}px</p>
        </div>
      )}
    </div>
  );
}`,
  },
  "nextjs-patterns": {
    filename: "BlogPost.tsx",
    code: `import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BlogPost({ post }) {
  const router = useRouter();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href
      });
    }
  };

  return (
    <article className="blog-post">
      <header>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author}</span>
          <time>{post.publishedAt}</time>
        </div>
      </header>
      
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      
      <footer>
        <button onClick={handleShare}>Share</button>
        <Link href="/blog">
          <a>← Back to Blog</a>
        </Link>
      </footer>
    </article>
  );
}`,
  },
};

export default function Dashboard() {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [forceBypassLoading, setForceBypassLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize hydration and bypass loading
  useEffect(() => {
    setIsHydrated(true);
    // Immediate bypass for dashboard
    setForceBypassLoading(true);
    console.log("Dashboard hydrated and bypass enabled");
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const [dashboardState, setDashboardState] = useState<DashboardState>({
    isLoading: false,
    currentFile: null,
    result: null,
    showResults: false,
    selectedLayers: [],
    applyFixes: false,
    sidebarCollapsed: false,
    activeSection: "overview",
    analysisHistory: [],
    projects: [],
    settings: {
      defaultLayers: [],
      autoSave: true,
      notifications: true,
      theme: "dark",
    },
    progressStatus: "",
    uploadProgress: 0,
    subscriptionData: {
      subscriptions: [],
      currentPlan: user?.plan || "free",
      loading: false,
      error: null,
    },
    collaborationSessions: [],
    loadingSessions: false,
    collaborationTeams: [],
    collaborationActivity: [],
    loadingTeams: false,
    loadingActivity: false,
  });

  // Search & filter for analysis history
  const [historySearch, setHistorySearch] = useState("");
  const filteredHistory = React.useMemo(
    () =>
      dashboardState.analysisHistory.filter((item) =>
        item.filename.toLowerCase().includes(historySearch.toLowerCase()),
      ),
    [dashboardState.analysisHistory, historySearch],
  );

  // Robust copy function with fallbacks
  const copyToClipboard = async (text: string, type: string) => {
    try {
      // First try the modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        console.log(`${type} code copied to clipboard`);
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback:", err);
    }

    // Optimized fallback method using textarea
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Use efficient CSS to avoid layout calculations
      textArea.style.cssText =
        "position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";

      // Use requestAnimationFrame to avoid forced reflow
      let successful = false;
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          document.body.appendChild(textArea);
          textArea.select();
          successful = document.execCommand("copy");

          // Cleanup in next frame
          requestAnimationFrame(() => {
            if (textArea.parentNode) {
              document.body.removeChild(textArea);
            }
            resolve();
          });
        });
      });

      if (successful) {
        console.log(`${type} code copied to clipboard (fallback)`);
      } else {
        throw new Error("execCommand failed");
      }
    } catch (fallbackErr) {
      console.error("All copy methods failed:", fallbackErr);
      // Show user a manual copy option - optimized to prevent reflows
      requestAnimationFrame(() => {
        const modal = document.createElement("div");
        modal.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 10000;
          max-width: 90vw;
          max-height: 80vh;
          overflow: auto;
          backdrop-filter: blur(10px);
          opacity: 0;
          transition: opacity 0.2s ease;
        `;

        const content = document.createElement("div");
        content.innerHTML = `
                <h3 style="margin-top: 0; color: rgba(33, 150, 243, 0.9);">Copy Code Manually</h3>
        <p style="color: rgba(255, 255, 255, 0.8);">Please copy the code below manually:</p>
        <textarea readonly style="
          width: 100%;
          height: 200px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          resize: vertical;
        ">${text}</textarea>
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 10px;
          padding: 8px 16px;
          background: rgba(33, 150, 243, 0.2);
          border: 1px solid rgba(33, 150, 243, 0.4);
                    color: rgba(33, 150, 243, 0.9);
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        ">Close</button>
      `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Auto-select the text in the textarea
        const textarea = modal.querySelector("textarea") as HTMLTextAreaElement;
        if (textarea) {
          textarea.select();
          textarea.focus();
        }

        // Fade in the modal
        requestAnimationFrame(() => {
          modal.style.opacity = "1";
        });
      });
    }
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBusinessImpact = (issueType: string, severity: string) => {
    const impacts: Record<string, Record<string, string>> = {
      "missing-key": {
        high: "Poor user experience, React warnings in console, potential performance issues during updates",
        medium:
          "Console warnings, slight performance degradation in list rendering",
        low: "Minor console warnings with minimal impact",
      },
      "html-entities": {
        high: "Broken text display, poor SEO, accessibility issues for screen readers",
        medium: "Text display issues, potential SEO impact",
        low: "Minor text encoding issues",
      },
      "ssr-hydration": {
        critical:
          "App crashes, hydration mismatches, poor Core Web Vitals, SEO penalties",
        high: "Hydration warnings, potential layout shifts, poor user experience",
        medium: "Minor hydration issues, slight performance impact",
      },
      accessibility: {
        high: "Legal compliance risk, excludes users with disabilities, poor lighthouse scores",
        medium: "Reduced accessibility, potential compliance issues",
        low: "Minor accessibility improvements needed",
      },
    };

    return (
      impacts[issueType]?.[severity] ||
      "Improves code standards and maintainability"
    );
  };

  const getSolutionDescription = (issueType: string) => {
    const solutions: Record<string, string> = {
      "missing-key":
        "Add unique key props to list items for optimal React reconciliation and performance",
      "html-entities":
        "Convert HTML entities to proper Unicode characters for correct text display",
      "ssr-hydration":
        "Add client-side guards and useEffect hooks to prevent server/client mismatches",
      accessibility:
        "Add ARIA labels, alt attributes, and semantic HTML for screen reader compatibility",
      "console-usage":
        "Remove or guard console statements for production optimization",
      "error-handling":
        "Add try-catch blocks and error boundaries for robust error handling",
    };

    return (
      solutions[issueType] ||
      "Apply established coding standards and performance optimizations"
    );
  };

  const formatProcessingTime = (ms: number) => {
    if (ms < 10) return `${ms.toFixed(1)}ms`;
    if (ms < 100) return `${ms.toFixed(0)}ms`;
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null);
  const [userExpandedSidebar, setUserExpandedSidebar] = useState(false);
  const [useEnhanced, setUseEnhanced] = useState(false);

  // Refs for scrolling
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const pasteSectionRef = useRef<HTMLDivElement>(null);
  const githubSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Save analysis to history
  const saveToHistory = useCallback(
    async (
      filename: string,
      result: DemoResult,
      layers: number[],
      executionTime: number,
    ) => {
      const historyItem: AnalysisHistory = {
        id: Date.now().toString(),
        filename,
        timestamp: new Date(),
        result,
        layers,
        executionTime,
      };

      // Use hybrid approach: save to both Supabase and localStorage
      await dataService.saveAnalysisHistoryHybrid(user?.id || null, {
        filename,
        timestamp: new Date().toISOString(),
        result,
        layers,
        execution_time: executionTime,
      });

      // Update local state
      setDashboardState((prev) => {
        const newHistory = [historyItem, ...prev.analysisHistory].slice(0, 50);
        return { ...prev, analysisHistory: newHistory };
      });
    },
    [user?.id],
  );

  // Auto-scroll utility function
  const scrollToSection = useCallback(
    (sectionRef: React.RefObject<HTMLDivElement>) => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    },
    [],
  );

  const analyzecode = useCallback(
    async (
      code: string,
      filename: string,
      layers: number[] | "auto" | "all",
      applyFixes: boolean,
    ) => {
      const startTime = Date.now();
      setDashboardState((prev) => ({
        ...prev,
        isLoading: true,
        result: null,
        progressStatus: "Initializing analysis...",
        uploadProgress: 0,
      }));

      try {
        setDashboardState((prev) => ({
          ...prev,
          progressStatus: "Sending request...",
          uploadProgress: 25,
        }));

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token && {
              Authorization: `Bearer ${session.access_token}`,
            }),
          },
          body: JSON.stringify({
            code,
            filename,
            layers,
            applyFixes,
            enhanced: useEnhanced,
          }),
        });

        setDashboardState((prev) => ({
          ...prev,
          progressStatus: "Processing response...",
          uploadProgress: 75,
        }));

        if (!response.ok) {
          let errorMessage = "Analysis failed";
          try {
            // Clone response to avoid "body stream already read" error
            const responseClone = response.clone();
            const errorResult = await responseClone.json();
            errorMessage = errorResult.error || errorMessage;
          } catch (jsonError) {
            // If response isn't JSON, use status text or default message
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();

        const normalizedResult = {
          ...result,
          success: result?.dryRun ? true : result?.success,
        };

        const executionTime = Date.now() - startTime;

        // Update session info if provided
        if (result.sessionInfo) {
          setSessionId(result.sessionInfo.sessionId);
          setRateLimitInfo(result.sessionInfo.rateLimitInfo);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "neurolint-session-id",
              result.sessionInfo.sessionId,
            );
          }
        }

        // Save to history if settings allow
        if (dashboardState.settings.autoSave && normalizedResult.success) {
          saveToHistory(
            filename,
            normalizedResult,
            Array.isArray(layers) ? layers : [],
            executionTime,
          );
        }

        setDashboardState((prev) => ({
          ...prev,
          result: normalizedResult,
          showResults: true,
          isLoading: false,
          progressStatus: "Analysis complete",
          uploadProgress: 100,
        }));

        // Auto-scroll to results after analysis completes
        setTimeout(() => {
          scrollToSection(resultsSectionRef);
        }, 100);
      } catch (error) {
        console.error("[DASHBOARD] Analysis failed:", error);
        setDashboardState((prev) => ({
          ...prev,
          result: {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Unknown error occurred during analysis",
          },
          showResults: true,
          isLoading: false,
          progressStatus: "Analysis failed",
          uploadProgress: 0,
        }));

        // Auto-scroll to results even on error
        setTimeout(() => {
          scrollToSection(resultsSectionRef);
        }, 100);
      }
    },
    [dashboardState.settings.autoSave, saveToHistory, session?.access_token],
  );

  const loadSampleFile = useCallback(
    (sampleKey: string) => {
      const sample = sampleFiles[sampleKey as keyof typeof sampleFiles];
      if (!sample) return;

      setDashboardState((prev) => ({ ...prev, currentFile: sample.filename }));

      const layers =
        dashboardState.selectedLayers.length > 0
          ? dashboardState.selectedLayers
          : "auto";
      analyzecode(
        sample.code,
        sample.filename,
        layers,
        dashboardState.applyFixes,
      );
    },
    [analyzecode, dashboardState.selectedLayers, dashboardState.applyFixes],
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.match(/\.(ts|tsx|js|jsx)$/)) {
        alert(
          "Please upload a TypeScript or JavaScript file (.ts, .tsx, .js, .jsx)",
        );
        return;
      }

      try {
        const code = await file.text();
        setDashboardState((prev) => ({ ...prev, currentFile: file.name }));

        const layers =
          dashboardState.selectedLayers.length > 0
            ? dashboardState.selectedLayers
            : "auto";
        analyzecode(code, file.name, layers, dashboardState.applyFixes);

        // Auto-scroll to upload section
        setTimeout(() => {
          scrollToSection(uploadSectionRef);
        }, 100);
      } catch (error) {
        console.error("[DASHBOARD] File upload failed:", error);
        alert("Failed to read the file. Please try again.");
      }
    },
    [
      analyzecode,
      dashboardState.selectedLayers,
      dashboardState.applyFixes,
      scrollToSection,
    ],
  );

  const toggleLayerSelection = useCallback((layerId: number) => {
    setDashboardState((prev) => ({
      ...prev,
      selectedLayers: prev.selectedLayers.includes(layerId)
        ? prev.selectedLayers.filter((id) => id !== layerId)
        : [...prev.selectedLayers, layerId].sort(),
    }));
  }, []);

  // Load subscription data from API
  const loadSubscriptionData = useCallback(async () => {
    if (!session?.access_token) return;

    setDashboardState((prev) => ({
      ...prev,
      subscriptionData: {
        ...prev.subscriptionData,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await fetch("/api/subscriptions", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscription data");
      }

      const data = await response.json();

      setDashboardState((prev) => ({
        ...prev,
        subscriptionData: {
          subscriptions: data.subscriptions || [],
          currentPlan: data.currentPlan || user?.plan || "free",
          loading: false,
          error: null,
        },
      }));
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      setDashboardState((prev) => ({
        ...prev,
        subscriptionData: {
          ...prev.subscriptionData,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  }, [session?.access_token, user?.plan]);

  // Load saved data and session on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load analysis history (hybrid approach)
        const history = await dataService.getAnalysisHistoryHybrid(
          user?.id || null,
        );
        setDashboardState((prev) => ({ ...prev, analysisHistory: history }));

        // If user is authenticated, load Supabase data
        if (user?.id) {
          try {
            // Load projects from Supabase
            const projects = await dataService.getProjects(user.id);
            const formattedProjects = projects.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              files: Array.isArray(p.files) ? p.files : [],
              createdAt: new Date(p.created_at),
              lastAnalyzed: p.last_analyzed
                ? new Date(p.last_analyzed)
                : undefined,
            }));
            setDashboardState((prev) => ({
              ...prev,
              projects: formattedProjects,
            }));

            // Load user settings from Supabase
            try {
              const settings = await dataService.getUserSettings(user.id);
              if (settings) {
                setDashboardState((prev) => ({
                  ...prev,
                  settings: {
                    defaultLayers: settings.default_layers || [],
                    autoSave: settings.auto_save,
                    notifications: settings.notifications,
                    theme: settings.theme as "dark" | "light",
                  },
                }));
              }
            } catch (settingsError) {
              // Enhanced error handling to prevent uncaught exceptions
              const errorMessage = (() => {
                if (settingsError instanceof Error) {
                  return settingsError.message;
                }
                if (
                  typeof settingsError === "object" &&
                  settingsError !== null
                ) {
                  try {
                    // Safely extract error information without consuming response bodies
                    const errorObj = {};
                    if (settingsError.message)
                      errorObj.message = settingsError.message;
                    if (settingsError.code) errorObj.code = settingsError.code;
                    if (settingsError.status)
                      errorObj.status = settingsError.status;
                    return Object.keys(errorObj).length > 0
                      ? Object.entries(errorObj)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : "Unknown object error";
                  } catch {
                    return "Error object processing failed";
                  }
                }
                return String(settingsError);
              })();

              console.error("Error fetching user settings:", errorMessage);
              // Continue with default settings - this is not a critical error
            }
          } catch (error) {
            // Enhanced error handling to prevent response body consumption issues
            const errorMessage = (() => {
              if (error instanceof Error) {
                return error.message;
              }
              if (typeof error === "object" && error !== null) {
                try {
                  // Safely extract error information without consuming response bodies
                  const errorObj = {};
                  if (error.message) errorObj.message = error.message;
                  if (error.code) errorObj.code = error.code;
                  if (error.status) errorObj.status = error.status;
                  if (error.details) errorObj.details = error.details;
                  return Object.keys(errorObj).length > 0
                    ? Object.entries(errorObj)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")
                    : "Unknown object error";
                } catch {
                  return "Error object processing failed";
                }
              }
              return String(error);
            })();
            console.error("Error loading Supabase data:", errorMessage);
            // Fall back to localStorage
            const savedProjects =
              typeof window !== "undefined"
                ? localStorage.getItem("neurolint-projects")
                : null;
            const savedSettings =
              typeof window !== "undefined"
                ? localStorage.getItem("neurolint-settings")
                : null;

            if (savedProjects) {
              try {
                const projects = JSON.parse(savedProjects);
                setDashboardState((prev) => ({ ...prev, projects }));
              } catch (e) {
                console.error("Failed to load projects from localStorage:", e);
              }
            }

            if (savedSettings) {
              try {
                const settings = JSON.parse(savedSettings);
                setDashboardState((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, ...settings },
                }));
              } catch (e) {
                console.error("Failed to load settings from localStorage:", e);
              }
            }
          }
        } else {
          // For non-authenticated users, use localStorage
          const savedProjects =
            typeof window !== "undefined"
              ? localStorage.getItem("neurolint-projects")
              : null;
          const savedSettings =
            typeof window !== "undefined"
              ? localStorage.getItem("neurolint-settings")
              : null;

          if (savedProjects) {
            try {
              const projects = JSON.parse(savedProjects);
              setDashboardState((prev) => ({ ...prev, projects }));
            } catch (e) {
              console.error("Failed to load projects:", e);
            }
          }

          if (savedSettings) {
            try {
              const settings = JSON.parse(savedSettings);
              setDashboardState((prev) => ({
                ...prev,
                settings: { ...prev.settings, ...settings },
              }));
            } catch (e) {
              console.error("Failed to load settings:", e);
            }
          }
        }

        // Load session info
        const savedSessionId =
          typeof window !== "undefined"
            ? localStorage.getItem("neurolint-session-id")
            : null;
        if (savedSessionId) {
          setSessionId(savedSessionId);
          fetch(`/api/dashboard?sessionId=${savedSessionId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.rateLimitInfo) {
                setRateLimitInfo(data.rateLimitInfo);
              }
            })
            .catch((e) => console.error("Failed to load session info:", e));
        }
      } catch (error) {
        // Enhanced top-level error handling
        const errorMessage = (() => {
          if (error instanceof Error) {
            return error.message;
          }
          if (typeof error === "object" && error !== null) {
            try {
              // Safely extract error information
              const errorObj = {};
              if (error.message) errorObj.message = error.message;
              if (error.name) errorObj.name = error.name;
              if (error.code) errorObj.code = error.code;
              return Object.keys(errorObj).length > 0
                ? Object.entries(errorObj)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                : "Unknown error object";
            } catch {
              return "Error processing failed";
            }
          }
          return String(error);
        })();
        console.error("Error loading dashboard data:", errorMessage);
      }
    };

    if (isHydrated) {
      loadDashboardData();
    }
  }, [user?.id, isHydrated]);

  // Load subscription data when account section is opened
  useEffect(() => {
    if (
      dashboardState.activeSection === "account" &&
      user &&
      session?.access_token
    ) {
      loadSubscriptionData();
    }
  }, [
    dashboardState.activeSection,
    user,
    session?.access_token,
    loadSubscriptionData,
  ]);

  // Load collaboration sessions when collaborate section is opened
  useEffect(() => {
    if (dashboardState.activeSection === "collaborate" && user?.id) {
      const loadSessions = async () => {
        setDashboardState((prev) => ({ ...prev, loadingSessions: true }));
        try {
          const response = await fetch("/api/collaboration/sessions", {
            headers: {
              "x-user-id": user.id,
              "x-user-name": user.firstName || user.email || "Anonymous",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setDashboardState((prev) => ({
              ...prev,
              collaborationSessions: data.sessions || [],
              loadingSessions: false,
            }));
          } else {
            setDashboardState((prev) => ({ ...prev, loadingSessions: false }));
          }
        } catch (error) {
          console.error("Failed to load collaboration sessions:", error);
          setDashboardState((prev) => ({ ...prev, loadingSessions: false }));
        }
      };
      loadSessions();
    }
  }, [dashboardState.activeSection, user]);

  // Show loading screen while checking authentication (bypassed for dashboard)
  if (!isHydrated && !forceBypassLoading && false) {
    // Disabled loading condition
    return (
      <div className="onboarding-section">
        <div className="onboarding-container">
          <div className="onboarding-content">
            <div className="onboarding-card">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "2px solid rgba(33, 150, 243, 0.4)",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                  margin: "0 auto 1.5rem",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <p className="onboarding-subtitle">Loading dashboard...</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const sidebarItems = [
    {
      id: "overview",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3h18v4H3z" />
          <path d="M3 10h18v4H3z" />
          <path d="M3 17h18v4H3z" />
        </svg>
      ),
      label: "Overview",
      description: "Summary & recent activity",
    },
    {
      id: "editor",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </svg>
      ),
      label: "Code Analysis",
      description: "Upload and analyze files",
    },
    {
      id: "bulk",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      label: "GitHub Integration",
      description: "Connect & scan repositories",
    },
    {
      id: "analytics",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
        </svg>
      ),
      label: "Analytics",
      description: "View insights & trends",
    },
    {
      id: "api-keys",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      ),
      label: "API Keys",
      description: "Manage API access",
    },
    {
      id: "collaborate",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      label: "Collaborate",
      description: "Real-time code editing",
    },
    {
      id: "integrations",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="7.5,4.21 12,6.81 16.5,4.21" />
          <polyline points="7.5,19.79 7.5,14.6 3,12" />
          <polyline points="21,12 16.5,14.6 16.5,19.79" />
          <polyline points="12,22.08 12,17" />
        </svg>
      ),
      label: "Integrations",
      description: "CI/CD & webhooks",
    },
    {
      id: "projects",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
      label: "Projects",
      description: "Organize your work",
    },
    {
      id: "history",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
      label: "Analysis History",
      description: "Previous analyses",
    },
    {
      id: "samples",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
      label: "Sample Files",
      description: "Test with examples",
    },
    {
      id: "status",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
        </svg>
      ),
      label: "System Status",
      description: "Health & monitoring",
    },
    {
      id: "account",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: "User Account",
      description: "Profile & billing",
    },
    {
      id: "docs",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      ),
      label: "Documentation",
      description: "Guides & API reference",
      isExternal: true,
      href: "/docs",
    },
    {
      id: "settings",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      label: "Settings",
      description: "Configure preferences",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${dashboardState.sidebarCollapsed ? "collapsed" : ""} ${userExpandedSidebar ? "user-expanded" : ""}`}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="sidebar-header">
          <div className="brand">
            <a
              href="/"
              className="brand-logo"
              aria-label="NeuroLint Pro Logo - Go to homepage"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbcdfdb608d38407b88c1584fe3705961%2F1b38a4a385ed4a0bb404148fae0ce80e?format=webp&width=800"
                alt="NeuroLint Pro"
                width="32"
                height="32"
              />
            </a>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => {
              const newCollapsed = !dashboardState.sidebarCollapsed;
              setDashboardState((prev) => ({
                ...prev,
                sidebarCollapsed: newCollapsed,
              }));
              setUserExpandedSidebar(!newCollapsed);
            }}
            aria-label={
              dashboardState.sidebarCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            aria-expanded={!dashboardState.sidebarCollapsed}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              {dashboardState.sidebarCollapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav" role="menu">
          {sidebarItems.map((item, index) => {
            if (item.isExternal) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="nav-item"
                  role="menuitem"
                  aria-label={`${item.label}: ${item.description}`}
                  tabIndex={0}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!dashboardState.sidebarCollapsed && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-item ${dashboardState.activeSection === item.id ? "active" : ""}`}
                onClick={() =>
                  setDashboardState((prev) => ({
                    ...prev,
                    activeSection: item.id,
                    // Auto-hide results when switching tabs
                    showResults:
                      item.id === "editor" || item.id === "samples"
                        ? prev.showResults
                        : false,
                  }))
                }
                role="menuitem"
                aria-current={
                  dashboardState.activeSection === item.id ? "page" : undefined
                }
                aria-label={`${item.label}: ${item.description}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDashboardState((prev) => ({
                      ...prev,
                      activeSection: item.id,
                      // Auto-hide results when switching tabs via keyboard
                      showResults:
                        item.id === "editor" || item.id === "samples"
                          ? prev.showResults
                          : false,
                    }));
                  }
                }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {!dashboardState.sidebarCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div
          className={`sidebar-footer ${dashboardState.sidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="user-section">
            <div className="user-avatar" aria-label="User profile">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {!dashboardState.sidebarCollapsed && (
              <div className="user-info">
                <span className="user-name">
                  {user?.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email}
                </span>
                <span className="user-plan">
                  {user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1) ||
                    "Free"}{" "}
                  Plan
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <Link
                    href="/profile"
                    className="text-xs text-gray-400 hover:text-white"
                    title="Profile settings"
                  >
                    Profile
                  </Link>
                  <span className="text-gray-600">•</span>
                  <button
                    onClick={signOut}
                    className="text-xs text-gray-400 hover:text-white"
                    title="Sign out"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-title-container">
          <h1>NeuroLint Pro Dashboard</h1>
        </div>

        <div className="dashboard-content">
          {/* Enhanced Analysis Configuration */}
          {(dashboardState.activeSection === "editor" ||
            dashboardState.activeSection === "samples") && (
            <div
              className="analysis-configuration"
              role="region"
              aria-labelledby="config-title"
            >
              <div className="config-header">
                <div className="config-title">
                  <h2 id="config-title">Analysis Configuration</h2>
                  <p>
                    Configure analysis mode, engine type, and layer selection
                  </p>
                </div>
                <div className="config-status">
                  <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>Configuration Ready</span>
                  </div>
                </div>
              </div>

              <div className="config-grid">
                <fieldset className="control-group">
                  <legend className="control-label">MODE</legend>
                  <div
                    className="control-options"
                    role="radiogroup"
                    aria-labelledby="mode-legend"
                  >
                    <button
                      className={`control-btn ${!dashboardState.applyFixes ? "active" : ""}`}
                      onClick={() =>
                        setDashboardState((prev) => ({
                          ...prev,
                          applyFixes: false,
                        }))
                      }
                      role="radio"
                      aria-checked={!dashboardState.applyFixes}
                      aria-describedby="dry-run-description"
                    >
                      Dry Run (Analysis Only)
                    </button>
                    <button
                      className={`control-btn ${dashboardState.applyFixes ? "active" : ""}`}
                      onClick={() =>
                        setDashboardState((prev) => ({
                          ...prev,
                          applyFixes: true,
                        }))
                      }
                      role="radio"
                      aria-checked={dashboardState.applyFixes}
                      aria-describedby="apply-fixes-description"
                    >
                      Apply Fixes
                    </button>
                  </div>
                  <div id="dry-run-description" className="sr-only">
                    Analyze code without making changes
                  </div>
                  <div id="apply-fixes-description" className="sr-only">
                    Analyze and modify your code files
                  </div>
                </fieldset>

                <fieldset className="control-group">
                  <legend className="control-label">ENGINE TYPE</legend>
                  <div
                    className="control-options"
                    role="radiogroup"
                    aria-labelledby="engine-legend"
                  >
                    <button
                      className={`control-btn ${!useEnhanced ? "active" : ""}`}
                      onClick={() => setUseEnhanced(false)}
                      role="radio"
                      aria-checked={!useEnhanced}
                      aria-describedby="standard-engine-description"
                    >
                      Standard Engine
                    </button>
                    <button
                      className={`control-btn ${useEnhanced ? "active" : ""}`}
                      onClick={() => setUseEnhanced(true)}
                      role="radio"
                      aria-checked={useEnhanced}
                      aria-describedby="enhanced-engine-description"
                    >
                      Enhanced AST Engine
                    </button>
                  </div>
                  <div id="standard-engine-description" className="sr-only">
                    Standard regex-based pattern matching engine
                  </div>
                  <div id="enhanced-engine-description" className="sr-only">
                    Advanced AST analysis with semantic understanding
                  </div>
                </fieldset>

                <fieldset className="control-group">
                  <legend className="control-label">LAYER SELECTION</legend>
                  <div
                    className="layer-controls"
                    role="group"
                    aria-labelledby="layer-presets"
                  >
                    <span id="layer-presets" className="sr-only">
                      Layer presets
                    </span>
                    <button
                      className={`control-btn ${dashboardState.selectedLayers.length === 0 ? "active" : ""}`}
                      onClick={() =>
                        setDashboardState((prev) => ({
                          ...prev,
                          selectedLayers: [],
                        }))
                      }
                      aria-pressed={dashboardState.selectedLayers.length === 0}
                      aria-describedby="auto-detect-description"
                    >
                      Auto-Detect
                    </button>
                    <button
                      className={`control-btn ${dashboardState.selectedLayers.length === 6 ? "active" : ""}`}
                      onClick={() =>
                        setDashboardState((prev) => ({
                          ...prev,
                          selectedLayers: [1, 2, 3, 4, 5, 6],
                        }))
                      }
                      aria-pressed={dashboardState.selectedLayers.length === 6}
                      aria-describedby="all-layers-description"
                    >
                      All Layers
                    </button>
                  </div>
                  <div id="auto-detect-description" className="sr-only">
                    Let NeuroLint Pro automatically select appropriate layers
                  </div>
                  <div id="all-layers-description" className="sr-only">
                    Run all 6 layers of analysis and fixes
                  </div>
                  <div
                    className="layer-checkboxes"
                    role="group"
                    aria-labelledby="individual-layers"
                  >
                    <span id="individual-layers" className="sr-only">
                      Individual layer selection
                    </span>
                    {[1, 2, 3, 4, 5, 6].map((layerId) => (
                      <label key={layerId} className="layer-checkbox">
                        <input
                          type="checkbox"
                          checked={dashboardState.selectedLayers.includes(
                            layerId,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDashboardState((prev) => ({
                                ...prev,
                                selectedLayers: [
                                  ...prev.selectedLayers,
                                  layerId,
                                ].sort(),
                              }));
                            } else {
                              setDashboardState((prev) => ({
                                ...prev,
                                selectedLayers: prev.selectedLayers.filter(
                                  (id) => id !== layerId,
                                ),
                              }));
                            }
                          }}
                          aria-describedby={`layer-${layerId}-description`}
                        />
                        <span className="layer-label">Layer {layerId}</span>
                        <span
                          id={`layer-${layerId}-description`}
                          className="sr-only"
                        >
                          {layerId === 1 && "Configuration fixes"}
                          {layerId === 2 && "Pattern detection and cleanup"}
                          {layerId === 3 && "Component improvements"}
                          {layerId === 4 && "Hydration safety"}
                          {layerId === 5 && "Next.js optimizations"}
                          {layerId === 6 && "Testing enhancements"}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* Demo Settings Status */}
          {(dashboardState.activeSection === "editor" ||
            dashboardState.activeSection === "samples") && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "rgba(33, 150, 243, 0.08)",
                border: "1px solid rgba(33, 150, 243, 0.2)",
                borderRadius: "8px",
                fontSize: "0.9rem",
                color: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 2px 8px rgba(33, 150, 243, 0.1)",
              }}
            >
              <strong>Current Settings:</strong>{" "}
              <span
                style={{
                  color: dashboardState.applyFixes ? "#ff9800" : "#4caf50",
                }}
              >
                {dashboardState.applyFixes
                  ? "Apply Fixes Mode"
                  : "Dry-Run Mode"}
              </span>
              {" �� "}
              <span style={{ color: "rgba(33, 150, 243, 0.9)" }}>
                {dashboardState.selectedLayers.length === 0
                  ? "Auto-Detect Layers"
                  : dashboardState.selectedLayers.length === 6
                    ? "All 6 Layers"
                    : `Custom Layers [${dashboardState.selectedLayers.join(",")}]`}
              </span>
              {" • "}
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {useEnhanced ? "Enhanced AST Engine" : "Standard Engine"}
              </span>
            </div>
          )}

          {/* Progress Indicator */}
          {dashboardState.isLoading && (
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${dashboardState.uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-status">{dashboardState.progressStatus}</p>
            </div>
          )}

          {/* GitHub Integration Tab */}
          {dashboardState.activeSection === "bulk" && (
            <div className="tab-content">
              <ErrorBoundary>
                <GitHubIntegrationFixed />
              </ErrorBoundary>
            </div>
          )}

          {/* Overview Tab */}
          {dashboardState.activeSection === "overview" && (
            <div className="tab-content">
              <ErrorBoundary>
                <Overview analysisHistory={dashboardState.analysisHistory} />
              </ErrorBoundary>
            </div>
          )}

          {/* Analytics Tab */}
          {dashboardState.activeSection === "analytics" && (
            <div className="tab-content">
              <ErrorBoundary>
                <AnalyticsDashboard
                  analysisHistory={dashboardState.analysisHistory}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* API Keys Tab */}
          {dashboardState.activeSection === "api-keys" && (
            <div className="tab-content">
              <ErrorBoundary>
                <ApiKeysManager userId={user.id} />
              </ErrorBoundary>
            </div>
          )}

          {/* Collaborate Tab */}
          {dashboardState.activeSection === "collaborate" && (
            <div className="tab-content">
              <CollaborationDashboard
                user={user}
                sessions={dashboardState.collaborationSessions}
                loadingSessions={dashboardState.loadingSessions}
                onRefreshSessions={async () => {
                  if (!user?.id) return;
                  setDashboardState((prev) => ({
                    ...prev,
                    loadingSessions: true,
                  }));
                  try {
                    const response = await fetch(
                      "/api/collaboration/sessions",
                      {
                        headers: {
                          "x-user-id": user.id,
                          "x-user-name":
                            user.firstName || user.email || "Anonymous",
                        },
                      },
                    );
                    if (response.ok) {
                      const data = await response.json();
                      setDashboardState((prev) => ({
                        ...prev,
                        collaborationSessions: data.sessions || [],
                        loadingSessions: false,
                      }));
                    } else {
                      setDashboardState((prev) => ({
                        ...prev,
                        loadingSessions: false,
                      }));
                    }
                  } catch (error) {
                    console.error(
                      "Failed to load collaboration sessions:",
                      error,
                    );
                    setDashboardState((prev) => ({
                      ...prev,
                      loadingSessions: false,
                    }));
                  }
                }}
                onUpdateSessions={(sessions) => {
                  setDashboardState((prev) => ({
                    ...prev,
                    collaborationSessions: sessions,
                  }));
                }}
              />
            </div>
          )}

          {/* Integrations Tab */}
          {dashboardState.activeSection === "integrations" && (
            <div className="tab-content">
              <div className="integrations-overview">
                <h3>Integrations & Automations</h3>
                <p className="tab-description">
                  Connect NeuroLint Pro with your development workflow.
                </p>

                <div className="integration-categories">
                  <div className="integration-category">
                    <div className="category-header">
                      <h4>CI/CD Pipelines</h4>
                      <span
                        className="category-status"
                        data-status="coming-soon"
                      >
                        Coming Soon
                      </span>
                    </div>
                    <p>
                      Automatically analyze code in your CI/CD pipeline with
                      GitHub Actions, GitLab CI, Jenkins, and more.
                    </p>
                    <div className="supported-platforms">
                      <span className="platform-badge">GitHub Actions</span>
                      <span className="platform-badge">GitLab CI</span>
                      <span className="platform-badge">Jenkins</span>
                      <span className="platform-badge">Azure DevOps</span>
                    </div>
                  </div>

                  <div className="integration-category">
                    <div className="category-header">
                      <h4>Webhooks</h4>
                      <span className="category-status" data-status="available">
                        Available
                      </span>
                    </div>
                    <p>
                      Receive real-time notifications when analyses complete or
                      issues are detected.
                    </p>
                    <div className="webhook-features">
                      <div className="feature-item">
                        Analysis completion notifications
                      </div>
                      <div className="feature-item">Error alerts</div>
                      <div className="feature-item">
                        Custom payload formatting
                      </div>
                      <div className="feature-item">Retry mechanisms</div>
                    </div>
                  </div>

                  <div className="integration-category">
                    <div className="category-header">
                      <h4>Team Notifications</h4>
                      <span className="category-status" data-status="available">
                        Available
                      </span>
                    </div>
                    <p>
                      Keep your team informed with Slack and Microsoft Teams
                      integrations.
                    </p>
                    <div className="notification-channels">
                      <div className="channel-item">
                        <span>Slack Channels</span>
                      </div>
                      <div className="channel-item">
                        <span>Email Notifications</span>
                      </div>
                      <div className="channel-item">
                        <span>Microsoft Teams</span>
                      </div>
                    </div>
                  </div>

                  <div className="integration-category">
                    <div className="category-header">
                      <h4>API Access</h4>
                      <span className="category-status" data-status="available">
                        Available
                      </span>
                    </div>
                    <p>
                      Programmatic access to NeuroLint Pro analysis engine with
                      comprehensive REST API.
                    </p>
                    <div className="api-features">
                      <div className="feature-item">API key authentication</div>
                      <div className="feature-item">Rate limiting</div>
                      <div className="feature-item">OpenAPI documentation</div>
                      <div className="feature-item">SDKs coming soon</div>
                    </div>
                    <div className="api-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          window.open("/api/docs?format=html", "_blank")
                        }
                      >
                        View API Docs
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          setDashboardState((prev) => ({
                            ...prev,
                            activeSection: "api-keys",
                          }))
                        }
                      >
                        Manage API Keys
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Code Analysis Tab */}
          {dashboardState.activeSection === "editor" && (
            <div className="tab-content">
              <ErrorBoundary>
                <CodeAnalysis
                  onAnalyzeCode={(code, filename) => {
                    setDashboardState((prev) => ({
                      ...prev,
                      currentFile: filename,
                    }));

                    const layers =
                      dashboardState.selectedLayers.length > 0
                        ? dashboardState.selectedLayers
                        : "auto";
                    analyzecode(
                      code,
                      filename,
                      layers,
                      dashboardState.applyFixes,
                    );
                  }}
                  onFileUpload={handleFileUpload}
                  isLoading={dashboardState.isLoading}
                  currentFile={dashboardState.currentFile}
                  fileInputRef={fileInputRef}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Projects Tab */}
          {dashboardState.activeSection === "projects" && (
            <div className="tab-content">
              <div className="projects-header">
                <h3>Your Projects</h3>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    const name = prompt("Project name:");
                    if (name) {
                      try {
                        if (user?.id) {
                          // Save to Supabase
                          console.log(
                            "Attempting to save project for user:",
                            user.id,
                          );
                          const savedProject = await dataService.saveProject(
                            user.id,
                            {
                              name,
                              description: "",
                              files: [],
                            },
                          );
                          console.log("SaveProject result:", savedProject);

                          if (savedProject) {
                            const newProject: Project = {
                              id: savedProject.id,
                              name: savedProject.name,
                              description: savedProject.description,
                              files: Array.isArray(savedProject.files)
                                ? savedProject.files
                                : [],
                              createdAt: new Date(savedProject.created_at),
                            };
                            setDashboardState((prev) => ({
                              ...prev,
                              projects: [...prev.projects, newProject],
                            }));
                          } else {
                            console.error(
                              "Failed to create project - savedProject is null",
                            );
                            alert(
                              "Failed to create project. Please check the console for details and try again.",
                            );
                          }
                        } else {
                          // Fallback to localStorage for non-authenticated users
                          const newProject: Project = {
                            id: Date.now().toString(),
                            name,
                            description: "",
                            files: [],
                            createdAt: new Date(),
                          };
                          setDashboardState((prev) => {
                            const projects = [...prev.projects, newProject];
                            localStorage.setItem(
                              "neurolint-projects",
                              JSON.stringify(projects),
                            );
                            return { ...prev, projects };
                          });
                        }
                      } catch (error) {
                        console.error("Error creating project:", error);
                        alert("Failed to create project. Please try again.");
                      }
                    }
                  }}
                >
                  New Project
                </button>
              </div>

              {dashboardState.projects.length === 0 ? (
                <div className="empty-state">
                  <p>
                    No projects yet. Create your first project to organize your
                    code analysis.
                  </p>
                </div>
              ) : (
                <div className="projects-grid">
                  {dashboardState.projects.map((project) => (
                    <div key={project.id} className="project-card">
                      <h4>{project.name}</h4>
                      <p className="project-meta">
                        Created {project.createdAt.toLocaleDateString()}
                      </p>
                      <p className="project-stats">
                        {project.files.length} files
                      </p>
                      <div className="project-actions">
                        <button className="btn btn-sm">Open</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={async () => {
                            if (confirm("Delete this project?")) {
                              try {
                                if (user?.id) {
                                  // Delete from Supabase
                                  const success =
                                    await dataService.deleteProject(
                                      user.id,
                                      project.id,
                                    );
                                  if (success) {
                                    setDashboardState((prev) => ({
                                      ...prev,
                                      projects: prev.projects.filter(
                                        (p) => p.id !== project.id,
                                      ),
                                    }));
                                  } else {
                                    alert(
                                      "Failed to delete project. Please try again.",
                                    );
                                  }
                                } else {
                                  // Fallback to localStorage for non-authenticated users
                                  setDashboardState((prev) => {
                                    const projects = prev.projects.filter(
                                      (p) => p.id !== project.id,
                                    );
                                    localStorage.setItem(
                                      "neurolint-projects",
                                      JSON.stringify(projects),
                                    );
                                    return { ...prev, projects };
                                  });
                                }
                              } catch (error) {
                                console.error("Error deleting project:", error);
                                alert(
                                  "Failed to delete project. Please try again.",
                                );
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analysis History Tab */}
          {dashboardState.activeSection === "history" && (
            <div className="tab-content">
              <div
                className="history-header"
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h3 style={{ margin: 0 }}>Analysis History</h3>
                <input
                  type="text"
                  className="history-search-input"
                  placeholder="Search filename..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    flex: "0 0 220px",
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (confirm("Clear all analysis history?")) {
                      try {
                        if (user?.id) {
                          // Clear from Supabase
                          const success =
                            await dataService.clearAnalysisHistory(user.id);
                          if (success) {
                            localStorage.removeItem("neurolint-history");
                            setDashboardState((prev) => ({
                              ...prev,
                              analysisHistory: [],
                            }));
                          } else {
                            alert("Failed to clear history. Please try again.");
                          }
                        } else {
                          // Fallback to localStorage for non-authenticated users
                          localStorage.removeItem("neurolint-history");
                          setDashboardState((prev) => ({
                            ...prev,
                            analysisHistory: [],
                          }));
                        }
                      } catch (error) {
                        console.error("Error clearing history:", error);
                        alert("Failed to clear history. Please try again.");
                      }
                    }
                  }}
                >
                  Clear History
                </button>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="empty-state">
                  <p>
                    No analysis history yet. Your completed analyses will appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="history-list">
                  {filteredHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-main">
                        <h4>{item.filename}</h4>
                        <div className="history-meta">
                          <span className="timestamp">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <span className="execution-time">
                            {formatProcessingTime(item.executionTime)}
                          </span>
                          <span
                            className={`status ${item.result.success ? "success" : "error"}`}
                          >
                            {item.result.success ? "Success" : "Failed"}
                          </span>
                        </div>
                      </div>
                      <div className="history-summary">
                        {item.result.analysis && (
                          <>
                            <span className="issues-count">
                              {item.result.analysis.detectedIssues?.length || 0}{" "}
                              issues
                            </span>
                            <span className="confidence">
                              {(
                                (item.result.analysis.confidence || 0) * 100
                              ).toFixed(0)}
                              % confidence
                            </span>
                            <span className="layers">
                              Layers:{" "}
                              {item.layers.length
                                ? item.layers.join(", ")
                                : "Auto"}
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setDashboardState((prev) => ({
                            ...prev,
                            result: item.result,
                            showResults: true,
                            currentFile: item.filename,
                          }));
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sample Files Tab */}
          {dashboardState.activeSection === "samples" && (
            <div className="tab-content">
              <h3>Sample Code Files</h3>
              <p className="tab-description">
                Test NeuroLint Pro with these curated examples showcasing
                different types of issues.
              </p>

              <div className="samples-grid">
                {Object.entries(sampleFiles).map(([key, sample]) => (
                  <div key={key} className="sample-card">
                    <div className="sample-header">
                      <h4>{sample.filename}</h4>
                      <span className="sample-type">
                        {key === "component-issues" && "React Components"}
                        {key === "ssr-hydration" && "SSR/Hydration"}
                        {key === "nextjs-patterns" && "Next.js Patterns"}
                      </span>
                    </div>
                    <p className="sample-description">
                      {key === "component-issues" &&
                        "Missing key props, type issues"}
                      {key === "ssr-hydration" && "localStorage and SSR safety"}
                      {key === "nextjs-patterns" &&
                        "Next.js specific optimizations"}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => loadSampleFile(key)}
                      disabled={dashboardState.isLoading}
                    >
                      {dashboardState.isLoading
                        ? "Analyzing..."
                        : "Analyze Sample"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Status Tab */}
          {dashboardState.activeSection === "status" && (
            <div className="tab-content">
              <ErrorBoundary>
                <SystemStatus />
              </ErrorBoundary>
            </div>
          )}

          {/* User Account Tab */}
          {dashboardState.activeSection === "account" && (
            <div className="tab-content">
              <h3>User Account</h3>

              <div className="account-sections">
                <div className="account-section">
                  <h4>Profile Information</h4>
                  <div className="profile-info">
                    <div className="profile-row">
                      <label>Name</label>
                      <div className="profile-value">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : "Not set"}
                      </div>
                    </div>
                    <div className="profile-row">
                      <label>Email</label>
                      <div className="profile-value">{user?.email}</div>
                    </div>
                    <div className="profile-row">
                      <label>Plan</label>
                      <div className="profile-value">
                        <span className="plan-badge">
                          {user?.plan?.charAt(0).toUpperCase() +
                            user?.plan?.slice(1) || "Free"}
                        </span>
                      </div>
                    </div>
                    <div className="profile-row">
                      <label>Member Since</label>
                      <div className="profile-value">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Recently"}
                      </div>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <Link href="/profile" className="btn btn-primary">
                      Edit Profile
                    </Link>
                  </div>
                </div>

                <div className="account-section">
                  <h4>Usage & Billing</h4>
                  {dashboardState.subscriptionData.loading ? (
                    <div
                      className="loading-state"
                      style={{ padding: "20px", textAlign: "center" }}
                    >
                      <div
                        className="loading-spinner"
                        style={{ width: "24px", height: "24px" }}
                      ></div>
                      <p style={{ fontSize: "14px", margin: "8px 0 0 0" }}>
                        Loading billing information...
                      </p>
                    </div>
                  ) : dashboardState.subscriptionData.error ? (
                    <div
                      className="error-state"
                      style={{ padding: "16px", fontSize: "14px" }}
                    >
                      <p>
                        Failed to load billing information:{" "}
                        {dashboardState.subscriptionData.error}
                      </p>
                      <button
                        className="btn btn-sm"
                        onClick={loadSubscriptionData}
                        style={{ marginTop: "8px" }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="usage-info">
                        <div className="usage-row">
                          <label>Current Plan</label>
                          <div className="usage-value">
                            <span className="plan-badge">
                              {dashboardState.subscriptionData.currentPlan.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {rateLimitInfo && (
                          <>
                            <div className="usage-row">
                              <label>Analyses Used</label>
                              <div className="usage-value">
                                {rateLimitInfo.used || 0} /{" "}
                                {rateLimitInfo.limit || "∞"}
                              </div>
                            </div>
                            <div className="usage-row">
                              <label>Remaining</label>
                              <div className="usage-value">
                                {rateLimitInfo.remaining} analyses
                              </div>
                            </div>
                            <div className="usage-row">
                              <label>Resets</label>
                              <div className="usage-value">
                                {new Date(
                                  rateLimitInfo.resetTime,
                                ).toLocaleString()}
                              </div>
                            </div>
                          </>
                        )}
                        {dashboardState.subscriptionData.subscriptions.length >
                          0 && (
                          <div className="usage-row">
                            <label>Active Subscriptions</label>
                            <div className="usage-value">
                              {
                                dashboardState.subscriptionData.subscriptions.filter(
                                  (s) => s.status === "active",
                                ).length
                              }
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="billing-actions">
                        <Link href="/pricing" className="btn btn-primary">
                          Upgrade Plan
                        </Link>
                        <button
                          className="btn btn-secondary"
                          onClick={async () => {
                            try {
                              if (
                                dashboardState.subscriptionData.subscriptions
                                  .length > 0
                              ) {
                                // Export billing history from state
                                const historyData = {
                                  subscriptions:
                                    dashboardState.subscriptionData
                                      .subscriptions,
                                  currentPlan:
                                    dashboardState.subscriptionData.currentPlan,
                                  exportedAt: new Date().toISOString(),
                                };

                                const blob = new Blob(
                                  [JSON.stringify(historyData, null, 2)],
                                  {
                                    type: "application/json",
                                  },
                                );
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `billing-history-${new Date().toISOString().split("T")[0]}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              } else {
                                alert(
                                  "No billing history found. You're on the free plan.",
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Failed to export billing history:",
                                error,
                              );
                              alert(
                                "Failed to export billing history. Please try again.",
                              );
                            }
                          }}
                        >
                          Export Billing History
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="account-section">
                  <h4>Account Actions</h4>
                  <div className="account-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={async () => {
                        try {
                          const response = await fetch("/api/exports", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              ...(session?.access_token && {
                                Authorization: `Bearer ${session.access_token}`,
                              }),
                            },
                            body: JSON.stringify({ exportType: "complete" }),
                          });

                          if (!response.ok) {
                            let errorMessage = "Export failed";
                            try {
                              // Clone response to avoid "body stream already read" error
                              const responseClone = response.clone();
                              const errorResult = await responseClone.json();
                              errorMessage = errorResult.error || errorMessage;
                            } catch (jsonError) {
                              errorMessage =
                                response.statusText || errorMessage;
                            }
                            throw new Error(errorMessage);
                          }

                          const result = await response.json();

                          if (result.success) {
                            const blob = new Blob(
                              [JSON.stringify(result.data, null, 2)],
                              {
                                type: "application/json",
                              },
                            );
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = result.filename;
                            a.click();
                            URL.revokeObjectURL(url);
                            alert("Account data exported successfully!");
                          } else {
                            throw new Error(result.error || "Export failed");
                          }
                        } catch (error) {
                          console.error("Export failed:", error);
                          alert(
                            "Failed to export account data. Please try again.",
                          );
                        }
                      }}
                    >
                      Export Account Data
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        if (confirm("Are you sure you want to sign out?")) {
                          signOut();
                        }
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {dashboardState.activeSection === "settings" && (
            <div className="tab-content">
              <h3>Settings</h3>

              <div className="settings-sections">
                <div className="settings-section">
                  <h4>Analysis Defaults</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={dashboardState.settings.autoSave}
                        onChange={(e) => {
                          const newSettings = {
                            ...dashboardState.settings,
                            autoSave: e.target.checked,
                          };
                          localStorage.setItem(
                            "neurolint-settings",
                            JSON.stringify(newSettings),
                          );
                          setDashboardState((prev) => ({
                            ...prev,
                            settings: newSettings,
                          }));
                        }}
                      />
                      Auto-save analysis results to history
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={dashboardState.settings.notifications}
                        onChange={(e) => {
                          const newSettings = {
                            ...dashboardState.settings,
                            notifications: e.target.checked,
                          };
                          localStorage.setItem(
                            "neurolint-settings",
                            JSON.stringify(newSettings),
                          );
                          setDashboardState((prev) => ({
                            ...prev,
                            settings: newSettings,
                          }));
                        }}
                      />
                      Show notifications for completed analyses
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>API Configuration</h4>
                  <div className="setting-item">
                    <label>API Endpoint</label>
                    <input
                      type="text"
                      className="form-input"
                      value="/api/demo"
                      disabled
                      placeholder="Default API endpoint"
                    />
                  </div>
                  <div className="setting-item">
                    <label>Request Timeout</label>
                    <input
                      type="number"
                      className="form-input"
                      defaultValue={30000}
                      placeholder="Timeout in milliseconds"
                    />
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Data Management</h4>
                  <div className="setting-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const data = {
                          history: dashboardState.analysisHistory,
                          projects: dashboardState.projects,
                          settings: dashboardState.settings,
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], {
                          type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "neurolint-data.json";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Export Data
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (
                          confirm(
                            "This will clear all your data. Are you sure?",
                          )
                        ) {
                          localStorage.removeItem("neurolint-history");
                          localStorage.removeItem("neurolint-projects");
                          localStorage.removeItem("neurolint-settings");

                          setDashboardState((prev) => ({
                            ...prev,
                            analysisHistory: [],
                            projects: [],
                            settings: {
                              defaultLayers: [],
                              autoSave: true,
                              notifications: true,
                              theme: "dark",
                            },
                          }));
                        }
                      }}
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clear Results Button */}
          {dashboardState.showResults && (
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <button
                className="control-btn"
                onClick={() =>
                  setDashboardState((prev) => ({
                    ...prev,
                    showResults: false,
                    result: null,
                    currentFile: null,
                    isLoading: false,
                    progressStatus: "",
                    uploadProgress: 0,
                  }))
                }
                aria-label="Clear analysis results and start over"
              >
                Clear Results
              </button>
            </div>
          )}

          {/* Results Section */}
          {dashboardState.showResults && (
            <div className="results-section">
              {dashboardState.isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Analyzing code with NeuroLint Pro...</p>
                </div>
              ) : dashboardState.result?.error ? (
                <div className="error-state">
                  <h3>Analysis Failed</h3>
                  <p>{dashboardState.result.error}</p>
                </div>
              ) : (
                dashboardState.result && (
                  <div className="analysis-results">
                    {/* Premium Business Insights */}
                    {dashboardState.result.analysis && (
                      <div className="business-insights">
                        <h3>Technical Impact Analysis</h3>
                        <div className="insights-grid">
                          <div className="insight-card">
                            <div className="insight-label">
                              Potential Savings
                            </div>
                            <div className="insight-value">
                              ~
                              {Math.round(
                                dashboardState.result.analysis.detectedIssues
                                  .length * 2.5,
                              )}{" "}
                              hours dev time
                            </div>
                          </div>
                          <div className="insight-card">
                            <div className="insight-label">
                              Performance Gain
                            </div>
                            <div className="insight-value">
                              {dashboardState.result.analysis.estimatedImpact
                                .level === "high"
                                ? "15-25%"
                                : "5-15%"}{" "}
                              faster
                            </div>
                          </div>
                          <div className="insight-card">
                            <div className="insight-label">Risk Reduction</div>
                            <div className="insight-value">
                              {
                                dashboardState.result.analysis.detectedIssues.filter(
                                  (i) =>
                                    i.severity === "high" ||
                                    i.severity === "critical",
                                ).length
                              }{" "}
                              critical issues
                            </div>
                          </div>
                          <div className="insight-card">
                            <div className="insight-label">
                              Standards Compliance
                            </div>
                            <div className="insight-value">
                              {Math.round(
                                dashboardState.result.analysis.confidence * 100,
                              )}
                              % best practices
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Analysis Overview */}
                    {dashboardState.result.analysis && (
                      <div className="analysis-overview">
                        <h3>Analysis Overview</h3>
                        <div className="overview-stats">
                          <div className="stat">
                            <span className="stat-value">
                              {
                                dashboardState.result.analysis.detectedIssues
                                  .length
                              }
                            </span>
                            <span className="stat-label">Issues Found</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">
                              {dashboardState.result.analysis.confidence}%
                            </span>
                            <span className="stat-label">Analysis Score</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">
                              {
                                dashboardState.result.analysis.estimatedImpact
                                  .level
                              }
                            </span>
                            <span className="stat-label">Impact Level</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">
                              {formatProcessingTime(
                                dashboardState.result.metadata
                                  ?.processingTimeMs || 0,
                              )}
                            </span>
                            <span className="stat-label">Processing Time</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Before/After Code Comparison */}
                    {dashboardState.result.originalCode &&
                      dashboardState.result.transformed && (
                        <div className="code-comparison">
                          <h3>
                            {dashboardState.result.dryRun
                              ? "Code Preview (Dry Run)"
                              : "Applied Changes"}
                          </h3>

                          {dashboardState.result.originalCode ===
                          dashboardState.result.transformed ? (
                            <div className="no-changes">
                              <p>
                                No changes needed - your code is already
                                optimized!
                              </p>
                            </div>
                          ) : (
                            <div className="comparison-grid">
                              <div className="code-panel">
                                <div className="code-panel-header">
                                  <h4>Original Code</h4>
                                  <div className="code-actions">
                                    <button
                                      className="code-action-btn"
                                      onClick={() =>
                                        copyToClipboard(
                                          dashboardState.result?.originalCode ||
                                            "",
                                          "Original",
                                        )
                                      }
                                      title="Copy original code"
                                      aria-label="Copy original code to clipboard"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <rect
                                          x="9"
                                          y="9"
                                          width="13"
                                          height="13"
                                          rx="2"
                                          ry="2"
                                        ></rect>
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                      </svg>
                                    </button>
                                    <button
                                      className="code-action-btn"
                                      onClick={() =>
                                        downloadCode(
                                          dashboardState.result?.originalCode ||
                                            "",
                                          `${dashboardState.currentFile || "original-code"}.backup.tsx`,
                                        )
                                      }
                                      title="Download original code"
                                      aria-label="Download original code as file"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                        <polyline points="7,10 12,15 17,10"></polyline>
                                        <line
                                          x1="12"
                                          y1="15"
                                          x2="12"
                                          y2="3"
                                        ></line>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <pre className="code-block">
                                  <code>
                                    {dashboardState.result.originalCode}
                                  </code>
                                </pre>
                              </div>
                              <div className="code-panel">
                                <div className="code-panel-header">
                                  <h4>
                                    {dashboardState.result.dryRun
                                      ? "Preview Changes"
                                      : "Fixed Code"}
                                  </h4>
                                  <div className="code-actions">
                                    <button
                                      className="code-action-btn"
                                      onClick={() =>
                                        copyToClipboard(
                                          dashboardState.result?.transformed ||
                                            "",
                                          "Fixed",
                                        )
                                      }
                                      title="Copy fixed code"
                                      aria-label="Copy fixed code to clipboard"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <rect
                                          x="9"
                                          y="9"
                                          width="13"
                                          height="13"
                                          rx="2"
                                          ry="2"
                                        ></rect>
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                      </svg>
                                    </button>
                                    <button
                                      className="code-action-btn"
                                      onClick={() =>
                                        downloadCode(
                                          dashboardState.result?.transformed ||
                                            "",
                                          `${dashboardState.currentFile || "fixed-code"}.tsx`,
                                        )
                                      }
                                      title="Download fixed code"
                                      aria-label="Download fixed code as file"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                        <polyline points="7,10 12,15 17,10"></polyline>
                                        <line
                                          x1="12"
                                          y1="15"
                                          x2="12"
                                          y2="3"
                                        ></line>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <pre className="code-block">
                                  <code>
                                    {dashboardState.result.transformed}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Issues Details */}
                    {dashboardState.result.analysis?.detectedIssues &&
                      dashboardState.result.analysis.detectedIssues.length >
                        0 && (
                        <div className="issues-section">
                          <h3>Detected Issues</h3>
                          <div className="issues-list">
                            {dashboardState.result.analysis.detectedIssues.map(
                              (issue, index) => (
                                <div
                                  key={index}
                                  className={`issue-item severity-${issue.severity.toLowerCase()}`}
                                >
                                  <div className="issue-header">
                                    <span className="issue-type">
                                      {issue.type}
                                    </span>
                                    <span className="issue-severity">
                                      {issue.severity}
                                    </span>
                                  </div>
                                  <p className="issue-description">
                                    {issue.description}
                                  </p>
                                  <div className="issue-meta">
                                    <span>
                                      Fixed by Layer {issue.fixedByLayer}
                                    </span>
                                    {issue.count && (
                                      <span>{issue.count} occurrences</span>
                                    )}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Layer Execution Details */}
                    {dashboardState.result.layers && (
                      <div className="layers-section">
                        <h3>Layer Execution</h3>
                        <div className="layers-list">
                          {dashboardState.result.layers.map((layer) => (
                            <div
                              key={layer.layerId}
                              className={`layer-item ${layer.success ? "success" : "failed"}`}
                            >
                              <div className="layer-header">
                                <span className="layer-id">
                                  Layer {layer.layerId}
                                </span>
                                <span className="layer-time">
                                  {formatProcessingTime(layer.executionTime)}
                                </span>
                                <span
                                  className={`layer-status ${layer.success ? "success" : "failed"}`}
                                >
                                  {layer.success ? "Success" : "Failed"}
                                </span>
                              </div>
                              {layer.improvements && (
                                <ul className="layer-improvements">
                                  {layer.improvements.map(
                                    (improvement, idx) => (
                                      <li key={idx}>{improvement}</li>
                                    ),
                                  )}
                                </ul>
                              )}
                              {layer.revertReason && (
                                <p className="layer-revert">
                                  Reverted: {layer.revertReason}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
