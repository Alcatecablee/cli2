"use client";

import React from "react";
import Link from "next/link";

export default function SupportedFrameworksPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#introduction">Introduction</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Supported Languages & Frameworks
          </span>
        </div>

        <h1 className="docs-page-title">Supported Languages & Frameworks</h1>
        <p className="docs-page-subtitle">
          React, Next.js, TypeScript compatibility and requirements
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">2 min read</span>
          <span className="docs-meta-item difficulty-beginner">Beginner</span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        <div className="docs-highlight-box info">
          <h3>Current Support</h3>
          <p>
            NeuroLint Pro is specialized for React and Next.js ecosystems with
            full TypeScript support. More frameworks coming soon based on
            community feedback.
          </p>
        </div>

        <div className="docs-section">
          <h2>Fully Supported</h2>

          <div className="docs-support-grid">
            <div className="docs-support-item supported">
              <h4>React</h4>
              <div className="docs-version-badge">16.8+</div>
              <p>
                Full support for functional components, hooks, and modern React
                patterns
              </p>
              <ul>
                <li>Function components</li>
                <li>React Hooks</li>
                <li>JSX/TSX</li>
                <li>Context API</li>
                <li>Suspense & Error Boundaries</li>
              </ul>
            </div>

            <div className="docs-support-item supported">
              <h4>Next.js</h4>
              <div className="docs-version-badge">12+</div>
              <p>
                Optimized for both Pages Router and App Router architectures
              </p>
              <ul>
                <li>App Router (13+)</li>
                <li>Pages Router</li>
                <li>Server Components</li>
                <li>Client Components</li>
                <li>API Routes</li>
              </ul>
            </div>

            <div className="docs-support-item supported">
              <h4>TypeScript</h4>
              <div className="docs-version-badge">4.0+</div>
              <p>
                Native TypeScript support with intelligent type-aware
                transformations
              </p>
              <ul>
                <li>Type definitions</li>
                <li>Interface updates</li>
                <li>Generic components</li>
                <li>Strict mode</li>
                <li>Module resolution</li>
              </ul>
            </div>

            <div className="docs-support-item supported">
              <h4>JavaScript</h4>
              <div className="docs-version-badge">ES6+</div>
              <p>Modern JavaScript with ES6+ features and module systems</p>
              <ul>
                <li>ES Modules</li>
                <li>Arrow functions</li>
                <li>Destructuring</li>
                <li>Template literals</li>
                <li>Async/await</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Coming Soon</h2>

          <div className="docs-support-grid">
            <div className="docs-support-item planned">
              <h4>Vue.js</h4>
              <div className="docs-status-badge planned">Planned</div>
              <p>Vue 3 composition API support with TypeScript integration</p>
            </div>

            <div className="docs-support-item planned">
              <h4>Angular</h4>
              <div className="docs-status-badge planned">Planned</div>
              <p>Angular 15+ with standalone components and modern patterns</p>
            </div>

            <div className="docs-support-item planned">
              <h4>Svelte</h4>
              <div className="docs-status-badge research">Research</div>
              <p>SvelteKit applications with TypeScript support</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>File Types & Extensions</h2>

          <div className="docs-file-types">
            <div className="docs-file-group">
              <h4>Supported Files</h4>
              <div className="docs-file-extensions">
                <span className="docs-file-ext">.jsx</span>
                <span className="docs-file-ext">.tsx</span>
                <span className="docs-file-ext">.js</span>
                <span className="docs-file-ext">.ts</span>
                <span className="docs-file-ext">.mjs</span>
                <span className="docs-file-ext">.cjs</span>
              </div>
            </div>

            <div className="docs-file-group">
              <h4>Configuration Files</h4>
              <div className="docs-file-extensions">
                <span className="docs-file-ext">tsconfig.json</span>
                <span className="docs-file-ext">next.config.js</span>
                <span className="docs-file-ext">package.json</span>
                <span className="docs-file-ext">.eslintrc.*</span>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Version Requirements</h2>

          <div className="docs-requirements">
            <div className="docs-requirement">
              <strong>Node.js:</strong> 16.0.0 or higher
            </div>
            <div className="docs-requirement">
              <strong>npm:</strong> 7.0.0 or higher (or yarn 1.22+)
            </div>
            <div className="docs-requirement">
              <strong>React:</strong> 16.8.0 or higher
            </div>
            <div className="docs-requirement">
              <strong>Next.js:</strong> 12.0.0 or higher (13+ recommended)
            </div>
            <div className="docs-requirement">
              <strong>TypeScript:</strong> 4.0.0 or higher (optional)
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Request Support for Your Framework</h2>
          <p>
            Don't see your framework listed? We're always expanding our support
            based on community needs. Let us know what you'd like to see
            supported next.
          </p>

          <div className="docs-request-support">
            <a
              href="https://github.com/neurolint/neurolint-pro/issues/new?template=framework-request.md"
              className="docs-support-request-btn"
            >
              Request Framework Support
            </a>
            <a
              href="https://github.com/neurolint/neurolint-pro/discussions"
              className="docs-support-discuss-btn"
            >
              Join Discussion
            </a>
          </div>
        </div>
      </div>

      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/introduction/why-rule-based"
            className="docs-nav-link prev"
          >
            ← Why Rule-Based?
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/introduction/vs-traditional-tools"
            className="docs-nav-link next"
          >
            vs Traditional Tools →
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

        .docs-section ul {
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

        .docs-highlight-box.info {
          background: rgba(33, 150, 243, 0.1);
          border-color: rgba(33, 150, 243, 0.3);
        }

        .docs-highlight-box h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: white;
        }

        .docs-highlight-box p {
          margin: 0;
        }

        .docs-support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-support-item {
          padding: 24px;
          border-radius: 12px;
          border: 1px solid;
          position: relative;
        }

        .docs-support-item.supported {
          background: rgba(76, 175, 80, 0.05);
          border-color: rgba(76, 175, 80, 0.3);
        }

        .docs-support-item.planned {
          background: rgba(255, 152, 0, 0.05);
          border-color: rgba(255, 152, 0, 0.3);
        }

        .docs-support-item h4 {
          margin: 0 0 8px 0;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .docs-support-item p {
          margin: 8px 0 16px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .docs-support-item ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-support-item li {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .docs-version-badge {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .docs-status-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .docs-status-badge.planned {
          background: rgba(255, 152, 0, 0.2);
          color: #ff9800;
        }

        .docs-status-badge.research {
          background: rgba(156, 39, 176, 0.2);
          color: #9c27b0;
        }

        .docs-file-types {
          margin: 32px 0;
        }

        .docs-file-group {
          margin-bottom: 24px;
        }

        .docs-file-group h4 {
          margin: 0 0 12px 0;
        }

        .docs-file-extensions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .docs-file-ext {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 6px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          color: #2196f3;
        }

        .docs-requirements {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
        }

        .docs-requirement {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-requirement:last-child {
          border-bottom: none;
        }

        .docs-requirement strong {
          color: white;
        }

        .docs-request-support {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin: 32px 0;
        }

        .docs-support-request-btn,
        .docs-support-discuss-btn {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .docs-support-request-btn {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          color: #2196f3;
        }

        .docs-support-request-btn:hover {
          background: rgba(33, 150, 243, 0.15);
          border-color: rgba(33, 150, 243, 0.5);
        }

        .docs-support-discuss-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }

        .docs-support-discuss-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
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

          .docs-support-grid {
            grid-template-columns: 1fr;
          }

          .docs-request-support {
            flex-direction: column;
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
