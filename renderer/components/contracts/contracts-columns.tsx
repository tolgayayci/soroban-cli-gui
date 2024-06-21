"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import Link from "next/link";

export type Network = {
  [key: string]: any;
};

export const createContractsColumns = (): ColumnDef<Network>[] => {
  return [
    {
      accessorKey: "name",
      header: "Main Contract",
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
    },
    {
      accessorKey: "details",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Link
            href={`/contracts/${encodeURIComponent(row.original.projectPath)}`}
          >
            <Button>Contract Actions</Button>
          </Link>
        </div>
      ),
    },
  ];
};
