import { useEffect, useState } from "react";
import { CommandHistoryDataTable } from "components/logs/command-history/command-history-data-table";
import { createCommandHistoryColumns } from "components/logs/command-history/command-history-columns";

interface LogEntry {
  date: string;
  time: string;
  cliType: string;
  subcommand: string;
  command: string;
  path: string;
  result: string;
}

export default function CommandHistory() {
  const [commands, setCommands] = useState<LogEntry[]>([]);
  const [subcommandFilter, setSubcommandFilter] = useState("");

  async function getCommandHistory() {
    try {
      const commandContent: string = await window.sorobanApi.readCommandLogs();
      const commandEntries = commandContent
        .split("\n")
        .filter((entry) => entry.trim() !== "");

      const parsedCommands = commandEntries
        .filter(
          (entry) => entry.includes("soroban") || entry.includes("stellar")
        )
        .map((entry) => {
          const [timestamp, ...commandParts] = entry.split(/]\s+/);
          const command = commandParts.join("]").trim();

          // Extract date and time from the timestamp
          const [date, time] = timestamp.slice(1, -1).split(" ");

          // Determine CLI type (soroban or stellar)
          const cliType = command.startsWith("stellar") ? "stellar" : "soroban";

          // Extract subcommand from the command
          const subcommandParts = command.split(" ");
          const subcommandIndex = cliType === "stellar" ? 1 : 1;
          const subcommand = subcommandParts[subcommandIndex];

          // Check if the subcommand is one of "contract", "network", "lab", or "xdr" (for stellar)
          const validSubcommands = ["contract", "network", "lab", "xdr"];
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
            cliType: cliType,
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
