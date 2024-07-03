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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const childProcess = __importStar(require("child_process"));
const CommandHistoryProvider_1 = require("./providers/CommandHistoryProvider");
const CommandBuilderProvider_1 = require("./providers/CommandBuilderProvider");
//Utils
const fileUtils_1 = require("./utils/fileUtils");
const general_1 = require("./utils/general");
let outputChannel;
function activate(context) {
    outputChannel = vscode.window.createOutputChannel("Soroban Command Output");
    const commandBuilderProvider = new CommandBuilderProvider_1.CommandBuilderProvider(context.extensionUri);
    const commandBuilderWebView = vscode.window.registerWebviewViewProvider(CommandBuilderProvider_1.CommandBuilderProvider.viewType, commandBuilderProvider);
    childProcess.exec("soroban --version", (error, stdout) => {
        if (error) {
            vscode.commands.executeCommand("setContext", "sorobanCLI.installed", false);
        }
        else {
            vscode.commands.executeCommand("setContext", "sorobanCLI.installed", true);
            console.log(`Soroban CLI version: ${stdout.trim()}`);
            const logFilePath = (0, general_1.getLogFilePath)();
            const commandHistoryProvider = new CommandHistoryProvider_1.CommandHistoryProvider(logFilePath);
            vscode.window.registerTreeDataProvider("commandHistory", commandHistoryProvider);
            let refreshCommand = vscode.commands.registerCommand("stellar-suite.refreshCommandHistory", () => {
                commandHistoryProvider.refresh();
            });
            let runHistoryCommand = vscode.commands.registerCommand("stellar-suite.runHistoryCommand", (item) => {
                if (item.commandToRun) {
                    const terminal = vscode.window.createTerminal("Soroban");
                    terminal.sendText(item.commandToRun);
                    terminal.show();
                }
            });
            context.subscriptions.push(refreshCommand, runHistoryCommand);
        }
    });
    let showCommandResult = vscode.commands.registerCommand("stellar-suite.showCommandResult", (result) => {
        const formattedResult = (0, fileUtils_1.formatCliOutput)(result);
        outputChannel.clear();
        outputChannel.appendLine(formattedResult);
        outputChannel.show(true);
    });
    // Register the installSorobanCLI command
    let installSorobanCLICommand = vscode.commands.registerCommand("stellar-suite.installSorobanCLI", () => {
        vscode.env.openExternal(vscode.Uri.parse("https://soroban.stellar.org/docs/getting-started/setup"));
    });
    context.subscriptions.push(showCommandResult, outputChannel, commandBuilderWebView, installSorobanCLICommand);
}
function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
//# sourceMappingURL=extension.js.map