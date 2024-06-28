import * as vscode from "vscode";
import { commands } from "../data/commands";

export class CommandBuilderPanel {
  public static currentPanel: CommandBuilderPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (CommandBuilderPanel.currentPanel) {
      CommandBuilderPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "sorobanCommandBuilder",
      "Soroban Command Builder",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      }
    );

    CommandBuilderPanel.currentPanel = new CommandBuilderPanel(
      panel,
      extensionUri
    );
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    this._panel.webview.html = this._getHtmlForWebview(
      this._panel.webview,
      extensionUri
    );

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "runCommand":
            vscode.window.showInformationMessage(
              `Running command: ${message.text}`
            );
            const terminal = vscode.window.createTerminal("Soroban");
            terminal.sendText(message.text);
            terminal.show();
            return;
        }
      },
      null,
      this._disposables
    );
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
  ) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "commandBuilder.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "commandBuilder.css")
    );

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Soroban Command Builder</title>
            </head>
            <body>
                <div id="app">
                    <h1>Soroban Command Builder</h1>
                    <div class="command-selector">
                        <select id="commandSelect">
                            ${commands
                              .map(
                                (cmd) =>
                                  `<option value="${cmd.value}">${cmd.label}</option>`
                              )
                              .join("")}
                        </select>
                    </div>
                    <div id="optionsContainer"></div>
                    <div id="commandPreview"></div>
                    <button id="runButton">Run Command</button>
                </div>
                <script src="${scriptUri}"></script>
                <script>
                    const vscode = acquireVsCodeApi();
                    const commandData = ${JSON.stringify(commands)};
                    initCommandBuilder(commandData);
                </script>
            </body>
            </html>
        `;
  }

  public dispose() {
    CommandBuilderPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
