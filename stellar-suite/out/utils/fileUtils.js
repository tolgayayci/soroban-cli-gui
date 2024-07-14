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
exports.readLogFile = readLogFile;
exports.formatCliOutput = formatCliOutput;
const fs = __importStar(require("fs"));
function readLogFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const entries = content.split("\n").filter((line) => line.trim() !== "");
        return entries
            .map((entry) => parseLogEntry(entry))
            .filter((entry) => entry !== null);
    }
    catch (error) {
        console.error(`Error reading log file: ${error}`);
        return [];
    }
}
function parseLogEntry(entry) {
    const match = entry.match(/\[(.*?)\] (.*?) (\/.*?) Result: (.*)/s);
    if (match) {
        return {
            timestamp: match[1],
            command: match[2],
            path: match[3],
            result: match[4],
        };
    }
    return null;
}
function formatCliOutput(result) {
    try {
        let output = "Command Output:\n\n";
        const formattedResult = JSON.parse(result);
        output += formattedResult
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n");
        return output;
    }
    catch (error) {
        console.error("Error formatting output:", error);
        return result;
    }
}
//# sourceMappingURL=fileUtils.js.map