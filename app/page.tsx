import React from "react";

export default function HomePage() {
  return (
    <div className="container">
      <header>
        <h1>NeuroLint Pro</h1>
        <p>Premium React/Next.js Code Fixing Service</p>
      </header>

      <main>
        <section className="hero">
          <h2>Professional automated debugging service</h2>
          <p>
            Safely fixes HTML entities, missing key props, SSR issues, and more.
            Built on proven enterprise patterns - never corrupts your code.
          </p>
        </section>

        <section className="features">
          <h3>Features</h3>
          <ul>
            <li>Safe Layer Execution Pattern</li>
            <li>Layer Dependency Management</li>
            <li>Incremental Validation System</li>
            <li>Smart Layer Selection</li>
            <li>Error Recovery and Reporting</li>
          </ul>
        </section>
      </main>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: "Inter", sans-serif;
          background: #000;
          color: #fff;
          min-height: 100vh;
        }

        header {
          text-align: center;
          margin-bottom: 3rem;
        }

        h1 {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        .hero {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .features {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        li:before {
          content: "✓ ";
          color: #fff;
          font-weight: 600;
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}
