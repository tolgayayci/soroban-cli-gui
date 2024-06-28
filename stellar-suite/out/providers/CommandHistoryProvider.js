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
exports.CommandHistoryProvider = void 0;
const vscode = __importStar(require("vscode"));
const fileUtils_1 = require("../utils/fileUtils");
const types_1 = require("../types");
class CommandHistoryProvider {
    logFilePath;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(logFilePath) {
        this.logFilePath = logFilePath;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            const logEntries = (0, fileUtils_1.readLogFile)(this.logFilePath);
            return Promise.resolve(this.getCommandHistoryItems(logEntries));
        }
        else if (element instanceof types_1.CommandHistoryItem) {
            return Promise.resolve([
                new types_1.CommandDetailItem("Path", element.path),
                new types_1.CommandDetailItem("Timestamp", element.timestamp),
                new types_1.CommandDetailItem("Result", "Click to view result", element.result),
            ]);
        }
        return Promise.resolve([]);
    }
    getCommandHistoryItems(logEntries) {
        return logEntries.map((entry) => new types_1.CommandHistoryItem(entry.command, entry.timestamp, entry.path, entry.result, entry.command));
    }
}
exports.CommandHistoryProvider = CommandHistoryProvider;
//# sourceMappingURL=CommandHistoryProvider.js.map