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
    </div>
  );
}
