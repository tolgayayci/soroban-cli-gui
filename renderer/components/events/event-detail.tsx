import { useEffect, useState } from "react";

import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { Avatar, AvatarImage } from "components/ui/avatar";

import { RemoveContractEventModal } from "components/events/remove-event-modal";
import { EditContractEventModal } from "components/events/edit-event-modal";

export default function ContractEventDetail({
  eventDetail,
}: {
  eventDetail: string;
}) {
  const [showRemoveContractEventDialog, setShowRemoveContractEventDialog] =
    useState(false);
  const [showEditContractEventDialog, setShowEditContractEventDialog] =
    useState(false);
  const [contractEvent, setContractEvent] = useState(null);

  useEffect(() => {
    const fetchContractEvents = async () => {
      try {
        const result = await window.sorobanApi.manageContractEvents(
          "get",
          eventDetail
        );

        const projectsData: any[] = result.map((event: any) => ({
          startLedger: event.start_ledger,
          cursor: event.cursor,
          output: event.output,
          count: event.count,
          contractId: event.contract_id,
          topicFilters: event.topic_filters,
          eventType: event.event_type,
          useGlobalConfig: event.is_global,
          configDir: event.config_dir,
          rpcUrl: event.rpc_url,
          networkPassphrase: event.network_passphrase,
          network: event.network,
        }));

        setContractEvent(projectsData[0]);
      } catch (error) {
        console.error("Error fetching project:", error);
        setContractEvent(null);
      }
    };

    fetchContractEvents();
  }, [eventDetail]);

  if (contractEvent) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${contractEvent.startLedger}.png`}
                  alt={contractEvent.startLedger}
                />
              </Avatar>
              <h2 className="font-bold">{contractEvent.startLedger}</h2>
            </div>
            <div className="space-x-2">
              <Button onClick={() => setShowEditContractEventDialog(true)}>
                Edit Contract Event
              </Button>
              <EditContractEventModal
                contractEvent={contractEvent}
                isOpen={showEditContractEventDialog}
                onClose={() => setShowEditContractEventDialog(false)}
              />
              <Button
                variant="destructive"
                onClick={() => setShowRemoveContractEventDialog(true)}
              >
                Remove
              </Button>
              <RemoveContractEventModal
                contractEvent={contractEvent}
                isOpen={showRemoveContractEventDialog}
                onClose={() => setShowRemoveContractEventDialog(false)}
              />
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <div className="flex flex-row w-full">
            {/* <div className="w-3/5 pr-4">
              <CliCommandSelector
                path={projectPath}
                setCommandError={setCommandError}
                setCommandOutput={setCommandOutput}
              />
            </div>
            <div className="w-2/5 pr-4">
              <CommandStatusConfig
                canister={project}
                projectPath={projectPath}
                commandOutput={commandOutput}
                commandError={commandError}
              />
            </div> */}
          </div>
        </div>
      </>
    );
  } else {
    return <div>Contract event not found or name is undefined.</div>;
  }
}
