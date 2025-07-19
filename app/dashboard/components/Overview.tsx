import React, { useMemo, useState } from "react";

interface AnalysisHistoryItem {
  id: string;
  filename: string;
  timestamp: Date;
  result: {
    analysis?: {
      detectedIssues: { type: string; severity: string }[];
      confidence: number;
      estimatedImpact?: {
        level: string;
        description: string;
      };
    };
    success?: boolean;
    layers?: Array<{
      layerId: number;
      success: boolean;
      changeCount?: number;
    }>;
  };
  executionTime: number;
}

interface OverviewProps {
  analysisHistory: AnalysisHistoryItem[];
}

export default function Overview({ analysisHistory }: OverviewProps) {
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all");
  const [showQuickActions, setShowQuickActions] = useState(true);

  const filteredHistory = useMemo(() => {
    if (timeFilter === "all") return analysisHistory;

    const now = new Date();
    const filterDate = new Date();

    if (timeFilter === "week") {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "month") {
      filterDate.setMonth(now.getMonth() - 1);
    }

    return analysisHistory.filter(
      (item) => new Date(item.timestamp) >= filterDate,
    );
  }, [analysisHistory, timeFilter]);

  const metrics = useMemo(() => {
    if (filteredHistory.length === 0) {
      return {
        totalAnalyses: 0,
        totalIssues: 0,
        avgConfidence: 0,
        successRate: 0,
        totalFixesApplied: 0,
        avgExecutionTime: 0,
        issueBreakdown: { high: 0, medium: 0, low: 0 },
        mostCommonIssues: [],
        performanceTrend: "stable",
      };
    }

    const totalAnalyses = filteredHistory.length;
    const successful = filteredHistory.filter((h) => h.result.success).length;
    const successRate = (successful / totalAnalyses) * 100;

    const totalIssues = filteredHistory.reduce(
      (sum, h) => sum + (h.result.analysis?.detectedIssues?.length || 0),
      0,
    );

    const totalFixesApplied = filteredHistory.reduce(
      (sum, h) =>
        sum +
        (h.result.layers?.reduce(
          (layerSum, layer) => layerSum + (layer.changeCount || 0),
          0,
        ) || 0),
      0,
    );

    const avgConfidence =
      filteredHistory.reduce(
        (s, h) => s + (h.result.analysis?.confidence || 0),
        0,
      ) / totalAnalyses;

    const avgExecutionTime =
      filteredHistory.reduce((s, h) => s + h.executionTime, 0) / totalAnalyses;

    // Issue severity breakdown
    const issueBreakdown = filteredHistory.reduce(
      (acc, h) => {
        h.result.analysis?.detectedIssues?.forEach((issue) => {
          if (issue.severity === "high") acc.high++;
          else if (issue.severity === "medium") acc.medium++;
          else acc.low++;
        });
        return acc;
      },
      { high: 0, medium: 0, low: 0 },
    );

    // Most common issue types
    const issueTypes = filteredHistory.reduce(
      (acc, h) => {
        h.result.analysis?.detectedIssues?.forEach((issue) => {
          acc[issue.type] = (acc[issue.type] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostCommonIssues = Object.entries(issueTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));

    // Performance trend (simplified)
    const recentAvg =
      filteredHistory
        .slice(0, Math.floor(totalAnalyses / 2))
        .reduce((s, h) => s + h.executionTime, 0) /
      Math.max(Math.floor(totalAnalyses / 2), 1);
    const olderAvg =
      filteredHistory
        .slice(Math.floor(totalAnalyses / 2))
        .reduce((s, h) => s + h.executionTime, 0) /
      Math.max(Math.ceil(totalAnalyses / 2), 1);

    const performanceTrend =
      recentAvg < olderAvg
        ? "improving"
        : recentAvg > olderAvg
          ? "declining"
          : "stable";

    return {
      totalAnalyses,
      totalIssues,
      avgConfidence,
      successRate,
      totalFixesApplied,
      avgExecutionTime,
      issueBreakdown,
      mostCommonIssues,
      performanceTrend,
    };
  }, [filteredHistory]);

  const recentAnalyses = useMemo(
    () => filteredHistory.slice(0, 5),
    [filteredHistory],
  );

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getPerformanceIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        );
      case "declining":
        return (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
          </svg>
        );
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        );
    }
  };

  return (
    <div className="overview-root">
      {/* Header with filters */}
      <div className="overview-header">
        <div className="header-title">
          <h2>Dashboard Overview</h2>
          <p>Comprehensive analysis insights and metrics</p>
        </div>

        <div className="time-filters">
          {(["all", "week", "month"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`filter-btn ${timeFilter === filter ? "active" : ""}`}
            >
              {filter === "all"
                ? "All Time"
                : filter === "week"
                  ? "Last Week"
                  : "Last Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalAnalyses}</div>
            <div className="metric-label">Total Analyses</div>
            <div className="metric-change">
              <span className="trend-indicator success">
                ↗ {Math.round(metrics.successRate)}% Success Rate
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalIssues}</div>
            <div className="metric-label">Issues Detected</div>
            <div className="metric-breakdown">
              <span className="high">High: {metrics.issueBreakdown.high}</span>
              <span className="medium">
                Med: {metrics.issueBreakdown.medium}
              </span>
              <span className="low">Low: {metrics.issueBreakdown.low}</span>
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {(metrics.avgConfidence * 100).toFixed(0)}%
            </div>
            <div className="metric-label">Avg Confidence</div>
            <div className="metric-change">
              <span className="fixes-applied">
                {metrics.totalFixesApplied} fixes applied
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card performance">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {formatExecutionTime(metrics.avgExecutionTime)}
            </div>
            <div className="metric-label">Avg Execution Time</div>
            <div className="metric-trend">
              <span className={`trend-icon ${metrics.performanceTrend}`}>
                {getPerformanceIcon(metrics.performanceTrend)}
              </span>
              <span className="trend-text">{metrics.performanceTrend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="quick-actions-section">
          <div className="section-header">
            <h3>Quick Actions</h3>
            <button
              onClick={() => setShowQuickActions(false)}
              className="close-btn"
            >
              ×
            </button>
          </div>
          <div className="quick-actions-grid">
            <button className="action-card primary">
              <div className="action-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="action-content">
                <h4>New Analysis</h4>
                <p>Analyze new code files</p>
              </div>
            </button>

            <button className="action-card secondary">
              <div className="action-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="action-content">
                <h4>GitHub Scan</h4>
                <p>Scan repositories</p>
              </div>
            </button>

            <button className="action-card warning">
              <div className="action-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="action-content">
                <h4>View Analytics</h4>
                <p>Detailed insights</p>
              </div>
            </button>

            <button className="action-card danger">
              <div className="action-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div className="action-content">
                <h4>Clear Data</h4>
                <p>Reset all history</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Insights Section */}
      <div className="insights-section">
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Most Common Issues</h4>
            {metrics.mostCommonIssues.length > 0 ? (
              <div className="issues-list">
                {metrics.mostCommonIssues.map((issue, index) => (
                  <div key={issue.type} className="issue-item">
                    <span className="issue-type">
                      {issue.type.replace("-", " ")}
                    </span>
                    <span className="issue-count">{issue.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No issues detected yet</p>
            )}
          </div>

          <div className="insight-card">
            <h4>Recent Activity</h4>
            {recentAnalyses.length > 0 ? (
              <div className="activity-list">
                {recentAnalyses.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-info">
                      <span className="filename">{item.filename}</span>
                      <span className="timestamp">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`status ${item.result.success ? "success" : "error"}`}
                    >
                      {item.result.success ? "✓" : "✗"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent analyses</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview-root {
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border: 2px solid #000000;
          border-radius: 16px;
          padding: 1.5rem;
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .header-title h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .header-title p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 1rem;
        }

        .time-filters {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 4px;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .filter-btn.active {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          color: #ffffff;
          border: 1px solid rgba(33, 150, 243, 0.3);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 16px;
          backdrop-filter: blur(25px) saturate(1.2);
          -webkit-backdrop-filter: blur(25px) saturate(1.2);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .metric-card.primary {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(33, 150, 243, 0.3);
        }

        .metric-card.warning {
          background: linear-gradient(
            135deg,
            rgba(255, 152, 0, 0.2) 0%,
            rgba(255, 152, 0, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(255, 152, 0, 0.3);
        }

        .metric-card.success {
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.2) 0%,
            rgba(76, 175, 80, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .metric-card.performance {
          background: linear-gradient(
            135deg,
            rgba(156, 39, 176, 0.2) 0%,
            rgba(156, 39, 176, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(156, 39, 176, 0.3);
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
          min-width: 0;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .trend-indicator {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .trend-indicator.success {
          color: #4caf50;
        }

        .metric-breakdown {
          display: flex;
          gap: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .metric-breakdown .high {
          color: #e53e3e;
        }

        .metric-breakdown .medium {
          color: #ff9800;
        }

        .metric-breakdown .low {
          color: #4caf50;
        }

        .fixes-applied {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .trend-icon {
          display: flex;
          align-items: center;
        }

        .trend-icon.improving {
          color: #4caf50;
        }

        .trend-icon.declining {
          color: #e53e3e;
        }

        .trend-icon.stable {
          color: rgba(255, 255, 255, 0.6);
        }

        .trend-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: capitalize;
        }

        .quick-actions-section {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h3 {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.5rem;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-card:hover {
          transform: translateY(-2px);
        }

        .action-card.primary {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(33, 150, 243, 0.3);
        }

        .action-card.secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-card.warning {
          background: linear-gradient(
            135deg,
            rgba(255, 152, 0, 0.2) 0%,
            rgba(255, 152, 0, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(255, 152, 0, 0.3);
        }

        .action-card.danger {
          background: linear-gradient(
            135deg,
            rgba(229, 62, 62, 0.2) 0%,
            rgba(229, 62, 62, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(229, 62, 62, 0.3);
        }

        .action-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          flex-shrink: 0;
        }

        .action-content h4 {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .action-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          margin: 0;
        }

        .insights-section {
          margin-top: 1rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .insight-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .insight-card h4 {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .issue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .issue-type {
          color: #ffffff;
          font-weight: 500;
          text-transform: capitalize;
        }

        .issue-count {
          background: rgba(255, 152, 0, 0.2);
          color: #ff9800;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filename {
          color: #ffffff;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .timestamp {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }

        .status {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .status.success {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }

        .status.error {
          background: rgba(229, 62, 62, 0.2);
          color: #e53e3e;
        }

        .no-data {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          text-align: center;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .overview-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
