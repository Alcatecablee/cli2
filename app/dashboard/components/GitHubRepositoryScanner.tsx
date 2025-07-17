"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";

interface GitHubFile {
  name: string;
  path: string;
  size: number;
  downloadUrl: string;
  sha: string;
}

interface ScanProgress {
  current: number;
  total: number;
  currentFile: string;
  status: "pending" | "scanning" | "completed" | "error";
}

interface FileResult {
  file: GitHubFile;
  status: "pending" | "scanning" | "completed" | "error";
  result?: any;
  error?: string;
  processingTime?: number;
  issuesFound?: number;
  confidence?: number;
}

interface RepositoryScanProps {
  repositoryName: string;
  files: GitHubFile[];
  onScanComplete: (results: FileResult[]) => void;
  onClose: () => void;
}

const formatProcessingTime = (ms: number) => {
  if (ms < 10) return `${ms.toFixed(1)}ms`;
  if (ms < 100) return `${ms.toFixed(0)}ms`;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export default function GitHubRepositoryScanner({
  repositoryName,
  files,
  onScanComplete,
  onClose,
}: RepositoryScanProps) {
  const { session } = useAuth();
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    current: 0,
    total: files.length,
    currentFile: "",
    status: "pending",
  });
  const [fileResults, setFileResults] = useState<FileResult[]>(
    files.map((file) => ({ file, status: "pending" })),
  );
  const [overallStartTime, setOverallStartTime] = useState<number>(0);

  const scanRepository = useCallback(async () => {
    setOverallStartTime(Date.now());
    setScanProgress((prev) => ({ ...prev, status: "scanning" }));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const startTime = Date.now();

      // Update progress
      setScanProgress({
        current: i + 1,
        total: files.length,
        currentFile: file.name,
        status: "scanning",
      });

      // Update file status to scanning
      setFileResults((prev) =>
        prev.map((result, idx) =>
          idx === i ? { ...result, status: "scanning" } : result,
        ),
      );

      try {
        // Download file content
        const fileResponse = await fetch(file.downloadUrl);
        if (!fileResponse.ok) {
          throw new Error(`Failed to download ${file.name}`);
        }
        const fileContent = await fileResponse.text();

        // Analyze with NeuroLint Engine
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            code: fileContent,
            filename: file.name,
            layers: "auto", // Let NeuroLint determine best layers
            applyFixes: false, // Analysis only for GitHub repos
            metadata: {
              repository: repositoryName,
              filePath: file.path,
              fileSize: file.size,
              sha: file.sha,
            },
          }),
        });

        const result = await analysisResponse.json();
        const processingTime = Date.now() - startTime;

        if (analysisResponse.ok && result.success) {
          // Update with successful result
          setFileResults((prev) =>
            prev.map((fileResult, idx) =>
              idx === i
                ? {
                    ...fileResult,
                    status: "completed",
                    result,
                    processingTime,
                    issuesFound: result.analysis?.detectedIssues?.length || 0,
                    confidence: result.analysis?.confidence || 0,
                  }
                : fileResult,
            ),
          );
        } else {
          // Update with error
          setFileResults((prev) =>
            prev.map((fileResult, idx) =>
              idx === i
                ? {
                    ...fileResult,
                    status: "error",
                    error: result.error || "Analysis failed",
                    processingTime,
                  }
                : fileResult,
            ),
          );
        }
      } catch (error) {
        const processingTime = Date.now() - startTime;
        setFileResults((prev) =>
          prev.map((fileResult, idx) =>
            idx === i
              ? {
                  ...fileResult,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                  processingTime,
                }
              : fileResult,
          ),
        );
      }

      // Add delay to prevent rate limiting
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setScanProgress((prev) => ({ ...prev, status: "completed" }));
  }, [files, repositoryName, session]);

  const getScanSummary = () => {
    const completed = fileResults.filter((r) => r.status === "completed");
    const failed = fileResults.filter((r) => r.status === "error");
    const totalIssues = completed.reduce(
      (sum, r) => sum + (r.issuesFound || 0),
      0,
    );
    const avgConfidence =
      completed.length > 0
        ? completed.reduce((sum, r) => sum + (r.confidence || 0), 0) /
          completed.length
        : 0;
    const totalTime = Date.now() - overallStartTime;

    return {
      totalFiles: files.length,
      completed: completed.length,
      failed: failed.length,
      totalIssues,
      avgConfidence,
      totalTime,
    };
  };

  const exportResults = () => {
    const summary = getScanSummary();
    const exportData = {
      repository: repositoryName,
      scanDate: new Date().toISOString(),
      summary,
      results: fileResults.map((result) => ({
        file: result.file.path,
        status: result.status,
        issuesFound: result.issuesFound || 0,
        confidence: result.confidence || 0,
        processingTime: result.processingTime || 0,
        issues: result.result?.analysis?.detectedIssues || [],
        layers: result.result?.layers || [],
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repositoryName.replace("/", "-")}-scan-results-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "scanning":
        return "🔄";
      case "completed":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "rgba(255, 255, 255, 0.5)";
      case "scanning":
        return "rgba(33, 150, 243, 0.9)";
      case "completed":
        return "rgba(76, 175, 80, 0.9)";
      case "error":
        return "rgba(239, 68, 68, 0.9)";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  return (
    <div className="repository-scanner">
      <div className="scanner-header">
        <h3>Scanning: {repositoryName}</h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="scan-progress">
        <div className="progress-info">
          <span className="progress-text">
            {scanProgress.status === "pending" && "Ready to scan"}
            {scanProgress.status === "scanning" &&
              `Scanning ${scanProgress.currentFile}...`}
            {scanProgress.status === "completed" && "Scan completed"}
            {scanProgress.status === "error" && "Scan failed"}
          </span>
          <span className="progress-count">
            {scanProgress.current}/{scanProgress.total} files
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(scanProgress.current / scanProgress.total) * 100}%`,
            }}
          />
        </div>
      </div>

      {scanProgress.status === "pending" && (
        <div className="scan-controls">
          <button className="start-scan-btn" onClick={scanRepository}>
            Start Repository Scan
          </button>
          <p className="scan-warning">
            This will analyze {files.length} React/TypeScript files. Estimated
            time: {Math.ceil(files.length * 2)}s
          </p>
        </div>
      )}

      {scanProgress.status === "completed" && (
        <div className="scan-summary">
          <h4>Scan Summary</h4>
          <div className="summary-grid">
            <div className="summary-stat">
              <span className="stat-value">{getScanSummary().completed}</span>
              <span className="stat-label">Files Analyzed</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{getScanSummary().failed}</span>
              <span className="stat-label">Failed</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{getScanSummary().totalIssues}</span>
              <span className="stat-label">Issues Found</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                {Math.round(getScanSummary().avgConfidence * 100)}%
              </span>
              <span className="stat-label">Avg Confidence</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                {formatProcessingTime(getScanSummary().totalTime)}
              </span>
              <span className="stat-label">Total Time</span>
            </div>
          </div>
          <div className="summary-actions">
            <button className="export-btn" onClick={exportResults}>
              Export Results
            </button>
            <button
              className="complete-btn"
              onClick={() => onScanComplete(fileResults)}
            >
              View Detailed Results
            </button>
          </div>
        </div>
      )}

      <div className="file-results">
        <h4>File Analysis Progress</h4>
        <div className="file-list">
          {fileResults.map((result, index) => (
            <div key={index} className="file-result-item">
              <div className="file-status">
                <span
                  className="status-icon"
                  style={{ color: getStatusColor(result.status) }}
                >
                  {getStatusIcon(result.status)}
                </span>
              </div>
              <div className="file-info">
                <div className="file-name">{result.file.name}</div>
                <div className="file-path">{result.file.path}</div>
              </div>
              <div className="file-metrics">
                {result.status === "completed" && (
                  <>
                    <span className="metric">{result.issuesFound} issues</span>
                    <span className="metric">
                      {Math.round((result.confidence || 0) * 100)}% confidence
                    </span>
                    <span className="metric">
                      {formatProcessingTime(result.processingTime || 0)}
                    </span>
                  </>
                )}
                {result.status === "error" && (
                  <span className="error-text">{result.error}</span>
                )}
                {result.status === "scanning" && (
                  <span className="scanning-text">Analyzing...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .repository-scanner {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .scanner-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .scanner-header h3 {
          color: #ffffff;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.8);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .scan-progress {
          margin-bottom: 24px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-text {
          color: #ffffff;
          font-weight: 500;
        }

        .progress-count {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(33, 150, 243, 0.8),
            rgba(76, 175, 80, 0.8)
          );
          transition: width 0.3s ease;
        }

        .scan-controls {
          text-align: center;
          margin-bottom: 24px;
        }

        .start-scan-btn {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3),
            rgba(76, 175, 80, 0.3)
          );
          border: 1px solid rgba(33, 150, 243, 0.5);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }

        .start-scan-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
        }

        .scan-warning {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin: 0;
        }

        .scan-summary {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .scan-summary h4 {
          color: #ffffff;
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .summary-stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .export-btn,
        .complete-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .complete-btn {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2),
            rgba(76, 175, 80, 0.2)
          );
          border-color: rgba(33, 150, 243, 0.4);
        }

        .export-btn:hover,
        .complete-btn:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.15);
        }

        .complete-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3),
            rgba(76, 175, 80, 0.3)
          );
        }

        .file-results h4 {
          color: #ffffff;
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .file-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .file-result-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .file-status {
          display: flex;
          align-items: center;
        }

        .status-icon {
          font-size: 1.2rem;
        }

        .file-info {
          min-width: 0;
        }

        .file-name {
          color: #ffffff;
          font-weight: 500;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-path {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-metrics {
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: flex-end;
          min-width: 120px;
        }

        .metric {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .error-text {
          font-size: 0.8rem;
          color: rgba(239, 68, 68, 0.9);
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .scanning-text {
          font-size: 0.8rem;
          color: rgba(33, 150, 243, 0.9);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .summary-actions {
            flex-direction: column;
          }

          .file-result-item {
            grid-template-columns: auto 1fr;
            gap: 8px;
          }

          .file-metrics {
            grid-column: 1 / -1;
            margin-top: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
