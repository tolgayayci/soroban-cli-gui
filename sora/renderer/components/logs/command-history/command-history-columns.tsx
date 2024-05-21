"use client";

import { DataTableColumnHeader } from "components/logs/application-logs/application-logs-data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";

export type Network = {
  [key: string]: any;
};

function getLevelColor(level: string) {
  switch (level) {
    case "error":
      return "text-red-500";
    case "warn":
      return "text-yellow-500";
    case "info":
      return "text-green-500";
    case "verbose":
      return "text-blue-500";
    case "debug":
      return "text-indigo-500";
    case "silly":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
}

export const createCommandHistoryColumns = (): ColumnDef<Network>[] => {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <div className="uppercase">
          {row.original.timestamp.split(" ")[0].slice(1)}
        </div>
      ),
    },
    {
      accessorKey: "time",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time" />
      ),
      cell: ({ row }) => (
        <div className="uppercase">
          {row.original.timestamp.split(" ")[1].slice(0, -5)}
        </div>
      ),
    },
    {
      accessorKey: "subcommand",
      header: "Subcommand",
      cell: ({ row }) => (
        <div className={`${getLevelColor(row.original.type)} uppercase`}>
          {row.original.subcommand}
        </div>
      ),
    },
    {
      accessorKey: "command",
      header: "Command",
      cell: ({ row }) => (
        <div className="max-w-sm truncate">{row.original.command}</div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <Button variant="default">Re-run</Button>,
    },
  ];
};
