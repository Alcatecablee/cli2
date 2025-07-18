import * as vscode from "vscode";
import { ApiClient, AnalysisRequest, AnalysisResult } from "../utils/ApiClient";
import { ConfigurationManager } from "../utils/ConfigurationManager";

export class NeuroLintProvider implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];

  constructor(
    private apiClient: ApiClient,
    private configManager: ConfigurationManager,
    private outputChannel: vscode.OutputChannel,
  ) {}

  /**
   * Layer Dependency Management (from IMPLEMENTATION_PATTERNS.md)
   * Validates and corrects layer selection based on dependencies
   */
  private validateAndCorrectLayers(requestedLayers: number[]) {
    const DEPENDENCIES = {
      1: [], // Configuration has no dependencies
      2: [1], // Entity cleanup depends on config foundation
      3: [1, 2], // Components depend on config + cleanup
      4: [1, 2, 3], // Hydration depends on all previous layers
      5: [1, 2, 3, 4], // Next.js depends on all core layers
      6: [1, 2, 3, 4, 5], // Testing depends on all previous layers
    };

    const LAYER_INFO = {
      1: { name: "Configuration", critical: true },
      2: { name: "Entity Cleanup", critical: false },
      3: { name: "Components", critical: false },
      4: { name: "Hydration", critical: false },
      5: { name: "Next.js App Router", critical: false },
      6: { name: "Testing & Validation", critical: false },
    };

    const warnings: string[] = [];
    const autoAdded: number[] = [];
    let correctedLayers = [...requestedLayers];

    // Sort layers in execution order
    correctedLayers.sort((a, b) => a - b);

    // Check dependencies for each requested layer
    for (const layerId of requestedLayers) {
      const dependencies =
        DEPENDENCIES[layerId as keyof typeof DEPENDENCIES] || [];
      const missingDeps = dependencies.filter(
        (dep) => !correctedLayers.includes(dep),
      );

      if (missingDeps.length > 0) {
        // Auto-add missing dependencies
        correctedLayers.push(...missingDeps);
        autoAdded.push(...missingDeps);

        warnings.push(
          `Layer ${layerId} (${LAYER_INFO[layerId as keyof typeof LAYER_INFO]?.name}) requires ` +
            `${missingDeps.map((dep) => `${dep} (${LAYER_INFO[dep as keyof typeof LAYER_INFO]?.name})`).join(", ")}. ` +
            `Auto-added missing dependencies.`,
        );
      }
    }

    // Remove duplicates and sort
    correctedLayers = [...new Set(correctedLayers)].sort((a, b) => a - b);

    return {
      correctedLayers,
      warnings,
      autoAdded,
    };
  }

  public async analyzeDocument(
    document: vscode.TextDocument,
  ): Promise<AnalysisResult | null> {
    try {
      if (!this.apiClient.isAuthenticated()) {
        this.outputChannel.appendLine("No API key configured");
        return null;
      }

      // Check usage limits
      const usageCheck = await this.apiClient.checkUsageLimit();
      if (!usageCheck.canUse) {
        const message = `Usage limit reached (${usageCheck.usage.current}/${usageCheck.usage.limit}). Upgrade your plan to continue.`;
        this.outputChannel.appendLine(message);
        vscode.window
          .showWarningMessage(message, "Upgrade Plan")
          .then((selection) => {
            if (selection === "Upgrade Plan") {
              vscode.env.openExternal(
                vscode.Uri.parse("https://neurolint.dev/pricing"),
              );
            }
          });
        return null;
      }

      // Check premium feature access for layers 5 and 6
      const enabledLayers = this.configManager.getEnabledLayers();
      const premiumLayers = enabledLayers.filter((layer) => layer >= 5);

      if (premiumLayers.length > 0) {
        const userInfo = await this.apiClient.getUserInfo();
        if (userInfo && userInfo.plan === "free") {
          const message = `Layers ${premiumLayers.join(", ")} require Pro plan ($24.99/month). Upgrade to access Next.js and advanced features.`;
          this.outputChannel.appendLine(message);
          vscode.window
            .showWarningMessage(message, "Upgrade to Pro")
            .then((selection) => {
              if (selection === "Upgrade to Pro") {
                vscode.env.openExternal(
                  vscode.Uri.parse("https://neurolint.dev/pricing"),
                );
              }
            });
          // Continue with only free layers (1-4)
          const freeLayers = enabledLayers.filter((layer) => layer <= 4);
          if (freeLayers.length === 0) return null;
        }
      }

      // Apply layer dependency management (from IMPLEMENTATION_PATTERNS.md)
      const requestedLayers = this.configManager.getEnabledLayers();
      const validatedLayers = this.validateAndCorrectLayers(requestedLayers);

      if (validatedLayers.warnings.length > 0) {
        this.outputChannel.appendLine(
          `Layer dependencies auto-corrected: ${validatedLayers.warnings.join(", ")}`,
        );
      }

      const request: AnalysisRequest = {
        code: document.getText(),
        filename: document.fileName,
        layers: validatedLayers.correctedLayers,
        metadata: {
          language: document.languageId,
          uri: document.uri.toString(),
          version: document.version,
        },
      };

      this.outputChannel.appendLine(`Analyzing document: ${document.fileName}`);

      const result = await this.apiClient.analyzeCode(request);

      this.outputChannel.appendLine(
        `Analysis completed with ${result.changes?.length || 0} suggestions`,
      );

      return result;
    } catch (error) {
      this.outputChannel.appendLine(
        `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  public async analyzeWorkspace(): Promise<AnalysisResult | null> {
    try {
      if (!vscode.workspace.workspaceFolders) {
        this.outputChannel.appendLine("No workspace folder available");
        return null;
      }

      if (!this.apiClient.isAuthenticated()) {
        this.outputChannel.appendLine("No API key configured");
        return null;
      }

      // Check if user has bulk processing feature
      const canUseBulkProcessing =
        await this.apiClient.canUseFeature("bulkProcessing");
      if (!canUseBulkProcessing) {
        const message = "Workspace analysis requires a Pro plan or higher.";
        this.outputChannel.appendLine(message);
        vscode.window
          .showWarningMessage(message, "Upgrade to Pro")
          .then((selection) => {
            if (selection === "Upgrade to Pro") {
              vscode.env.openExternal(
                vscode.Uri.parse("https://neurolint.dev/pricing"),
              );
            }
          });
        return null;
      }

      const files = await this.collectWorkspaceFiles();

      if (files.length === 0) {
        this.outputChannel.appendLine("No files found to analyze");
        return null;
      }

      this.outputChannel.appendLine(
        `Analyzing ${files.length} files in workspace`,
      );

      const result = await this.apiClient.analyzeWorkspace(files);

      this.outputChannel.appendLine(`Workspace analysis completed`);

      return result;
    } catch (error) {
      this.outputChannel.appendLine(
        `Workspace analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  private async collectWorkspaceFiles(): Promise<
    Array<{
      filename: string;
      code: string;
    }>
  > {
    const files: Array<{ filename: string; code: string }> = [];
    const workspaceSettings = this.configManager.getWorkspaceSettings();

    if (!vscode.workspace.workspaceFolders) {
      return files;
    }

    for (const includePattern of workspaceSettings.includePatterns) {
      const fileUris = await vscode.workspace.findFiles(
        includePattern,
        `{${workspaceSettings.excludePatterns.join(",")}}`,
        workspaceSettings.maxFiles,
      );

      for (const uri of fileUris) {
        try {
          const document = await vscode.workspace.openTextDocument(uri);

          // Check file size limit
          if (document.getText().length <= workspaceSettings.maxFileSize) {
            files.push({
              filename: uri.fsPath,
              code: document.getText(),
            });
          } else {
            this.outputChannel.appendLine(
              `Skipping ${uri.fsPath}: file too large`,
            );
          }
        } catch (error) {
          this.outputChannel.appendLine(
            `Error reading ${uri.fsPath}: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }

        // Respect file count limit
        if (files.length >= workspaceSettings.maxFiles) {
          break;
        }
      }

      if (files.length >= workspaceSettings.maxFiles) {
        break;
      }
    }

    return files;
  }

  private async validateWorkspace(): Promise<void> {
    try {
      this.outputChannel.appendLine("Validating workspace configuration...");

      // Check workspace folders
      if (!vscode.workspace.workspaceFolders) {
        this.outputChannel.appendLine("No workspace folders available");
        return;
      }

      // Validate configuration
      const configValidation = this.configManager.validateConfiguration();
      if (!configValidation.valid) {
        this.outputChannel.appendLine(
          `Configuration errors: ${configValidation.errors.join(", ")}`,
        );
        vscode.window.showErrorMessage(
          `NeuroLint configuration errors: ${configValidation.errors.join(", ")}`,
        );
        return;
      }

      if (configValidation.warnings.length > 0) {
        this.outputChannel.appendLine(
          `Configuration warnings: ${configValidation.warnings.join(", ")}`,
        );
        vscode.window.showWarningMessage(
          `NeuroLint warnings: ${configValidation.warnings.join(", ")}`,
        );
      }

      // Check API connection
      if (this.apiClient.isAuthenticated()) {
        const isValid = await this.apiClient.validateApiKey();
        if (!isValid) {
          vscode.window.showErrorMessage(
            "NeuroLint: Invalid API key. Please check your configuration.",
          );
          return;
        }
      }

      this.outputChannel.appendLine(
        "Workspace validation completed successfully",
      );
    } catch (error) {
      this.outputChannel.appendLine(
        `Workspace validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      vscode.window.showErrorMessage(
        `NeuroLint workspace validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }
}
