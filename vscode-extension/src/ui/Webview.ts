import * as vscode from "vscode";
import * as path from "path";

export class NeuroLintWebview {
  private panel: vscode.WebviewPanel | undefined;
  private disposables: vscode.Disposable[] = [];

  public showAnalysisResults(results: any): void {
    this.createWebview("NeuroLint Analysis Results", "analysis");
    if (this.panel) {
      this.panel.webview.html = this.generateAnalysisHtml(results);
    }
  }

  public showWorkspaceResults(results: any[]): void {
    this.createWebview("NeuroLint Workspace Analysis", "workspace");
    if (this.panel) {
      this.panel.webview.html = this.generateWorkspaceHtml(results);
    }
  }

  public showDiffView(
    original: string,
    modified: string,
    fileName: string,
  ): void {
    this.createWebview(`NeuroLint Changes: ${fileName}`, "diff");
    if (this.panel) {
      this.panel.webview.html = this.generateDiffHtml(
        original,
        modified,
        fileName,
      );
    }
  }

  private createWebview(title: string, viewType: string): void {
    // Close existing panel if open
    if (this.panel) {
      this.panel.dispose();
    }

    this.panel = vscode.window.createWebviewPanel(
      `neurolint.${viewType}`,
      title,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [],
      },
    );

    // Handle disposal
    this.panel.onDidDispose(
      () => {
        this.panel = undefined;
        this.disposables.forEach((d) => d.dispose());
        this.disposables = [];
      },
      null,
      this.disposables,
    );

