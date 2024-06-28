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
exports.CommandHistoryPanel = void 0;
const vscode = __importStar(require("vscode"));
const fileUtils_1 = require("../utils/fileUtils");
class CommandHistoryPanel {
    static currentPanel;
    _panel;
    _extensionUri;
    _disposables = [];
    static createOrShow(extensionUri, logFilePath) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (CommandHistoryPanel.currentPanel) {
            CommandHistoryPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel("commandHistory", "Soroban Command History", column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        CommandHistoryPanel.currentPanel = new CommandHistoryPanel(panel, extensionUri, logFilePath);
    }
    constructor(panel, extensionUri, logFilePath) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update(logFilePath);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "runCommand":
                    this._runCommand(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    _runCommand(command) {
        const terminal = vscode.window.createTerminal("Soroban");
        terminal.sendText(command);
        terminal.show();
    }
    _update(logFilePath) {
        const webview = this._panel.webview;
        this._panel.title = "Soroban Command History";
        this._panel.webview.html = this._getHtmlForWebview(webview, logFilePath);
    }
    _getHtmlForWebview(webview, logFilePath) {
        const logEntries = (0, fileUtils_1.readLogFile)(logFilePath);
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
            .map((entry) => `<li>${entry} <button class="run-btn">Run</button></li>`)
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
    dispose() {
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
exports.CommandHistoryPanel = CommandHistoryPanel;
//# sourceMappingURL=CommandHistoryPanel.js.map