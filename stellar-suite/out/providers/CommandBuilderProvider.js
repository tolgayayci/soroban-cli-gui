"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuilderProvider = void 0;
const vscode = __importStar(require("vscode"));
const commands_1 = require("../data/commands");
class CommandBuilderProvider {
    _extensionUri;
    static viewType = "commandBuilder";
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case "runCommand":
                    vscode.window.showInformationMessage(`Running command: ${data.value}`);
                    const terminal = vscode.window.createTerminal("Soroban");
                    terminal.sendText(data.value);
                    terminal.show();
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "commandBuilder.js"));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "commandBuilder.css"));
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
							${commands_1.commands
            .map((cmd) => `<option value="${cmd.value}">${cmd.label}</option>`)
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
					const commandData = ${JSON.stringify(commands_1.commands)};
					initCommandBuilder(commandData);
				</script>
			</body>
			</html>`;
    }
}
exports.CommandBuilderProvider = CommandBuilderProvider;
//# sourceMappingURL=CommandBuilderProvider.js.map