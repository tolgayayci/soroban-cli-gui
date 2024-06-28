import * as vscode from "vscode";
import { readLogFile } from "../utils/fileUtils";
import { LogEntry, CommandHistoryItem, CommandDetailItem } from "../types";

export class CommandHistoryProvider
  implements vscode.TreeDataProvider<CommandHistoryItem | CommandDetailItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    CommandHistoryItem | CommandDetailItem | undefined | null | void
  > = new vscode.EventEmitter<
    CommandHistoryItem | CommandDetailItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<
    CommandHistoryItem | CommandDetailItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private logFilePath: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(
    element: CommandHistoryItem | CommandDetailItem
  ): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: CommandHistoryItem | CommandDetailItem
  ): Thenable<(CommandHistoryItem | CommandDetailItem)[]> {
    if (!element) {
      const logEntries = readLogFile(this.logFilePath);
      return Promise.resolve(this.getCommandHistoryItems(logEntries));
    } else if (element instanceof CommandHistoryItem) {
      return Promise.resolve([
        new CommandDetailItem("Path", element.path),
        new CommandDetailItem("Timestamp", element.timestamp),
        new CommandDetailItem("Result", "Click to view result", element.result),
      ]);
    }
    return Promise.resolve([]);
  }

  private getCommandHistoryItems(logEntries: LogEntry[]): CommandHistoryItem[] {
    return logEntries.map(
      (entry) =>
        new CommandHistoryItem(
          entry.command,
          entry.timestamp,
          entry.path,
          entry.result,
          entry.command
        )
    );
  }
}
