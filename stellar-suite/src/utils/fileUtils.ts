import * as fs from "fs";
import { LogEntry } from "../types";

export function readLogFile(filePath: string): LogEntry[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const entries = content.split("\n").filter((line) => line.trim() !== "");
    return entries
      .map((entry) => parseLogEntry(entry))
      .filter((entry): entry is LogEntry => entry !== null);
  } catch (error) {
    console.error(`Error reading log file: ${error}`);
    return [];
  }
}

function parseLogEntry(entry: string): LogEntry | null {
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
