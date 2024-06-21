import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";
import { Button } from "components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { AlertCircle, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

export default function LabCommandOutput({
  canister,
  projectPath,
  commandOutput,
  commandError,
}: {
  canister: any;
  projectPath: string;
  commandOutput: string;
  commandError: string;
}) {
  const [canisterStatus, setCanisterStatus] = useState<any>(null);
  const [accordionValue, setAccordionValue] = useState<string>("status");

  useEffect(() => {
    // Set the accordion to open the last item if there is command output or an error
    if (commandOutput || commandError) {
      setAccordionValue("output");
    } else {
      setAccordionValue("status");
    }
  }, [commandOutput, commandError]);

  function parseCliOutput(output) {
    const result = {};
    // Replace multiple spaces with a single space and then split the string into parts.
    const parts = output.replace(/\s+/g, " ").trim().split(" ");

    let currentKey = "";
    let currentValue = "";

    parts.forEach((part) => {
      if (part.endsWith(":")) {
        // If the current part ends with a colon, it's a key.
        if (currentKey && currentValue) {
          // Save the previous key-value pair.
          result[currentKey] = currentValue.trim();
        }
        // Start a new key-value pair.
        currentKey = part.slice(0, -1); // Remove the colon from the key.
        currentValue = "";
      } else {
        // Otherwise, it's part of the value.
        currentValue += part + " ";
      }
    });

    // Don't forget to add the last key-value pair.
    if (currentKey && currentValue) {
      result[currentKey] = currentValue.trim();
    }

    return result;
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] overflow-y-auto">
      <Accordion
        type="single"
        value={accordionValue}
        onValueChange={setAccordionValue}
        collapsible
        className="w-full space-y-4"
      >
        <AccordionItem value="output" className="border px-3 rounded-lg">
          <AccordionTrigger className="text-sm">
            Command Output
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {commandOutput && (
                <Alert>
                  <ThumbsUpIcon className="h-4 w-4 text-green-600" />
                  <AlertDescription>{commandOutput}</AlertDescription>
                </Alert>
              )}
              {commandError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{commandError}</AlertDescription>
                </Alert>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ScrollBar />
    </ScrollArea>
  );
}
