import * as vscode from "vscode";
import { readLogFile } from "../utils/fileUtils";

export class CommandHistoryPanel {
  public static currentPanel: CommandHistoryPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri, logFilePath: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (CommandHistoryPanel.currentPanel) {
      CommandHistoryPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "commandHistory",
      "Soroban Command History",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    CommandHistoryPanel.currentPanel = new CommandHistoryPanel(
      panel,
      extensionUri,
      logFilePath
    );
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    logFilePath: string
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update(logFilePath);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "runCommand":
            this._runCommand(message.text);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  private _runCommand(command: string) {
    const terminal = vscode.window.createTerminal("Soroban");
    terminal.sendText(command);
    terminal.show();
  }

  private _update(logFilePath: string) {
    const webview = this._panel.webview;
    this._panel.title = "Soroban Command History";
    this._panel.webview.html = this._getHtmlForWebview(webview, logFilePath);
  }

  private _getHtmlForWebview(webview: vscode.Webview, logFilePath: string) {
    const logEntries = readLogFile(logFilePath);

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Soroban Command History</title>
            </head>
            <body>
                <h1>Soroban Command History</h1>
                <ul id="command-list">
                    ${logEntries
                      .map(
                        (entry) =>
                          `<li>${entry} <button class="run-btn">Run</button></li>`
                      )
                      .join("")}
                </ul>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('command-list').addEventListener('click', (e) => {
                        if (e.target.classList.contains('run-btn')) {
                            const command = e.target.parentElement.textContent.replace('Run', '').trim();
                            vscode.postMessage({ command: 'runCommand', text: command });
                        }
                    });
                </script>
            </body>
            </html>`;
  }

  public dispose() {
    CommandHistoryPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
