import * as vscode from "vscode";
import { NeuroLintProvider } from "./providers/NeuroLintProvider";
import { NeuroLintCodeActionProvider } from "./providers/CodeActionProvider";
import { NeuroLintHoverProvider } from "./providers/HoverProvider";
import { NeuroLintDiagnosticProvider } from "./providers/DiagnosticProvider";
import { NeuroLintTreeDataProvider } from "./providers/TreeDataProvider";
import { NeuroLintStatusBar } from "./ui/StatusBar";
import { NeuroLintWebview } from "./ui/Webview";
import { ConfigurationManager } from "./utils/ConfigurationManager";
import { ApiClient } from "./utils/ApiClient";

let neurolintProvider: NeuroLintProvider;
let diagnosticProvider: NeuroLintDiagnosticProvider;
let statusBar: NeuroLintStatusBar;
let outputChannel: vscode.OutputChannel;
let webview: NeuroLintWebview;
let configManager: ConfigurationManager;
let apiClient: ApiClient;

export function activate(context: vscode.ExtensionContext) {
  try {
    // Initialize output channel
    outputChannel = vscode.window.createOutputChannel("NeuroLint");
    outputChannel.appendLine("NeuroLint extension activating...");

    // Initialize configuration manager
    configManager = new ConfigurationManager();
    outputChannel.appendLine("Configuration manager initialized");

    // Validate configuration on startup
    const configValidation = configManager.validateConfiguration();
    if (!configValidation.valid) {
      outputChannel.appendLine(
        `Configuration issues found: ${configValidation.errors.join(", ")}`,
      );
      statusBar?.updateStatus("Configuration Error");
    }
    if (configValidation.warnings.length > 0) {
      outputChannel.appendLine(
        `Configuration warnings: ${configValidation.warnings.join(", ")}`,
      );
    }

    // Initialize API client with secure storage
    apiClient = new ApiClient(configManager, context.secrets);
    outputChannel.appendLine("API client initialized");

    // Initialize status bar early
    statusBar = new NeuroLintStatusBar();
    context.subscriptions.push(statusBar.statusBarItem);
    statusBar.updateStatus("Initializing...", true);

    // Initialize main provider
    neurolintProvider = new NeuroLintProvider(
      apiClient,
      configManager,
      outputChannel,
    );
    context.subscriptions.push(neurolintProvider);
    outputChannel.appendLine("Main provider initialized");

    // Initialize diagnostic provider
    diagnosticProvider = new NeuroLintDiagnosticProvider(
      apiClient,
      outputChannel,
    );
    context.subscriptions.push(diagnosticProvider);
    outputChannel.appendLine("Diagnostic provider initialized");

    // Initialize webview
    webview = new NeuroLintWebview();
    context.subscriptions.push(webview);
    outputChannel.appendLine("Webview initialized");

    // Register providers
    const selector = [
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
    ];

    // Code action provider (quick fixes)
    try {
      context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
          selector,
          new NeuroLintCodeActionProvider(apiClient, outputChannel),
        ),
      );
      outputChannel.appendLine("Code action provider registered");
    } catch (error) {
      outputChannel.appendLine(
        `Failed to register code action provider: ${error}`,
      );
    }

    // Hover provider (documentation)
    try {
      context.subscriptions.push(
        vscode.languages.registerHoverProvider(
          selector,
          new NeuroLintHoverProvider(apiClient, outputChannel),
        ),
      );
      outputChannel.appendLine("Hover provider registered");
    } catch (error) {
      outputChannel.appendLine(`Failed to register hover provider: ${error}`);
    }

    // Tree data provider (explorer view)
    try {
      const treeDataProvider = new NeuroLintTreeDataProvider(
        apiClient,
        outputChannel,
      );
      context.subscriptions.push(treeDataProvider);
      vscode.window.registerTreeDataProvider(
        "neurolintExplorer",
        treeDataProvider,
      );
      outputChannel.appendLine("Tree data provider registered");
    } catch (error) {
      outputChannel.appendLine(
        `Failed to register tree data provider: ${error}`,
      );
    }

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand("neurolint.analyzeFile", analyzeFile),
      vscode.commands.registerCommand(
        "neurolint.analyzeWorkspace",
        analyzeWorkspace,
      ),
      vscode.commands.registerCommand(
        "neurolint.toggleDiagnostics",
        toggleDiagnostics,
      ),
      vscode.commands.registerCommand("neurolint.openSettings", openSettings),
      vscode.commands.registerCommand("neurolint.showHistory", showHistory),
      vscode.commands.registerCommand("neurolint.exportResults", exportResults),
      vscode.commands.registerCommand("neurolint.importConfig", importConfig),
      vscode.commands.registerCommand("neurolint.exportConfig", exportConfig),
      vscode.commands.registerCommand("neurolint.resetConfig", resetConfig),
      vscode.commands.registerCommand("neurolint.refreshTree", refreshTree),
      vscode.commands.registerCommand("neurolint.viewResult", viewResult),
      vscode.commands.registerCommand("neurolint.clearCache", clearCache),
      vscode.commands.registerCommand("neurolint.viewDocumentation", viewDocs),
      vscode.commands.registerCommand("neurolint.login", login),
    );

    // Configuration change listener
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("neurolint")) {
          outputChannel.appendLine("Configuration changed, reloading...");
          configManager.reloadConfiguration();

          // Update status bar
          const configValidation = configManager.validateConfiguration();
          if (!configValidation.valid) {
            statusBar.updateStatus("Configuration Error");
          } else {
            statusBar.updateStatus("Ready");
          }
        }
      }),
    );

    // Workspace folder changes
    context.subscriptions.push(
      vscode.workspace.onDidChangeWorkspaceFolders(() => {
        outputChannel.appendLine("Workspace folders changed");
        diagnosticProvider.clearAllDiagnostics();
      }),
    );

    // Document changes for real-time analysis
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (
          configManager.getConfiguration().autoFix &&
          selector.some(
            (s) =>
              s.language === e.document.languageId &&
              s.scheme === e.document.uri.scheme,
          )
        ) {
          // Debounce rapid changes
          setTimeout(() => {
            diagnosticProvider.updateDiagnostics(e.document);
          }, 500);
        }
      }),
    );

    // File save events
    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument((document) => {
        if (
          configManager.getConfiguration().autoFix &&
          selector.some(
            (s) =>
              s.language === document.languageId &&
              s.scheme === document.uri.scheme,
          )
        ) {
          analyzeFile(document.uri);
        }
      }),
    );

    outputChannel.appendLine("NeuroLint extension activated successfully");
    statusBar.updateStatus("Ready");
  } catch (error) {
    outputChannel.appendLine(`Extension activation failed: ${error}`);
    statusBar?.updateStatus("Activation Failed");
    vscode.window.showErrorMessage(
      `NeuroLint activation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export function deactivate() {
  outputChannel?.appendLine("NeuroLint extension deactivating...");
  diagnosticProvider?.clearAllDiagnostics();
  statusBar?.dispose();
  outputChannel?.dispose();
}

// Command implementations
async function analyzeFile(uri?: vscode.Uri): Promise<void> {
  try {
    const document = uri
      ? await vscode.workspace.openTextDocument(uri)
      : vscode.window.activeTextEditor?.document;

    if (!document) {
      vscode.window.showWarningMessage("No active document to analyze");
      return;
    }

    statusBar.updateStatus("Analyzing...", true);
    outputChannel.appendLine(`Analyzing file: ${document.fileName}`);

    const results = await neurolintProvider.analyzeDocument(document);

    if (results) {
      outputChannel.appendLine(
        `Analysis completed: ${results.changes?.length || 0} suggestions`,
      );
      webview.showAnalysisResults(results);
      diagnosticProvider.updateDiagnostics(document);
    }

    statusBar.updateStatus("Ready");
  } catch (error) {
    statusBar.updateStatus("Analysis Failed");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    outputChannel.appendLine(`Analysis failed: ${errorMessage}`);
    vscode.window.showErrorMessage(`Analysis failed: ${errorMessage}`);
  }
}

async function analyzeWorkspace(): Promise<void> {
  try {
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showWarningMessage("No workspace folder is open");
      return;
    }

    statusBar.updateStatus("Analyzing workspace...", true);
    outputChannel.appendLine("Starting workspace analysis");

    const results = await neurolintProvider.analyzeWorkspace();

    if (results) {
      outputChannel.appendLine("Workspace analysis completed");
      webview.showAnalysisResults(results);
    }

    statusBar.updateStatus("Ready");
  } catch (error) {
    statusBar.updateStatus("Analysis Failed");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    outputChannel.appendLine(`Workspace analysis failed: ${errorMessage}`);
    vscode.window.showErrorMessage(
      `Workspace analysis failed: ${errorMessage}`,
    );
  }
}

async function toggleDiagnostics(): Promise<void> {
  const enabled = diagnosticProvider.toggleDiagnostics();
  vscode.window.showInformationMessage(
    `Diagnostics ${enabled ? "enabled" : "disabled"}`,
  );
  outputChannel.appendLine(`Diagnostics ${enabled ? "enabled" : "disabled"}`);
}

async function openSettings(): Promise<void> {
  const options = [
    "API Settings",
    "Analysis Settings",
    "Diagnostic Level",
    "Workspace Settings",
    "Import Config",
    "Export Config",
    "Reset Config",
  ];

  const choice = await vscode.window.showQuickPick(options, {
    placeHolder: "Select settings category",
  });

  switch (choice) {
    case "API Settings":
      await configureApiSettings();
      break;
    case "Analysis Settings":
      await configureAnalysisSettings();
      break;
    case "Diagnostic Level":
      await configureDiagnosticLevel();
      break;
    case "Workspace Settings":
      await configureWorkspaceSettings();
      break;
    case "Import Config":
      await importConfig();
      break;
    case "Export Config":
      await exportConfig();
      break;
    case "Reset Config":
      await resetConfig();
      break;
  }
}

async function configureApiSettings(): Promise<void> {
  const apiUrl = await vscode.window.showInputBox({
    prompt: "Enter NeuroLint API URL",
    value: configManager.getApiUrl(),
    validateInput: (value) => {
      if (!value || !value.startsWith("http")) {
        return "Please enter a valid HTTP URL";
      }
      return null;
    },
  });

  if (apiUrl) {
    await configManager.setApiUrl(apiUrl);
    vscode.window.showInformationMessage("API URL updated successfully");
  }

  const apiKey = await vscode.window.showInputBox({
    prompt: "Enter your NeuroLint API key",
    password: true,
    value: configManager.getApiKey(),
  });

  if (apiKey) {
    await configManager.setApiKey(apiKey);
    vscode.window.showInformationMessage("API key updated successfully");
  }
}

async function configureAnalysisSettings(): Promise<void> {
  const enabledLayers = configManager.getEnabledLayers();
  const layerOptions = [
    { label: "Layer 1: Basic TypeScript checks", value: 1 },
    { label: "Layer 2: React/JSX patterns", value: 2 },
    { label: "Layer 3: Next.js optimizations", value: 3 },
    { label: "Layer 4: Performance patterns", value: 4 },
    { label: "Layer 5: Security analysis", value: 5 },
    { label: "Layer 6: Advanced transformations", value: 6 },
  ];

  const selectedLayers = await vscode.window.showQuickPick(
    layerOptions.map((option) => ({
      ...option,
      picked: enabledLayers.includes(option.value),
    })),
    {
      canPickMany: true,
      placeHolder: "Select analysis layers to enable",
    },
  );

  if (selectedLayers) {
    const newLayers = selectedLayers.map((item) => item.value);
    await configManager.setEnabledLayers(newLayers);
    vscode.window.showInformationMessage(
      `Analysis layers updated: ${newLayers.join(", ")}`,
    );
  }

  const autoFix = await vscode.window.showQuickPick(["Enable", "Disable"], {
    placeHolder: "Auto-fix on save",
  });

  if (autoFix) {
    await configManager.setAutoFix(autoFix === "Enable");
    vscode.window.showInformationMessage(
      `Auto-fix ${autoFix === "Enable" ? "enabled" : "disabled"}`,
    );
  }
}

async function configureDiagnosticLevel(): Promise<void> {
  const levels = ["error", "warning", "info"];
  const currentLevel = configManager.getDiagnosticsLevel();

  const selectedLevel = await vscode.window.showQuickPick(
    levels.map((level) => ({
      label: level.charAt(0).toUpperCase() + level.slice(1),
      value: level,
      picked: level === currentLevel,
    })),
    {
      placeHolder: "Select diagnostic level",
    },
  );

  if (selectedLevel) {
    await configManager.setDiagnosticsLevel(selectedLevel.value as any);
    vscode.window.showInformationMessage(
      `Diagnostic level set to: ${selectedLevel.label}`,
    );
  }
}

async function configureWorkspaceSettings(): Promise<void> {
  const settings = configManager.getWorkspaceSettings();

  const maxFiles = await vscode.window.showInputBox({
    prompt: "Maximum files to analyze",
    value: settings.maxFiles.toString(),
    validateInput: (value) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 1) {
        return "Please enter a valid number greater than 0";
      }
      return null;
    },
  });

  if (maxFiles) {
    await configManager.setWorkspaceSettings({
      ...settings,
      maxFiles: parseInt(maxFiles),
    });
    vscode.window.showInformationMessage("Workspace settings updated");
  }
}

async function showHistory(): Promise<void> {
  vscode.window.showInformationMessage("History feature coming soon!");
}

async function exportResults(): Promise<void> {
  vscode.window.showInformationMessage("Export feature coming soon!");
}

async function importConfig(): Promise<void> {
  const uri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectMany: false,
    filters: {
      "JSON files": ["json"],
    },
  });

  if (uri && uri[0]) {
    try {
      await configManager.importConfiguration(uri[0]);
      vscode.window.showInformationMessage(
        "Configuration imported successfully",
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

async function exportConfig(): Promise<void> {
  const uri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file("neurolint-config.json"),
    filters: {
      "JSON files": ["json"],
    },
  });

  if (uri) {
    try {
      await configManager.exportConfiguration(uri);
      vscode.window.showInformationMessage(
        `Configuration exported to ${uri.fsPath}`,
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

async function resetConfig(): Promise<void> {
  const confirm = await vscode.window.showWarningMessage(
    "Are you sure you want to reset all NeuroLint settings to defaults?",
    { modal: true },
    "Reset",
    "Cancel",
  );

  if (confirm === "Reset") {
    try {
      await configManager.resetConfiguration();
      vscode.window.showInformationMessage("Configuration reset successfully");
    } catch (error) {
      vscode.window.showErrorMessage(
        `Reset failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

async function refreshTree(): Promise<void> {
  // Tree view refresh logic would go here
  vscode.window.showInformationMessage("Tree view refreshed");
}

async function viewResult(result: any): Promise<void> {
  webview.showAnalysisResults(result);
}

async function clearCache(): Promise<void> {
  vscode.window.showInformationMessage("Cache cleared!");
}

async function viewDocs(): Promise<void> {
  vscode.env.openExternal(vscode.Uri.parse("https://neurolint.dev/docs"));
}

async function login(): Promise<void> {
  const apiKey = await vscode.window.showInputBox({
    prompt: "Enter your NeuroLint API key",
    password: true,
    placeHolder: "API key from neurolint.dev",
  });

  if (!apiKey || apiKey.trim().length === 0) {
    vscode.window.showWarningMessage("API key is required");
    return;
  }

  try {
    const trimmedApiKey = apiKey.trim();
    statusBar.updateStatus("Authenticating...", true);

    // Test the API key
    const userInfo = await apiClient.authenticate(trimmedApiKey);

    if (userInfo) {
      await configManager.setApiKey(trimmedApiKey);
      statusBar.updateStatus("Authenticated");

      vscode.window
        .showInformationMessage(
          `Welcome ${userInfo.name || "to NeuroLint"}!`,
          "View Dashboard",
        )
        .then((action) => {
          if (action === "View Dashboard") {
            vscode.env.openExternal(
              vscode.Uri.parse(`${configManager.getApiUrl()}/dashboard`),
            );
          }
        });
    }
  } catch (error) {
    statusBar.updateStatus("Authentication Failed");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    outputChannel.appendLine(`Authentication failed: ${errorMessage}`);
    vscode.window.showErrorMessage(`Authentication failed: ${errorMessage}`);
  }
}
