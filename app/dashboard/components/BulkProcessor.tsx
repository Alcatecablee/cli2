"use client";

import React, { useState, useCallback, useRef } from "react";

interface BulkResult {
  filename: string;
  status: "pending" | "processing" | "completed" | "error";
  result?: any;
  error?: string;
  progress: number;
  processingTime?: number;
  expanded?: boolean;
}

interface BulkProcessingState {
  files: File[];
  processing: boolean;
  results: BulkResult[];
  overallProgress: number;
  showSummary: boolean;
  completedAt?: Date;
}

interface BulkProcessorProps {
  onAnalysisComplete: (results: any[]) => void;
  selectedLayers: number[];
  applyFixes: boolean;
}

const formatProcessingTime = (ms: number) => {
  if (ms < 10) return `${ms.toFixed(1)}ms`;
  if (ms < 100) return `${ms.toFixed(0)}ms`;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export default function BulkProcessor({
  onAnalysisComplete,
  selectedLayers,
  applyFixes,
}: BulkProcessorProps) {
  const [bulkState, setBulkState] = useState<BulkProcessingState>({
    files: [],
    processing: false,
    results: [],
    overallProgress: 0,
    showSummary: false,
  });

  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter(
        (file) => file.name.match(/\.(ts|tsx|js|jsx)$/) && file.size <= 200000,
      );

      if (validFiles.length === 0) {
        alert(
          "No valid React/TypeScript files found. Please select a folder containing .ts, .tsx, .js, or .jsx files.",
        );
        return;
      }

      setBulkState((prev) => ({
        ...prev,
        files: validFiles,
        results: validFiles.map((file) => ({
          filename: file.name,
          status: "pending",
          progress: 0,
        })),
      }));
    },
    [],
  );

  const handleMultipleFiles = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter(
        (file) => file.name.match(/\.(ts|tsx|js|jsx)$/) && file.size <= 200000,
      );

      setBulkState((prev) => ({
        ...prev,
        files: validFiles,
        results: validFiles.map((file) => ({
          filename: file.name,
          status: "pending",
          progress: 0,
        })),
      }));
    },
    [],
  );

  const processBulkFiles = async () => {
    if (bulkState.files.length === 0) return;

    setBulkState((prev) => ({ ...prev, processing: true, overallProgress: 0 }));

    const results = [];
    const totalFiles = bulkState.files.length;

    for (let i = 0; i < bulkState.files.length; i++) {
      const file = bulkState.files[i];

      // Update current file status
      setBulkState((prev) => ({
        ...prev,
        results: prev.results.map((result, idx) =>
          idx === i ? { ...result, status: "processing", progress: 0 } : result,
        ),
      }));

      try {
        const code = await file.text();

        // Use the correct API endpoint for bulk processing
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            filename: file.name,
            layers: selectedLayers.length > 0 ? selectedLayers : "auto",
            applyFixes,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          results.push(result);
          setBulkState((prev) => ({
            ...prev,
            results: prev.results.map((r, idx) =>
              idx === i
                ? { ...r, status: "completed", progress: 100, result }
                : r,
            ),
            overallProgress: ((i + 1) / totalFiles) * 100,
          }));
        } else {
          setBulkState((prev) => ({
            ...prev,
            results: prev.results.map((r, idx) =>
              idx === i
                ? { ...r, status: "error", progress: 0, error: result.error }
                : r,
            ),
            overallProgress: ((i + 1) / totalFiles) * 100,
          }));
        }
      } catch (error) {
        setBulkState((prev) => ({
          ...prev,
          results: prev.results.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: "error",
                  progress: 0,
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                }
              : r,
          ),
          overallProgress: ((i + 1) / totalFiles) * 100,
        }));
      }

      // Add delay to prevent rate limiting
      if (i < bulkState.files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setBulkState((prev) => ({ ...prev, processing: false }));
    onAnalysisComplete(results);
  };

  const clearFiles = () => {
    setBulkState({
      files: [],
      processing: false,
      results: [],
      overallProgress: 0,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "○";
      case "processing":
        return "◐";
      case "completed":
        return "●";
      case "error":
        return "✕";
      default:
        return "○";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "rgba(255, 255, 255, 0.5)";
      case "processing":
        return "rgba(33, 150, 243, 0.9)";
      case "completed":
        return "rgba(76, 175, 80, 0.9)";
      case "error":
        return "rgba(229, 62, 62, 0.9)";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  return (
    <div className="bulk-processor">
      <div className="bulk-header">
        <h3>Bulk File Processing</h3>
        <p className="bulk-description">
          Process multiple React/Next.js files at once. Upload entire folders or
          select multiple files.
        </p>
      </div>

      <div className="bulk-upload-section">
        <div className="upload-options">
          <button
            className="upload-option-btn"
            onClick={() => folderInputRef.current?.click()}
            disabled={bulkState.processing}
          >
            <div className="upload-option-icon">📁</div>
            <div className="upload-option-text">
              <strong>Upload Folder</strong>
              <span>Select entire folder with React files</span>
            </div>
          </button>

          <button
            className="upload-option-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={bulkState.processing}
          >
            <div className="upload-option-icon">📄</div>
            <div className="upload-option-text">
              <strong>Select Multiple Files</strong>
              <span>Choose individual files to process</span>
            </div>
          </button>
        </div>

        <input
          ref={folderInputRef}
          type="file"
          style={{ display: "none" }}
          {...({ webkitdirectory: "" } as any)}
          multiple
          accept=".ts,.tsx,.js,.jsx"
          onChange={handleFolderUpload}
        />

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          multiple
          accept=".ts,.tsx,.js,.jsx"
          onChange={handleMultipleFiles}
        />
      </div>

      {bulkState.files.length > 0 && (
        <div className="bulk-summary">
          <div className="bulk-summary-header">
            <h4>Files Ready for Processing ({bulkState.files.length})</h4>
            <div className="bulk-actions">
              <button
                className="btn btn-primary"
                onClick={processBulkFiles}
                disabled={bulkState.processing}
              >
                {bulkState.processing ? "Processing..." : "Start Bulk Analysis"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={clearFiles}
                disabled={bulkState.processing}
              >
                Clear Files
              </button>
            </div>
          </div>

          {bulkState.processing && (
            <div className="bulk-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${bulkState.overallProgress}%` }}
                />
              </div>
              <div className="progress-text">
                Overall Progress: {Math.round(bulkState.overallProgress)}%
              </div>
            </div>
          )}

          <div className="bulk-file-list">
            {bulkState.results.map((result, index) => (
              <div key={index} className="bulk-file-item">
                <div
                  className="file-status"
                  style={{ color: getStatusColor(result.status) }}
                >
                  {getStatusIcon(result.status)}
                </div>
                <div className="file-info">
                  <div className="file-name">{result.filename}</div>
                  <div className="file-path">
                    {bulkState.files[index]?.webkitRelativePath ||
                      "Selected file"}
                  </div>
                </div>
                <div className="file-progress">
                  {result.status === "processing" && (
                    <div className="mini-progress">
                      <div className="mini-progress-fill" />
                    </div>
                  )}
                  {result.status === "completed" && result.result?.analysis && (
                    <div className="file-metrics">
                      <span className="metric">
                        {result.result.analysis.detectedIssues?.length || 0}{" "}
                        issues
                      </span>
                      <span className="metric">
                        {Math.round(
                          (result.result.analysis.confidence || 0) * 100,
                        )}
                        % confidence
                      </span>
                    </div>
                  )}
                  {result.status === "error" && (
                    <div className="file-error">{result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .bulk-processor {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .bulk-header h3 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .bulk-description {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 24px 0;
          font-size: 0.9rem;
        }

        .upload-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .upload-option-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-option-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .upload-option-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-option-icon {
          font-size: 2rem;
        }

        .upload-option-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .upload-option-text strong {
          font-weight: 600;
          font-size: 1rem;
        }

        .upload-option-text span {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .bulk-summary {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 24px;
        }

        .bulk-summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .bulk-summary-header h4 {
          color: #ffffff;
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .bulk-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(33, 150, 243, 0.4);
          border-radius: 8px;
          backdrop-filter: blur(20px) saturate(1.2);
          -webkit-backdrop-filter: blur(20px) saturate(1.2);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 12px rgba(33, 150, 243, 0.2);
          color: #ffffff;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.22) 50%,
            rgba(255, 255, 255, 0.12) 100%
          );
          border-color: rgba(33, 150, 243, 0.5);
          transform: translateY(-2px);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 16px rgba(33, 150, 243, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .bulk-progress {
          margin-bottom: 20px;
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
            rgba(33, 150, 243, 0.6),
            rgba(76, 175, 80, 0.6)
          );
          transition: width 0.3s ease;
        }

        .progress-text {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          text-align: center;
        }

        .bulk-file-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .bulk-file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .file-status {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        .file-info {
          flex: 1;
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

        .file-progress {
          min-width: 100px;
          text-align: right;
        }

        .mini-progress {
          width: 60px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-left: auto;
        }

        .mini-progress-fill {
          width: 100%;
          height: 100%;
          background: rgba(33, 150, 243, 0.9);
          animation: indeterminate 2s infinite linear;
        }

        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .file-metrics {
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: flex-end;
        }

        .metric {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .file-error {
          font-size: 0.8rem;
          color: rgba(229, 62, 62, 0.9);
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .upload-options {
            grid-template-columns: 1fr;
          }

          .bulk-summary-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .bulk-actions {
            justify-content: stretch;
          }

          .btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