    // Handle webview messages
    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleWebviewMessage(message),
      undefined,
      this.disposables,
    );
  }

  private generateAnalysisHtml(results: any): string {
    const layers = results.layers || [];
    const performance = results.performance || {};
    const errors = results.errors || [];

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>NeuroLint Analysis Results</title>
                <style>
                    ${this.getBaseStyles()}
                    .layer-card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 6px;
                        padding: 16px;
                        margin-bottom: 16px;
                    }
                    .layer-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 12px;
                    }
                    .layer-title {
                        font-weight: 600;
                        font-size: 14px;
                    }
                    .layer-status {
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 500;
                    }
                    .status-success {
                        background: var(--vscode-input-background);
                        color: var(--vscode-foreground);
                        border: 1px solid var(--vscode-panel-border);
                    }
                    .status-error {
                        background: var(--vscode-input-background);
                        color: var(--vscode-foreground);
                        border: 1px solid var(--vscode-panel-border);
                    }
                    .status-skipped {
                        background: var(--vscode-input-background);
                        color: var(--vscode-foreground);
                        border: 1px solid var(--vscode-panel-border);
                    }
                    .insights-list {
                        margin-top: 12px;
                    }
                    .insight-item {
                        padding: 8px 12px;
                        margin-bottom: 8px;
                        border-left: 4px solid var(--vscode-panel-border);
                        background: var(--vscode-input-background);
                    }
                    .insight-error {
                        border-left-color: var(--vscode-panel-border);
                    }
                    .insight-warning {
                        border-left-color: var(--vscode-panel-border);
                    }
                    .insight-info {
                        border-left-color: var(--vscode-panel-border);
                    }
                    .performance-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 12px;
                        margin-top: 16px;
                    }
                    .perf-card {
                        padding: 12px;
                        background: var(--vscode-input-background);
                        border-radius: 4px;
                        text-align: center;
                    }
                    .perf-value {
                        font-size: 18px;
                        font-weight: 600;
                        color: var(--vscode-foreground);
                    }
                    .perf-label {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 4px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>NeuroLint Analysis Results</h1>

                    <div class="performance-section">
                        <h2>Performance Summary</h2>
                        <div class="performance-grid">
                            <div class="perf-card">
                                <div class="perf-value">${performance.totalTime || 0}ms</div>
                                <div class="perf-label">Total Time</div>
                            </div>
                            <div class="perf-card">
                                <div class="perf-value">${layers.length}</div>
                                <div class="perf-label">Layers Processed</div>
                            </div>
                            <div class="perf-card">
                                <div class="perf-value">${layers.filter((l: any) => l.status === "success").length}</div>
                                <div class="perf-label">Successful</div>
                            </div>
                            <div class="perf-card">
                                <div class="perf-value">${errors.length}</div>
                                <div class="perf-label">Errors</div>
                            </div>
                        </div>
                    </div>

                    <div class="layers-section">
                        <h2>Layer Analysis</h2>
                        ${layers.map((layer: any) => this.generateLayerHtml(layer)).join("")}
                    </div>

                    ${
                      errors.length > 0
                        ? `
                        <div class="errors-section">
                            <h2>Errors</h2>
                            ${errors
                              .map(
                                (error: any) => `
                                <div class="insight-item insight-error">
                                    <strong>Error:</strong> ${error.message || error}
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                </div>
            </body>
            </html>
        `;
  }

  private generateLayerHtml(layer: any): string {
    const statusClass = `status-${layer.status}`;
    const insights = layer.insights || [];

    return `
            <div class="layer-card">
                <div class="layer-header">
                    <div class="layer-title">Layer ${layer.id}: ${layer.name}</div>
                    <div class="layer-status ${statusClass}">${layer.status.toUpperCase()}</div>
                </div>
                <div class="layer-details">
                    <p>Changes: ${layer.changes || 0}</p>
                    ${layer.error ? `<p style="color: var(--vscode-foreground); font-style: italic;">Error: ${layer.error}</p>` : ""}
                </div>
                ${
                  insights.length > 0
                    ? `
                    <div class="insights-list">
                        <h4>Insights:</h4>
                        ${insights
                          .map(
                            (insight: any) => `
                            <div class="insight-item insight-${insight.severity || "info"}">
                                <strong>${insight.severity?.toUpperCase() || "INFO"}:</strong> ${insight.message}
                                ${insight.line ? `<br><small>Line ${insight.line}</small>` : ""}
                                ${insight.fix ? `<br><small>Fix: ${insight.fix}</small>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  private generateWorkspaceHtml(results: any[]): string {
    const totalFiles = results.length;
    const successfulFiles = results.filter(
      (r) => r.result && !r.result.errors?.length,
    ).length;
    const totalIssues = results.reduce((sum, r) => {
      if (r.result && r.result.layers) {
        return (
          sum +
          r.result.layers.reduce((layerSum: number, layer: any) => {
            return layerSum + (layer.insights?.length || 0);
          }, 0)
        );
      }
      return sum;
    }, 0);

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>NeuroLint Workspace Analysis</title>
                <style>
                    ${this.getBaseStyles()}
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 16px;
                        margin-bottom: 24px;
                    }
                    .summary-card {
                        padding: 16px;
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 6px;
                        text-align: center;
                    }
                    .summary-value {
                        font-size: 24px;
                        font-weight: 600;
                        color: var(--vscode-foreground);
                    }
                    .summary-label {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 4px;
                    }
                    .file-list {
                        margin-top: 24px;
                    }
                    .file-item {
                        padding: 12px;
                        margin-bottom: 8px;
                        background: var(--vscode-input-background);
                        border-radius: 4px;
                        border-left: 4px solid var(--vscode-panel-border);
                    }
                    .file-item.has-issues {
                        border-left-color: var(--vscode-panel-border);
                        opacity: 0.8;
                    }
                    .file-item.no-issues {
                        border-left-color: var(--vscode-panel-border);
                        opacity: 1.0;
                    }
                    .file-name {
                        font-weight: 600;
                        margin-bottom: 4px;
                    }
                    .file-stats {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>NeuroLint Workspace Analysis</h1>

                    <div class="summary-grid">
                        <div class="summary-card">
                            <div class="summary-value">${totalFiles}</div>
                            <div class="summary-label">Files Analyzed</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${successfulFiles}</div>
                            <div class="summary-label">Successful</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${totalIssues}</div>
                            <div class="summary-label">Total Issues</div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-value">${Math.round((successfulFiles / totalFiles) * 100)}%</div>
                            <div class="summary-label">Success Rate</div>
                        </div>
                    </div>

                    <div class="file-list">
                        <h2>File Results</h2>
                        ${results.map((result) => this.generateFileResultHtml(result)).join("")}
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  private generateFileResultHtml(result: any): string {
    const fileName = path.basename(result.file);
    const issues =
      result.result?.layers?.reduce(
        (sum: number, layer: any) => sum + (layer.insights?.length || 0),
        0,
      ) || 0;
    const hasIssues = issues > 0;

    return `
            <div class="file-item ${hasIssues ? "has-issues" : "no-issues"}">
                <div class="file-name">${fileName}</div>
                <div class="file-stats">
                    Issues: ${issues} |
                    Layers: ${result.result?.layers?.length || 0} |
                    Time: ${result.result?.performance?.totalTime || 0}ms
                </div>
            </div>
        `;
  }

  private generateDiffHtml(
    original: string,
    modified: string,
    fileName: string,
  ): string {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>NeuroLint Changes: ${fileName}</title>
                <style>
                    ${this.getBaseStyles()}
                    .diff-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        height: calc(100vh - 100px);
                    }
                    .diff-panel {
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 6px;
                        overflow: hidden;
                    }
                    .diff-header {
                        padding: 12px;
                        background: var(--vscode-editor-background);
                        border-bottom: 1px solid var(--vscode-panel-border);
                        font-weight: 600;
                    }
                    .diff-content {
                        padding: 16px;
                        font-family: var(--vscode-editor-font-family);
                        font-size: var(--vscode-editor-font-size);
                        line-height: 1.4;
                        overflow-y: auto;
                        height: calc(100% - 48px);
                        white-space: pre-wrap;
                        background: var(--vscode-input-background);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>NeuroLint Changes: ${fileName}</h1>

                    <div class="diff-container">
                        <div class="diff-panel">
                            <div class="diff-header">Original</div>
                            <div class="diff-content">${this.escapeHtml(original)}</div>
                        </div>
                        <div class="diff-panel">
                            <div class="diff-header">NeuroLint Enhanced</div>
                            <div class="diff-content">${this.escapeHtml(modified)}</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  private getBaseStyles(): string {
    return `
            :root {
                --container-padding: 20px;
                --border-radius: 6px;
            }

            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background: var(--vscode-editor-background);
                margin: 0;
                padding: 0;
            }

            .container {
                padding: var(--container-padding);
                max-width: 1200px;
                margin: 0 auto;
            }

            h1, h2, h3, h4 {
                color: var(--vscode-foreground);
                margin-top: 0;
            }

            h1 {
                font-size: 24px;
                margin-bottom: 24px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }

            h2 {
                font-size: 18px;
                margin: 24px 0 16px 0;
            }

            p {
                line-height: 1.6;
                margin: 8px 0;
            }

            code {
                background: var(--vscode-textCodeBlock-background);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: var(--vscode-editor-font-family);
            }

            .text-muted {
                color: var(--vscode-descriptionForeground);
            }

            .text-success {
                color: var(--vscode-foreground);
            }

            .text-warning {
                color: var(--vscode-foreground);
            }

            .text-error {
                color: var(--vscode-foreground);
            }
        `;
  }

  private escapeHtml(text: string): string {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  private handleWebviewMessage(message: any): void {
    switch (message.command) {
      case "openFile":
        if (message.file) {
          vscode.workspace.openTextDocument(message.file).then((doc) => {
            vscode.window.showTextDocument(doc);
          });
        }
        break;
      case "applyFix":
        if (message.file && message.fix) {
          vscode.commands.executeCommand(
            "neurolint.applySpecificFix",
            message.file,
            message.fix,
          );
        }
        break;
    }
  }

  public dispose(): void {
    if (this.panel) {
      this.panel.dispose();
    }
    this.disposables.forEach((d) => d.dispose());
  }
}
