import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { Avatar, AvatarImage } from "components/ui/avatar";

import { RemoveContractEventModal } from "components/events/remove-event-modal";
import { EditContractEventModal } from "components/events/edit-event-modal";
import ContractEventDetailOutput from "components/events/contract-event-detail-output";
import { Edit, Trash2, Search } from "lucide-react";

export default function ContractEventDetail({
  startLedger,
  rpcUrl,
}: {
  startLedger: string;
  rpcUrl: string;
}) {
  const router = useRouter();
  const [showRemoveContractEventDialog, setShowRemoveContractEventDialog] = useState(false);
  const [showEditContractEventDialog, setShowEditContractEventDialog] = useState(false);
  const [contractEvent, setContractEvent] = useState(null);

  useEffect(() => {
    const fetchContractEvent = async () => {
      try {
        const result = await window.sorobanApi.manageContractEvents(
          "get",
          { start_ledger: startLedger, rpc_url: rpcUrl }
        );

        if (result) {
          setContractEvent(result);
        }
      } catch (error) {
        console.error("Error fetching contract event:", error);
        setContractEvent(null);
      }
    };

    fetchContractEvent();
  }, [startLedger, rpcUrl]);

  const handleRemoveSuccess = () => {
    router.push('/events');
  };

  if (contractEvent) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${contractEvent.start_ledger}.png`}
                  alt={contractEvent.start_ledger}
                />
              </Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold">{contractEvent.start_ledger}</h2>
                <p className="text-sm text-gray-500">{contractEvent.rpc_url}</p>
              </div>
            </div>
            <div className="space-x-2">
              <Button onClick={() => setShowEditContractEventDialog(true)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Event
              </Button>
              <EditContractEventModal
                contractEvent={contractEvent}
                isOpen={showEditContractEventDialog}
                onClose={() => setShowEditContractEventDialog(false)}
              />
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => setShowRemoveContractEventDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Remove
              </Button>
              <RemoveContractEventModal
                contractEvent={contractEvent}
                isOpen={showRemoveContractEventDialog}
                onClose={() => setShowRemoveContractEventDialog(false)}
                onRemoveSuccess={handleRemoveSuccess}
              />
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <ContractEventDetailOutput
            startLedger={contractEvent.start_ledger}
            rpcUrl={contractEvent.rpc_url}
            networkPassphrase={contractEvent.network_passphrase}
            network={contractEvent.network}
          />
        </div>
      </>
    );
  } else {
    return (
      <div className="h-[calc(100vh-106px)] w-full rounded-md border flex flex-col items-center justify-center space-y-4">
        <Search className="h-12 w-12" />
        <p className="text-lg">Contract Event Not Found</p>
        <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
          The contract event you're looking for could not be found.
          <br />
          It may have been removed or the details might be incorrect.
        </p>
        <Button onClick={() => router.push('/events')}>
          Back to Events
        </Button>
      </div>
    );
  }
}
