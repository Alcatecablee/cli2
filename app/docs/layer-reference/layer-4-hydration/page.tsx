"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Layer4HydrationPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "examples" | "performance" | "cli"
  >("overview");

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">📚 Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#layer-reference">🔧 Layer Reference</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Layer 4: Hydration & SSR Fixes
          </span>
        </div>

        <h1 className="docs-page-title">💧 Layer 4: Hydration & SSR Fixes</h1>
        <p className="docs-page-subtitle">
          Server-side rendering safety, hydration mismatch prevention, and
          client-only API protection
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">⏱️ 15 min read</span>
          <span className="docs-meta-item difficulty-advanced">
            🔴 Advanced
          </span>
          <span className="docs-meta-item layer-badge">💧 SSR Layer</span>
          <span className="docs-meta-item">📝 Last updated: Dec 2024</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="docs-tab-nav">
        <button
          className={`docs-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📋 Overview
        </button>
        <button
          className={`docs-tab ${activeTab === "examples" ? "active" : ""}`}
          onClick={() => setActiveTab("examples")}
        >
          📝 Examples
        </button>
        <button
          className={`docs-tab ${activeTab === "performance" ? "active" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          ⚡ Performance
        </button>
        <button
          className={`docs-tab ${activeTab === "cli" ? "active" : ""}`}
          onClick={() => setActiveTab("cli")}
        >
          💻 CLI Usage
        </button>
      </div>

      <div className="docs-page-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Quick Summary */}
            <div className="docs-highlight-box info">
              <h3>🎯 Layer 4 Purpose</h3>
              <p>
                Layer 4 prevents{" "}
                <strong>hydration mismatches and SSR errors</strong> by adding
                proper guards for client-only APIs, fixing theme provider
                patterns, creating NoSSR components, and ensuring your Next.js
                application works flawlessly with server-side rendering.
              </p>
            </div>

            {/* What It Fixes */}
            <div className="docs-section">
              <h2 id="what-it-fixes">💧 What Layer 4 Fixes</h2>

              <div className="docs-fix-categories">
                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🌐</div>
                  <h3>Browser API Guards</h3>
                  <ul>
                    <li>
                      <strong>localStorage protection:</strong> Adds{" "}
                      <code>typeof window !== "undefined"</code> guards
                    </li>
                    <li>
                      <strong>sessionStorage safety:</strong> Prevents SSR
                      access to session storage
                    </li>
                    <li>
                      <strong>document/window access:</strong> Guards DOM API
                      calls during SSR
                    </li>
                    <li>
                      <strong>Navigator API:</strong> Protects geolocation,
                      clipboard, and other browser APIs
                    </li>
                    <li>
                      <strong>Event listener setup:</strong> Ensures event
                      listeners are client-only
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🎨</div>
                  <h3>Theme Provider Hydration</h3>
                  <ul>
                    <li>
                      <strong>Mounted state pattern:</strong> Implements proper
                      hydration-safe theme providers
                    </li>
                    <li>
                      <strong>Default theme fallback:</strong> Provides
                      consistent initial state
                    </li>
                    <li>
                      <strong>Theme persistence:</strong> Safe localStorage
                      integration for theme saving
                    </li>
                    <li>
                      <strong>SSR placeholder:</strong> Renders neutral theme
                      during server-side rendering
                    </li>
                    <li>
                      <strong>Flash prevention:</strong> Prevents theme flashing
                      on first load
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🚫</div>
                  <h3>NoSSR Component Creation</h3>
                  <ul>
                    <li>
                      <strong>Dynamic import wrapper:</strong> Creates utility
                      for client-only rendering
                    </li>
                    <li>
                      <strong>Loading state handling:</strong> Provides fallback
                      during hydration
                    </li>
                    <li>
                      <strong>Component isolation:</strong> Wraps problematic
                      components safely
                    </li>
                    <li>
                      <strong>Error boundary integration:</strong> Handles
                      hydration failures gracefully
                    </li>
                    <li>
                      <strong>Conditional rendering:</strong> Smart client-side
                      only rendering
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">📄</div>
                  <h3>Missing File Creation</h3>
                  <ul>
                    <li>
                      <strong>robots.txt:</strong> Creates SEO-friendly robots
                      file
                    </li>
                    <li>
                      <strong>site.webmanifest:</strong> Adds PWA manifest
                      configuration
                    </li>
                    <li>
                      <strong>NoSSR utility:</strong> Creates reusable NoSSR
                      component
                    </li>
                    <li>
                      <strong>Error boundary:</strong> Adds hydration error
                      handling component
                    </li>
                    <li>
                      <strong>Theme utilities:</strong> Creates theme management
                      utilities
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Hydration Issues */}
            <div className="docs-section">
              <h2 id="hydration-issues">🚨 Common Hydration Issues</h2>

              <div className="docs-hydration-issues">
                <div className="docs-issue-item">
                  <h4>⚠️ Text Content Mismatch</h4>
                  <div className="docs-issue-description">
                    <p>
                      <strong>Problem:</strong> Server renders one value, client
                      renders different value
                    </p>
                    <p>
                      <strong>Cause:</strong> Time-based values, localStorage,
                      user preferences
                    </p>
                    <p>
                      <strong>Solution:</strong> Use mounted state to ensure
                      consistent initial render
                    </p>
                  </div>
                </div>

                <div className="docs-issue-item">
                  <h4>💾 localStorage Access Error</h4>
                  <div className="docs-issue-description">
                    <p>
                      <strong>Problem:</strong>{" "}
                      <code>ReferenceError: localStorage is not defined</code>
                    </p>
                    <p>
                      <strong>Cause:</strong> Server-side code trying to access
                      browser APIs
                    </p>
                    <p>
                      <strong>Solution:</strong> Add{" "}
                      <code>typeof window !== "undefined"</code> guards
                    </p>
                  </div>
                </div>

                <div className="docs-issue-item">
                  <h4>🎨 Theme Flash</h4>
                  <div className="docs-issue-description">
                    <p>
                      <strong>Problem:</strong> Theme flickers on page load
                    </p>
                    <p>
                      <strong>Cause:</strong> Theme provider hydration mismatch
                    </p>
                    <p>
                      <strong>Solution:</strong> Implement mounted state pattern
                      with default theme
                    </p>
                  </div>
                </div>

                <div className="docs-issue-item">
                  <h4>📡 Event Listener Errors</h4>
                  <div className="docs-issue-description">
                    <p>
                      <strong>Problem:</strong> Cannot add event listeners
                      during SSR
                    </p>
                    <p>
                      <strong>Cause:</strong> useEffect not guarded properly
                    </p>
                    <p>
                      <strong>Solution:</strong> Ensure event listeners are
                      added only on client
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detection Strategy */}
            <div className="docs-section">
              <h2 id="detection-strategy">🔍 How Layer 4 Detects Issues</h2>

              <div className="docs-detection-flow">
                <div className="docs-detection-step">
                  <div className="docs-step-number">1</div>
                  <div className="docs-step-content">
                    <h4>🌳 AST Analysis</h4>
                    <p>
                      Parses code to identify browser API usage patterns and
                      potential SSR issues
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">2</div>
                  <div className="docs-step-content">
                    <h4>🔍 Pattern Recognition</h4>
                    <p>
                      Identifies localStorage, window, document access without
                      proper guards
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">3</div>
                  <div className="docs-step-content">
                    <h4>🎨 Theme Provider Detection</h4>
                    <p>
                      Finds theme providers that could cause hydration
                      mismatches
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">4</div>
                  <div className="docs-step-content">
                    <h4>🛠️ Safe Transformation</h4>
                    <p>
                      Applies guards and creates utilities while preserving
                      existing functionality
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why It's Critical */}
            <div className="docs-section">
              <h2 id="why-critical">⚡ Why Layer 4 is Critical</h2>

              <div className="docs-importance-grid">
                <div className="docs-importance-item">
                  <h4>🚀 SEO Performance</h4>
                  <p>
                    Proper SSR ensures search engines can index your content
                    correctly and improve rankings.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>⚡ Initial Load Speed</h4>
                  <p>
                    Prevents hydration errors that can block page interactivity
                    and hurt Core Web Vitals.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🛡️ Runtime Stability</h4>
                  <p>
                    Eliminates server-side errors that could crash your
                    application during rendering.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🌟 User Experience</h4>
                  <p>
                    Prevents theme flashing, content jumping, and other visual
                    inconsistencies.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="docs-section">
              <h2 id="safety-features">🛡️ Safety Features</h2>

              <div className="docs-safety-grid">
                <div className="docs-safety-feature">
                  <h4>🔒 Context Preservation</h4>
                  <p>
                    Guards are added only where needed, preserving existing
                    logic and functionality.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>⚡ Performance Conscious</h4>
                  <p>
                    Guards are optimized to have minimal runtime impact on
                    client-side execution.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🎯 Targeted Fixes</h4>
                  <p>
                    Only modifies code that actually causes SSR issues, avoiding
                    unnecessary changes.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🔄 Graceful Fallbacks</h4>
                  <p>
                    Provides sensible defaults when browser APIs are unavailable
                    during SSR.
                  </p>
                </div>
              </div>
            </div>

            {/* Known Limitations */}
            <div className="docs-section">
              <h2 id="limitations">⚠️ Known Limitations</h2>

              <div className="docs-highlight-box warning">
                <h3>🔍 Current Limitations</h3>
                <ul>
                  <li>
                    <strong>Complex async patterns:</strong> Very complex
                    async/await patterns may need manual review
                  </li>
                  <li>
                    <strong>Third-party libraries:</strong> External library SSR
                    issues cannot be automatically fixed
                  </li>
                  <li>
                    <strong>Dynamic imports:</strong> Some dynamic import
                    patterns may not be detected
                  </li>
                  <li>
                    <strong>Custom hooks:</strong> Complex custom hooks with
                    browser APIs may need manual guards
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Examples Tab */}
        {activeTab === "examples" && (
          <>
            <div className="docs-section">
              <h2>📝 Before & After Examples</h2>

              <div className="docs-example-group">
                <h3>🌐 Browser API Guards</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (SSR Unsafe)</h4>
                    <pre>
                      <code>{`// Direct localStorage access
function UserPreferences() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );
  
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );
  
  return (
    <div className={\`theme-\${theme}\`}>
      <select value={language} onChange={updateLanguage}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}

// Direct window access
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div>Size: {windowSize.width}x{windowSize.height}</div>;
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (SSR Safe)</h4>
                    <pre>
                      <code>{`// Guarded localStorage access
function UserPreferences() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });
  
  return (
    <div className={\`theme-\${theme}\`}>
      <select value={language} onChange={updateLanguage}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}

// Guarded window access
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div>Size: {windowSize.width}x{windowSize.height}</div>;
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Added <code>typeof window !== "undefined"</code> guards
                      to localStorage access
                    </li>
                    <li>
                      ✅ Provided fallback values for SSR (light theme, en
                      language, 0 dimensions)
                    </li>
                    <li>
                      ✅ Guarded useEffect to prevent window access during SSR
                    </li>
                    <li>
                      ✅ Used lazy initial state to safely access localStorage
                    </li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>🎨 Theme Provider Hydration Fix</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Hydration Mismatch)</h4>
                    <pre>
                      <code>{`// Theme provider causing hydration issues
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={\`theme-\${theme}\`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Hydration Safe)</h4>
                    <pre>
                      <code>{`// Hydration-safe theme provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const savedTheme = typeof window !== 'undefined' 
      ? localStorage.getItem('theme') 
      : null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  // Show neutral theme during SSR
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
        <div className="theme-light">
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={\`theme-\${theme}\`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Added <code>mounted</code> state to track hydration
                      completion
                    </li>
                    <li>
                      ✅ Provided consistent SSR fallback with light theme
                    </li>
                    <li>
                      ✅ Moved localStorage access to useEffect for client-only
                      execution
                    </li>
                    <li>
                      ✅ Added guards to prevent localStorage access during SSR
                    </li>
                    <li>
                      ✅ Eliminated hydration mismatch between server and client
                    </li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>🚫 NoSSR Component Creation</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (No Utility)</h4>
                    <pre>
                      <code>{`// Component that breaks SSR
function InteractiveMap({ location }) {
  const [map, setMap] = useState(null);
  
  useEffect(() => {
    // This will break during SSR
    const googleMap = new window.google.maps.Map(
      document.getElementById('map'),
      { center: location, zoom: 10 }
    );
    setMap(googleMap);
  }, [location]);
  
  return <div id="map" style={{ height: '400px' }} />;
}

// Usage without SSR protection
function LocationPage() {
  return (
    <div>
      <h1>Our Location</h1>
      <InteractiveMap location={{ lat: 40.7128, lng: -74.0060 }} />
    </div>
  );
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (With NoSSR Utility)</h4>
                    <pre>
                      <code>{`// Created NoSSR utility component
function NoSSR({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return fallback;
  }
  
  return children;
}

// Component remains unchanged
function InteractiveMap({ location }) {
  const [map, setMap] = useState(null);
  
  useEffect(() => {
    const googleMap = new window.google.maps.Map(
      document.getElementById('map'),
      { center: location, zoom: 10 }
    );
    setMap(googleMap);
  }, [location]);
  
  return <div id="map" style={{ height: '400px' }} />;
}

// Usage with SSR protection
function LocationPage() {
  return (
    <div>
      <h1>Our Location</h1>
      <NoSSR fallback={<div style={{ height: '400px', background: '#f0f0f0' }}>Loading map...</div>}>
        <InteractiveMap location={{ lat: 40.7128, lng: -74.0060 }} />
      </NoSSR>
    </div>
  );
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Created reusable <code>NoSSR</code> utility component
                    </li>
                    <li>✅ Added loading fallback during SSR</li>
                    <li>✅ Wrapped problematic component with NoSSR wrapper</li>
                    <li>✅ Preserved original component functionality</li>
                    <li>✅ Prevented server-side rendering errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <>
            <div className="docs-section">
              <h2>⚡ Performance Impact</h2>

              <div className="docs-performance-stats">
                <div className="docs-performance-metric">
                  <div className="docs-metric-value">5-15s</div>
                  <div className="docs-metric-label">Execution Time</div>
                  <div className="docs-metric-description">
                    Hydration files only
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">~95%</div>
                  <div className="docs-metric-label">SSR Error Reduction</div>
                  <div className="docs-metric-description">
                    Prevents runtime crashes
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">Minimal</div>
                  <div className="docs-metric-label">Runtime Overhead</div>
                  <div className="docs-metric-description">
                    Optimized guards
                  </div>
                </div>
              </div>

              <div className="docs-performance-details">
                <h3>📊 Detailed Performance Analysis</h3>

                <div className="docs-performance-section">
                  <h4>🚀 Initial Load Performance</h4>
                  <ul>
                    <li>
                      <strong>SSR stability:</strong> Prevents server-side
                      crashes that delay page delivery
                    </li>
                    <li>
                      <strong>Hydration speed:</strong> Eliminates mismatches
                      that block interactivity
                    </li>
                    <li>
                      <strong>Core Web Vitals:</strong> Improves LCP and FID by
                      preventing render blocks
                    </li>
                    <li>
                      <strong>SEO benefits:</strong> Ensures search engines can
                      properly crawl content
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>🎨 Visual Stability</h4>
                  <ul>
                    <li>
                      <strong>Theme flash prevention:</strong> Eliminates layout
                      shift from theme changes
                    </li>
                    <li>
                      <strong>Content consistency:</strong> Same content
                      rendered on server and client
                    </li>
                    <li>
                      <strong>Smooth transitions:</strong> Better user
                      experience during hydration
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>🛡️ Error Prevention</h4>
                  <ul>
                    <li>
                      <strong>Runtime stability:</strong> Prevents crashes from
                      undefined browser APIs
                    </li>
                    <li>
                      <strong>Graceful degradation:</strong> Fallbacks when
                      features aren't available
                    </li>
                    <li>
                      <strong>Development experience:</strong> Fewer console
                      errors and warnings
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>⚡ Guard Optimization</h4>
                  <ul>
                    <li>
                      <strong>Minimal overhead:</strong> Guards are optimized
                      for performance
                    </li>
                    <li>
                      <strong>One-time checks:</strong> Many guards only run
                      once during initialization
                    </li>
                    <li>
                      <strong>Smart placement:</strong> Guards added only where
                      actually needed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CLI Usage Tab */}
        {activeTab === "cli" && (
          <>
            <div className="docs-section">
              <h2>💻 Command Line Usage</h2>

              <div className="docs-cli-section">
                <h3>🎯 Run Layer 4 Only</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>npm run fix-layer-4</code>
                  </pre>
                  <p>Executes only the hydration and SSR fixes layer</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🔍 Preview Layer 4 Changes</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-4-hydration.js --dry-run</code>
                  </pre>
                  <p>Shows what SSR safety improvements would be made</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📝 Verbose Output</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-4-hydration.js --verbose</code>
                  </pre>
                  <p>Provides detailed information about each hydration fix</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🎛️ Advanced Options</h3>
                <div className="docs-cli-options">
                  <div className="docs-cli-option">
                    <code>--skip-guards</code>
                    <p>Skip browser API guard additions</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-theme</code>
                    <p>Skip theme provider hydration fixes</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-nossr</code>
                    <p>Skip NoSSR component creation</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-files</code>
                    <p>Skip missing file creation (robots.txt, manifest)</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--create-utils</code>
                    <p>Force creation of SSR utility components</p>
                  </div>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📊 Example Output</h3>
                <div className="docs-cli-output">
                  <pre>
                    <code>{`💧 NeuroLint Pro - Layer 4: Hydration & SSR Fixes

📁 Scanning for SSR-sensitive files...
✅ Found 28 component files with potential SSR issues
✅ Found 5 theme-related files

🔍 Analyzing hydration patterns...
⚠️  12 unguarded localStorage accesses detected
⚠️  3 theme providers with hydration risks
⚠️  8 window/document API calls without guards
⚠️  2 missing SSR utility files

🛠️  Applying hydration fixes...
✅ Added typeof window guards to 12 localStorage calls
✅ Fixed 3 theme providers with mounted state pattern
✅ Protected 8 browser API calls
✅ Created NoSSR utility component
✅ Created robots.txt with SEO configuration
✅ Created site.webmanifest for PWA support

📊 Summary:
   • 12 localStorage accesses made SSR-safe
   • 3 theme providers fixed (eliminated hydration mismatches)
   • 8 browser API calls protected
   • 2 utility files created
   • 0 SSR errors remaining
   
✨ Layer 4 completed successfully!
   SSR stability: 100% (no server-side crashes)
   Hydration mismatches: Eliminated
   SEO readiness: Complete`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Page Navigation */}
      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-3-components"
            className="docs-nav-link prev"
          >
            ← Layer 3: Component Fixes
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-5-nextjs"
            className="docs-nav-link next"
          >
            Layer 5: Next.js App Router →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .docs-page {
          min-height: 100vh;
          background: #000000;
          color: white;
          font-family: var(--font-sans, "Inter", sans-serif);
        }

        .docs-page-header {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.08) 0%,
            rgba(0, 0, 0, 0.95) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
        }

        .docs-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .docs-breadcrumb a {
          color: var(--status-info);
          text-decoration: none;
        }

        .docs-breadcrumb a:hover {
          text-decoration: underline;
        }

        .docs-breadcrumb-separator {
          color: rgba(255, 255, 255, 0.4);
        }

        .docs-breadcrumb-current {
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-page-title {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #ffffff 0%, #2196f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .docs-page-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .docs-page-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .docs-meta-item {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .difficulty-advanced {
          color: var(--status-error);
          border-color: rgba(229, 62, 62, 0.3);
          background: rgba(229, 62, 62, 0.1);
        }

        .layer-badge {
          color: #00bcd4;
          border-color: rgba(0, 188, 212, 0.3);
          background: rgba(0, 188, 212, 0.1);
        }

        .docs-tab-nav {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0 40px;
          display: flex;
          gap: 8px;
        }

        .docs-tab {
          padding: 16px 24px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .docs-tab:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }

        .docs-tab.active {
          color: var(--status-info);
          border-bottom-color: var(--status-info);
          background: rgba(33, 150, 243, 0.1);
        }

        .docs-page-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 40px;
          line-height: 1.7;
        }

        .docs-section {
          margin-bottom: 60px;
        }

        .docs-section h2 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 24px 0;
          color: white;
        }

        .docs-section h3 {
          font-size: 24px;
          font-weight: 600;
          margin: 32px 0 16px 0;
          color: white;
        }

        .docs-section h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: white;
        }

        .docs-section p {
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-highlight-box {
          padding: 24px;
          border-radius: 12px;
          margin: 32px 0;
          border: 1px solid;
        }

        .docs-highlight-box.info {
          background: rgba(33, 150, 243, 0.1);
          border-color: rgba(33, 150, 243, 0.3);
        }

        .docs-highlight-box.warning {
          background: rgba(255, 152, 0, 0.1);
          border-color: rgba(255, 152, 0, 0.3);
        }

        .docs-highlight-box h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .docs-highlight-box p {
          margin: 0;
        }

        .docs-highlight-box ul {
          margin: 12px 0 0 0;
          padding-left: 20px;
        }

        .docs-highlight-box li {
          margin-bottom: 8px;
        }

        .docs-fix-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-fix-category {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-fix-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .docs-fix-category h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
        }

        .docs-fix-category ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-fix-category li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-hydration-issues {
          margin: 32px 0;
        }

        .docs-issue-item {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 152, 0, 0.05);
          border: 1px solid rgba(255, 152, 0, 0.2);
          border-radius: 12px;
        }

        .docs-issue-item h4 {
          margin: 0 0 12px 0;
          color: #ff9800;
        }

        .docs-issue-description p {
          margin: 8px 0;
          font-size: 14px;
        }

        .docs-issue-description strong {
          color: white;
        }

        .docs-detection-flow {
          margin: 32px 0;
        }

        .docs-detection-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .docs-step-number {
          width: 32px;
          height: 32px;
          background: #00bcd4;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .docs-step-content h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        .docs-step-content p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-importance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-importance-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-importance-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-importance-item p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-safety-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-safety-feature {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-safety-feature h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-safety-feature p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-example-group {
          margin: 40px 0;
          padding: 32px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .docs-example-group h3 {
          margin: 0 0 24px 0;
          font-size: 22px;
        }

        .docs-code-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 24px 0;
        }

        .docs-code-before,
        .docs-code-after {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .docs-code-before h4 {
          background: rgba(229, 62, 62, 0.2);
          color: #ff6b6b;
          margin: 0;
          padding: 12px 16px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-code-after h4 {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          margin: 0;
          padding: 12px 16px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-code-before pre,
        .docs-code-after pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
        }

        .docs-code-before code,
        .docs-code-after code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-changes-summary {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .docs-changes-summary h4 {
          margin: 0 0 12px 0;
          color: var(--status-info);
        }

        .docs-changes-summary ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-changes-summary li {
          margin-bottom: 6px;
          font-size: 14px;
        }

        .docs-performance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-performance-metric {
          text-align: center;
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-metric-value {
          font-size: 36px;
          font-weight: 700;
          color: #00bcd4;
          margin-bottom: 8px;
        }

        .docs-metric-label {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .docs-metric-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .docs-performance-details {
          margin: 40px 0;
        }

        .docs-performance-section {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-performance-section h4 {
          margin: 0 0 12px 0;
        }

        .docs-performance-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-performance-section li {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .docs-cli-section {
          margin: 32px 0;
        }

        .docs-cli-section h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
        }

        .docs-cli-command {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .docs-cli-command pre {
          margin: 0 0 8px 0;
        }

        .docs-cli-command code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 14px;
          color: #00bcd4;
        }

        .docs-cli-command p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-cli-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .docs-cli-option {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }

        .docs-cli-option code {
          color: var(--status-info);
          font-weight: 600;
          font-size: 14px;
        }

        .docs-cli-option p {
          margin: 8px 0 0 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-cli-output {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }

        .docs-cli-output pre {
          margin: 0;
          overflow-x: auto;
        }

        .docs-cli-output code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-page-nav {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          display: flex;
          justify-content: space-between;
        }

        .docs-nav-link {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          text-decoration: none;
          color: white;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .docs-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 0.9em;
        }

        strong {
          color: white;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .docs-page-header,
          .docs-page-content,
          .docs-page-nav {
            padding-left: 20px;
            padding-right: 20px;
          }

          .docs-tab-nav {
            padding-left: 20px;
            padding-right: 20px;
            overflow-x: auto;
          }

          .docs-page-title {
            font-size: 36px;
          }

          .docs-code-comparison {
            grid-template-columns: 1fr;
          }

          .docs-page-nav {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
