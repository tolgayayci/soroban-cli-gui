import * as vscode from "vscode";
import * as path from "path";

import { CommandHistoryProvider } from "./providers/CommandHistoryProvider";
import { CommandBuilderPanel } from "./panels/CommandBuilderPanel";
import { CommandHistoryItem } from "./types";

let outputChannel: vscode.OutputChannel;

function formatCliOutput(result: string): string {
  try {
    // The result is already a string, no need to parse JSON
    let output = "Command Output:\n\n";
    output += result
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");
    return output;
  } catch (error) {
    console.error("Error formatting output:", error);
    return result; // Return the original string if formatting fails
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "stellar-suite" is now active!');
  outputChannel = vscode.window.createOutputChannel("Soroban Command Output");

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

  let openCommandBuilder = vscode.commands.registerCommand(
    "stellar-suite.openCommandBuilder",
    () => {
      CommandBuilderPanel.createOrShow(context.extensionUri);
    }
  );

  context.subscriptions.push(
    refreshCommand,
    runHistoryCommand,
    showCommandResult,
    outputChannel,
    openCommandBuilder
  );
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}
