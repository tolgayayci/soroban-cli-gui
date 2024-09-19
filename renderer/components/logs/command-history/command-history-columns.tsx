// command-history-columns.tsx
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useToast } from "components/ui/use-toast";
import { Play, Copy, Info } from "lucide-react";
import { useCopyToClipboard } from "react-use";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "components/ui/dialog";

import CommandStatusConfig from "components/contracts/command-status-config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

export type Network = {
  [key: string]: any;
};

const getSubcommandColor = (subcommand: string) => {
  switch (subcommand) {
    case "contract":
      return "text-blue-500";
    case "xdr":
      return "text-orange-500";
    default:
      return "";
  }
};

const subcommandFilterFn = (
  row: any,
  columnId: string,
  filterValue: string
) => {
  if (filterValue === "all") {
    return true;
  }
  return row.getValue(columnId) === filterValue;
};

export const createCommandHistoryColumns = (
  subcommandFilter: string,
  setSubcommandFilter: (value: string) => void
): ColumnDef<Network>[] => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const router = useRouter();
  const { toast } = useToast();

  const isExists = async (path: string) => {
    try {
      const exist = await window.sorobanApi.checkFileExists(path);
      return exist;
    } catch (error) {
      console.error("Error checking file existence:", error);
      return false;
    }
  };

  return [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div className="uppercase">{row.original.date}</div>,
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => <div className="uppercase flex justify-center items-center">{row.original.time}</div>,
    },
    {
      accessorKey: "subcommand",
      header: () => (
        <div className="w-[110px] flex justify-center items-center">
          <Select
            value={subcommandFilter}
            onValueChange={(value) => setSubcommandFilter(value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="xdr">XDR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={`w-[140px] ${getSubcommandColor(
            row.original.subcommand
          )} uppercase text-center`}
        >
          {row.original.subcommand}
        </div>
      ),
      filterFn: subcommandFilterFn,
    },
    {
      accessorKey: "command",
      header: "Command",
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate">{row.original.command}</div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        const handlePlayClick = async () => {
          const { path, command, subcommand } = row.original;
          if (subcommand === "xdr") {
            router.push({
              pathname: `/lab/[command]`,
              query: { command },
            });
          } else {
            const pathExists = await window.sorobanApi.checkFileExists(path + "/Cargo.toml");
            if (pathExists) {
              router.push({
                pathname: `/contracts/[path]`,
                query: { path, command },
              });
            } else {
              toast({
                title: "Project Not Found",
                description: "You can't run this command because the project doesn't exist on Sora.",
              });
            }
          }
        };

        return (
          <div className="flex justify-start space-x-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[calc(70vw-106px)]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <span>
                      {row.original.isError
                        ? "Command Error"
                        : "Command Output"}
                    </span>
                    {row.original.subcommand !== "xdr" && (
                      <Badge className="ml-4">
                        {"Path: " + row.original.path}
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="pt-2">
                    <pre className="bg-white text-black shadow-lg border border-black p-2 pl-3 rounded-md whitespace-pre-wrap break-words">
                      {row.original.command.length > 100
                        ? row.original.command.slice(0, 100) + "..."
                        : row.original.command}
                    </pre>
                  </DialogDescription>
                </DialogHeader>
                {row.original.isError ? (
                  <CommandStatusConfig
                    commandOutput={""}
                    commandError={row.original.result}
                  />
                ) : (
                  <CommandStatusConfig
                    commandOutput={row.original.result}
                    commandError=""
                  />
                )}
              </DialogContent>
            </Dialog>
            <Button onClick={handlePlayClick}>
              <Play className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                copyToClipboard(row.original.command);
                toast({
                  title: "Copied to Clipboard",
                  description: (
                    <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[340px]">
                      {row.original.command}
                    </pre>
                  ),
                });
              }}
              className="transition-colors duration-200 hover:text-blue-500 focus:text-blue-500"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
