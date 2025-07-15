"use client";

import React, { useState, useEffect, useMemo } from "react";

interface AnalysisHistory {
  id: string;
  filename: string;
  timestamp: Date;
  result: {
    analysis?: {
      detectedIssues: Array<{
        type: string;
        severity: string;
        description: string;
        fixedByLayer: number;
        pattern: string;
        count?: number;
      }>;
      confidence: number;
      estimatedImpact: {
        level: string;
        description: string;
        estimatedFixTime: string;
      };
    };
    layers?: Array<{
      layerId: number;
      success: boolean;
      executionTime: number;
      changeCount?: number;
    }>;
    totalExecutionTime?: number;
  };
  layers: number[];
  executionTime: number;
}

interface AnalyticsDashboardProps {
  analysisHistory: AnalysisHistory[];
}

export default function AnalyticsDashboard({
  analysisHistory,
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const timeRangeMs = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    return analysisHistory.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return now - itemTime <= timeRangeMs[selectedTimeRange];
    });
  }, [analysisHistory, selectedTimeRange]);

  const analytics = useMemo(() => {
    if (filteredHistory.length === 0) {
      return {
        totalAnalyses: 0,
        totalIssuesFound: 0,
        averageConfidence: 0,
        averageExecutionTime: 0,
        mostCommonIssues: [],
        layerUsage: {},
        trendData: [],
        qualityScore: 0,
        timeSaved: 0,
      };
    }

    const totalAnalyses = filteredHistory.length;
    const totalIssuesFound = filteredHistory.reduce(
      (sum, item) => sum + (item.result.analysis?.detectedIssues?.length || 0),
      0,
    );

    const confidenceSum = filteredHistory.reduce(
      (sum, item) => sum + (item.result.analysis?.confidence || 0),
      0,
    );
    const averageConfidence = confidenceSum / totalAnalyses;

    const executionTimeSum = filteredHistory.reduce(
      (sum, item) => sum + item.executionTime,
      0,
    );
    const averageExecutionTime = executionTimeSum / totalAnalyses;

    // Count issue types
    const issueTypeCounts: Record<string, number> = {};
    filteredHistory.forEach((item) => {
      item.result.analysis?.detectedIssues?.forEach((issue) => {
        issueTypeCounts[issue.type] = (issueTypeCounts[issue.type] || 0) + 1;
      });
    });

    const mostCommonIssues = Object.entries(issueTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    // Layer usage statistics
    const layerUsage: Record<string, number> = {};
    filteredHistory.forEach((item) => {
      item.layers.forEach((layerId) => {
        layerUsage[`Layer ${layerId}`] =
          (layerUsage[`Layer ${layerId}`] || 0) + 1;
      });
    });

    // Trend data (last 7 days)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAnalyses = filteredHistory.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= dayStart && itemDate <= dayEnd;
      });

      const dayIssues = dayAnalyses.reduce(
        (sum, item) =>
          sum + (item.result.analysis?.detectedIssues?.length || 0),
        0,
      );

      trendData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        analyses: dayAnalyses.length,
        issues: dayIssues,
      });
    }

    // Quality score calculation
    const qualityScore = Math.round(averageConfidence * 100);

    // Time saved estimation (2.5 hours per issue on average)
    const timeSaved = totalIssuesFound * 2.5;

    return {
      totalAnalyses,
      totalIssuesFound,
      averageConfidence,
      averageExecutionTime,
      mostCommonIssues,
      layerUsage,
      trendData,
      qualityScore,
      timeSaved,
    };
  }, [filteredHistory]);

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    return `${Math.round(hours / 24)} days`;
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h3>Analytics Dashboard</h3>
        <div className="time-range-selector">
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <button
              key={range}
              className={`time-range-btn ${selectedTimeRange === range ? "active" : ""}`}
              onClick={() => setSelectedTimeRange(range)}
            >
              {range === "all" ? "All Time" : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">•</div>
          <h4>No Analysis Data</h4>
          <p>Run some code analyses to see your analytics dashboard.</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">����</div>
              <div className="metric-content">
                <div className="metric-value">{analytics.totalAnalyses}</div>
                <div className="metric-label">Total Analyses</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🐛</div>
              <div className="metric-content">
                <div className="metric-value">{analytics.totalIssuesFound}</div>
                <div className="metric-label">Issues Found</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">•</div>
              <div className="metric-content">
                <div className="metric-value">
                  {formatTime(analytics.timeSaved)}
                </div>
                <div className="metric-label">Time Saved</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">•</div>
              <div className="metric-content">
                <div className="metric-value">{analytics.qualityScore}%</div>
                <div className="metric-label">Avg Quality Score</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Trend Chart */}
            <div className="chart-card">
              <h4>Analysis Trend (Last 7 Days)</h4>
              <div className="trend-chart">
                {analytics.trendData.map((day, index) => (
                  <div key={index} className="trend-day">
                    <div className="trend-bars">
                      <div
                        className="trend-bar analyses"
                        style={{
                          height: `${Math.max(5, (day.analyses / Math.max(...analytics.trendData.map((d) => d.analyses))) * 60)}px`,
                        }}
                        title={`${day.analyses} analyses`}
                      />
                      <div
                        className="trend-bar issues"
                        style={{
                          height: `${Math.max(5, (day.issues / Math.max(...analytics.trendData.map((d) => d.issues), 1)) * 60)}px`,
                        }}
                        title={`${day.issues} issues found`}
                      />
                    </div>
                    <div className="trend-label">{day.date}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color analyses"></div>
                  <span>Analyses</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color issues"></div>
                  <span>Issues Found</span>
                </div>
              </div>
            </div>

            {/* Most Common Issues */}
            <div className="chart-card">
              <h4>Most Common Issues</h4>
              <div className="issues-chart">
                {analytics.mostCommonIssues.length === 0 ? (
                  <div className="no-issues">
                    No issues detected in analyzed files
                  </div>
                ) : (
                  analytics.mostCommonIssues.map((issue, index) => (
                    <div key={index} className="issue-bar">
                      <div className="issue-name">{issue.type}</div>
                      <div className="issue-bar-container">
                        <div
                          className="issue-bar-fill"
                          style={{
                            width: `${(issue.count / analytics.mostCommonIssues[0].count) * 100}%`,
                          }}
                        />
                        <div className="issue-count">{issue.count}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Layer Usage */}
          <div className="usage-section">
            <div className="chart-card">
              <h4>Layer Usage Statistics</h4>
              <div className="layer-usage">
                {Object.entries(analytics.layerUsage)
                  .sort(([, a], [, b]) => b - a)
                  .map(([layer, count]) => (
                    <div key={layer} className="layer-usage-item">
                      <div className="layer-name">{layer}</div>
                      <div className="layer-bar-container">
                        <div
                          className="layer-bar-fill"
                          style={{
                            width: `${(count / Math.max(...Object.values(analytics.layerUsage))) * 100}%`,
                          }}
                        />
                        <div className="layer-count">{count} uses</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="chart-card">
              <h4>Performance Metrics</h4>
              <div className="performance-metrics">
                <div className="perf-metric">
                  <span className="perf-label">Average Analysis Time</span>
                  <span className="perf-value">
                    {formatExecutionTime(analytics.averageExecutionTime)}
                  </span>
                </div>
                <div className="perf-metric">
                  <span className="perf-label">Average Issues per File</span>
                  <span className="perf-value">
                    {(
                      analytics.totalIssuesFound / analytics.totalAnalyses
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="perf-metric">
                  <span className="perf-label">Success Rate</span>
                  <span className="perf-value">{analytics.qualityScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .analytics-dashboard {
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .analytics-header h3 {
          color: #ffffff;
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .time-range-selector {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .time-range-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .time-range-btn.active,
        .time-range-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .no-data {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .no-data-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .no-data h4 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.25rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .metric-icon {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }

        .metric-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }

        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .chart-card h4 {
          color: #ffffff;
          margin: 0 0 20px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .trend-chart {
          display: flex;
          align-items: end;
          gap: 12px;
          height: 100px;
          margin-bottom: 16px;
        }

        .trend-day {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .trend-bars {
          display: flex;
          align-items: end;
          gap: 2px;
          height: 80px;
        }

        .trend-bar {
          width: 8px;
          border-radius: 2px;
          min-height: 5px;
        }

        .trend-bar.analyses {
          background: rgba(33, 150, 243, 0.6);
        }

        .trend-bar.issues {
          background: rgba(255, 152, 0, 0.6);
        }

        .trend-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .chart-legend {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-color.analyses {
          background: rgba(33, 150, 243, 0.8);
        }

        .legend-color.issues {
          background: rgba(255, 152, 0, 0.8);
        }

        .issues-chart {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .no-issues {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 20px;
          font-style: italic;
        }

        .issue-bar {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .issue-name {
          font-size: 0.9rem;
          color: #ffffff;
          font-weight: 500;
        }

        .issue-bar-container {
          position: relative;
          height: 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .issue-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #2196f3, #4caf50);
          transition: width 0.3s ease;
        }

        .issue-count {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.8rem;
          color: #ffffff;
          font-weight: 600;
        }

        .usage-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .layer-usage {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .layer-usage-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .layer-name {
          font-size: 0.9rem;
          color: #ffffff;
          font-weight: 500;
        }

        .layer-bar-container {
          position: relative;
          height: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .layer-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff9800, #4caf50);
          transition: width 0.3s ease;
        }

        .layer-count {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.8rem;
          color: #ffffff;
          font-weight: 500;
        }

        .performance-metrics {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .perf-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .perf-metric:last-child {
          border-bottom: none;
        }

        .perf-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .perf-value {
          color: #ffffff;
          font-weight: 600;
          font-size: 1rem;
        }

        @media (max-width: 1024px) {
          .charts-section,
          .usage-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .analytics-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .time-range-selector {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
