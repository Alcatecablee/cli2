import React, { useMemo } from "react";

interface AnalysisHistoryItem {
  id: string;
  filename: string;
  timestamp: Date;
  result: {
    analysis?: {
      detectedIssues: { type: string }[];
      confidence: number;
    };
  };
  executionTime: number;
}

interface OverviewProps {
  analysisHistory: AnalysisHistoryItem[];
}

export default function Overview({ analysisHistory }: OverviewProps) {
  const metrics = useMemo(() => {
    if (analysisHistory.length === 0) {
      return {
        totalAnalyses: 0,
        totalIssues: 0,
        avgConfidence: 0,
      };
    }

    const totalAnalyses = analysisHistory.length;
    const totalIssues = analysisHistory.reduce(
      (sum, h) =>
        sum + (h.result.analysis?.detectedIssues?.length || 0),
      0,
    );
    const avgConfidence =
      analysisHistory.reduce(
        (s, h) => s + (h.result.analysis?.confidence || 0),
        0,
      ) / totalAnalyses;

    return { totalAnalyses, totalIssues, avgConfidence };
  }, [analysisHistory]);

  const recent = useMemo(
    () => analysisHistory.slice(0, 5),
    [analysisHistory],
  );

  return (
    <div className="overview-root">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 3 3 21 21 21" />
              <path d="M7 12h4l3-8 4 8h3" />
            </svg>
          </div>
          <div>
            <div className="metric-value">{metrics.totalAnalyses}</div>
            <div className="metric-label">Analyses</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <div>
            <div className="metric-value">{metrics.totalIssues}</div>
            <div className="metric-label">Issues</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="metric-value">
              {(metrics.avgConfidence * 100).toFixed(0)}%
            </div>
            <div className="metric-label">Avg Confidence</div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h4 style={{ marginBottom: "12px", color: "#fff" }}>Recent Analyses</h4>
        {recent.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.6)" }}>No recent analyses</p>
        ) : (
          <ul className="recent-list">
            {recent.map((item) => (
              <li key={item.id} className="recent-item">
                <span>{item.filename}</span>
                <span style={{ opacity: 0.7, fontSize: "0.8rem" }}>
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .overview-root {
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .metric-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .metric-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }
        .metric-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: #ffffff;
        }
        .metric-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }
        .recent-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .recent-item {
          display: flex;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}