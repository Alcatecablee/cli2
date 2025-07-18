"use client";

import React, { useState, useEffect } from "react";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalAnalyses: number;
    avgExecutionTime: number;
    errorRate: number;
  };
  planDistribution: Record<string, number>;
  layerUsage: Record<string, number>;
  dailyAnalytics: Array<{
    date: string;
    users: number;
    analyses: number;
  }>;
  topIssues: Array<{
    type: string;
    count: number;
  }>;
  apiUsage: {
    totalKeys: number;
    activeKeys: number;
    totalRequests: number;
  };
}

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  period: string;
}

export default function AnalyticsOverview() {
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    loading: true,
    error: null,
    period: "7d",
  });

  const fetchAnalytics = async (period = "7d") => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch(`/api/admin/analytics?period=${period}`, {
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
        data: result.analytics,
        loading: false,
        period,
      }));
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handlePeriodChange = (newPeriod: string) => {
    fetchAnalytics(newPeriod);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return { change: 0, direction: "neutral" };
    const change = ((current - previous) / previous) * 100;
    return {
      change: Math.abs(change),
      direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
    };
  };

  if (state.loading) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="admin-content">
        <div className="error-container">
          <h3>Failed to load analytics</h3>
          <p>{state.error}</p>
          <button
            onClick={() => fetchAnalytics(state.period)}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { data } = state;

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Analytics Overview</h1>
        <p>System usage metrics and performance insights</p>
      </div>

      <div className="content-body">
        {/* Period Selection */}
        <div className="analytics-controls">
          <div className="period-selector">
            {["7d", "30d", "90d"].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`period-btn ${state.period === period ? "active" : ""}`}
              >
                {period === "7d"
                  ? "7 Days"
                  : period === "30d"
                    ? "30 Days"
                    : "90 Days"}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(state.period)}
            className="btn-secondary"
          >
            Refresh
          </button>
        </div>

        {/* Overview Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h3>Total Users</h3>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="metric-value">
              {formatNumber(data.overview.totalUsers)}
            </div>
            <div className="metric-subtitle">
              {data.overview.activeUsers} active in last 7 days
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Total Analyses</h3>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <polyline points="3 3 3 21 21 21" />
                <path d="M7 12h4l3-8 4 8h3" />
              </svg>
            </div>
            <div className="metric-value">
              {formatNumber(data.overview.totalAnalyses)}
            </div>
            <div className="metric-subtitle">
              Avg {formatDuration(data.overview.avgExecutionTime)} execution
              time
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Success Rate</h3>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="metric-value">
              {(100 - data.overview.errorRate).toFixed(1)}%
            </div>
            <div className="metric-subtitle">
              {data.overview.errorRate.toFixed(1)}% error rate
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>API Usage</h3>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="metric-value">
              {formatNumber(data.apiUsage.totalRequests)}
            </div>
            <div className="metric-subtitle">
              {data.apiUsage.activeKeys} of {data.apiUsage.totalKeys} keys
              active
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="analytics-grid">
          {/* Plan Distribution */}
          <div className="analytics-card">
            <h3>Plan Distribution</h3>
            <div className="plan-distribution">
              {Object.entries(data.planDistribution).map(([plan, count]) => {
                const total = Object.values(data.planDistribution).reduce(
                  (a, b) => a + b,
                  0,
                );
                const percentage =
                  total > 0 ? ((count / total) * 100).toFixed(1) : "0";

                return (
                  <div key={plan} className="plan-item">
                    <div className="plan-info">
                      <span className={`plan-badge plan-${plan}`}>
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </span>
                      <span className="plan-count">{count} users</span>
                    </div>
                    <div className="plan-bar">
                      <div
                        className={`plan-fill plan-${plan}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="plan-percentage">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Layer Usage */}
          <div className="analytics-card">
            <h3>Layer Usage</h3>
            <div className="layer-usage">
              {Object.entries(data.layerUsage)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([layer, count]) => {
                  const maxCount = Math.max(...Object.values(data.layerUsage));
                  const percentage =
                    maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <div key={layer} className="layer-item">
                      <div className="layer-info">
                        <span className="layer-label">Layer {layer}</span>
                        <span className="layer-count">{count}</span>
                      </div>
                      <div className="layer-bar">
                        <div
                          className="layer-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Top Issues */}
          <div className="analytics-card">
            <h3>Top Issues Detected</h3>
            <div className="issues-list">
              {data.topIssues.slice(0, 8).map((issue, index) => (
                <div key={issue.type} className="issue-item">
                  <div className="issue-rank">#{index + 1}</div>
                  <div className="issue-info">
                    <span className="issue-type">{issue.type}</span>
                    <span className="issue-count">
                      {issue.count} occurrences
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Trend */}
          <div className="analytics-card">
            <h3>Daily Activity ({state.period})</h3>
            <div className="daily-chart">
              {data.dailyAnalytics.slice(-7).map((day, index) => {
                const maxAnalyses = Math.max(
                  ...data.dailyAnalytics.map((d) => d.analyses),
                );
                const height =
                  maxAnalyses > 0 ? (day.analyses / maxAnalyses) * 100 : 0;

                return (
                  <div key={day.date} className="day-item">
                    <div className="day-bar">
                      <div
                        className="day-fill"
                        style={{ height: `${height}%` }}
                        title={`${day.analyses} analyses`}
                      />
                    </div>
                    <div className="day-label">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="day-stats">
                      <span>{day.analyses}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Average analyses per user:</span>
            <span className="stat-value">
              {data.overview.totalUsers > 0
                ? (
                    data.overview.totalAnalyses / data.overview.totalUsers
                  ).toFixed(1)
                : "0"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">User activation rate:</span>
            <span className="stat-value">
              {data.overview.totalUsers > 0
                ? (
                    (data.overview.activeUsers / data.overview.totalUsers) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Most used layer:</span>
            <span className="stat-value">
              {Object.entries(data.layerUsage).length > 0
                ? `Layer ${Object.entries(data.layerUsage).sort(([, a], [, b]) => b - a)[0][0]}`
                : "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
