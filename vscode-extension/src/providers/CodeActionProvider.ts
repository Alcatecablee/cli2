import * as vscode from "vscode";
import { ApiClient } from "../utils/ApiClient";

export class NeuroLintCodeActionProvider implements vscode.CodeActionProvider {
  constructor(
    private apiClient: ApiClient,
    private outputChannel: vscode.OutputChannel,
  ) {}

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    const actions: vscode.CodeAction[] = [];

    // Add quick fix for NeuroLint diagnostics
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source === "NeuroLint") {
        const action = new vscode.CodeAction(
          `NeuroLint: Fix ${diagnostic.message}`,
          vscode.CodeActionKind.QuickFix,
        );
        action.diagnostics = [diagnostic];
        actions.push(action);
      }
    }

    return actions;
  }
}
