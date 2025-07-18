"use client";

import React, { useState, useEffect } from "react";

interface SystemData {
  system: {
    server: {
      platform: string;
      arch: string;
      nodeVersion: string;
      uptime: number;
      memory: {
        total: number;
        free: number;
        used: number;
        processUsage: number;
      };
      cpu: {
        cores: number;
        model: string;
        loadAverage: number[];
      };
    };
    environment: {
      nodeEnv: string;
      port: string;
      timezone: string;
    };
  };
  database: {
    connected: boolean;
    responseTime: number;
    error: string | null;
  };
  apis: Array<{
    name: string;
    status: string;
    responseTime: number;
    statusCode?: number;
    error?: string;
  }>;
  errors: Array<{
    id: string;
    message: string;
    level: string;
    created_at: string;
  }>;
  activeSessions: Array<{
    id: string;
    email: string;
    last_sign_in_at: string;
  }>;
  backgroundJobs: Array<{
    name: string;
    status: string;
    lastRun: string;
    nextRun: string;
  }>;
  timestamp: string;
}

interface SystemMonitoringState {
  data: SystemData | null;
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number;
}

export default function SystemMonitoring() {
  const [state, setState] = useState<SystemMonitoringState>({
    data: null,
    loading: true,
    error: null,
    autoRefresh: false,
    refreshInterval: 30000, // 30 seconds
  });

  const fetchSystemData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/system", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        data: result.monitoring,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching system data:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      }));
    }
  };

  const performSystemAction = async (action: string) => {
    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/system", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        alert(result.message);
      } else {
        alert(`Action failed: ${result.message}`);
      }

      // Refresh data after action
      fetchSystemData();
    } catch (error) {
      console.error("Error performing system action:", error);
      alert(
        `Action failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.autoRefresh) {
      intervalId = setInterval(fetchSystemData, state.refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.autoRefresh, state.refreshInterval]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatMemory = (mb: number) => {
    if (mb > 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
      case "completed":
        return "status-success";
      case "unhealthy":
      case "error":
      case "failed":
        return "status-error";
      case "warning":
      case "degraded":
        return "status-warning";
      default:
        return "status-info";
    }
  };

  const getMemoryUsageColor = (percentage: number) => {
    if (percentage > 90) return "memory-critical";
    if (percentage > 75) return "memory-warning";
    return "memory-normal";
  };

  if (state.loading && !state.data) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading system monitoring...</p>
        </div>
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="admin-content">
        <div className="error-container">
          <h3>Failed to load system data</h3>
          <p>{state.error}</p>
          <button onClick={fetchSystemData} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { data } = state;
  const memoryUsagePercentage =
    (data.system.server.memory.used / data.system.server.memory.total) * 100;

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>System Monitoring</h1>
        <p>Real-time system health and performance metrics</p>
      </div>

      <div className="content-body">
        {/* Controls */}
        <div className="monitoring-controls">
          <button
            onClick={fetchSystemData}
            disabled={state.loading}
            className="btn-secondary"
          >
            {state.loading ? "Refreshing..." : "Refresh"}
          </button>

          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={state.autoRefresh}
              onChange={(e) =>
                setState((prev) => ({ ...prev, autoRefresh: e.target.checked }))
              }
            />
            Auto-refresh (30s)
          </label>

          <div className="system-actions">
            <button
              onClick={() => performSystemAction("clear_cache")}
              className="btn-secondary"
            >
              Clear Cache
            </button>
            <button
              onClick={() => performSystemAction("force_garbage_collection")}
              className="btn-secondary"
            >
              Force GC
            </button>
            <button
              onClick={() => performSystemAction("test_database")}
              className="btn-secondary"
            >
              Test Database
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="monitoring-grid">
          <div className="monitoring-card">
            <h3>Server Information</h3>
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">Platform:</span>
                <span className="info-value">
                  {data.system.server.platform} ({data.system.server.arch})
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Node.js:</span>
                <span className="info-value">
                  {data.system.server.nodeVersion}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Uptime:</span>
                <span className="info-value">
                  {formatUptime(data.system.server.uptime)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">CPU Cores:</span>
                <span className="info-value">
                  {data.system.server.cpu.cores}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Environment:</span>
                <span className="info-value">
                  {data.system.environment.nodeEnv}
                </span>
              </div>
            </div>
          </div>

          <div className="monitoring-card">
            <h3>Memory Usage</h3>
            <div className="memory-stats">
              <div className="memory-bar">
                <div
                  className={`memory-fill ${getMemoryUsageColor(memoryUsagePercentage)}`}
                  style={{ width: `${memoryUsagePercentage}%` }}
                />
              </div>
              <div className="memory-details">
                <div className="memory-item">
                  <span>Used:</span>
                  <span>
                    {formatMemory(data.system.server.memory.used)} (
                    {memoryUsagePercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="memory-item">
                  <span>Free:</span>
                  <span>{formatMemory(data.system.server.memory.free)}</span>
                </div>
                <div className="memory-item">
                  <span>Total:</span>
                  <span>{formatMemory(data.system.server.memory.total)}</span>
                </div>
                <div className="memory-item">
                  <span>Process:</span>
                  <span>
                    {formatMemory(data.system.server.memory.processUsage)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="monitoring-card">
            <h3>Database Status</h3>
            <div className="database-status">
              <div
                className={`status-indicator ${data.database.connected ? "status-success" : "status-error"}`}
              >
                <div className="status-dot" />
                <span>
                  {data.database.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="database-metrics">
                <div className="metric-item">
                  <span>Response Time:</span>
                  <span>{data.database.responseTime}ms</span>
                </div>
                {data.database.error && (
                  <div className="error-message">
                    <span>Error:</span>
                    <span>{data.database.error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="monitoring-card">
            <h3>API Health</h3>
            <div className="api-health">
              {data.apis.map((api) => (
                <div key={api.name} className="api-item">
                  <div
                    className={`status-indicator ${getStatusColor(api.status)}`}
                  >
                    <div className="status-dot" />
                    <span className="api-name">{api.name}</span>
                  </div>
                  <div className="api-metrics">
                    <span>
                      {api.responseTime >= 0 ? `${api.responseTime}ms` : "N/A"}
                    </span>
                    {api.statusCode && <span>HTTP {api.statusCode}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="monitoring-section">
          <h3>Active Sessions ({data.activeSessions.length})</h3>
          <div className="sessions-list">
            {data.activeSessions.slice(0, 10).map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-user">
                  <div className="user-avatar">
                    {session.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-email">{session.email}</span>
                </div>
                <div className="session-time">
                  Last seen:{" "}
                  {new Date(session.last_sign_in_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Jobs */}
        <div className="monitoring-section">
          <h3>Background Jobs</h3>
          <div className="jobs-grid">
            {data.backgroundJobs.map((job) => (
              <div key={job.name} className="job-card">
                <div className="job-header">
                  <h4>{job.name}</h4>
                  <span
                    className={`status-badge ${getStatusColor(job.status)}`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="job-details">
                  <div className="job-item">
                    <span>Last Run:</span>
                    <span>{new Date(job.lastRun).toLocaleString()}</span>
                  </div>
                  <div className="job-item">
                    <span>Next Run:</span>
                    <span>{new Date(job.nextRun).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Errors */}
        {data.errors.length > 0 && (
          <div className="monitoring-section">
            <h3>Recent Errors ({data.errors.length})</h3>
            <div className="errors-list">
              {data.errors.slice(0, 10).map((error) => (
                <div key={error.id} className="error-item">
                  <div className="error-header">
                    <span className={`error-level error-${error.level}`}>
                      {error.level.toUpperCase()}
                    </span>
                    <span className="error-time">
                      {new Date(error.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="error-message">{error.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Info Footer */}
        <div className="system-footer">
          <div className="footer-info">
            <span>
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </span>
            <span>
              CPU Load:{" "}
              {data.system.server.cpu.loadAverage
                .map((l) => l.toFixed(2))
                .join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
