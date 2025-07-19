"use client";

import React from "react";
import Link from "next/link";

export default function VsTraditionalToolsPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#introduction">Introduction</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            NeuroLint vs Traditional Linters
          </span>
        </div>

        <h1 className="docs-page-title">NeuroLint vs Traditional Linters</h1>
        <p className="docs-page-subtitle">
          How NeuroLint Pro differs from ESLint, Prettier, and other traditional
          development tools
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">5 min read</span>
          <span className="docs-meta-item difficulty-intermediate">
            Intermediate
          </span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        {/* Quick Comparison */}
        <div className="docs-highlight-box info">
          <h3>Key Difference</h3>
          <p>
            Traditional linters like ESLint <strong>identify problems</strong>,
            while NeuroLint Pro{" "}
            <strong>automatically fixes complex issues</strong> that would
            otherwise require hours of manual work. It's not a replacement for
            your existing tools - it's a powerful complement that handles what
            they can't.
          </p>
        </div>

        {/* The Limitation Problem */}
        <div className="docs-section">
          <h2 id="limitation-problem">The Limitation of Traditional Tools</h2>
          <p>
            Modern development tools each serve specific purposes, but they all
            have significant limitations when it comes to complex code
            transformation and modernization:
          </p>

          <div className="docs-tool-comparison">
            <div className="docs-tool-card limitation">
              <div className="docs-tool-header">
                <div className="docs-tool-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M7.5 9.5L10 12L7.5 14.5" />
                    <path d="M16.5 9.5L14 12L16.5 14.5" />
                    <path d="M12 3a9 9 0 0 0-9 9v9h18v-9a9 9 0 0 0-9-9z" />
                  </svg>
                </div>
                <h4>ESLint</h4>
                <span className="docs-tool-type">Linter</span>
              </div>
              <div className="docs-tool-content">
                <h5>What it does well:</h5>
                <ul>
                  <li>Catches syntax errors and code style issues</li>
                  <li>Enforces team coding standards</li>
                  <li>Basic auto-fixing for simple patterns</li>
                </ul>
                <h5>What it can't do:</h5>
                <ul>
                  <li>Fix complex HTML entity corruption</li>
                  <li>Add missing React key props intelligently</li>
                  <li>Modernize TypeScript configurations</li>
                  <li>Handle SSR hydration mismatches</li>
                </ul>
              </div>
            </div>

            <div className="docs-tool-card limitation">
              <div className="docs-tool-header">
                <div className="docs-tool-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M4 7h16v2H4zm0 4h16v2H4zm0 4h7v2H4z" />
                  </svg>
                </div>
                <h4>Prettier</h4>
                <span className="docs-tool-type">Formatter</span>
              </div>
              <div className="docs-tool-content">
                <h5>What it does well:</h5>
                <ul>
                  <li>Consistent code formatting</li>
                  <li>Automated indentation and spacing</li>
                  <li>Quote and semicolon standardization</li>
                </ul>
                <h5>What it can't do:</h5>
                <ul>
                  <li>Transform code logic or structure</li>
                  <li>Fix functional issues or bugs</li>
                  <li>Modernize legacy patterns</li>
                  <li>Add safety guards for SSR</li>
                </ul>
              </div>
            </div>

            <div className="docs-tool-card limitation">
              <div className="docs-tool-header">
                <div className="docs-tool-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h4>TypeScript Compiler</h4>
                <span className="docs-tool-type">Type Checker</span>
              </div>
              <div className="docs-tool-content">
                <h5>What it does well:</h5>
                <ul>
                  <li>Type checking and inference</li>
                  <li>Compile-time error detection</li>
                  <li>Modern JavaScript transpilation</li>
                </ul>
                <h5>What it can't do:</h5>
                <ul>
                  <li>Fix component architectural issues</li>
                  <li>Add missing accessibility attributes</li>
                  <li>Modernize configuration files</li>
                  <li>Handle framework-specific patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* NeuroLint Pro Advantage */}
        <div className="docs-section">
          <h2 id="neurolint-advantage">The NeuroLint Pro Advantage</h2>
          <p>
            NeuroLint Pro was designed specifically to handle the complex
            transformations that traditional tools can't address. It operates at
            a higher level of abstraction, understanding your codebase's
            structure and applying sophisticated fixes:
          </p>

          <div className="docs-advantage-grid">
            <div className="docs-advantage-card">
              <div className="docs-advantage-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20m8-10H4" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h4>Architectural Intelligence</h4>
              <p>
                Understands React component patterns, Next.js App Router
                structure, and TypeScript relationships to make intelligent
                transformations.
              </p>
              <div className="docs-example-mini">
                <strong>Example:</strong> Automatically adds "use client"
                directives to components that use hooks
              </div>
            </div>

            <div className="docs-advantage-card">
              <div className="docs-advantage-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <h4>Multi-Layer Approach</h4>
              <p>
                Six specialized layers that build upon each other, ensuring
                comprehensive coverage from configuration to component
                optimization.
              </p>
              <div className="docs-example-mini">
                <strong>Example:</strong> Layer 1 modernizes configs, Layer 3
                uses those configs to fix components
              </div>
            </div>

            <div className="docs-advantage-card">
              <div className="docs-advantage-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4>Safety-First Design</h4>
              <p>
                Built-in validation, rollback mechanisms, and dry-run
                capabilities ensure your code is never corrupted during
                transformation.
              </p>
              <div className="docs-example-mini">
                <strong>Example:</strong> Each layer validates its changes
                before proceeding to the next
              </div>
            </div>

            <div className="docs-advantage-card">
              <div className="docs-advantage-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                  <polyline points="7.5 19.79 7.5 14.6 3 12" />
                  <polyline points="21 12 16.5 14.6 16.5 19.79" />
                  <polyline points="12 22.08 12 17" />
                </svg>
              </div>
              <h4>Context-Aware Fixes</h4>
              <p>
                Analyzes the entire project context to make informed decisions
                about transformations, not just isolated pattern matching.
              </p>
              <div className="docs-example-mini">
                <strong>Example:</strong> Adds proper key props based on data
                structure and mapping context
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="docs-section">
          <h2 id="detailed-comparison">Detailed Feature Comparison</h2>
          <p>
            Here's how NeuroLint Pro compares to traditional tools across key
            capabilities:
          </p>

          <div className="docs-comparison-table">
            <div className="docs-table-header">
              <div className="docs-table-cell feature">Feature</div>
              <div className="docs-table-cell">ESLint</div>
              <div className="docs-table-cell">Prettier</div>
              <div className="docs-table-cell">TypeScript</div>
              <div className="docs-table-cell neurolint">NeuroLint Pro</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">Code Formatting</div>
              <div className="docs-table-cell">Basic</div>
              <div className="docs-table-cell">Excellent</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Good</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">
                Syntax Error Detection
              </div>
              <div className="docs-table-cell">Excellent</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">Excellent</div>
              <div className="docs-table-cell neurolint">Good</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">HTML Entity Fixes</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Excellent</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">Missing Key Props</div>
              <div className="docs-table-cell">Detection Only</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Auto-Fix</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">
                SSR Hydration Safety
              </div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Excellent</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">
                Config Modernization
              </div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Excellent</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">
                Component Accessibility
              </div>
              <div className="docs-table-cell">Basic Rules</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Auto-Enhancement</div>
            </div>

            <div className="docs-table-row">
              <div className="docs-table-cell feature">Next.js App Router</div>
              <div className="docs-table-cell">Basic Rules</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell">None</div>
              <div className="docs-table-cell neurolint">Specialized</div>
            </div>
          </div>
        </div>

        {/* Workflow Integration */}
        <div className="docs-section">
          <h2 id="workflow-integration">Workflow Integration</h2>
          <p>
            NeuroLint Pro is designed to work <em>alongside</em> your existing
            tools, not replace them. Here's how it fits into a modern
            development workflow:
          </p>

          <div className="docs-workflow">
            <div className="docs-workflow-step">
              <div className="docs-workflow-number">1</div>
              <div className="docs-workflow-content">
                <h4>Write Code</h4>
                <p>
                  Develop features using your normal workflow with your IDE and
                  preferred tools.
                </p>
              </div>
            </div>

            <div className="docs-workflow-step">
              <div className="docs-workflow-number">2</div>
              <div className="docs-workflow-content">
                <h4>Run NeuroLint Pro</h4>
                <p>
                  Use NeuroLint Pro to automatically fix complex issues and
                  modernize patterns.
                </p>
                <div className="docs-workflow-tools">
                  <span className="docs-tool-badge">HTML Entities</span>
                  <span className="docs-tool-badge">Missing Keys</span>
                  <span className="docs-tool-badge">SSR Guards</span>
                </div>
              </div>
            </div>

            <div className="docs-workflow-step">
              <div className="docs-workflow-number">3</div>
              <div className="docs-workflow-content">
                <h4>Traditional Tools</h4>
                <p>
                  Run your existing linting and formatting tools for final
                  polish.
                </p>
                <div className="docs-workflow-tools">
                  <span className="docs-tool-badge">ESLint</span>
                  <span className="docs-tool-badge">Prettier</span>
                  <span className="docs-tool-badge">TypeScript</span>
                </div>
              </div>
            </div>

            <div className="docs-workflow-step">
              <div className="docs-workflow-number">4</div>
              <div className="docs-workflow-content">
                <h4>Commit & Deploy</h4>
                <p>
                  Your code is now modernized, safe, and properly formatted for
                  production.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* When to Use Each Tool */}
        <div className="docs-section">
          <h2 id="when-to-use">When to Use Each Tool</h2>

          <div className="docs-usage-guide">
            <div className="docs-usage-card">
              <h4>Use ESLint when:</h4>
              <ul>
                <li>Setting up coding standards for your team</li>
                <li>Catching basic syntax and logic errors</li>
                <li>Enforcing consistent code patterns</li>
                <li>Running continuous validation in CI/CD</li>
              </ul>
            </div>

            <div className="docs-usage-card">
              <h4>Use Prettier when:</h4>
              <ul>
                <li>Standardizing code formatting across your team</li>
                <li>Automatically fixing indentation and spacing</li>
                <li>Eliminating formatting discussions in code reviews</li>
                <li>Setting up consistent style in your editor</li>
              </ul>
            </div>

            <div className="docs-usage-card">
              <h4>Use TypeScript when:</h4>
              <ul>
                <li>Adding type safety to JavaScript projects</li>
                <li>Catching type-related bugs at compile time</li>
                <li>Improving IDE intellisense and refactoring</li>
                <li>Building large, maintainable applications</li>
              </ul>
            </div>

            <div className="docs-usage-card highlight">
              <h4>Use NeuroLint Pro when:</h4>
              <ul>
                <li>Modernizing legacy React/Next.js codebases</li>
                <li>Fixing complex HTML entity corruption</li>
                <li>Adding missing React key props automatically</li>
                <li>Implementing SSR safety guards</li>
                <li>Upgrading to Next.js App Router patterns</li>
                <li>Enhancing accessibility systematically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="docs-section">
          <h2 id="next-steps">Ready to See the Difference?</h2>
          <p>
            Now that you understand how NeuroLint Pro complements your existing
            tools, see it in action:
          </p>

          <div className="docs-next-steps">
            <Link
              href="/docs/getting-started/installation"
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
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h4>Try NeuroLint Pro</h4>
              <p>Install and run your first transformation in minutes</p>
            </Link>

            <Link
              href="/docs/getting-started/first-fix"
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
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
              <h4>See Before & After</h4>
              <p>Real examples of complex problems solved automatically</p>
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
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <h4>Explore All Layers</h4>
              <p>Deep dive into each transformation layer</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/introduction/supported-frameworks"
            className="docs-nav-link prev"
          >
            ← Supported Languages & Frameworks
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/getting-started/installation"
            className="docs-nav-link next"
          >
            Installation & Requirements →
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

        .docs-section h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: white;
        }

        .docs-section h5 {
          font-size: 16px;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-section p {
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-section ul {
          margin: 12px 0;
          padding-left: 24px;
        }

        .docs-section li {
          margin-bottom: 6px;
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

        .docs-tool-comparison {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-tool-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .docs-tool-card.limitation {
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.05);
        }

        .docs-tool-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .docs-tool-icon {
          color: #2196f3;
        }

        .docs-tool-type {
          font-size: 12px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
        }

        .docs-tool-content h5 {
          margin: 16px 0 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-tool-content ul {
          margin: 0 0 16px 0;
          padding-left: 16px;
        }

        .docs-tool-content li {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .docs-advantage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-advantage-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-advantage-icon {
          color: #2196f3;
          margin-bottom: 12px;
        }

        .docs-advantage-card h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
        }

        .docs-advantage-card p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-example-mini {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-family: "Monaco", "Menlo", monospace;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 4px;
          margin-top: 8px;
        }

        .docs-comparison-table {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          margin: 32px 0;
        }

        .docs-table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .docs-table-row:last-child {
          border-bottom: none;
        }

        .docs-table-cell {
          padding: 12px 16px;
          font-size: 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .docs-table-cell:last-child {
          border-right: none;
        }

        .docs-table-cell.feature {
          font-weight: 600;
          color: white;
        }

        .docs-table-cell.neurolint {
          background: rgba(33, 150, 243, 0.1);
          color: #2196f3;
          font-weight: 600;
        }

        .docs-workflow {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 32px 0;
        }

        .docs-workflow-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-workflow-number {
          width: 40px;
          height: 40px;
          background: #2196f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .docs-workflow-content h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        .docs-workflow-content p {
          margin: 0 0 12px 0;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-workflow-tools {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .docs-tool-badge {
          font-size: 12px;
          padding: 4px 8px;
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          border-radius: 4px;
          font-weight: 500;
        }

        .docs-usage-guide {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-usage-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-usage-card.highlight {
          border-color: rgba(33, 150, 243, 0.3);
          background: rgba(33, 150, 243, 0.05);
        }

        .docs-usage-card h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: white;
        }

        .docs-usage-card ul {
          margin: 0;
          padding-left: 16px;
        }

        .docs-usage-card li {
          font-size: 14px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
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

        em {
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
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

          .docs-table-header,
          .docs-table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .docs-table-cell {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .docs-workflow {
            gap: 12px;
          }

          .docs-workflow-step {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
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
