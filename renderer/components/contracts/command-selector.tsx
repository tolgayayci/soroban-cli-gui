import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "components/ui/select";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { commands } from "lib/commands";
import { Checkbox } from "components/ui/checkbox";
import { Label } from "components/ui/label";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "components/ui/tooltip";

import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { SelectSeparator } from "components/ui/select";

const CliCommandSelector = ({
  path,
  initialCommand,
  latestCommand,
  setCommandOutput,
  setCommandError,
  setLatestCommand,
  setCommandExecuted,
}: {
  path: string;
  initialCommand: string;
  latestCommand: string;
  setCommandOutput: (any) => void;
  setCommandError: (any) => void;
  setLatestCommand: (any) => void;
  setCommandExecuted: (executed: boolean) => void;
}) => {
  const defaultCommand = commands.length > 0 ? commands[0].value : "";

  const [selectedCommand, setSelectedCommand] = useState(
    initialCommand || defaultCommand
  );
  const [commandArgs, setCommandArgs] = useState({});
  const [commandOptions, setCommandOptions] = useState({});
  const [isRunningCommand, setIsRunningCommand] = useState(false);

  useEffect(() => {
    if (initialCommand) {
      const [command, ...args] = initialCommand.split(" ");

      const commandValue = args[1];
      setSelectedCommand(commandValue);
      handleCommandChange(commandValue, args);
    }
  }, [initialCommand]);

  const updateLatestCommand = () => {
    const selectedCommandDetails = commands.find(
      (c) => c.value === selectedCommand
    );
    if (!selectedCommandDetails) {
      setLatestCommand("");
      return;
    }

    // Only values of the arguments separated by spaces
    const argsString = Object.values(commandArgs)
      .filter((value) => value)
      .join(" ");

    const optionsString = Object.entries(commandOptions)
      .filter(([key, value]) => {
        const optionDetails = selectedCommandDetails.options.find(
          (o) => o.name === key
        );
        return (
          optionDetails &&
          ((optionDetails.type === "flag" && value) ||
            (optionDetails.type === "argument" && value))
        );
      })
      .map(([key, value]) => {
        const optionDetails = selectedCommandDetails.options.find(
          (o) => o.name === key
        );
        return (
          optionDetails &&
          (optionDetails.type === "flag" ? `${key}` : `${key} ${value}`)
        );
      })
      .join(" ");

    // Check the installation info and set the command accordingly
    window.sorobanApi
      .isSorobanInstalled()
      .then((installationInfo) => {
        let commandPrefix = "soroban";
        if (
          typeof installationInfo === "object" &&
          installationInfo.type === "stellar"
        ) {
          commandPrefix = "stellar";
        }

        setLatestCommand(
          `${commandPrefix} contract ${selectedCommandDetails.value} ${argsString} ${optionsString}`
        );
      })
      .catch((error) => {
        console.error("Error checking installation:", error);
        // Fallback to soroban if there's an error
        setLatestCommand(
          `soroban contract ${selectedCommandDetails.value} ${argsString} ${optionsString}`
        );
      });
  };

  useEffect(() => {
    updateLatestCommand();
  }, [selectedCommand, commandArgs, commandOptions]);

  const handleCommandChange = (commandValue, initialArgs = []) => {
    setSelectedCommand(commandValue);
    const command = commands.find((c) => c.value === commandValue);

    // Initialize arguments
    if (command && command.args) {
      const argsInitialState = {};
      command.args.forEach((arg, index) => {
        const argValue = initialArgs.find((initialArg) =>
          initialArg.startsWith(arg.name)
        );
        argsInitialState[arg.name] = argValue
          ? argValue.split(arg.name)[1].trim()
          : "";
      });
      setCommandArgs(argsInitialState);
    } else {
      setCommandArgs({});
    }

    // Initialize options
    if (command && command.options) {
      const optionsInitialState = {};
      command.options.forEach((option) => {
        const optionValue = initialArgs.find((initialArg) =>
          initialArg.startsWith(option.name)
        );
        if (option.type === "flag") {
          optionsInitialState[option.name] = !!optionValue;
        } else if (option.type === "argument") {
          optionsInitialState[option.name] = optionValue
            ? optionValue.split(option.name)[1].trim()
            : "";
        }
      });
      setCommandOptions(optionsInitialState);
    } else {
      setCommandOptions({});
    }
  };

  const handleRunCommand = async () => {
    setIsRunningCommand(true);
    try {
      await runCli(selectedCommand, Object.values(commandArgs));
      setCommandExecuted(true); // Set the flag when command is executed
    } catch (error) {
      console.error("Error executing command:", error);
      setCommandExecuted(true); // Set the flag even if there's an error
    } finally {
      setIsRunningCommand(false);
    }
  };

  const runCli = async (command, args) => {
    try {
      if (path) {
        const selectedCommandDetails = commands.find(
          (c) => c.value === command
        );

        // Construct the options array, including -- for options and flags
        const optionsArray = selectedCommandDetails.options.reduce(
          (acc, option) => {
            const value = commandOptions[option.name];
            if (option.type === "flag" && value) {
              // If it's a flag and it's set, add the key
              acc.push(`${option.name}`);
            } else if (option.type === "argument" && value) {
              // If it's an argument and it has a value, add both key and value
              acc.push(`${option.name}`, value);
            }
            return acc;
          },
          []
        );

        const processedArgs = args.map((arg) =>
          isNaN(arg) ? arg : parseInt(arg, 10)
        );

        const result = await window.sorobanApi.runSorobanCommand(
          "contract",
          command,
          [...processedArgs], // Use processedArgs instead of args
          optionsArray,
          path
        );

        setCommandError("");
        setCommandOutput(result);
      }
    } catch (error) {
      setCommandError(`${error.message}`);
      setCommandOutput(""); // Clear any previous output
      throw error;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-200 dark:bg-white dark:text-black p-4 rounded-md mb-3">
        <code>{initialCommand || latestCommand}</code>
      </div>
      <ScrollArea className="max-h-[calc(100vh-320px)] overflow-y-auto">
        <div className="flex flex-col space-y-4 mx-1 pt-1">
          <div className="relative">
            <Select
              value={selectedCommand}
              onValueChange={(e) => handleCommandChange(e)}
            >
              <SelectTrigger className="w-full pr-10">
                <SelectValue placeholder="Select a contract command" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[300px]">
                    <p>{selectedCommand ? commands.find(c => c.value === selectedCommand)?.description : "Choose a command to see its description"}</p>
                  </TooltipContent>
                </Tooltip>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="h-[150px]">
                  {commands.map((command) => (
                    <SelectItem key={command.value} value={command.value}>
                      {command.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Accordion
            type="multiple"
            className="w-full space-y-4"
            defaultValue={["options"]}
          >
            {selectedCommand &&
              commands.find((c) => c.value === selectedCommand)?.args?.length >
                0 && (
                <AccordionItem value="args" className="border px-3 rounded-lg">
                  <AccordionTrigger className="text-sm">
                    Arguments
                  </AccordionTrigger>
                  <AccordionContent>
                    <SelectSeparator />
                    {selectedCommand &&
                      commands
                        .find((c) => c.value === selectedCommand)
                        ?.args?.map((arg) => (
                          <div key={arg.name} className="space-y-2 my-4">
                            <Tooltip key={arg.name}>
                              <div className="space-y-2 my-4">
                                <div className="flex items-center my-4">
                                  <Label htmlFor={arg.name}>{arg.name}</Label>
                                  <TooltipTrigger asChild>
                                    <span className="inline-block ml-1">
                                      <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                                    </span>
                                  </TooltipTrigger>
                                </div>
                              </div>
                              <TooltipContent side="right">
                                <p>
                                  {arg.description ||
                                    "No description available"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <Input
                              type="text"
                              id={arg.name}
                              value={commandArgs[arg.name] || ""}
                              placeholder={arg.placeholder || arg.name}
                              onChange={(e) => {
                                setCommandArgs({
                                  ...commandArgs,
                                  [arg.name]: e.target.value,
                                });
                              }}
                            />
                          </div>
                        ))}
                    <SelectSeparator className="-mt-4" />
                  </AccordionContent>
                </AccordionItem>
              )}
            {selectedCommand &&
              commands.find((c) => c.value === selectedCommand)?.options
                ?.length > 0 && (
                <AccordionItem
                  value="options"
                  className="border px-3 rounded-lg"
                >
                  <AccordionTrigger className="text-sm">
                    Options & Flags
                  </AccordionTrigger>
                  <AccordionContent>
                    <SelectSeparator />
                    <div className="flex flex-wrap -mx-1 my-3">
                      {selectedCommand &&
                        commands
                          .find((c) => c.value === selectedCommand)
                          ?.options?.filter((option) => option.type === "flag")
                          .map((option, index) => (
                            <div
                              key={option.name}
                              className={`w-1/3 px-2 mb-4 space-x-2 items-center flex ${
                                index % 3 === 0 ? "clear-left" : ""
                              }`} // Adjust width as per your design
                            >
                              <Checkbox
                                id={option.name}
                                checked={!!commandOptions[option.name]}
                                onCheckedChange={(checked) => {
                                  setCommandOptions({
                                    ...commandOptions,
                                    [option.name]: checked,
                                  });
                                }}
                              />
                              <Tooltip key={option.name}>
                                <Label htmlFor={option.name}>
                                  {option.name}
                                </Label>
                                <TooltipTrigger asChild>
                                  <span className="inline-block ml-1">
                                    <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>
                                    {option.description ||
                                      "No description available"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ))}
                    </div>

                    <SelectSeparator className="-mt-4" />

                    {selectedCommand &&
                      commands
                        .find((c) => c.value === selectedCommand)
                        ?.options?.filter(
                          (option) => option.type === "argument"
                        )
                        .map((option) => (
                          <div key={option.name} className="space-y-2 my-4 mx-1">
                            <Tooltip key={option.name}>
                              <div className="flex items-center my-4">
                                <Label htmlFor={option.name}>
                                  {option.name}
                                </Label>
                                <TooltipTrigger asChild>
                                  <span className="inline-block ml-1">
                                    <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>
                                    {option.description ||
                                      "No description available"}
                                  </p>
                                </TooltipContent>
                              </div>
                            </Tooltip>
                            <Input
                              type="text"
                              id={option.name}
                              value={commandOptions[option.name] || ""}
                              placeholder={option.placeholder || option.name}
                              onChange={(e) => {
                                setCommandOptions({
                                  ...commandOptions,
                                  [option.name]: e.target.value,
                                });
                              }}
                            />
                          </div>
                        ))}
                  </AccordionContent>
                </AccordionItem>
              )}
          </Accordion>
        </div>
        <ScrollBar />
      </ScrollArea>
      {isRunningCommand ? (
        <Button className="mt-4" disabled>
          {" "}
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Command Running...
        </Button>
      ) : (
        <Button
          className={selectedCommand ? "mt-4" : ""}
          onClick={handleRunCommand}
        >
          Run Command
        </Button>
      )}
    </div>
  );
};

export default CliCommandSelector;
