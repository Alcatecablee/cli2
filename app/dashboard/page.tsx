"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import "./dashboard.css";

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
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    isLoading: false,
    currentFile: null,
    result: null,
    showResults: false,
    selectedLayers: [],
    applyFixes: false,
    sidebarCollapsed: false,
    activeSection: "editor",
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
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null);

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

        const response = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            filename,
            layers,
            applyFixes,
            sessionId,
          }),
        });

        setDashboardState((prev) => ({
          ...prev,
          progressStatus: "Processing response...",
          uploadProgress: 75,
        }));

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Analysis failed");
        }

        const normalizedResult = {
          ...result,
          success: result?.dryRun ? true : result?.success,
        };

        const executionTime = Date.now() - startTime;

        // Update session info if provided
        if (result.sessionInfo) {
          setSessionId(result.sessionInfo.sessionId);
          setRateLimitInfo(result.sessionInfo.rateLimitInfo);
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
      }
    },
    [dashboardState.settings.autoSave, saveToHistory],
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
      } catch (error) {
        console.error("[DASHBOARD] File upload failed:", error);
        alert("Failed to read the file. Please try again.");
      }
    },
    [analyzecode, dashboardState.selectedLayers, dashboardState.applyFixes],
  );

  const toggleLayerSelection = useCallback((layerId: number) => {
    setDashboardState((prev) => ({
      ...prev,
      selectedLayers: prev.selectedLayers.includes(layerId)
        ? prev.selectedLayers.filter((id) => id !== layerId)
        : [...prev.selectedLayers, layerId].sort(),
    }));
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("neurolint-history");
    const savedProjects = localStorage.getItem("neurolint-projects");
    const savedSettings = localStorage.getItem("neurolint-settings");

    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setDashboardState((prev) => ({ ...prev, analysisHistory: history }));
      } catch (e) {
        console.error("Failed to load analysis history:", e);
      }
    }

    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        setDashboardState((prev) => ({ ...prev, projects: projects }));
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
  }, []);

  // Save analysis to history
  const saveToHistory = useCallback(
    (
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

      setDashboardState((prev) => {
        const newHistory = [historyItem, ...prev.analysisHistory].slice(0, 50); // Keep last 50
        localStorage.setItem("neurolint-history", JSON.stringify(newHistory));
        return { ...prev, analysisHistory: newHistory };
      });
    },
    [],
  );

  const sidebarItems = [
    {
      id: "editor",
      icon: "<>",
      label: "Code Analysis",
      description: "Upload and analyze files",
    },
    {
      id: "projects",
      icon: "[]",
      label: "Projects",
      description: "Organize your work",
    },
    {
      id: "history",
      icon: "#",
      label: "Analysis History",
      description: "Previous analyses",
    },
    {
      id: "samples",
      icon: "{ }",
      label: "Sample Files",
      description: "Test with examples",
    },
    {
      id: "settings",
      icon: "*",
      label: "Settings",
      description: "Configure preferences",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${dashboardState.sidebarCollapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">NL</div>
            {!dashboardState.sidebarCollapsed && (
              <div className="brand-text">
                <span className="brand-name">NeuroLint</span>
                <span className="brand-subtitle">Pro</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() =>
              setDashboardState((prev) => ({
                ...prev,
                sidebarCollapsed: !prev.sidebarCollapsed,
              }))
            }
          >
            {dashboardState.sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${dashboardState.activeSection === item.id ? "active" : ""}`}
              onClick={() =>
                setDashboardState((prev) => ({
                  ...prev,
                  activeSection: item.id,
                }))
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {!dashboardState.sidebarCollapsed && (
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {!dashboardState.sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-section">
              <div className="user-avatar">U</div>
              <div className="user-info">
                <span className="user-name">Free User</span>
                <span className="user-plan">Unlimited Access</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>NeuroLint Pro Dashboard</h1>
            <p>Professional code analysis and automated fixing</p>
          </div>

          {dashboardState.currentFile && (
            <div className="current-file">
              <span className="file-icon">FILE</span>
              <span className="file-name">{dashboardState.currentFile}</span>
            </div>
          )}
        </header>

        <div className="dashboard-content">
          {/* Global Controls - Always Visible */}
          {(dashboardState.activeSection === "editor" ||
            dashboardState.activeSection === "samples") && (
            <div className="controls-section">
              <div className="control-group">
                <h3>Analysis Configuration</h3>
                <div className="controls-row">
                  <div className="mode-toggle">
                    <label className="toggle-label">Mode:</label>
                    <button
                      className={`mode-btn ${!dashboardState.applyFixes ? "active" : ""}`}
                      onClick={() =>
                        setDashboardState((prev) => ({
                          ...prev,
                          applyFixes: false,
                        }))
                      }
                    >
                      Analysis Only
                    </button>
                    <button
                      className={`mode-btn ${dashboardState.applyFixes ? "active" : ""}`}
                      onClick={() =>
                        setDashboardState((prev) => ({
                          ...prev,
                          applyFixes: true,
                        }))
                      }
                    >
                      Apply Fixes
                    </button>
                  </div>

                  <div className="layers-control">
                    <label className="toggle-label">Layers:</label>
                    <div className="layers-grid">
                      {[1, 2, 3, 4, 5, 6].map((layerId) => (
                        <button
                          key={layerId}
                          className={`layer-btn ${dashboardState.selectedLayers.includes(layerId) ? "selected" : ""}`}
                          onClick={() => toggleLayerSelection(layerId)}
                          title={`Layer ${layerId}: ${
                            layerId === 1
                              ? "Configuration"
                              : layerId === 2
                                ? "Patterns"
                                : layerId === 3
                                  ? "Components"
                                  : layerId === 4
                                    ? "Hydration"
                                    : layerId === 5
                                      ? "Next.js"
                                      : "Testing"
                          }`}
                        >
                          {layerId}
                        </button>
                      ))}
                    </div>
                    <span className="layers-hint">
                      {dashboardState.selectedLayers.length === 0
                        ? "Auto-detect"
                        : dashboardState.selectedLayers.length === 6
                          ? "All layers"
                          : `${dashboardState.selectedLayers.length} selected`}
                    </span>
                  </div>
                </div>
              </div>
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

          {/* Code Analysis Tab */}
          {dashboardState.activeSection === "editor" && (
            <div className="tab-content">
              <div className="upload-section">
                <div
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-icon">+</div>
                  <h3>Upload Code Files</h3>
                  <p>Drag and drop files here or click to browse</p>
                  <p className="file-types">
                    Supports .ts, .tsx, .js, .jsx files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ts,.tsx,.js,.jsx"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    multiple
                  />
                </div>

                {dashboardState.currentFile && (
                  <div className="current-file-info">
                    <h4>Current File</h4>
                    <div className="file-card">
                      <span className="file-name">
                        {dashboardState.currentFile}
                      </span>
                      <span className="file-status">Ready for analysis</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {dashboardState.activeSection === "projects" && (
            <div className="tab-content">
              <div className="projects-header">
                <h3>Your Projects</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const name = prompt("Project name:");
                    if (name) {
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
                          onClick={() => {
                            if (confirm("Delete this project?")) {
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
              <div className="history-header">
                <h3>Analysis History</h3>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (confirm("Clear all analysis history?")) {
                      localStorage.removeItem("neurolint-history");
                      setDashboardState((prev) => ({
                        ...prev,
                        analysisHistory: [],
                      }));
                    }
                  }}
                >
                  Clear History
                </button>
              </div>

              {dashboardState.analysisHistory.length === 0 ? (
                <div className="empty-state">
                  <p>
                    No analysis history yet. Your completed analyses will appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="history-list">
                  {dashboardState.analysisHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-main">
                        <h4>{item.filename}</h4>
                        <div className="history-meta">
                          <span className="timestamp">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <span className="execution-time">
                            {item.executionTime}ms
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
                            <span className="stat-label">Confidence</span>
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
                              {dashboardState.result.metadata?.processingTimeMs}
                              ms
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
                                <h4>Original Code</h4>
                                <pre className="code-block">
                                  <code>
                                    {dashboardState.result.originalCode}
                                  </code>
                                </pre>
                              </div>
                              <div className="code-panel">
                                <h4>
                                  {dashboardState.result.dryRun
                                    ? "Preview Changes"
                                    : "Fixed Code"}
                                </h4>
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
                                  {layer.executionTime}ms
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
