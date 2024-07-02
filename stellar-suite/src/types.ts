import * as vscode from "vscode";

export interface LogEntry {
  timestamp: string;
  command: string;
  path: string;
  result: string;
}

export class CommandHistoryItem extends vscode.TreeItem {
  constructor(
    public readonly commandText: string,
    public readonly relativeTime: string,
    public readonly timestamp: string,
    public readonly path: string,
    public readonly result: string,
    public readonly commandToRun: string
  ) {
    super(commandText, vscode.TreeItemCollapsibleState.Collapsed);
    this.tooltip = `${commandToRun}\nExecuted: ${timestamp}\nPath: ${path}`;
    this.description = path;
  }

  iconPath = new vscode.ThemeIcon("terminal");
  contextValue = "commandHistoryItem";
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
