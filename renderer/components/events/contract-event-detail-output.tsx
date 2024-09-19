import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

export default function ContractEventDetailOutput({
  startLedger,
  rpcUrl,
  networkPassphrase,
  network,
}: {
  startLedger: string;
  rpcUrl: string;
  networkPassphrase: string;
  network: string;
}) {
  const [commandOutput, setCommandOutput] = useState<string>("");
  const [commandError, setCommandError] = useState<string>("");

  useEffect(() => {
    const fetchContractEventDetail = async () => {
      try {
        const command = "events";
        const subcommand = "";
        const args = [];
        const flags = [
          `--start-ledger ${startLedger}`,
          `--rpc-url ${rpcUrl}`,
          `--network-passphrase "${networkPassphrase}"`,
          `--network ${network}`,
        ];

        const result = await window.sorobanApi.runSorobanCommand(command, subcommand, args, flags);
        setCommandOutput(result);
        setCommandError("");
      } catch (error) {
        console.error("Error fetching contract event detail:", error);
        setCommandError(`${error}`);
        setCommandOutput("");
      }
    };

    fetchContractEventDetail();
  }, [startLedger, rpcUrl, networkPassphrase, network]);

  return (
    <div>
      {commandOutput && (
        <div className="bg-gray-900 text-white p-4 rounded-md -mt-1">
          <ScrollArea className="h-[calc(83vh-106px)]">
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
          <ScrollArea className="h-[calc(83vh-106px)]">
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {commandError}
            </pre>
            <ScrollBar />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}