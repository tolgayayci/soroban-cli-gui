import * as vscode from "vscode";
import * as path from "path";

import { CommandHistoryProvider } from "./providers/CommandHistoryProvider";
import { CommandBuilderProvider } from "./providers/CommandBuilderProvider";
import { CommandHistoryItem } from "./types";
import { formatCliOutput } from "./utils/fileUtils";

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Soroban Command Output");

  const commandBuilderProvider = new CommandBuilderProvider(
    context.extensionUri
  );

  const commandBuilderWebView = vscode.window.registerWebviewViewProvider(
    CommandBuilderProvider.viewType,
    commandBuilderProvider
  );

  const logFilePath = path.join(
    context.extensionPath,
    "soroban_command_history.log"
  );
  const commandHistoryProvider = new CommandHistoryProvider(logFilePath);
  vscode.window.registerTreeDataProvider(
    "commandHistory",
    commandHistoryProvider
  );

  let refreshCommand = vscode.commands.registerCommand(
    "stellar-suite.refreshCommandHistory",
    () => {
      commandHistoryProvider.refresh();
    }
  );

  let runHistoryCommand = vscode.commands.registerCommand(
    "stellar-suite.runHistoryCommand",
    (item: CommandHistoryItem) => {
      if (item.commandToRun) {
        const terminal = vscode.window.createTerminal("Soroban");
        terminal.sendText(item.commandToRun);
        terminal.show();
      }
    }
  );

  let showCommandResult = vscode.commands.registerCommand(
    "stellar-suite.showCommandResult",
    (result: string) => {
      const formattedResult = formatCliOutput(result);
      outputChannel.clear();
      outputChannel.appendLine(formattedResult);
      outputChannel.show(true);
    }
  );

  context.subscriptions.push(
    refreshCommand,
    runHistoryCommand,
    showCommandResult,
    outputChannel,
    commandBuilderWebView
  );
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}
