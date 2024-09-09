"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "components/ui/use-toast";
import Link from "next/link";

import LabCommandSelector from "components/lab/command-selector";
import LabCommandOutput from "components/lab/lab-command-output";

import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { Avatar, AvatarImage } from "components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "components/ui/dialog";
import { FileBoxIcon } from "lucide-react";

export default function LabComponent() {
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();
  const [latestCommand, setLatestCommand] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { command } = router.query;

  const { toast, dismiss } = useToast();

  useEffect(() => {
    if (commandOutput && !commandError) {
      const { id } = toast({
        title: "Command Executed Successfully",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[340px]">
              {latestCommand}
            </pre>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsModalOpen(true);
                dismiss(id);
              }}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-green-500",
      });
    } else if (commandError) {
      const { id } = toast({
        title: "Command Execution Failed",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[340px]">
              {latestCommand}
            </pre>
            <Button
              variant="default"
              onClick={() => {
                setIsModalOpen(true);
                dismiss(id);
              }}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-red-500",
      });
    }
  }, [commandOutput, commandError, toast]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between space-y-2 mb-4">
          <div className="flex items-center">
            <Avatar className="mr-4 h-10 w-10">
              <AvatarImage
                src={`https://avatar.vercel.sh/${command}.png`}
                alt="Avatar"
              />
            </Avatar>
            <h2 className="font-bold">XDR </h2>
          </div>
          <div className="space-x-2 flex items-center">
            {(commandOutput || commandError) && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileBoxIcon className="w-5 h-5 mr-2" />
                    View Output
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[calc(70vw-106px)]">
                  <DialogHeader>
                    <DialogTitle>Command Output</DialogTitle>
                    <DialogDescription className="pt-2">
                      <pre className="bg-white text-black shadow-lg border border-black p-2 pl-3 rounded-md">
                        {latestCommand}
                      </pre>
                    </DialogDescription>
                  </DialogHeader>
                  <LabCommandOutput
                    commandOutput={commandOutput}
                    commandError={commandError}
                  />
                </DialogContent>
              </Dialog>
            )}
            <Link href={`/logs`}>
              <Button>View Command History</Button>
            </Link>
          </div>
        </div>
        <Separator className="w-full mb-4 -mx-4" />
        <div className="flex flex-row w-full">
          <div className="w-full">
            <LabCommandSelector
              initialCommand={command as string}
              latestCommand={latestCommand}
              setCommandError={setCommandError}
              setCommandOutput={setCommandOutput}
              setLatestCommand={setLatestCommand}
            />
          </div>
        </div>
      </div>
    </>
  );
}
