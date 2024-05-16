"use client";

import { Button } from "components/ui/button";
import { DataTableColumnHeader } from "components/logs/application-logs-data-table-column-header";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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

export const createApplicationLogsColumns = (): ColumnDef<Network>[] => {
  return [
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Timestamp" />
      ),
      cell: ({ row }) => (
        <div className="uppercase">{row.original.timestamp}</div>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <div className={`${getLevelColor(row.original.level)} uppercase`}>
          {row.original.level}
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="truncate max-w-xl">{row.original.message}</div>
      ),
    },
  ];
};
