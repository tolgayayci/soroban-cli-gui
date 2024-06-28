import * as vscode from "vscode";

export interface LogEntry {
  timestamp: string;
  command: string;
  path: string;
  result: string;
}

export class CommandHistoryItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly timestamp: string,
    public readonly path: string,
    public readonly result: string,
    public readonly commandToRun: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.tooltip = `${timestamp}\nPath: ${path}`;
    this.description = timestamp;
    this.contextValue = "commandHistoryItem";
    this.iconPath = new vscode.ThemeIcon("terminal-cmd");
  }
}

export class CommandDetailItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly detail: string,
    public readonly fullContent?: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = detail;
    this.description = detail;
    if (label === "Result") {
      this.command = {
        command: "stellar-suite.showCommandResult",
        title: "Show Result",
        arguments: [fullContent],
      };
    }
  }
}
