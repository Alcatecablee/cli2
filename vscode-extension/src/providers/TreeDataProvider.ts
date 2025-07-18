import * as vscode from "vscode";
import { ApiClient } from "../utils/ApiClient";

export class NeuroLintTreeDataProvider
  implements vscode.TreeDataProvider<TreeItem>, vscode.Disposable
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | null | void
  > = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(
    private apiClient: ApiClient,
    private outputChannel: vscode.OutputChannel,
  ) {}

  public getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  public getChildren(element?: TreeItem): Thenable<TreeItem[]> {
    if (!element) {
      return Promise.resolve([
        new TreeItem(
          "NeuroLint",
          vscode.TreeItemCollapsibleState.Expanded,
          "status",
        ),
        new TreeItem(
          "Analysis",
          vscode.TreeItemCollapsibleState.Collapsed,
          "folder",
        ),
      ]);
    }

    if (element.label === "NeuroLint") {
      return Promise.resolve([
        new TreeItem("Connected", vscode.TreeItemCollapsibleState.None, "info"),
        new TreeItem("Ready", vscode.TreeItemCollapsibleState.None, "info"),
      ]);
    }

    if (element.label === "Analysis") {
      return Promise.resolve([
        new TreeItem(
          "No recent analysis",
          vscode.TreeItemCollapsibleState.None,
          "info",
        ),
      ]);
    }

    return Promise.resolve([]);
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    iconPath?: string,
  ) {
    super(label, collapsibleState);
    if (iconPath) {
      this.iconPath = new vscode.ThemeIcon(iconPath);
    }
  }
}
