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
exports.CommandBuilderPanel = void 0;
const vscode = __importStar(require("vscode"));
const commands_1 = require("../data/commands");
class CommandBuilderPanel {
    static currentPanel;
    _panel;
    _disposables = [];
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (CommandBuilderPanel.currentPanel) {
            CommandBuilderPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel("sorobanCommandBuilder", "Soroban Command Builder", column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
        });
        CommandBuilderPanel.currentPanel = new CommandBuilderPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._panel = panel;
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, extensionUri);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "runCommand":
                    vscode.window.showInformationMessage(`Running command: ${message.text}`);
                    const terminal = vscode.window.createTerminal("Soroban");
                    terminal.sendText(message.text);
                    terminal.show();
                    return;
            }
        }, null, this._disposables);
    }
    _getHtmlForWebview(webview, extensionUri) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "commandBuilder.js"));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "commandBuilder.css"));
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
            </html>
        `;
    }
    dispose() {
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
exports.CommandBuilderPanel = CommandBuilderPanel;
//# sourceMappingURL=CommandBuilderPanel.js.map