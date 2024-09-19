"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import Link from "next/link";

export type ContractEvent = {
  startLedger: number;
  eventType: string;
  network: string;
  rpcUrl: string;
};

export const createContractEventsColumns = (): ColumnDef<ContractEvent>[] => [
  {
    accessorKey: "startLedger",
    header: "Start Ledger",
    sortingFn: "basic",
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
    enableSorting: false,
  },
  {
    accessorKey: "network",
    header: "Network",
    enableSorting: false,
  },
  {
    accessorKey: "rpcUrl",
    header: "RPC URL",
    enableSorting: false,
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-right">
        <Link href={`/events/detail/${encodeURIComponent(row.original.startLedger)}?rpcUrl=${encodeURIComponent(row.original.rpcUrl)}`}>
          <Button>Event Detail</Button>
        </Link>
      </div>
    ),
  },
];
