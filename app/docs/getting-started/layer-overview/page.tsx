"use client";

import React from "react";
import Link from "next/link";

export default function LayerOverviewPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#getting-started">Getting Started</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Quick Layer Overview (1–6)
          </span>
        </div>

        <h1 className="docs-page-title">Quick Layer Overview (1–6)</h1>
        <p className="docs-page-subtitle">
          Understanding what each layer does and when to use them
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">6 min read</span>
          <span className="docs-meta-item difficulty-beginner">Beginner</span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        {/* Quick Summary */}
        <div className="docs-highlight-box info">
          <h3>The Big Picture</h3>
          <p>
            NeuroLint Pro's 6-layer system works <strong>sequentially</strong> -
            each layer builds on the previous one's work. Layer 1 creates the
            foundation, and each subsequent layer handles increasingly
            sophisticated transformations. You can run all layers together or
            pick specific ones for targeted fixes.
          </p>
        </div>

        {/* Layer Flow Visualization */}
        <div className="docs-section">
          <h2 id="layer-flow">The Sequential Flow</h2>
          <p>
            Each layer has dependencies on previous layers. Here's how they work
            together:
          </p>

          <div className="docs-layer-flow-detailed">
            <div className="docs-layer-group foundation">
              <h3>Foundation</h3>
              <div className="docs-layer-card">
                <div className="docs-layer-header">
                  <div className="docs-layer-number">1</div>
                  <h4>Configuration Fixes</h4>
                  <span className="docs-layer-type">Foundation</span>
                </div>
                <p>
                  Modernizes TypeScript, Next.js, and package.json settings to
                  create a solid foundation.
                </p>
                <div className="docs-layer-fixes">
                  <span className="docs-fix-badge">
                    TypeScript target → ES2020
                  </span>
                  <span className="docs-fix-badge">Next.js config cleanup</span>
                  <span className="docs-fix-badge">
                    Package.json optimization
                  </span>
                </div>
                <div className="docs-layer-dependency">
                  <strong>Dependencies:</strong> None (runs first)
                </div>
              </div>
            </div>

            <div className="docs-layer-arrow-down">↓</div>

            <div className="docs-layer-group cleanup">
              <h3>Cleanup & Preparation</h3>
              <div className="docs-layer-card">
                <div className="docs-layer-header">
                  <div className="docs-layer-number">2</div>
                  <h4>Pattern Fixes</h4>
                  <span className="docs-layer-type">Cleanup</span>
                </div>
                <p>
                  Cleans up corrupted entities, imports, and legacy patterns
                  before component work.
                </p>
                <div className="docs-layer-fixes">
                  <span className="docs-fix-badge">
                    HTML entities → proper characters
                  </span>
                  <span className="docs-fix-badge">Unused imports removal</span>
                  <span className="docs-fix-badge">
                    Console.log → console.debug
                  </span>
                </div>
                <div className="docs-layer-dependency">
                  <strong>Dependencies:</strong> Layer 1 (needs modern config)
                </div>
              </div>
            </div>

            <div className="docs-layer-arrow-down">↓</div>

            <div className="docs-layer-group enhancement">
              <h3>Component Enhancement</h3>
              <div className="docs-layer-card">
                <div className="docs-layer-header">
                  <div className="docs-layer-number">3</div>
                  <h4>Component Fixes</h4>
                  <span className="docs-layer-type">React</span>
                </div>
                <p>
                  Improves React components with proper keys, accessibility, and
                  modern patterns.
                </p>
                <div className="docs-layer-fixes">
                  <span className="docs-fix-badge">Missing key props</span>
                  <span className="docs-fix-badge">Button variants</span>
                  <span className="docs-fix-badge">
                    Accessibility attributes
                  </span>
                </div>
                <div className="docs-layer-dependency">
                  <strong>Dependencies:</strong> Layers 1-2 (needs clean
                  foundation)
                </div>
              </div>
            </div>

            <div className="docs-layer-arrow-down">↓</div>

            <div className="docs-layer-group runtime">
              <h3>Runtime Safety</h3>
              <div className="docs-layer-card">
                <div className="docs-layer-header">
                  <div className="docs-layer-number">4</div>
                  <h4>Hydration Fixes</h4>
                  <span className="docs-layer-type">SSR Safety</span>
                </div>
                <p>
                  Prevents server-side rendering issues and hydration
                  mismatches.
                </p>
                <div className="docs-layer-fixes">
                  <span className="docs-fix-badge">typeof window guards</span>
                  <span className="docs-fix-badge">
                    localStorage protection
                  </span>
                  <span className="docs-fix-badge">Theme provider fixes</span>
                </div>
                <div className="docs-layer-dependency">
                  <strong>Dependencies:</strong> Layers 1-3 (needs components
                  fixed first)
                </div>
              </div>
            </div>

            <div className="docs-layer-arrow-down">↓</div>

            <div className="docs-layer-group framework">
              <h3>Framework Optimization</h3>
              <div className="docs-layer-card">
                <div className="docs-layer-header">
                  <div className="docs-layer-number">5</div>
                  <h4>Next.js App Router</h4>
                  <span className="docs-layer-type">Next.js</span>
                </div>
                <p>
                  Ensures compatibility with Next.js 13+ App Router and client
                  directives.
                </p>
                <div className="docs-layer-fixes">
                  <span className="docs-fix-badge">
                    "use client" directives
                  </span>
                  <span className="docs-fix-badge">App Router patterns</span>
                  <span className="docs-fix-badge">Import corrections</span>
                </div>
                <div className="docs-layer-dependency">
                  <strong>Dependencies:</strong> Layers 1-4 (needs SSR-safe
                  components)
                </div>
              </div>
            </div>

            <div className="docs-layer-arrow-down">↓</div>

            <div className="docs-layer-group quality">
              <h3>Quality & Testing</h3>
              <div className="docs-layer-card">
                <div className="docs-layer-header">
                  <div className="docs-layer-number">6</div>
                  <h4>Testing & Validation</h4>
                  <span className="docs-layer-type">Quality</span>
                </div>
                <p>
                  Adds error boundaries, testing improvements, and final quality
                  enhancements.
                </p>
                <div className="docs-layer-fixes">
                  <span className="docs-fix-badge">Error boundaries</span>
                  <span className="docs-fix-badge">TypeScript interfaces</span>
                  <span className="docs-fix-badge">
                    Performance optimizations
                  </span>
                </div>
                <div className="docs-layer-dependency">
                  <strong>Dependencies:</strong> Layers 1-5 (final polish on
                  complete system)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* When to Use Each Layer */}
        <div className="docs-section">
          <h2 id="when-to-use">When to Use Each Layer</h2>
          <p>
            Different scenarios call for different layer combinations. Here's a
            practical guide:
          </p>

          <div className="docs-scenario-grid">
            <div className="docs-scenario-card">
              <h4>New Project Setup</h4>
              <div className="docs-scenario-layers">
                <span className="docs-layer-badge">Layer 1</span>
              </div>
              <p>
                Starting a new project? Run Layer 1 to get modern TypeScript and
                Next.js configurations.
              </p>
              <div className="docs-scenario-command">
                <code>npm run fix-layer-1</code>
              </div>
            </div>

            <div className="docs-scenario-card">
              <h4>Legacy Codebase Modernization</h4>
              <div className="docs-scenario-layers">
                <span className="docs-layer-badge">All Layers</span>
              </div>
              <p>
                Inheriting old code? Run all layers for comprehensive
                modernization and safety improvements.
              </p>
              <div className="docs-scenario-command">
                <code>npm run fix-all</code>
              </div>
            </div>

            <div className="docs-scenario-card">
              <h4>HTML Entity Corruption</h4>
              <div className="docs-scenario-layers">
                <span className="docs-layer-badge">Layer 2</span>
              </div>
              <p>
                Code displaying weird characters? Layer 2 fixes HTML entity
                corruption.
              </p>
              <div className="docs-scenario-command">
                <code>npm run fix-layer-2</code>
              </div>
            </div>

            <div className="docs-scenario-card">
              <h4>React Key Props Missing</h4>
              <div className="docs-scenario-layers">
                <span className="docs-layer-badge">Layer 1</span>
                <span className="docs-layer-badge">Layer 3</span>
              </div>
              <p>
                Console warnings about missing keys? Run Layers 1+3 for proper
                React components.
              </p>
              <div className="docs-scenario-command">
                <code>npm run fix-layer-1 && npm run fix-layer-3</code>
              </div>
            </div>

            <div className="docs-scenario-card">
              <h4>SSR Hydration Errors</h4>
              <div className="docs-scenario-layers">
                <span className="docs-layer-badge">Layer 1-4</span>
              </div>
              <p>
                Hydration mismatches? Run Layers 1-4 for proper SSR safety
                guards.
              </p>
              <div className="docs-scenario-command">
                <code>npm run fix-layer-4</code>
              </div>
            </div>

            <div className="docs-scenario-card">
              <h4>Next.js App Router Migration</h4>
              <div className="docs-scenario-layers">
                <span className="docs-layer-badge">Layer 1-5</span>
              </div>
              <p>
                Upgrading to App Router? Layers 1-5 ensure full compatibility.
              </p>
              <div className="docs-scenario-command">
                <code>npm run fix-layer-5</code>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Selection Strategies */}
        <div className="docs-section">
          <h2 id="selection-strategies">Layer Selection Strategies</h2>

          <div className="docs-strategy-tabs">
            <div className="docs-strategy-tab">
              <h4>Auto-Detect (Recommended)</h4>
              <p>
                Let NeuroLint Pro analyze your code and automatically select the
                most relevant layers. This is the safest and most efficient
                approach for most projects.
              </p>
              <div className="docs-strategy-command">
                <code>npm run neurolint</code> (with no layer specification)
              </div>
              <div className="docs-strategy-benefits">
                <span className="docs-benefit-badge">
                  Intelligent selection
                </span>
                <span className="docs-benefit-badge">Optimal performance</span>
                <span className="docs-benefit-badge">Safe defaults</span>
              </div>
            </div>

            <div className="docs-strategy-tab">
              <h4>All Layers</h4>
              <p>
                Run the complete transformation pipeline. Best for major
                refactoring or modernizing legacy codebases. Takes longer but
                provides comprehensive improvements.
              </p>
              <div className="docs-strategy-command">
                <code>npm run fix-all</code>
              </div>
              <div className="docs-strategy-benefits">
                <span className="docs-benefit-badge">Complete coverage</span>
                <span className="docs-benefit-badge">Maximum improvement</span>
                <span className="docs-benefit-badge">One-time setup</span>
              </div>
            </div>

            <div className="docs-strategy-tab">
              <h4>Custom Selection</h4>
              <p>
                Pick specific layers based on your needs. Useful when you want
                to target particular types of issues or when working with
                well-maintained codebases.
              </p>
              <div className="docs-strategy-command">
                <code>node scripts/fix-master.js --layers 1,2,4</code>
              </div>
              <div className="docs-strategy-benefits">
                <span className="docs-benefit-badge">Targeted fixes</span>
                <span className="docs-benefit-badge">Fast execution</span>
                <span className="docs-benefit-badge">Full control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Considerations */}
        <div className="docs-section">
          <h2 id="performance">Performance & Timing</h2>
          <p>
            Understanding execution times helps you plan when to run different
            layer combinations:
          </p>

          <div className="docs-performance-table">
            <div className="docs-perf-header">
              <div className="docs-perf-cell">Layer</div>
              <div className="docs-perf-cell">Typical Time</div>
              <div className="docs-perf-cell">File Types</div>
              <div className="docs-perf-cell">Best For</div>
            </div>

            <div className="docs-perf-row">
              <div className="docs-perf-cell">
                <span className="docs-layer-badge small">1</span>
                Configuration
              </div>
              <div className="docs-perf-cell">2-5 seconds</div>
              <div className="docs-perf-cell">Config files only</div>
              <div className="docs-perf-cell">Project setup</div>
            </div>

            <div className="docs-perf-row">
              <div className="docs-perf-cell">
                <span className="docs-layer-badge small">2</span>
                Pattern Fixes
              </div>
              <div className="docs-perf-cell">10-30 seconds</div>
              <div className="docs-perf-cell">All source files</div>
              <div className="docs-perf-cell">Entity corruption</div>
            </div>

            <div className="docs-perf-row">
              <div className="docs-perf-cell">
                <span className="docs-layer-badge small">3</span>
                Components
              </div>
              <div className="docs-perf-cell">5-15 seconds</div>
              <div className="docs-perf-cell">React files</div>
              <div className="docs-perf-cell">Component quality</div>
            </div>

            <div className="docs-perf-row">
              <div className="docs-perf-cell">
                <span className="docs-layer-badge small">4</span>
                Hydration
              </div>
              <div className="docs-perf-cell">5-15 seconds</div>
              <div className="docs-perf-cell">SSR components</div>
              <div className="docs-perf-cell">Runtime safety</div>
            </div>

            <div className="docs-perf-row">
              <div className="docs-perf-cell">
                <span className="docs-layer-badge small">5</span>
                Next.js
              </div>
              <div className="docs-perf-cell">3-10 seconds</div>
              <div className="docs-perf-cell">Next.js files</div>
              <div className="docs-perf-cell">App Router compat</div>
            </div>

            <div className="docs-perf-row">
              <div className="docs-perf-cell">
                <span className="docs-layer-badge small">6</span>
                Testing
              </div>
              <div className="docs-perf-cell">5-20 seconds</div>
              <div className="docs-perf-cell">All files</div>
              <div className="docs-perf-cell">Quality polish</div>
            </div>

            <div className="docs-perf-row total">
              <div className="docs-perf-cell">
                <strong>All Layers</strong>
              </div>
              <div className="docs-perf-cell">
                <strong>30-95 seconds</strong>
              </div>
              <div className="docs-perf-cell">Entire codebase</div>
              <div className="docs-perf-cell">Complete modernization</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="docs-section">
          <h2 id="next-steps">Ready to Run Your First Layers?</h2>
          <p>
            Now that you understand the layer system, here's how to put it into
            practice:
          </p>

          <div className="docs-next-steps">
            <Link
              href="/docs/getting-started/first-fix"
              className="docs-next-step-card primary"
            >
              <div className="docs-next-step-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
              <h4>Run Your First Fix</h4>
              <p>Step-by-step guide to running layers and seeing results</p>
            </Link>

            <Link
              href="/docs/usage-guide/dry-runs-previews"
              className="docs-next-step-card"
            >
              <div className="docs-next-step-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h4>Preview Changes Safely</h4>
              <p>Learn dry-run mode to see what will change before applying</p>
            </Link>

            <Link
              href="/docs/layer-reference/layer-1-config"
              className="docs-next-step-card"
            >
              <div className="docs-next-step-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h4>Deep Dive Into Layers</h4>
              <p>Detailed documentation for each transformation layer</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/getting-started/first-fix"
            className="docs-nav-link prev"
          >
            ← Running Your First Fix
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/getting-started/safety-features"
            className="docs-nav-link next"
          >
            Safety Features Overview →
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

        .difficulty-beginner {
          color: var(--status-active);
          border-color: rgba(76, 175, 80, 0.3);
          background: rgba(76, 175, 80, 0.1);
        }

        .docs-page-content {
          max-width: 900px;
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

        .docs-highlight-box h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .docs-highlight-box p {
          margin: 0;
        }

        .docs-layer-flow-detailed {
          margin: 32px 0;
        }

        .docs-layer-group {
          margin-bottom: 32px;
        }

        .docs-layer-group h3 {
          font-size: 20px;
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
        }

        .docs-layer-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .docs-layer-group.foundation .docs-layer-card {
          border-color: rgba(76, 175, 80, 0.3);
          background: rgba(76, 175, 80, 0.05);
        }

        .docs-layer-group.cleanup .docs-layer-card {
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.05);
        }

        .docs-layer-group.enhancement .docs-layer-card {
          border-color: rgba(33, 150, 243, 0.3);
          background: rgba(33, 150, 243, 0.05);
        }

        .docs-layer-group.runtime .docs-layer-card {
          border-color: rgba(156, 39, 176, 0.3);
          background: rgba(156, 39, 176, 0.05);
        }

        .docs-layer-group.framework .docs-layer-card {
          border-color: rgba(255, 193, 7, 0.3);
          background: rgba(255, 193, 7, 0.05);
        }

        .docs-layer-group.quality .docs-layer-card {
          border-color: rgba(244, 67, 54, 0.3);
          background: rgba(244, 67, 54, 0.05);
        }

        .docs-layer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .docs-layer-number {
          width: 32px;
          height: 32px;
          background: #2196f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .docs-layer-header h4 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }

        .docs-layer-type {
          font-size: 12px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-layer-card p {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-layer-fixes {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .docs-fix-badge {
          font-size: 11px;
          padding: 4px 8px;
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          border-radius: 4px;
          font-weight: 500;
        }

        .docs-layer-dependency {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .docs-layer-arrow-down {
          text-align: center;
          font-size: 24px;
          color: rgba(255, 255, 255, 0.4);
          margin: 16px 0;
        }

        .docs-scenario-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-scenario-card {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-scenario-card h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
        }

        .docs-scenario-layers {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }

        .docs-layer-badge {
          font-size: 11px;
          padding: 4px 8px;
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          border-radius: 4px;
          font-weight: 600;
        }

        .docs-layer-badge.small {
          font-size: 10px;
          padding: 2px 6px;
        }

        .docs-scenario-card p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-scenario-command {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-strategy-tabs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-strategy-tab {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-strategy-tab h4 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .docs-strategy-tab p {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-strategy-command {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.3);
          padding: 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 12px;
        }

        .docs-strategy-benefits {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .docs-benefit-badge {
          font-size: 11px;
          padding: 4px 8px;
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border-radius: 4px;
          font-weight: 500;
        }

        .docs-performance-table {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          margin: 32px 0;
        }

        .docs-perf-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }

        .docs-perf-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .docs-perf-row:last-child {
          border-bottom: none;
        }

        .docs-perf-row.total {
          background: rgba(33, 150, 243, 0.1);
          border-top: 1px solid rgba(33, 150, 243, 0.3);
        }

        .docs-perf-cell {
          padding: 12px 16px;
          font-size: 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .docs-perf-cell:last-child {
          border-right: none;
        }

        .docs-next-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-next-step-card {
          display: block;
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          text-decoration: none;
          color: white;
          transition: all 0.2s ease;
        }

        .docs-next-step-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .docs-next-step-card.primary {
          border-color: var(--status-info);
          background: rgba(33, 150, 243, 0.1);
        }

        .docs-next-step-card.primary:hover {
          background: rgba(33, 150, 243, 0.15);
        }

        .docs-next-step-icon {
          margin-bottom: 12px;
          color: #2196f3;
        }

        .docs-next-step-card h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        .docs-next-step-card p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
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
          .docs-page-header {
            padding: 20px;
          }

          .docs-page-title {
            font-size: 36px;
          }

          .docs-page-content {
            padding: 40px 20px;
          }

          .docs-perf-header,
          .docs-perf-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .docs-perf-cell {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .docs-page-nav {
            padding: 20px;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
