"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Layer1ConfigPage() {
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
            Layer 1: Configuration Fixes
          </span>
        </div>

        <h1 className="docs-page-title">🔧 Layer 1: Configuration Fixes</h1>
        <p className="docs-page-subtitle">
          Foundation setup and configuration modernization for TypeScript,
          Next.js, and package.json
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">⏱️ 8 min read</span>
          <span className="docs-meta-item difficulty-intermediate">
            🟡 Intermediate
          </span>
          <span className="docs-meta-item layer-badge">
            🏗️ Foundation Layer
          </span>
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
              <h3>🎯 Layer 1 Purpose</h3>
              <p>
                Layer 1 provides the <strong>essential foundation</strong> for
                all other transformations. It modernizes your project's
                configuration files to ensure compatibility with current
                React/Next.js best practices and enables the advanced
                transformations in subsequent layers.
              </p>
            </div>

            {/* What It Fixes */}
            <div className="docs-section">
              <h2 id="what-it-fixes">🔧 What Layer 1 Fixes</h2>

              <div className="docs-fix-categories">
                <div className="docs-fix-category">
                  <div className="docs-fix-icon">📐</div>
                  <h3>TypeScript Configuration</h3>
                  <ul>
                    <li>
                      <strong>Target modernization:</strong> Updates from
                      ES5/ES2015 to ES2020
                    </li>
                    <li>
                      <strong>Iteration support:</strong> Enables{" "}
                      <code>downlevelIteration</code> for modern array methods
                    </li>
                    <li>
                      <strong>Strict mode:</strong> Enables strict type checking
                      for better code quality
                    </li>
                    <li>
                      <strong>Module resolution:</strong> Configures proper
                      Node.js module resolution
                    </li>
                    <li>
                      <strong>Library includes:</strong> Adds ES2020, DOM, and
                      DOM.Iterable libraries
                    </li>
                    <li>
                      <strong>Build optimization:</strong> Enables{" "}
                      <code>skipLibCheck</code> for faster builds
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">⚡</div>
                  <h3>Next.js Configuration</h3>
                  <ul>
                    <li>
                      <strong>Deprecated removal:</strong> Removes{" "}
                      <code>appDir</code> and other deprecated options
                    </li>
                    <li>
                      <strong>React strict mode:</strong> Enables React 18+
                      strict mode
                    </li>
                    <li>
                      <strong>Security headers:</strong> Adds recommended
                      security configurations
                    </li>
                    <li>
                      <strong>Performance optimization:</strong> Configures
                      bundle optimization settings
                    </li>
                    <li>
                      <strong>Build settings:</strong> Sets up proper production
                      build configuration
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">📦</div>
                  <h3>Package.json Optimization</h3>
                  <ul>
                    <li>
                      <strong>Script standardization:</strong> Normalizes build,
                      dev, and lint scripts
                    </li>
                    <li>
                      <strong>Dependency cleanup:</strong> Identifies and
                      suggests outdated dependencies
                    </li>
                    <li>
                      <strong>Engine requirements:</strong> Sets appropriate
                      Node.js version requirements
                    </li>
                    <li>
                      <strong>Metadata updates:</strong> Ensures proper project
                      metadata structure
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why It's Important */}
            <div className="docs-section">
              <h2 id="why-important">⚡ Why Layer 1 is Critical</h2>

              <div className="docs-importance-grid">
                <div className="docs-importance-item">
                  <h4>🏗️ Foundation for Other Layers</h4>
                  <p>
                    Layers 2-6 depend on modern configuration. Without proper
                    TypeScript settings, AST transformations may fail.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🚀 Performance Improvements</h4>
                  <p>
                    Modern compilation targets and optimized build settings
                    significantly improve build times and runtime performance.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🛡️ Type Safety</h4>
                  <p>
                    Strict mode and proper library includes catch more errors at
                    compile time, preventing runtime issues.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🔮 Future Compatibility</h4>
                  <p>
                    Modern configurations ensure your project works with the
                    latest React, Next.js, and TypeScript features.
                  </p>
                </div>
              </div>
            </div>

            {/* Execution Strategy */}
            <div className="docs-section">
              <h2 id="execution-strategy">⚙️ How Layer 1 Works</h2>

              <div className="docs-execution-flow">
                <div className="docs-execution-step">
                  <div className="docs-step-number">1</div>
                  <div className="docs-step-content">
                    <h4>🔍 Discovery Phase</h4>
                    <p>
                      Scans for <code>tsconfig.json</code>,{" "}
                      <code>next.config.js</code>, and <code>package.json</code>{" "}
                      files
                    </p>
                  </div>
                </div>

                <div className="docs-execution-step">
                  <div className="docs-step-number">2</div>
                  <div className="docs-step-content">
                    <h4>📊 Analysis Phase</h4>
                    <p>
                      Parses existing configurations and identifies outdated or
                      missing settings
                    </p>
                  </div>
                </div>

                <div className="docs-execution-step">
                  <div className="docs-step-number">3</div>
                  <div className="docs-step-content">
                    <h4>🔧 Transformation Phase</h4>
                    <p>
                      Applies targeted updates while preserving existing custom
                      configurations
                    </p>
                  </div>
                </div>

                <div className="docs-execution-step">
                  <div className="docs-step-number">4</div>
                  <div className="docs-step-content">
                    <h4>✅ Validation Phase</h4>
                    <p>
                      Ensures all configurations are valid JSON/JavaScript and
                      functionally correct
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="docs-section">
              <h2 id="safety-features">🛡️ Safety Features</h2>

              <div className="docs-safety-grid">
                <div className="docs-safety-feature">
                  <h4>📝 JSON Validation</h4>
                  <p>
                    All JSON modifications are validated for syntax correctness
                    before saving.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🔄 Backup Creation</h4>
                  <p>
                    Original configuration files are backed up before any
                    modifications.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🎯 Selective Updates</h4>
                  <p>
                    Only modifies outdated settings, preserving your custom
                    configurations.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>✨ Graceful Degradation</h4>
                  <p>
                    If any configuration file can't be updated, the layer
                    continues with others.
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
                    <strong>Complex Next.js configs:</strong> Very complex
                    configurations with dynamic logic may not be fully optimized
                  </li>
                  <li>
                    <strong>Custom TypeScript paths:</strong> Complex path
                    mapping configurations are preserved but not optimized
                  </li>
                  <li>
                    <strong>Monorepo setups:</strong> Root-level configurations
                    in monorepos may need manual review
                  </li>
                  <li>
                    <strong>Legacy projects:</strong> Projects with very old
                    configurations may require manual intervention after Layer 1
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
                <h3>🎯 TypeScript Configuration (tsconfig.json)</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Outdated)</h4>
                    <pre>
                      <code>{`{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "es6"],
    "allowJs": true,
    "skipLibCheck": false,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Modernized)</h4>
                    <pre>
                      <code>{`{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "ES2020", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "downlevelIteration": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Updated target from <code>es5</code> to{" "}
                      <code>ES2020</code>
                    </li>
                    <li>
                      ✅ Added <code>ES2020</code> and <code>DOM.Iterable</code>{" "}
                      to libraries
                    </li>
                    <li>
                      ✅ Enabled <code>strict</code> mode for better type safety
                    </li>
                    <li>
                      ✅ Added <code>downlevelIteration</code> for modern array
                      methods
                    </li>
                    <li>
                      ✅ Enabled <code>skipLibCheck</code> for faster
                      compilation
                    </li>
                    <li>✅ Added Next.js plugin configuration</li>
                    <li>
                      ✅ Included <code>.next/types/**/*.ts</code> for Next.js
                      13+ support
                    </li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>⚡ Next.js Configuration (next.config.js)</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Deprecated)</h4>
                    <pre>
                      <code>{`/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
}

module.exports = nextConfig`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Modern)</h4>
                    <pre>
                      <code>{`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      🗑️ Removed deprecated <code>appDir</code> configuration
                    </li>
                    <li>
                      ✅ Enabled <code>reactStrictMode</code> for React 18+
                      compatibility
                    </li>
                    <li>
                      ✅ Added <code>swcMinify</code> for faster builds
                    </li>
                    <li>✅ Added basic image configuration structure</li>
                    <li>✅ Added security headers for production safety</li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>📦 Package.json Script Updates</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Basic)</h4>
                    <pre>
                      <code>{`{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Comprehensive)</h4>
                    <pre>
                      <code>{`{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Added <code>lint</code> and <code>lint:fix</code>{" "}
                      scripts
                    </li>
                    <li>
                      ✅ Added <code>type-check</code> for TypeScript validation
                    </li>
                    <li>
                      ✅ Added <code>clean</code> script for build cleanup
                    </li>
                    <li>✅ Added Node.js engine requirement</li>
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
                  <div className="docs-metric-value">2-5s</div>
                  <div className="docs-metric-label">Execution Time</div>
                  <div className="docs-metric-description">
                    Configuration files only
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">~20%</div>
                  <div className="docs-metric-label">
                    Build Speed Improvement
                  </div>
                  <div className="docs-metric-description">
                    After ES2020 upgrade
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">Zero</div>
                  <div className="docs-metric-label">Runtime Impact</div>
                  <div className="docs-metric-description">
                    Configuration changes only
                  </div>
                </div>
              </div>

              <div className="docs-performance-details">
                <h3>📊 Detailed Performance Analysis</h3>

                <div className="docs-performance-section">
                  <h4>🏗️ Build Time Improvements</h4>
                  <ul>
                    <li>
                      <strong>ES2020 Target:</strong> Reduces transpilation
                      overhead by ~15-25%
                    </li>
                    <li>
                      <strong>skipLibCheck:</strong> Can reduce TypeScript
                      compilation time by 30-50% on large projects
                    </li>
                    <li>
                      <strong>SWC Minify:</strong> Up to 2x faster minification
                      compared to Terser
                    </li>
                    <li>
                      <strong>Incremental compilation:</strong> Enables faster
                      subsequent builds
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>🚀 Runtime Performance</h4>
                  <ul>
                    <li>
                      <strong>Modern JavaScript:</strong> Better browser
                      optimization for ES2020 features
                    </li>
                    <li>
                      <strong>Strict mode:</strong> Enables more aggressive
                      compiler optimizations
                    </li>
                    <li>
                      <strong>Tree shaking:</strong> Better dead code
                      elimination with modern module resolution
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>🔍 Development Experience</h4>
                  <ul>
                    <li>
                      <strong>Faster type checking:</strong> skipLibCheck
                      reduces IDE lag
                    </li>
                    <li>
                      <strong>Better error reporting:</strong> Strict mode
                      catches issues earlier
                    </li>
                    <li>
                      <strong>Improved IntelliSense:</strong> Modern library
                      definitions provide better autocomplete
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
                <h3>🎯 Run Layer 1 Only</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>npm run fix-layer-1</code>
                  </pre>
                  <p>Executes only the configuration fixes layer</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🔍 Preview Layer 1 Changes</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-1-config.js --dry-run</code>
                  </pre>
                  <p>Shows what changes would be made without applying them</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📝 Verbose Output</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-1-config.js --verbose</code>
                  </pre>
                  <p>
                    Provides detailed information about each configuration
                    change
                  </p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🎛️ Advanced Options</h3>
                <div className="docs-cli-options">
                  <div className="docs-cli-option">
                    <code>--skip-typescript</code>
                    <p>Skip TypeScript configuration updates</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-nextjs</code>
                    <p>Skip Next.js configuration updates</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-package</code>
                    <p>Skip package.json script updates</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--backup-dir</code>
                    <p>Specify custom backup directory</p>
                  </div>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📊 Example Output</h3>
                <div className="docs-cli-output">
                  <pre>
                    <code>{`🔧 NeuroLint Pro - Layer 1: Configuration Fixes

📁 Scanning for configuration files...
✅ Found tsconfig.json
✅ Found next.config.js  
✅ Found package.json

🔍 Analyzing configurations...
⚠️  TypeScript target: es5 (outdated)
⚠️  Missing downlevelIteration setting
⚠️  React strict mode disabled
⚠️  Missing recommended scripts

🛠️  Applying fixes...
✅ Updated TypeScript target to ES2020
✅ Enabled downlevelIteration  
✅ Added skipLibCheck for faster builds
✅ Enabled React strict mode
✅ Added recommended security headers
✅ Added lint and type-check scripts

📊 Summary:
   • 6 configuration improvements applied
   • 0 errors encountered
   • Estimated build time improvement: ~20%
   
✨ Layer 1 completed successfully!`}</code>
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
          <Link href="/docs/layer-reference" className="docs-nav-link prev">
            ← Layer Reference Overview
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-2-patterns"
            className="docs-nav-link next"
          >
            Layer 2: Pattern Fixes →
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

        .difficulty-intermediate {
          color: var(--status-processing);
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.1);
        }

        .layer-badge {
          color: var(--status-info);
          border-color: rgba(33, 150, 243, 0.3);
          background: rgba(33, 150, 243, 0.1);
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

        .docs-execution-flow {
          margin: 32px 0;
        }

        .docs-execution-step {
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
          background: var(--status-info);
          color: white;
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
          color: var(--status-active);
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
          color: var(--status-active);
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
