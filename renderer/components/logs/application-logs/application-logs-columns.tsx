"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

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
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="uppercase">
          {row.original.timestamp.split(" ")[0].slice(1)}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const dateTimeA = rowA.original.timestamp;
        const dateTimeB = rowB.original.timestamp;
        return dateTimeA.localeCompare(dateTimeB);
      },
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => (
        <div className="uppercase">
          {row.original.timestamp.split(" ")[1].slice(0, -5)}
        </div>
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
        <div className="max-w-xl truncate">{row.original.message}</div>
      ),
    },
  ];
};
