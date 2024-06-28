import * as vscode from "vscode";
import { commands } from "../data/commands";

export class CommandBuilderProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "commandBuilder";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

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
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "commandBuilder.js")
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "commandBuilder.css")
    );

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Soroban Command Builder</title>
			</head>
			<body>
				<div id="app">
					<h2>Soroban Command Builder</h2>
					<div class="command-selector">
						<select id="commandSelect">
							${commands
                .map(
                  (cmd) => `<option value="${cmd.value}">${cmd.label}</option>`
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
			</html>`;
  }
}
