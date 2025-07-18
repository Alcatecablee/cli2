"use client";

import React from "react";
import Link from "next/link";

export default function WhatIsNeuroLintPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">📚 Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#introduction">🚀 Introduction</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            What is NeuroLint Pro?
          </span>
        </div>

        <h1 className="docs-page-title">🧠 What is NeuroLint Pro?</h1>
        <p className="docs-page-subtitle">
          Understanding the core concept and rule-based architecture that makes
          NeuroLint Pro unique
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">⏱️ 3 min read</span>
          <span className="docs-meta-item difficulty-beginner">
            🟢 Beginner
          </span>
          <span className="docs-meta-item">📝 Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        {/* Quick Answer */}
        <div className="docs-highlight-box success">
          <h3>💡 Quick Answer</h3>
          <p>
            NeuroLint Pro is a{" "}
            <strong>rule-based code transformation engine</strong> that
            automatically fixes React/Next.js codebases through a sophisticated
            6-layer system. It uses deterministic patterns and AST analysis -{" "}
            <strong>not artificial intelligence</strong> - to safely modernize
            your code.
          </p>
        </div>

        {/* Core Concept */}
        <div className="docs-section">
          <h2 id="core-concept">🎯 The Core Concept</h2>
          <p>
            NeuroLint Pro is fundamentally different from traditional linters
            like ESLint or formatters like Prettier. Instead of just{" "}
            <em>identifying</em> problems or <em>formatting</em> code, NeuroLint
            Pro <strong>transforms</strong>
            your codebase to fix real issues that would otherwise require manual
            intervention.
          </p>

          <div className="docs-comparison-grid">
            <div className="docs-comparison-item">
              <h4>❌ Traditional Linters</h4>
              <ul>
                <li>Point out problems</li>
                <li>Require manual fixes</li>
                <li>Limited auto-fixing</li>
                <li>Style-focused</li>
              </ul>
            </div>
            <div className="docs-comparison-item success">
              <h4>✅ NeuroLint Pro</h4>
              <ul>
                <li>Automatically fixes problems</li>
                <li>Handles complex transformations</li>
                <li>Comprehensive modernization</li>
                <li>Logic and safety-focused</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What Problems It Solves */}
        <div className="docs-section">
          <h2 id="problems-solved">🔧 What Problems Does It Solve?</h2>
          <p>
            NeuroLint Pro tackles the most time-consuming and error-prone issues
            in React/Next.js development:
          </p>

          <div className="docs-problem-grid">
            <div className="docs-problem-card">
              <div className="docs-problem-icon">🔧</div>
              <h4>Configuration Modernization</h4>
              <p>
                Updates outdated TypeScript configs, Next.js settings, and
                package.json scripts to modern standards.
              </p>
              <div className="docs-example">
                <strong>Example:</strong> <code>target: "es5"</code> →{" "}
                <code>target: "ES2020"</code>
              </div>
            </div>

            <div className="docs-problem-card">
              <div className="docs-problem-icon">🧹</div>
              <h4>HTML Entity Corruption</h4>
              <p>
                Fixes corrupted HTML entities that break string literals and JSX
                attributes.
              </p>
              <div className="docs-example">
                <strong>Example:</strong> <code>&amp;quot;Hello&amp;quot;</code>{" "}
                → <code>"Hello"</code>
              </div>
            </div>

            <div className="docs-problem-card">
              <div className="docs-problem-icon">⚛️</div>
              <h4>React Component Issues</h4>
              <p>
                Adds missing key props, fixes button variants, and improves
                accessibility.
              </p>
              <div className="docs-example">
                <strong>Example:</strong> <code>&lt;li&gt;</code> →{" "}
                <code>&lt;li key=&#123;item.id&#125;&gt;</code>
              </div>
            </div>

            <div className="docs-problem-card">
              <div className="docs-problem-icon">💧</div>
              <h4>Hydration Mismatches</h4>
              <p>
                Prevents SSR errors by adding proper guards for client-only
                APIs.
              </p>
              <div className="docs-example">
                <strong>Example:</strong> <code>localStorage.getItem()</code> →{" "}
                <code>
                  typeof window !== "undefined" && localStorage.getItem()
                </code>
              </div>
            </div>

            <div className="docs-problem-card">
              <div className="docs-problem-icon">🚀</div>
              <h4>Next.js App Router</h4>
              <p>
                Ensures compatibility with Next.js 13+ App Router patterns and
                client directives.
              </p>
              <div className="docs-example">
                <strong>Example:</strong> Adds <code>"use client"</code> to
                components using hooks
              </div>
            </div>

            <div className="docs-problem-card">
              <div className="docs-problem-icon">🛡️</div>
              <h4>Error Boundaries & Safety</h4>
              <p>
                Adds error handling, accessibility attributes, and performance
                optimizations.
              </p>
              <div className="docs-example">
                <strong>Example:</strong> Wraps risky components in error
                boundaries
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="docs-section">
          <h2 id="how-it-works">⚙️ How It Works: The 6-Layer System</h2>
          <p>
            NeuroLint Pro uses a{" "}
            <strong>sequential 6-layer transformation system</strong>. Each
            layer builds upon the previous one's work, ensuring safe and
            comprehensive code improvements:
          </p>

          <div className="docs-layer-flow">
            <div className="docs-layer-item">
              <div className="docs-layer-number">1</div>
              <div className="docs-layer-content">
                <h4>🔧 Configuration Fixes</h4>
                <p>Modernizes TypeScript, Next.js, and package.json settings</p>
              </div>
            </div>
            <div className="docs-layer-arrow">↓</div>

            <div className="docs-layer-item">
              <div className="docs-layer-number">2</div>
              <div className="docs-layer-content">
                <h4>🧹 Pattern Fixes</h4>
                <p>Cleans up HTML entities, imports, and legacy patterns</p>
              </div>
            </div>
            <div className="docs-layer-arrow">↓</div>

            <div className="docs-layer-item">
              <div className="docs-layer-number">3</div>
              <div className="docs-layer-content">
                <h4>⚛️ Component Fixes</h4>
                <p>Improves React components, keys, and accessibility</p>
              </div>
            </div>
            <div className="docs-layer-arrow">↓</div>

            <div className="docs-layer-item">
              <div className="docs-layer-number">4</div>
              <div className="docs-layer-content">
                <h4>💧 Hydration Fixes</h4>
                <p>Prevents SSR issues and hydration mismatches</p>
              </div>
            </div>
            <div className="docs-layer-arrow">↓</div>

            <div className="docs-layer-item">
              <div className="docs-layer-number">5</div>
              <div className="docs-layer-content">
                <h4>🚀 Next.js App Router</h4>
                <p>Ensures App Router compatibility and proper directives</p>
              </div>
            </div>
            <div className="docs-layer-arrow">↓</div>

            <div className="docs-layer-item">
              <div className="docs-layer-number">6</div>
              <div className="docs-layer-content">
                <h4>🛡️ Testing & Validation</h4>
                <p>Adds error boundaries, testing, and quality improvements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rule-Based Approach */}
        <div className="docs-section">
          <h2 id="rule-based-approach">📐 The Rule-Based Approach</h2>

          <div className="docs-highlight-box info">
            <h3>🎯 Why Rules, Not AI?</h3>
            <p>
              NeuroLint Pro uses{" "}
              <strong>deterministic transformation rules</strong> rather than
              machine learning. This approach provides several key advantages:
            </p>
          </div>

          <div className="docs-advantages-grid">
            <div className="docs-advantage-item">
              <div className="docs-advantage-icon">🎯</div>
              <h4>Predictable Results</h4>
              <p>
                Same input always produces the same output. No randomness or
                uncertainty.
              </p>
            </div>

            <div className="docs-advantage-item">
              <div className="docs-advantage-icon">🔍</div>
              <h4>Transparent Logic</h4>
              <p>
                You can understand exactly what each transformation does and
                why.
              </p>
            </div>

            <div className="docs-advantage-item">
              <div className="docs-advantage-icon">⚡</div>
              <h4>Fast Execution</h4>
              <p>No model inference needed - transformations run instantly.</p>
            </div>

            <div className="docs-advantage-item">
              <div className="docs-advantage-icon">🛡️</div>
              <h4>Safety Guaranteed</h4>
              <p>Rules are tested and validated to never corrupt your code.</p>
            </div>

            <div className="docs-advantage-item">
              <div className="docs-advantage-icon">🎛️</div>
              <h4>Full Control</h4>
              <p>
                You can customize, disable, or extend any transformation rule.
              </p>
            </div>

            <div className="docs-advantage-item">
              <div className="docs-advantage-icon">📊</div>
              <h4>Reliable Metrics</h4>
              <p>Accurate reporting of what was changed and why.</p>
            </div>
          </div>
        </div>

        {/* Safety First */}
        <div className="docs-section">
          <h2 id="safety-first">🛡️ Safety-First Architecture</h2>
          <p>
            Every transformation in NeuroLint Pro is designed with safety as the
            top priority:
          </p>

          <div className="docs-safety-features">
            <div className="docs-safety-item">
              <h4>🔍 Dry-Run Mode</h4>
              <p>Preview all changes before applying them to your code.</p>
            </div>

            <div className="docs-safety-item">
              <h4>✅ Incremental Validation</h4>
              <p>
                Each layer validates its changes before proceeding to the next.
              </p>
            </div>

            <div className="docs-safety-item">
              <h4>🔄 Automatic Rollback</h4>
              <p>
                If any transformation corrupts code, it's automatically
                reverted.
              </p>
            </div>

            <div className="docs-safety-item">
              <h4>📝 Complete Logging</h4>
              <p>Detailed logs show exactly what was changed and why.</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="docs-section">
          <h2 id="next-steps">🚀 Ready to Get Started?</h2>
          <p>
            Now that you understand what NeuroLint Pro is and how it works, here
            are the best next steps:
          </p>

          <div className="docs-next-steps">
            <Link
              href="/docs/introduction/why-rule-based"
              className="docs-next-step-card"
            >
              <div className="docs-next-step-icon">📐</div>
              <h4>Why Rule-Based (Not AI)?</h4>
              <p>
                Deep dive into the advantages of deterministic transformations
              </p>
            </Link>

            <Link
              href="/docs/getting-started/installation"
              className="docs-next-step-card primary"
            >
              <div className="docs-next-step-icon">🛠️</div>
              <h4>Installation & Setup</h4>
              <p>Get NeuroLint Pro running on your system in minutes</p>
            </Link>

            <Link
              href="/docs/getting-started/first-fix"
              className="docs-next-step-card"
            >
              <div className="docs-next-step-icon">⚡</div>
              <h4>Your First Fix</h4>
              <p>Complete walkthrough from problem to solution</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link href="/docs" className="docs-nav-link prev">
            ← Back to Documentation
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/introduction/why-rule-based"
            className="docs-nav-link next"
          >
            Why Rule-Based (Not AI)? →
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
          max-width: 800px;
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
          display: flex;
          align-items: center;
          gap: 8px;
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

        .docs-section ul,
        .docs-section ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .docs-section li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-highlight-box {
          padding: 24px;
          border-radius: 12px;
          margin: 32px 0;
          border: 1px solid;
        }

        .docs-highlight-box.success {
          background: rgba(76, 175, 80, 0.1);
          border-color: rgba(76, 175, 80, 0.3);
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

        .docs-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 32px 0;
        }

        .docs-comparison-item {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-comparison-item.success {
          border-color: rgba(76, 175, 80, 0.3);
          background: rgba(76, 175, 80, 0.05);
        }

        .docs-comparison-item h4 {
          margin: 0 0 16px 0;
        }

        .docs-comparison-item ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-comparison-item li {
          margin-bottom: 8px;
        }

        .docs-problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-problem-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .docs-problem-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .docs-problem-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .docs-problem-card h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-problem-card p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-example {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-family: "Monaco", "Menlo", monospace;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 4px;
        }

        .docs-layer-flow {
          margin: 32px 0;
        }

        .docs-layer-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .docs-layer-number {
          width: 40px;
          height: 40px;
          background: var(--status-info);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .docs-layer-content h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        .docs-layer-content p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-layer-arrow {
          text-align: center;
          font-size: 24px;
          color: rgba(255, 255, 255, 0.4);
          margin: 4px 0;
        }

        .docs-advantages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-advantage-item {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-advantage-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .docs-advantage-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-advantage-item p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-safety-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-safety-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-safety-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-safety-item p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
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
          font-size: 32px;
          margin-bottom: 12px;
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

          .docs-comparison-grid {
            grid-template-columns: 1fr;
          }

          .docs-layer-item {
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
