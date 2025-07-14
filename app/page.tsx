"use client";

import React, { useState, useEffect } from "react";

// Demo state interface for sophisticated analysis results
interface DemoResult {
  success: boolean;
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
  }>;
  error?: string;
}

interface DemoState {
  isLoading: boolean;
  currentSample: string | null;
  result: DemoResult | null;
  showResults: boolean;
  selectedLayers: number[];
  applyFixes: boolean;
}

export default function HomePage() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const texts = [
    "Fix React Errors Instantly",
    "Eliminate HTML Entities",
    "Add Missing Key Props",
    "Secure SSR Hydration",
    "Professional Code Quality",
  ];

  // Sophisticated demo state management
  const [demoState, setDemoState] = useState<DemoState>({
    isLoading: false,
    currentSample: null,
    result: null,
    showResults: false,
    selectedLayers: [],
    applyFixes: false,
  });

  // Sophisticated sample code examples that showcase different layer capabilities
  const sampleCodes = {
    "missing-keys": {
      name: "Missing Keys & HTML Entities",
      description: "Showcases Layer 2 (Patterns) and Layer 3 (Components)",
      code: `const items = [
  { id: 1, name: &quot;React Component&quot; },
  { id: 2, name: &quot;Next.js App&quot; },
  { id: 3, name: &quot;TypeScript Fix&quot; }
];

function ItemList() {
  return (
    <ul>
      {items.map(item =>
        <li>{item.name}</li>
      )}
    </ul>
  );
}

export default ItemList;`,
      expectedLayers: [1, 2, 3],
      expectedIssues: ["HTML entities", "Missing key props"],
    },
    "html-entities": {
      name: "HTML Entity Corruption",
      description:
        "Showcases Layer 2 (Entity Cleanup) sophisticated pattern detection",
      code: `const message = &quot;Welcome to NeuroLint Pro&quot;;
const description = &quot;Detects &amp; fixes 50+ issues&quot;;
const note = &quot;Smart confidence scoring &amp; impact estimation&quot;;

console.log(&quot;Processing HTML entities...&quot;);

function Display() {
  return (
    <div>
      <h1>{message}</h1>
      <p>{description}</p>
      <small>{note}</small>
    </div>
  );
}`,
      expectedLayers: [1, 2],
      expectedIssues: [
        "HTML quote entities",
        "HTML ampersand entities",
        "Console.log usage",
      ],
    },
    "ssr-issues": {
      name: "SSR Hydration Issues",
      description: "Showcases Layer 4 (Hydration) SSR safety guards",
      code: `import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

export default ThemeToggle;`,
      expectedLayers: [1, 4],
      expectedIssues: [
        "Unguarded localStorage usage",
        "Document access without SSR guards",
      ],
    },
    accessibility: {
      name: "Accessibility & Testing Issues",
      description:
        "Showcases Layer 3 (Components) and Layer 6 (Testing) comprehensive validation",
      code: `import { useState } from 'react';

function ImageGallery({ images }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => document.getElementById('fileInput').click()}>
        Upload Image
      </button>
      <input type="file" id="fileInput" onChange={(e) => handleUpload(e.target.files[0])} />
      <div>
        {images.map(image =>
          <img src={image.url} />
        )}
      </div>
    </div>
  );
}`,
      expectedLayers: [1, 3, 6],
      expectedIssues: [
        "Missing key props",
        "Missing alt attributes",
        "Missing error handling",
        "Missing prop types",
      ],
    },
  };

  useEffect(() => {
    const typewriterEffect = () => {
      const currentFullText = texts[currentIndex];
      if (currentText.length < currentFullText.length) {
        setCurrentText(currentFullText.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => {
          setCurrentText("");
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
      }
    };

    const timer = setTimeout(typewriterEffect, 100);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, texts]);

  const openPaymentModal = (plan: string) => {
    alert(`Opening payment modal for ${plan} plan`);
  };

  // Sophisticated sample code loading with real engine integration
  const loadSampleCode = async (sampleKey: string) => {
    const sample = sampleCodes[sampleKey as keyof typeof sampleCodes];
    if (!sample) return;

    setDemoState((prev) => ({
      ...prev,
      isLoading: true,
      currentSample: sampleKey,
      showResults: false,
      result: null,
    }));

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: sample.code,
          filename: `${sample.name.toLowerCase().replace(/\s+/g, "-")}.tsx`,
          layers: "auto", // Let engine auto-detect
          applyFixes: false, // Dry-run mode for demo
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      setDemoState((prev) => ({
        ...prev,
        isLoading: false,
        result,
        showResults: true,
      }));
    } catch (error) {
      console.error("Demo analysis failed:", error);
      setDemoState((prev) => ({
        ...prev,
        isLoading: false,
        result: {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      }));
    }
  };

  // Sophisticated file upload with real engine integration
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.name.match(/\.(ts|tsx|js|jsx)$/)) {
      alert(
        "Please upload a TypeScript or JavaScript React file (.ts, .tsx, .js, .jsx)",
      );
      return;
    }

    setDemoState((prev) => ({
      ...prev,
      isLoading: true,
      currentSample: "uploaded-file",
      showResults: false,
      result: null,
    }));

    try {
      const code = await file.text();

      const response = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          filename: file.name,
          layers:
            demoState.selectedLayers.length > 0
              ? demoState.selectedLayers
              : "auto",
          applyFixes: demoState.applyFixes,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      setDemoState((prev) => ({
        ...prev,
        isLoading: false,
        result,
        showResults: true,
      }));
    } catch (error) {
      console.error("File upload analysis failed:", error);
      setDemoState((prev) => ({
        ...prev,
        isLoading: false,
        result: {
          success: false,
          error:
            error instanceof Error ? error.message : "File processing failed",
        },
      }));
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            NeuroLint Pro
          </a>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Pricing</a>
            <button
              className="btn"
              onClick={() => openPaymentModal("single")}
              aria-label="Purchase single fix for $49"
            >
              Fix Code Now
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-subtitle">Automated Code Fixing Service</div>
          <h1 className="typewriter" aria-live="polite">
            {currentText}
          </h1>
          <p className="hero-desc">
            Automated multi-layer code fixing for React and Next.js. Resolves
            common issues—HTML entities, missing keys, SSR safety—using a
            validated 6-layer pipeline with automatic rollback.
          </p>
          <div className="hero-actions">
            <button
              className="btn"
              onClick={() => openPaymentModal("single")}
              aria-label="Purchase single fix for $49"
            >
              Fix Code Now - $49
            </button>
            <a href="#demo" className="btn" aria-label="Try free demo">
              Try Free Demo
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2 className="section-title">Why NeuroLint Pro?</h2>
          <p className="section-subtitle">
            Built on battle-tested patterns from IMPLEMENTATION_PATTERNS.md -
            Never corrupts your code
          </p>

          <div className="feature-card">
            <div className="feature-title">Safe Transformations</div>
            <div className="feature-desc">
              Automatic rollback on validation failure. Your code is never
              corrupted - guaranteed.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Smart Detection</div>
            <div className="feature-desc">
              Detects 50+ types of issues across 6 layers with smart confidence
              scoring and impact estimation. Advanced pattern recognition for
              comprehensive code analysis.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">6-Layer System</div>
            <div className="feature-desc">
              Config → Patterns → Components → Hydration → Next.js → Testing.
              Each layer builds on the previous safely.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Error Recovery</div>
            <div className="feature-desc">
              Comprehensive error categorization and recovery suggestions.
              Built-in fallback transformations when layer scripts unavailable
              ensure continuous operation.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Detailed Reports</div>
            <div className="feature-desc">
              Get comprehensive analysis of issues found, fixes applied, and
              improvement recommendations.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Enterprise Ready</div>
            <div className="feature-desc">
              Processes codebases up to 10,000+ files. Used by React teams at
              scale.
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="demo-section">
          <div className="demo-container">
            <h2 className="section-title">Try NeuroLint Pro Live</h2>
            <p className="section-subtitle">
              Upload your React/Next.js files and see real fixes applied using
              our 6-layer system. Dry-run mode perfect for demos returns
              analysis without changes, letting you explore safely.
            </p>

            {/* Advanced Demo Controls */}
            <div className="demo-controls">
              <h3>Analysis Configuration</h3>
              <div className="controls-grid">
                <div className="control-group">
                  <label className="control-label">Mode</label>
                  <div className="control-options">
                    <button
                      className={`control-btn ${!demoState.applyFixes ? "active" : ""}`}
                      onClick={() =>
                        setDemoState((prev) => ({ ...prev, applyFixes: false }))
                      }
                    >
                      🔍 Dry-Run (Analysis Only)
                    </button>
                    <button
                      className={`control-btn ${demoState.applyFixes ? "active" : ""}`}
                      onClick={() =>
                        setDemoState((prev) => ({ ...prev, applyFixes: true }))
                      }
                    >
                      🔧 Apply Fixes
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">Layer Selection</label>
                  <div className="layer-controls">
                    <button
                      className={`control-btn ${demoState.selectedLayers.length === 0 ? "active" : ""}`}
                      onClick={() =>
                        setDemoState((prev) => ({
                          ...prev,
                          selectedLayers: [],
                        }))
                      }
                    >
                      🤖 Auto-Detect
                    </button>
                    <button
                      className={`control-btn ${demoState.selectedLayers.length === 6 ? "active" : ""}`}
                      onClick={() =>
                        setDemoState((prev) => ({
                          ...prev,
                          selectedLayers: [1, 2, 3, 4, 5, 6],
                        }))
                      }
                    >
                      🎯 All Layers
                    </button>
                  </div>
                  <div className="layer-checkboxes">
                    {[1, 2, 3, 4, 5, 6].map((layerId) => (
                      <label key={layerId} className="layer-checkbox">
                        <input
                          type="checkbox"
                          checked={demoState.selectedLayers.includes(layerId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDemoState((prev) => ({
                                ...prev,
                                selectedLayers: [
                                  ...prev.selectedLayers,
                                  layerId,
                                ].sort(),
                              }));
                            } else {
                              setDemoState((prev) => ({
                                ...prev,
                                selectedLayers: prev.selectedLayers.filter(
                                  (id) => id !== layerId,
                                ),
                              }));
                            }
                          }}
                        />
                        <span className="layer-label">Layer {layerId}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="demo-upload-section">
              <div
                className="upload-area"
                onClick={() => document.getElementById("fileInput")?.click()}
                role="button"
                aria-label="Upload files for demo analysis"
              >
                <h3>Upload Your Files</h3>
                <p>Drop React/Next.js files here or click to browse</p>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                  Supports .jsx, .tsx, .js, .ts files
                </p>
                <input
                  type="file"
                  id="fileInput"
                  className="file-input"
                  accept=".jsx,.tsx,.js,.ts"
                  onChange={handleFileUpload}
                  aria-label="Select files for analysis"
                />
              </div>

              <div className="sample-code-section">
                <h3>Try Sample Code</h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: "1.5rem",
                  }}
                >
                  See real fixes on common React issues
                </p>
                <div className="sample-buttons">
                  <button
                    className={`sample-btn ${demoState.isLoading && demoState.currentSample === "missing-keys" ? "loading" : ""}`}
                    onClick={() => loadSampleCode("missing-keys")}
                    disabled={demoState.isLoading}
                  >
                    {demoState.isLoading &&
                    demoState.currentSample === "missing-keys"
                      ? "Analyzing..."
                      : "Missing Keys & Entities"}
                  </button>
                  <button
                    className={`sample-btn ${demoState.isLoading && demoState.currentSample === "html-entities" ? "loading" : ""}`}
                    onClick={() => loadSampleCode("html-entities")}
                    disabled={demoState.isLoading}
                  >
                    {demoState.isLoading &&
                    demoState.currentSample === "html-entities"
                      ? "Analyzing..."
                      : "HTML Entity Corruption"}
                  </button>
                  <button
                    className={`sample-btn ${demoState.isLoading && demoState.currentSample === "ssr-issues" ? "loading" : ""}`}
                    onClick={() => loadSampleCode("ssr-issues")}
                    disabled={demoState.isLoading}
                  >
                    {demoState.isLoading &&
                    demoState.currentSample === "ssr-issues"
                      ? "Analyzing..."
                      : "SSR Hydration Issues"}
                  </button>
                  <button
                    className={`sample-btn ${demoState.isLoading && demoState.currentSample === "accessibility" ? "loading" : ""}`}
                    onClick={() => loadSampleCode("accessibility")}
                    disabled={demoState.isLoading}
                  >
                    {demoState.isLoading &&
                    demoState.currentSample === "accessibility"
                      ? "Analyzing..."
                      : "Accessibility & Testing"}
                  </button>
                </div>
              </div>
            </div>

            {/* Sophisticated Analysis Results Display */}
            {demoState.showResults && demoState.result && (
              <div className="demo-results">
                <h3 className="results-title">
                  NeuroLint Pro Analysis Results
                </h3>

                {demoState.result.success ? (
                  <>
                    {/* Analysis Summary */}
                    {demoState.result.analysis && (
                      <div className="analysis-summary">
                        <div className="analysis-grid">
                          <div className="analysis-card">
                            <div className="analysis-label">
                              Confidence Score
                            </div>
                            <div className="analysis-value">
                              {(
                                demoState.result.analysis.confidence * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="analysis-card">
                            <div className="analysis-label">Impact Level</div>
                            <div className="analysis-value">
                              {demoState.result.analysis.estimatedImpact.level.toUpperCase()}
                            </div>
                          </div>
                          <div className="analysis-card">
                            <div className="analysis-label">Issues Found</div>
                            <div className="analysis-value">
                              {demoState.result.analysis.detectedIssues.length}
                            </div>
                          </div>
                          <div className="analysis-card">
                            <div className="analysis-label">
                              Recommended Layers
                            </div>
                            <div className="analysis-value">
                              {demoState.result.analysis.recommendedLayers.join(
                                ", ",
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detected Issues Breakdown */}
                    {demoState.result.analysis?.detectedIssues &&
                      demoState.result.analysis.detectedIssues.length > 0 && (
                        <div className="issues-breakdown">
                          <h4>Detected Issues by Layer</h4>
                          <div className="issues-list">
                            {demoState.result.analysis.detectedIssues.map(
                              (issue, index) => (
                                <div
                                  key={index}
                                  className={`issue-item severity-${issue.severity}`}
                                >
                                  <div className="issue-header">
                                    <span className="issue-type">
                                      Layer {issue.fixedByLayer}
                                    </span>
                                    <span
                                      className={`issue-severity ${issue.severity}`}
                                    >
                                      {issue.severity.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="issue-description">
                                    {issue.description}
                                  </div>
                                  <div className="issue-pattern">
                                    Pattern: {issue.pattern}
                                  </div>
                                  {issue.count && (
                                    <div className="issue-count">
                                      {issue.count} occurrences
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Layer Execution Results */}
                    {demoState.result.layers &&
                      demoState.result.layers.length > 0 && (
                        <div className="layer-results">
                          <h4>Layer Execution Summary</h4>
                          <div className="layers-grid">
                            {demoState.result.layers.map((layer) => (
                              <div
                                key={layer.layerId}
                                className={`layer-card ${layer.success ? "success" : "failed"}`}
                              >
                                <div className="layer-header">
                                  <span className="layer-name">
                                    Layer {layer.layerId}
                                  </span>
                                  <span
                                    className={`layer-status ${layer.success ? "success" : "failed"}`}
                                  >
                                    {layer.success ? "✅" : "❌"}
                                  </span>
                                </div>
                                <div className="layer-time">
                                  {layer.executionTime.toFixed(0)}ms
                                </div>
                                {layer.improvements &&
                                  layer.improvements.length > 0 && (
                                    <div className="layer-improvements">
                                      {layer.improvements.map(
                                        (improvement, index) => (
                                          <div
                                            key={index}
                                            className="improvement-item"
                                          >
                                            • {improvement}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Before/After Code Display */}
                    {demoState.result.originalCode &&
                      demoState.result.transformed && (
                        <div className="code-comparison">
                          <h4>Before & After Comparison</h4>
                          <div className="code-panels">
                            <div className="code-panel">
                              <div className="code-panel-header">
                                Original Code
                              </div>
                              <pre className="code-block original">
                                <code>{demoState.result.originalCode}</code>
                              </pre>
                            </div>
                            <div className="code-panel">
                              <div className="code-panel-header">
                                NeuroLint Pro Fixed
                              </div>
                              <pre className="code-block transformed">
                                <code>{demoState.result.transformed}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="error-result">
                    <h4>Analysis Failed</h4>
                    <p>
                      {demoState.result.error ||
                        "Unknown error occurred during analysis"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <div className="pricing-container">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Pay per use or get unlimited access. No hidden fees.
            </p>

            <div className="pricing-grid">
              <div className="pricing-card">
                <h3>Single Fix</h3>
                <div className="price">
                  $49<span className="price-per">per codebase</span>
                </div>
                <ul>
                  <li>Up to 50 files</li>
                  <li>All 6 layers included</li>
                  <li>Detailed analysis report</li>
                  <li>24-hour delivery</li>
                  <li>PayPal/Card payment</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => openPaymentModal("single")}
                  aria-label="Purchase single fix plan"
                >
                  Fix Now
                </button>
              </div>

              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <h3>Professional</h3>
                <div className="price">
                  $149<span className="price-per">per month</span>
                </div>
                <ul>
                  <li>Unlimited fixes</li>
                  <li>Up to 500 files per fix</li>
                  <li>Priority processing</li>
                  <li>API access</li>
                  <li>Team collaboration</li>
                  <li>Cancel anytime</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => openPaymentModal("professional")}
                  aria-label="Subscribe to professional plan"
                >
                  Get Started
                </button>
              </div>

              <div className="pricing-card">
                <h3>Enterprise</h3>
                <div className="price">
                  $499<span className="price-per">per month</span>
                </div>
                <ul>
                  <li>Unlimited everything</li>
                  <li>Custom layer development</li>
                  <li>Dedicated support</li>
                  <li>SLA guarantee</li>
                  <li>On-premise deployment</li>
                  <li>Training included</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => openPaymentModal("enterprise")}
                  aria-label="Contact sales for enterprise plan"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>
            &copy; 2024 NeuroLint Pro. Professional React/Next.js debugging
            service.
          </p>
          <p>
            Built on proven 6-layer patterns from IMPLEMENTATION_PATTERNS.md
          </p>
        </div>
      </footer>
    </div>
  );
}
