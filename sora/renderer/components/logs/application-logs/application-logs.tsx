import { useEffect, useState } from "react";

import { Button } from "components/ui/button";
import { ApplicationLogsDataTable } from "components/logs/application-logs/application-logs-data-table";
import { createApplicationLogsColumns } from "components/logs/application-logs/application-logs-columns";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export default function ApplicationLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  async function getLogs() {
    try {
      const logContent: string = await window.sorobanApi.readLogs();
      const logEntries = logContent
        .split("\n")
        .filter((entry) => entry.trim() !== "");
      const parsedLogs = logEntries.map((entry) => {
        const [timestamp, level, message] = entry.split(/\[(\w+)\]/);
        return {
          timestamp: timestamp.trim(),
          level: level.trim(),
          message: message.trim(),
        };
      });

      setLogs(parsedLogs);
    } catch (error) {
      console.error(`Error fetching logs: ${error}`);
    }
  }

  useEffect(() => {
    getLogs();
  }, []);

  const columns = createApplicationLogsColumns();

  return <ApplicationLogsDataTable columns={columns} data={logs} />;
}
