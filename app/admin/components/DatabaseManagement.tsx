"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth-context";

interface DatabaseTable {
  name: string;
  rowCount: number;
  size: string;
  lastModified: string;
}

interface DatabaseStats {
  totalSize: string;
  totalTables: number;
  totalRows: number;
  connectionCount: number;
}

interface DatabaseManagementState {
  tables: DatabaseTable[];
  stats: DatabaseStats | null;
  loading: boolean;
  error: string | null;
  selectedTable: string | null;
  queryResult: any;
  queryLoading: boolean;
  maintenanceRunning: boolean;
}

export default function DatabaseManagement() {
  const { session } = useAuth();
  const [state, setState] = useState<DatabaseManagementState>({
    tables: [],
    stats: null,
    loading: true,
    error: null,
    selectedTable: null,
    queryResult: null,
    queryLoading: false,
    maintenanceRunning: false,
  });

  const [customQuery, setCustomQuery] = useState("");

  const fetchDatabaseData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/admin/database", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        tables: data.tables || [],
        stats: data.stats,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching database data:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      }));
    }
  };

  const executeQuery = async (query: string) => {
    setState((prev) => ({ ...prev, queryLoading: true }));

    try {
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/admin/database", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "execute_query", query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        queryResult: data,
        queryLoading: false,
      }));
    } catch (error) {
      console.error("Error executing query:", error);
      setState((prev) => ({
        ...prev,
        queryResult: {
          error: error instanceof Error ? error.message : String(error),
        },
        queryLoading: false,
      }));
    }
  };

  const runMaintenance = async (action: string) => {
    setState((prev) => ({ ...prev, maintenanceRunning: true }));

    try {
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/admin/database", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Maintenance completed successfully");
        fetchDatabaseData(); // Refresh data
      } else {
        alert(data.message || "Maintenance failed");
      }
    } catch (error) {
      console.error("Error running maintenance:", error);
      alert(
        `Maintenance failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setState((prev) => ({ ...prev, maintenanceRunning: false }));
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      fetchDatabaseData();
    }
  }, [session?.access_token]);

  const predefinedQueries = [
    {
      name: "User Statistics",
      query:
        "SELECT plan, COUNT(*) as count FROM profiles GROUP BY plan ORDER BY count DESC;",
    },
    {
      name: "Recent Analysis Activity",
      query:
        "SELECT DATE(created_at) as date, COUNT(*) as analyses FROM analysis_history WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY DATE(created_at) ORDER BY date DESC;",
    },
    {
      name: "Top API Key Usage",
      query:
        "SELECT name, usage_count, last_used FROM api_keys ORDER BY usage_count DESC LIMIT 10;",
    },
    {
      name: "Error Log Summary",
      query:
        "SELECT level, COUNT(*) as count FROM error_logs WHERE created_at >= NOW() - INTERVAL '24 hours' GROUP BY level ORDER BY count DESC;",
    },
  ];

  if (state.loading) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading database management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Database Management</h1>
        <p>Monitor database health, execute queries, and manage data</p>
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
        {/* Database Statistics */}
        {state.stats && (
          <div className="db-stats">
            <div className="stat-card">
              <h3>Total Size</h3>
              <div className="stat-value">{state.stats.totalSize}</div>
            </div>
            <div className="stat-card">
              <h3>Tables</h3>
              <div className="stat-value">{state.stats.totalTables}</div>
            </div>
            <div className="stat-card">
              <h3>Total Rows</h3>
              <div className="stat-value">
                {state.stats.totalRows.toLocaleString()}
              </div>
            </div>
            <div className="stat-card">
              <h3>Connections</h3>
              <div className="stat-value">{state.stats.connectionCount}</div>
            </div>
          </div>
        )}

        {/* Database Controls */}
        <div className="db-controls">
          <button
            onClick={fetchDatabaseData}
            disabled={state.loading}
            className="btn-secondary"
          >
            {state.loading ? "Refreshing..." : "Refresh"}
          </button>

          <div className="maintenance-actions">
            <button
              onClick={() => runMaintenance("vacuum")}
              disabled={state.maintenanceRunning}
              className="btn-secondary"
            >
              {state.maintenanceRunning ? "Running..." : "Vacuum Database"}
            </button>
            <button
              onClick={() => runMaintenance("analyze")}
              disabled={state.maintenanceRunning}
              className="btn-secondary"
            >
              Analyze Tables
            </button>
            <button
              onClick={() => runMaintenance("reindex")}
              disabled={state.maintenanceRunning}
              className="btn-secondary"
            >
              Reindex
            </button>
          </div>
        </div>

        {/* Tables Overview */}
        <div className="tables-section">
          <h3>Database Tables</h3>
          <div className="table-container">
            <table className="tables-table">
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th>Row Count</th>
                  <th>Size</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.tables.map((table) => (
                  <tr key={table.name}>
                    <td>
                      <button
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            selectedTable: table.name,
                          }))
                        }
                        className="table-name-btn"
                      >
                        {table.name}
                      </button>
                    </td>
                    <td>{table.rowCount.toLocaleString()}</td>
                    <td>{table.size}</td>
                    <td>{new Date(table.lastModified).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() =>
                          executeQuery(`SELECT * FROM ${table.name} LIMIT 100;`)
                        }
                        className="btn-icon"
                        title="View data"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          executeQuery(
                            `SELECT COUNT(*) as total FROM ${table.name};`,
                          )
                        }
                        className="btn-icon"
                        title="Count rows"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <polyline points="3 3 3 21 21 21" />
                          <path d="M7 12h4l3-8 4 8h3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Interface */}
        <div className="query-section">
          <h3>Query Interface</h3>

          {/* Predefined Queries */}
          <div className="predefined-queries">
            <h4>Predefined Queries</h4>
            <div className="query-buttons">
              {predefinedQueries.map((pq, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCustomQuery(pq.query);
                    executeQuery(pq.query);
                  }}
                  className="btn-outline"
                  disabled={state.queryLoading}
                >
                  {pq.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query */}
          <div className="custom-query">
            <h4>Custom Query</h4>
            <div className="query-input-container">
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="query-textarea"
                rows={6}
              />
              <div className="query-actions">
                <button
                  onClick={() => executeQuery(customQuery)}
                  disabled={!customQuery.trim() || state.queryLoading}
                  className="btn-primary"
                >
                  {state.queryLoading ? "Executing..." : "Execute Query"}
                </button>
                <button
                  onClick={() => setCustomQuery("")}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Query Results */}
          {state.queryResult && (
            <div className="query-results">
              <h4>Query Results</h4>
              {state.queryResult.error ? (
                <div className="error-result">
                  <strong>Error:</strong> {state.queryResult.error}
                </div>
              ) : (
                <div className="result-container">
                  {Array.isArray(state.queryResult.data) ? (
                    <div className="result-table-container">
                      <table className="result-table">
                        <thead>
                          <tr>
                            {state.queryResult.data.length > 0 &&
                              Object.keys(state.queryResult.data[0]).map(
                                (col) => <th key={col}>{col}</th>,
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {state.queryResult.data.map(
                            (row: any, index: number) => (
                              <tr key={index}>
                                {Object.values(row).map(
                                  (value: any, i: number) => (
                                    <td key={i}>
                                      {value === null ? (
                                        <span className="null-value">NULL</span>
                                      ) : typeof value === "object" ? (
                                        JSON.stringify(value)
                                      ) : (
                                        String(value)
                                      )}
                                    </td>
                                  ),
                                )}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                      <div className="result-info">
                        Returned {state.queryResult.data.length} row(s)
                      </div>
                    </div>
                  ) : (
                    <div className="result-text">
                      <pre>{JSON.stringify(state.queryResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Warning Notice */}
        <div className="db-warning">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>Warning:</strong> Database operations can affect system
            performance and data integrity. Always backup your data before
            running maintenance operations or executing modifying queries.
          </div>
        </div>
      </div>
    </div>
  );
}
