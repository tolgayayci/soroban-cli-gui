import { useEffect, useState } from "react";

import { CommandHistoryDataTable } from "components/logs/command-history/command-history-data-table";
import { createCommandHistoryColumns } from "components/logs/command-history/command-history-columns";

interface LogEntry {
  timestamp: string;
  subcommand: string;
  command: string;
}

export default function CommandHistory() {
  const [commands, setCommands] = useState<LogEntry[]>([]);

  async function getCommandHistory() {
    try {
      const commandContent: string = await window.sorobanApi.readLogs();
      const commandEntries = commandContent
        .split("\n")
        .filter((entry) => entry.trim() !== "");
      const parsedCommands = commandEntries.map((entry) => {
        const [timestamp, level, message] = entry.split(/\[(\w+)\]/);
        return {
          timestamp: timestamp.trim(),
          subcommand: level.trim(),
          command: message.trim(),
        };
      });

      setCommands(parsedCommands);
    } catch (error) {
      console.error(`Error fetching command history: ${error}`);
    }
  }

  useEffect(() => {
    getCommandHistory();
  }, []);

  const columns = createCommandHistoryColumns();

  return <CommandHistoryDataTable columns={columns} data={commands} />;
}
