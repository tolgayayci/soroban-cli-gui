import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

export default function LabCommandOutput({
  commandOutput,
  commandError,
}: {
  commandOutput: string;
  commandError: string;
}) {
  const [accordionValue, setAccordionValue] = useState<string>("status");

  useEffect(() => {
    // Set the accordion to open the last item if there is command output or an error
    if (commandOutput || commandError) {
      setAccordionValue("output");
    } else {
      setAccordionValue("status");
    }
  }, [commandOutput, commandError]);

  return (
    <div>
      {commandOutput && (
        <div className="bg-gray-900 text-white p-4 rounded-md -mt-1">
          <ScrollArea className="h-[calc(80vh-106px)]">
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {commandOutput.split("\n").map((line, index) => (
                <div key={index}>
                  {line
                    .split(
                      /(\s--[\w-]+(?:\s+<[\w_]+>)?|\s-\w(?:\s+<[\w_]+>)?)/g
                    )
                    .map((part, partIndex) => {
                      if (part.trim().match(/^--[\w-]+(?:\s+<[\w_]+>)?$/)) {
                        return (
                          <span key={partIndex} className="text-blue-400">
                            {part}
                          </span>
                        );
                      } else if (part.trim().match(/^-\w(?:\s+<[\w_]+>)?$/)) {
                        return (
                          <span key={partIndex} className="text-blue-400">
                            {part}
                          </span>
                        );
                      } else if (part.trim() === "") {
                        return <br key={partIndex} />;
                      } else {
                        return <span key={partIndex}>{part}</span>;
                      }
                    })}
                </div>
              ))}
            </pre>
            <ScrollBar />
          </ScrollArea>
        </div>
      )}
      {commandError && (
        <div className="bg-red-100 text-red-500 p-4 rounded-md -mt-1">
          <ScrollArea className="h-[calc(80vh-106px)]">
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {commandError.split("\n").map((line, index) => (
                <div key={index}>
                  {line
                    .split(
                      /(\s--[\w-]+(?:\s+<[\w_]+>)?|\s-\w(?:\s+<[\w_]+>)?)/g
                    )
                    .map((part, partIndex) => {
                      if (part.trim().match(/^--[\w-]+(?:\s+<[\w_]+>)?$/)) {
                        return (
                          <span key={partIndex} className="text-blue-400">
                            {part}
                          </span>
                        );
                      } else if (part.trim().match(/^-\w(?:\s+<[\w_]+>)?$/)) {
                        return (
                          <span key={partIndex} className="text-blue-400">
                            {part}
                          </span>
                        );
                      } else if (part.trim() === "") {
                        return <br key={partIndex} />;
                      } else {
                        return <span key={partIndex}>{part}</span>;
                      }
                    })}
                </div>
              ))}
            </pre>
            <ScrollBar />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
