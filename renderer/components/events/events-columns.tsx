"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import Link from "next/link";

export type Network = {
  [key: string]: any;
};

export const createContractEventsColumns = (): ColumnDef<Network>[] => {
  return [
    {
      accessorKey: "startLedger",
      header: "Start Ledger",
    },
    {
      accessorKey: "cursor",
      header: "Cursor",
    },
    {
      accessorKey: "network",
      header: "Network",
    },
    {
      accessorKey: "details",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Link
            href={`/events/${encodeURIComponent(row.original.startLedger)}`}
          >
            <Button>Event Detail</Button>
          </Link>
        </div>
      ),
    },
  ];
};
