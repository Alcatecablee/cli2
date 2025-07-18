"use client";

import React, { useState } from "react";
import { useAdminAuth, logAdminAction, reportError } from "../utils/auth";

interface SetupState {
  loading: boolean;
  error: string | null;
  success: boolean;
  results: Array<{
    operation?: string;
    sql?: string;
    success?: boolean;
    error?: string;
    details?: string;
  }>;
  instructions?: {
    message: string;
    tables: string[];
    note?: string;
  };
  summary?: {
    totalChecks: number;
    passed: number;
    failed: number;
    recommendation: string;
  };
}

export default function AdminSetup() {
  const { adminFetch } = useAdminAuth();
  const [state, setState] = useState<SetupState>({
    loading: false,
    error: null,
    success: false,
    results: [],
  });

  const runSetup = async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const response = await adminFetch("/api/admin/setup-debug", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        loading: false,
        success: data.success,
        results: data.results || [],
        instructions: data.instructions,
        summary: data.summary,
      }));

      // Log successful setup
      await logAdminAction("setup_database", "system", undefined, {
        results: data.results,
      });
    } catch (error) {
      console.error("Setup error:", error);
      let errorMessage = error instanceof Error ? error.message : String(error);

      // Provide more helpful error messages
      if (errorMessage.includes("HTTP 500")) {
        errorMessage =
          "Server error occurred. This might be due to missing environment variables or database configuration issues.";
      } else if (errorMessage.includes("HTTP 401")) {
        errorMessage =
          "Authentication failed. Please make sure you're logged in as an admin user.";
      } else if (errorMessage.includes("HTTP 403")) {
        errorMessage =
          "Access denied. You need admin permissions to run setup.";
      }

      await reportError(
        error instanceof Error ? error : new Error(errorMessage),
        "error",
        {
          action: "setup_database",
          originalError: error instanceof Error ? error.message : String(error),
        },
      );

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  return (
    <div className="admin-setup">
      <div className="setup-header">
        <h2>Admin System Check</h2>
        <p>Verify your system configuration and admin dashboard setup</p>
      </div>

      {state.error && (
        <div className="error-banner">
          <span>Setup Error: {state.error}</span>
          <button
            onClick={() => setState((prev) => ({ ...prev, error: null }))}
          >
            Dismiss
          </button>
        </div>
      )}

      {state.success && (
        <div className="success-banner">
          <span>Setup verification completed successfully!</span>
        </div>
      )}

      {state.summary && (
        <div className="setup-summary">
          <h3>Setup Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value success">{state.summary.passed}</span>
              <span className="stat-label">Passed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value error">{state.summary.failed}</span>
              <span className="stat-label">Failed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{state.summary.totalChecks}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <p className="recommendation">{state.summary.recommendation}</p>
        </div>
      )}

      <div className="setup-actions">
        <button
          onClick={runSetup}
          disabled={state.loading}
          className="btn-primary"
        >
          {state.loading ? "Setting up..." : "Run Setup Check"}
        </button>

        <button
          onClick={() => {
            // Simple connectivity test
            fetch("/api/health")
              .then((response) => response.json())
              .then((data) => console.log("Health check:", data))
              .catch((error) => console.error("Health check failed:", error));
          }}
          className="btn-secondary"
          disabled={state.loading}
        >
          Test API Connection
        </button>
      </div>

      {state.results.length > 0 && (
        <div className="setup-results">
          <h3>Setup Results</h3>
          <div className="results-list">
            {state.results.map((result, index) => (
              <div
                key={index}
                className={`result-item ${result.success ? "success" : "error"}`}
              >
                <div className="result-operation">
                  <strong>{result.operation || result.sql}</strong>
                </div>
                {result.details && (
                  <div className="result-details">{result.details}</div>
                )}
                {result.error && (
                  <div className="result-error">Error: {result.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {state.instructions && (
        <div className="setup-instructions">
          <h3>Setup Instructions</h3>
          <p>{state.instructions.message}</p>
          {state.instructions.tables &&
            state.instructions.tables.length > 0 && (
              <div className="manual-tables">
                <h4>Tables to create manually:</h4>
                <ul>
                  {state.instructions.tables.map((table, index) => (
                    <li key={index}>
                      <code>{table}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      <div className="setup-info">
        <h3>What this setup includes:</h3>
        <ul>
          <li>API Keys table with rate limiting</li>
          <li>Error Logs table for system monitoring</li>
          <li>Admin Configuration table</li>
          <li>Admin Audit Log for tracking admin actions</li>
          <li>System Health Log for performance metrics</li>
          <li>Notification Queue for alerts</li>
          <li>Row Level Security (RLS) policies</li>
          <li>Database indexes for performance</li>
          <li>Update triggers for timestamps</li>
        </ul>
      </div>

      <style jsx>{`
        .admin-setup {
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .setup-header {
          margin-bottom: 24px;
        }

        .setup-header h2 {
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .setup-header p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .success-banner {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4caf50;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .setup-actions {
          margin-bottom: 32px;
        }

        .setup-results {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .setup-results h3 {
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .result-item {
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .result-item.success {
          background: rgba(76, 175, 80, 0.1);
          border-left-color: #4caf50;
        }

        .result-item.error {
          background: rgba(244, 67, 54, 0.1);
          border-left-color: #f44336;
        }

        .result-operation {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 4px;
        }

        .result-details {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }

        .result-sql {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .result-error {
          margin-top: 8px;
          font-size: 0.8rem;
          color: #f44336;
        }

        .setup-summary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .setup-summary h3 {
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .summary-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ffffff;
        }

        .stat-value.success {
          color: #4caf50;
        }

        .stat-value.error {
          color: #f44336;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .recommendation {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-style: italic;
        }

        .setup-instructions {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .setup-instructions h3 {
          color: #2196f3;
          margin: 0 0 16px 0;
        }

        .setup-instructions p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 16px 0;
        }

        .manual-tables h4 {
          color: rgba(255, 255, 255, 0.9);
          margin: 16px 0 8px 0;
        }

        .manual-tables code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }

        .setup-info {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .setup-info h3 {
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .setup-info ul {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          padding-left: 20px;
        }

        .setup-info li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
