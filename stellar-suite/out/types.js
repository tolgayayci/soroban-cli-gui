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
exports.CommandDetailItem = exports.CommandHistoryItem = void 0;
const vscode = __importStar(require("vscode"));
class CommandHistoryItem extends vscode.TreeItem {
    label;
    timestamp;
    path;
    result;
    commandToRun;
    constructor(label, timestamp, path, result, commandToRun) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.label = label;
        this.timestamp = timestamp;
        this.path = path;
        this.result = result;
        this.commandToRun = commandToRun;
        this.tooltip = `${timestamp}\nPath: ${path}`;
        this.description = timestamp;
        this.contextValue = "commandHistoryItem";
        this.iconPath = new vscode.ThemeIcon("terminal-cmd");
    }
}
exports.CommandHistoryItem = CommandHistoryItem;
class CommandDetailItem extends vscode.TreeItem {
    label;
    detail;
    fullContent;
    constructor(label, detail, fullContent) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.detail = detail;
        this.fullContent = fullContent;
        this.tooltip = detail;
        this.description = detail;
        if (label === "Result") {
            this.command = {
                command: "stellar-suite.showCommandResult",
                title: "Show Result",
                arguments: [fullContent],
            };
        }
    }
}
exports.CommandDetailItem = CommandDetailItem;
//# sourceMappingURL=types.js.map