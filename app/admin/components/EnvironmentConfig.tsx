"use client";

import React, { useState, useEffect } from "react";

interface EnvironmentVariable {
  key: string;
  value: string;
  description?: string;
  required?: boolean;
}

interface EnvironmentConfigState {
  variables: Record<string, string>;
  loading: boolean;
  error: string | null;
  saving: boolean;
  testResults: Record<string, any>;
  testing: boolean;
}

export default function EnvironmentConfig() {
  const [state, setState] = useState<EnvironmentConfigState>({
    variables: {},
    loading: true,
    error: null,
    saving: false,
    testResults: {},
    testing: false,
  });

  const environmentGroups = {
    database: {
      title: "Database Configuration",
      variables: [
        {
          key: "SUPABASE_URL",
          description: "Supabase project URL",
          required: true,
        },
        {
          key: "SUPABASE_ANON_KEY",
          description: "Supabase anonymous key",
          required: true,
        },
        {
          key: "SUPABASE_SERVICE_ROLE_KEY",
          description: "Supabase service role key",
          required: true,
        },
      ],
    },
    auth: {
      title: "Authentication",
      variables: [
        {
          key: "NEXTAUTH_SECRET",
          description: "NextAuth secret key",
          required: true,
        },
        {
          key: "NEXTAUTH_URL",
          description: "Application base URL",
          required: true,
        },
      ],
    },
    payment: {
      title: "Payment Integration",
      variables: [
        {
          key: "PAYPAL_CLIENT_ID",
          description: "PayPal client ID",
          required: false,
        },
        {
          key: "PAYPAL_CLIENT_SECRET",
          description: "PayPal client secret",
          required: false,
        },
      ],
    },
    github: {
      title: "GitHub Integration",
      variables: [
        {
          key: "GITHUB_CLIENT_ID",
          description: "GitHub OAuth app client ID",
          required: false,
        },
        {
          key: "GITHUB_CLIENT_SECRET",
          description: "GitHub OAuth app client secret",
          required: false,
        },
      ],
    },
    email: {
      title: "Email Configuration",
      variables: [
        {
          key: "SMTP_HOST",
          description: "SMTP server hostname",
          required: false,
        },
        { key: "SMTP_PORT", description: "SMTP server port", required: false },
        { key: "SMTP_USER", description: "SMTP username", required: false },
        { key: "SMTP_PASS", description: "SMTP password", required: false },
      ],
    },
    application: {
      title: "Application Settings",
      variables: [
        { key: "NODE_ENV", description: "Node.js environment", required: true },
        { key: "PORT", description: "Application port", required: false },
        {
          key: "NEUROLINT_API_URL",
          description: "NeuroLint API endpoint",
          required: false,
        },
        {
          key: "NEUROLINT_API_KEY",
          description: "NeuroLint API key",
          required: false,
        },
      ],
    },
  };

  const fetchEnvironmentVariables = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/environment", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        variables: data.environment || {},
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching environment variables:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchEnvironmentVariables();
  }, []);

  const handleVariableChange = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      variables: {
        ...prev.variables,
        [key]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setState((prev) => ({ ...prev, saving: true, error: null }));

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      // Only send variables that have been changed and are not "[SET]" placeholders
      const updates = Object.entries(state.variables)
        .filter(([key, value]) => value !== "[SET]" && value !== "[NOT SET]")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const response = await fetch("/api/admin/environment", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        saving: false,
      }));

      // Show success message
      alert(data.message || "Configuration updated successfully");
    } catch (error) {
      console.error("Error saving environment variables:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        saving: false,
      }));
    }
  };

  const testConfiguration = async (testType: string) => {
    setState((prev) => ({ ...prev, testing: true }));

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/environment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: testType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          [testType]: data,
        },
        testing: false,
      }));
    } catch (error) {
      console.error("Error testing configuration:", error);
      setState((prev) => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          [testType]: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
        testing: false,
      }));
    }
  };

  const getVariableStatus = (key: string, value: string) => {
    if (value === "[SET]") return "configured";
    if (value === "[NOT SET]") return "missing";
    if (value) return "configured";
    return "empty";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "configured":
        return (
          <svg
            className="status-icon status-success"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case "missing":
        return (
          <svg
            className="status-icon status-error"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case "empty":
        return (
          <svg
            className="status-icon status-warning"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (state.loading) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading environment configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Environment Configuration</h1>
        <p>Manage environment variables and system credentials</p>
      </div>

      {state.error && (
        <div className="error-banner">
          <span>Error: {state.error}</span>
          <button
            onClick={() => setState((prev) => ({ ...prev, error: null }))}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="content-body">
        <div className="env-controls">
          <button
            onClick={handleSaveChanges}
            disabled={state.saving}
            className="btn-primary"
          >
            {state.saving ? "Saving..." : "Save Changes"}
          </button>

          <div className="test-buttons">
            <button
              onClick={() => testConfiguration("test_database")}
              disabled={state.testing}
              className="btn-secondary"
            >
              Test Database
            </button>
            <button
              onClick={() => testConfiguration("test_auth")}
              disabled={state.testing}
              className="btn-secondary"
            >
              Test Auth
            </button>
          </div>
        </div>

        {/* Test Results */}
        {Object.keys(state.testResults).length > 0 && (
          <div className="test-results">
            <h3>Test Results</h3>
            {Object.entries(state.testResults).map(([test, result]) => (
              <div key={test} className="test-result">
                <strong>
                  {test.replace("test_", "").replace("_", " ").toUpperCase()}:
                </strong>
                {result.error ? (
                  <span className="result-error">Failed - {result.error}</span>
                ) : (
                  <span className="result-success">Success</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Environment Variable Groups */}
        <div className="env-groups">
          {Object.entries(environmentGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="env-group">
              <h3>{group.title}</h3>
              <div className="env-variables">
                {group.variables.map((variable) => {
                  const currentValue = state.variables[variable.key] || "";
                  const status = getVariableStatus(variable.key, currentValue);

                  return (
                    <div key={variable.key} className="env-variable">
                      <div className="variable-header">
                        <label className="variable-label">
                          {getStatusIcon(status)}
                          {variable.key}
                          {variable.required && (
                            <span className="required">*</span>
                          )}
                        </label>
                      </div>

                      <input
                        type={
                          variable.key.toLowerCase().includes("secret") ||
                          variable.key.toLowerCase().includes("key") ||
                          variable.key.toLowerCase().includes("pass")
                            ? "password"
                            : "text"
                        }
                        value={
                          currentValue === "[SET]" ||
                          currentValue === "[NOT SET]"
                            ? ""
                            : currentValue
                        }
                        onChange={(e) =>
                          handleVariableChange(variable.key, e.target.value)
                        }
                        placeholder={
                          currentValue === "[SET]"
                            ? "Value is set (leave empty to keep current)"
                            : currentValue === "[NOT SET]"
                              ? "Not configured"
                              : "Enter value..."
                        }
                        className="variable-input"
                      />

                      {variable.description && (
                        <p className="variable-description">
                          {variable.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="env-footer">
          <div className="warning-notice">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>Important:</strong> Changes to environment variables may
              require a server restart to take effect. Some changes are stored
              in the database configuration and will be applied immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
