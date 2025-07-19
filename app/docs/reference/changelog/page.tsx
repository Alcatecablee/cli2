"use client";

import React from "react";
import Link from "next/link";

export default function ChangelogPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#reference">Reference</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Changelog / Version History
          </span>
        </div>

        <h1 className="docs-page-title">Changelog</h1>
        <p className="docs-page-subtitle">
          Track new features, improvements, and breaking changes in NeuroLint
          Pro
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">5 min read</span>
          <span className="docs-meta-item difficulty-beginner">Beginner</span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        <div className="docs-section">
          <div className="docs-version">
            <div className="docs-version-header">
              <h2>v1.2.0</h2>
              <span className="docs-version-date">December 2024</span>
              <span className="docs-version-badge latest">Latest</span>
            </div>

            <div className="docs-changes">
              <div className="docs-change-group">
                <h4>New Features</h4>
                <ul>
                  <li>
                    Enhanced AST engine with improved React component analysis
                  </li>
                  <li>Added support for Next.js 14 App Router patterns</li>
                  <li>New Layer 6 testing and validation improvements</li>
                  <li>VSCode extension with real-time feedback</li>
                </ul>
              </div>

              <div className="docs-change-group">
                <h4>Improvements</h4>
                <ul>
                  <li>50% faster processing for large codebases</li>
                  <li>Improved HTML entity detection and fixing</li>
                  <li>Better error reporting and rollback mechanisms</li>
                  <li>Enhanced CLI output with progress indicators</li>
                </ul>
              </div>

              <div className="docs-change-group">
                <h4>Bug Fixes</h4>
                <ul>
                  <li>Fixed hydration mismatch detection in SSR components</li>
                  <li>Resolved TypeScript config modernization edge cases</li>
                  <li>
                    Improved key prop addition for complex list structures
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="docs-version">
            <div className="docs-version-header">
              <h2>v1.1.0</h2>
              <span className="docs-version-date">November 2024</span>
            </div>

            <div className="docs-changes">
              <div className="docs-change-group">
                <h4>New Features</h4>
                <ul>
                  <li>Web dashboard for browser-based analysis</li>
                  <li>Real-time collaboration features</li>
                  <li>Custom rule configuration system</li>
                  <li>GitHub integration for CI/CD workflows</li>
                </ul>
              </div>

              <div className="docs-change-group">
                <h4>Improvements</h4>
                <ul>
                  <li>
                    Enhanced layer orchestration with dependency management
                  </li>
                  <li>Improved backup and rollback capabilities</li>
                  <li>Better TypeScript support for complex generics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="docs-version">
            <div className="docs-version-header">
              <h2>v1.0.0</h2>
              <span className="docs-version-date">October 2024</span>
              <span className="docs-version-badge stable">Stable</span>
            </div>

            <div className="docs-changes">
              <div className="docs-change-group">
                <h4>Initial Release</h4>
                <ul>
                  <li>6-layer transformation system</li>
                  <li>React and Next.js support</li>
                  <li>CLI tool with dry-run capabilities</li>
                  <li>Comprehensive safety mechanisms</li>
                  <li>TypeScript and JavaScript support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Upgrade Guide</h2>
          <p>To upgrade to the latest version, run:</p>
          <div className="docs-code-block">
            <pre>
              <code>npm update -g @neurolint/cli</code>
            </pre>
          </div>
          <p>
            Check our{" "}
            <Link href="/docs/getting-started/installation">
              installation guide
            </Link>{" "}
            for detailed upgrade instructions.
          </p>
        </div>
      </div>

      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link href="/docs/reference/faq" className="docs-nav-link prev">
            ← FAQ
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link href="/docs" className="docs-nav-link next">
            Back to Docs →
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
          color: #2196f3;
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
          color: #4caf50;
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
        }

        .docs-section p {
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-version {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 32px;
        }

        .docs-version-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .docs-version-header h2 {
          margin: 0;
          font-size: 24px;
          color: white;
        }

        .docs-version-date {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .docs-version-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .docs-version-badge.latest {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }

        .docs-version-badge.stable {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
        }

        .docs-changes {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .docs-change-group h4 {
          margin: 0 0 12px 0;
          color: #2196f3;
          font-size: 16px;
          font-weight: 600;
        }

        .docs-change-group ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-change-group li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        .docs-code-block {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin: 16px 0;
          overflow: hidden;
        }

        .docs-code-block pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
        }

        .docs-code-block code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.5;
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

          .docs-version {
            padding: 20px;
          }

          .docs-version-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
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
