"use client";

import React, { useState, useEffect, useCallback } from "react";
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

interface DashboardState {
  isLoading: boolean;
  currentFile: string | null;
  result: DemoResult | null;
  showResults: boolean;
  selectedLayers: number[];
  applyFixes: boolean;
  sidebarCollapsed: boolean;
  activeSection: string;
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
  });

  const analyzecode = useCallback(
    async (
      code: string,
      filename: string,
      layers: number[] | "auto" | "all",
      applyFixes: boolean,
    ) => {
      setDashboardState((prev) => ({ ...prev, isLoading: true, result: null }));

      try {
        const response = await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, filename, layers, applyFixes }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Analysis failed");
        }

        const normalizedResult = {
          ...result,
          success: result?.dryRun ? true : result?.success,
        };

        setDashboardState((prev) => ({
          ...prev,
          result: normalizedResult,
          showResults: true,
          isLoading: false,
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
        }));
      }
    },
    [],
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

  const sidebarItems = [
    {
      id: "editor",
      icon: "ED",
      label: "Code Editor",
      description: "Upload and analyze code",
    },
    {
      id: "samples",
      icon: "SA",
      label: "Sample Files",
      description: "Test with example files",
    },
    {
      id: "history",
      icon: "HI",
      label: "History",
      description: "Previous analyses",
    },
    {
      id: "settings",
      icon: "SE",
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
              <span className="file-icon">📄</span>
              <span className="file-name">{dashboardState.currentFile}</span>
            </div>
          )}
        </header>

        <div className="dashboard-content">
          {/* Controls Section */}
          <div className="controls-section">
            <div className="control-group">
              <h3>Analysis Mode</h3>
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${!dashboardState.applyFixes ? "active" : ""}`}
                  onClick={() =>
                    setDashboardState((prev) => ({
                      ...prev,
                      applyFixes: false,
                    }))
                  }
                >
                  Dry Run (Preview)
                </button>
                <button
                  className={`mode-btn ${dashboardState.applyFixes ? "active" : ""}`}
                  onClick={() =>
                    setDashboardState((prev) => ({ ...prev, applyFixes: true }))
                  }
                >
                  Apply Fixes
                </button>
              </div>
            </div>

            <div className="control-group">
              <h3>Layers Selection</h3>
              <div className="layers-grid">
                {[1, 2, 3, 4, 5, 6].map((layerId) => (
                  <button
                    key={layerId}
                    className={`layer-btn ${dashboardState.selectedLayers.includes(layerId) ? "selected" : ""}`}
                    onClick={() => toggleLayerSelection(layerId)}
                  >
                    Layer {layerId}
                  </button>
                ))}
              </div>
              <p className="layers-hint">
                {dashboardState.selectedLayers.length === 0
                  ? "Auto-select layers"
                  : `Selected: ${dashboardState.selectedLayers.join(", ")}`}
              </p>
            </div>
          </div>

          {/* Action Section */}
          {dashboardState.activeSection === "editor" && (
            <div className="action-section">
              <div className="upload-area">
                <h3>Upload Code File</h3>
                <label className="upload-btn">
                  <input
                    type="file"
                    accept=".ts,.tsx,.js,.jsx"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  Choose File
                </label>
                <p className="upload-hint">
                  Supports .ts, .tsx, .js, .jsx files
                </p>
              </div>
            </div>
          )}

          {dashboardState.activeSection === "samples" && (
            <div className="action-section">
              <h3>Sample Files</h3>
              <div className="samples-grid">
                {Object.entries(sampleFiles).map(([key, sample]) => (
                  <button
                    key={key}
                    className="sample-btn"
                    onClick={() => loadSampleFile(key)}
                  >
                    <span className="sample-name">{sample.filename}</span>
                    <span className="sample-description">
                      {key === "component-issues" &&
                        "React component with common issues"}
                      {key === "ssr-hydration" && "SSR/hydration problems"}
                      {key === "nextjs-patterns" && "Next.js specific patterns"}
                    </span>
                  </button>
                ))}
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
