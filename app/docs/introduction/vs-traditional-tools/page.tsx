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
          How NeuroLint Pro differs from ESLint, Prettier, and other tools
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
        <div className="docs-section">
          <h2>Traditional Linting vs Code Transformation</h2>

          <div className="docs-comparison-table">
            <div className="docs-comparison-header">
              <div className="docs-comparison-col">Traditional Tools</div>
              <div className="docs-comparison-col">NeuroLint Pro</div>
            </div>

            <div className="docs-comparison-row">
              <div className="docs-comparison-col">
                <strong>ESLint</strong>
                <p>Identifies code quality issues and style violations</p>
              </div>
              <div className="docs-comparison-col">
                <strong>Automatic Fixes</strong>
                <p>Transforms code to resolve complex architectural issues</p>
              </div>
            </div>

            <div className="docs-comparison-row">
              <div className="docs-comparison-col">
                <strong>Prettier</strong>
                <p>Formats code for consistent styling</p>
              </div>
              <div className="docs-comparison-col">
                <strong>Intelligent Modernization</strong>
                <p>Updates patterns and dependencies for modern standards</p>
              </div>
            </div>

            <div className="docs-comparison-row">
              <div className="docs-comparison-col">
                <strong>Manual Fixes Required</strong>
                <p>Developers must implement suggested changes</p>
              </div>
              <div className="docs-comparison-col">
                <strong>Automated Implementation</strong>
                <p>Safely applies transformations with rollback capability</p>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>When to Use Each Tool</h2>

          <div className="docs-use-cases">
            <div className="docs-use-case">
              <h3>Use Traditional Linters For:</h3>
              <ul>
                <li>Code style enforcement</li>
                <li>Basic syntax checking</li>
                <li>Team coding standards</li>
                <li>Real-time development feedback</li>
              </ul>
            </div>

            <div className="docs-use-case highlight">
              <h3>Use NeuroLint Pro For:</h3>
              <ul>
                <li>Legacy code modernization</li>
                <li>Framework migrations</li>
                <li>Complex refactoring projects</li>
                <li>Production code improvements</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Complementary Tools</h2>
          <p>
            NeuroLint Pro works alongside traditional linters rather than
            replacing them. Use both for comprehensive code quality management.
          </p>
        </div>
      </div>

      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/introduction/supported-frameworks"
            className="docs-nav-link prev"
          >
            ← Supported Frameworks
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/getting-started/installation"
            className="docs-nav-link next"
          >
            Installation →
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

        .difficulty-intermediate {
          color: #ff9800;
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.1);
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

        .docs-section h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: white;
        }

        .docs-section p {
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-section ul {
          margin: 16px 0;
          padding-left: 24px;
        }

        .docs-section li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-comparison-table {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          margin: 32px 0;
        }

        .docs-comparison-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-comparison-header .docs-comparison-col {
          padding: 16px 20px;
          font-weight: 600;
          text-align: center;
          color: white;
        }

        .docs-comparison-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .docs-comparison-row:last-child {
          border-bottom: none;
        }

        .docs-comparison-row .docs-comparison-col {
          padding: 20px;
        }

        .docs-comparison-row .docs-comparison-col strong {
          display: block;
          color: white;
          margin-bottom: 8px;
        }

        .docs-comparison-row .docs-comparison-col p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-use-cases {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 32px 0;
        }

        .docs-use-case {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-use-case.highlight {
          border-color: rgba(33, 150, 243, 0.3);
          background: rgba(33, 150, 243, 0.05);
        }

        .docs-use-case h3 {
          margin: 0 0 16px 0;
          color: white;
        }

        .docs-use-case ul {
          margin: 0;
          padding-left: 20px;
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

          .docs-comparison-header,
          .docs-comparison-row {
            grid-template-columns: 1fr;
          }

          .docs-use-cases {
            grid-template-columns: 1fr;
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
