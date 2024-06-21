import { useEffect, useState } from "react";
import { CommandHistoryDataTable } from "components/logs/command-history/command-history-data-table";
import { createCommandHistoryColumns } from "components/logs/command-history/command-history-columns";

interface LogEntry {
  date: string;
  time: string;
  subcommand: string;
  command: string;
  path: string;
  result: string;
}

export default function CommandHistory() {
  const [commands, setCommands] = useState<LogEntry[]>([]);
  const [subcommandFilter, setSubcommandFilter] = useState("");

  // CommandHistory.tsx
  async function getCommandHistory() {
    try {
      const commandContent: string = await window.sorobanApi.readCommandLogs();
      const commandEntries = commandContent
        .split("\n")
        .filter((entry) => entry.trim() !== "");

      const parsedCommands = commandEntries
        .filter((entry) => entry.includes("soroban"))
        .map((entry) => {
          const [timestamp, ...commandParts] = entry.split(/]\s+/);
          const command = commandParts.join("]").trim();

          // Extract date and time from the timestamp
          const [date, time] = timestamp.slice(1, -1).split(" ");

          // Extract subcommand from the command
          const subcommand = command.split(" ")[1];

          // Check if the subcommand is one of "contract", "network", or "lab"
          const validSubcommands = ["contract", "network", "lab"];
          const mappedSubcommand = validSubcommands.includes(subcommand)
            ? subcommand.trim()
            : "";

          // Extract path from the command
          const pathRegex = /\/[^\s]+/;
          const pathMatch = command.match(pathRegex);
          const path = pathMatch ? pathMatch[0] : "";

          // Extract result from the command
          const resultIndex = command.indexOf("Result:");
          const result =
            resultIndex !== -1
              ? command
                  .slice(resultIndex + 8)
                  .trim()
                  .replace(/^"/, "")
                  .replace(/"$/, "")
                  .replace(/\\n/g, "\n")
              : "";

          // Remove the result from the command
          const commandWithoutResult = command
            .slice(0, resultIndex)
            .trim()
            .replace(path, "")
            .trim();

          return {
            date: date,
            time: time.slice(0, 8),
            subcommand: mappedSubcommand,
            command: commandWithoutResult,
            path: path,
            result: result,
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

  const columns = createCommandHistoryColumns(
    subcommandFilter,
    setSubcommandFilter
  );

  return (
    <CommandHistoryDataTable
      columns={columns}
      data={commands}
      subcommandFilter={subcommandFilter}
    />
  );
}
