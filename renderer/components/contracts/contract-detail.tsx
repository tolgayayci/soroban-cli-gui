// ContractDetail.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useProject } from "hooks/useProject";

import CliCommandSelector from "components/contracts/command-selector";
import CommandStatusConfig from "components/contracts/command-status-config";
import { CommandGenerator } from "components/contracts/command-constructor";

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
import { useToast } from "components/ui/use-toast";

import { FileBoxIcon, CodeIcon } from "lucide-react";

export default function ContractDetail() {
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();
  const [latestCommand, setLatestCommand] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenCommandGenerator, setIsOpenCommandGenerator] = useState(false);
  const [commandExecuted, setCommandExecuted] = useState(false);

  const router = useRouter();
  const { path } = router.query;
  const { command } = router.query;

  const project = useProject(path as string);
  const { toast, dismiss } = useToast();

  useEffect(() => {
    if (commandExecuted && latestCommand) {
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
          duration: 5000,
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
          className: "border-red-500",
          duration: 5000,
        });
      }
      setCommandExecuted(false); // Reset the flag
    }
  }, [commandExecuted, latestCommand, commandOutput, commandError]);

  const handleOpenCommandGenerator = () => {
    setIsOpenCommandGenerator(true);
  };

  const handleCloseCommandGenerator = () => {
    setIsOpenCommandGenerator(false);
  };

  if (project) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${project.name}.png`}
                  alt={project.name}
                />
              </Avatar>
              <h2 className="font-bold">{project.name}</h2>
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
                    <CommandStatusConfig
                      commandOutput={commandOutput}
                      commandError={commandError}
                    />
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" onClick={handleOpenCommandGenerator}>
                <CodeIcon className="mr-2 h-4 w-4" />
                Command Generator
              </Button>
              <CommandGenerator
                isOpen={isOpenCommandGenerator}
                onClose={handleCloseCommandGenerator}
              />
              <Link href={`/contracts`}>
                <Button>View All Contracts</Button>
              </Link>
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <div className="flex flex-row w-full">
            <div className="w-full">
              <CliCommandSelector
                path={path as string}
                initialCommand={command as string}
                latestCommand={latestCommand}
                setCommandError={setCommandError}
                setCommandOutput={setCommandOutput}
                setLatestCommand={setLatestCommand}
                setCommandExecuted={setCommandExecuted}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <div>Contract not found or name is undefined.</div>;
  }
}
