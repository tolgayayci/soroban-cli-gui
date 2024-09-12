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
          let command = commandParts.join("]").trim();

          // Extract date and time from the timestamp
          const [date, time] = timestamp.slice(1, -1).split(" ");

          // Check if the entry is an error log
          const isError = entry.includes("Error:");
          let result = "";
          if (isError) {
            const errorIndex = command.indexOf("Error:");
            result = command.slice(errorIndex).trim();
            // For error logs, remove the error message from the command
            command = command.slice(0, errorIndex).trim();
          } else {
            const resultIndex = command.indexOf("Result:");
            result =
              resultIndex !== -1
                ? command
                    .slice(resultIndex + 8)
                    .trim()
                    .replace(/^"/, "")
                    .replace(/"$/, "")
                    .replace(/\\n/g, "\n")
                : "";
            // For non-error logs, remove the result from the command
            command =
              resultIndex !== -1
                ? command.slice(0, resultIndex).trim()
                : command;
          }

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

          // Remove the path from the command display
          const commandWithoutPath = command.replace(path, "").trim();

          return {
            date: date,
            time: time.slice(0, 8),
            cliType: cliType,
            subcommand: mappedSubcommand,
            command: commandWithoutPath,
            path: path,
            result: result,
            isError: isError,
          };
        });

      // Sort the commands to have the latest first
      parsedCommands.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
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

  console.log(commands);

  return (
    <CommandHistoryDataTable
      columns={columns}
      data={commands}
      subcommandFilter={subcommandFilter}
    />
  );
}
