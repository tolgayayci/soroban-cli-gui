import * as vscode from "vscode";
import * as path from "path";
import * as childProcess from "child_process";
import { CommandHistoryProvider } from "./providers/CommandHistoryProvider";
import { CommandBuilderProvider } from "./providers/CommandBuilderProvider";
import { CommandHistoryItem } from "./types";

//Utils
import { formatCliOutput } from "./utils/fileUtils";
import { getLogFilePath } from "./utils/general";

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

  childProcess.exec("soroban --version", (error, stdout) => {
    if (error) {
      vscode.commands.executeCommand(
        "setContext",
        "sorobanCLI.installed",
        false
      );
    } else {
      vscode.commands.executeCommand(
        "setContext",
        "sorobanCLI.installed",
        true
      );

      const logFilePath = getLogFilePath();

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

      context.subscriptions.push(refreshCommand, runHistoryCommand);
    }
  });

  let showCommandResult = vscode.commands.registerCommand(
    "stellar-suite.showCommandResult",
    (result: string) => {
      const formattedResult = formatCliOutput(result);
      outputChannel.clear();
      outputChannel.appendLine(formattedResult);
      outputChannel.show(true);
    }
  );

  // Register the installSorobanCLI command
  let installSorobanCLICommand = vscode.commands.registerCommand(
    "stellar-suite.installSorobanCLI",
    () => {
      vscode.env.openExternal(
        vscode.Uri.parse(
          "https://soroban.stellar.org/docs/getting-started/setup"
        )
      );
    }
  );

  context.subscriptions.push(
    showCommandResult,
    outputChannel,
    commandBuilderWebView,
    installSorobanCLICommand
  );
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}
