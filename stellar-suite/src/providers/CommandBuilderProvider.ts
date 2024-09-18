import * as vscode from "vscode";
import { commands } from "../data/commands";

export class CommandBuilderProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "commandBuilder";

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "runCommand":
          vscode.window.showInformationMessage(
            `Running command: ${data.value}`
          );
          const terminal = vscode.window.createTerminal("Soroban");
          terminal.sendText(data.value);
          terminal.show();
          break;
        case "log":
          break;
        case "showInfo":
          vscode.window.showInformationMessage(data.value);
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "commandBuilder.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "commandBuilder.css")
    );
    const toolkitUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "node_modules",
        "@vscode/webview-ui-toolkit",
        "dist",
        "toolkit.min.js"
      )
    );

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <script type="module" src="${toolkitUri}"></script>
        <title>Soroban Command Builder</title>
    </head>
    <body>
        <div id="app">
            <div class="command-section">
                <vscode-text-field id="commandPreview" readonly></vscode-text-field>
                <vscode-dropdown id="commandSelect">
                    <vscode-option value="">Select a command</vscode-option>
                    ${commands
                      .map(
                        (cmd) =>
                          `<vscode-option value="${cmd.value}" ${
                            cmd.value === "build" ? "selected" : ""
                          }>${cmd.label}</vscode-option>`
                      )
                      .join("")}
                </vscode-dropdown>
            </div>
            <div class="options-section">
                <h3>Options & Flags</h3>
                <div id="optionsContainer"></div>
            </div>
            <div class="button-section">
                <vscode-button id="runButton" appearance="primary">Run Command</vscode-button>
            </div>
        </div>
        <script src="${scriptUri}"></script>
        <script>
            const vscode = acquireVsCodeApi();
            const commandData = ${JSON.stringify(commands)};
            initCommandBuilder(commandData, vscode);
        </script>
    </body>
    </html>`;
  }
}
