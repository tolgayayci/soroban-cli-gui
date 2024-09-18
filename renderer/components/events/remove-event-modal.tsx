import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "components/ui/use-toast";
import { onRemoveContractEventFormSubmit } from "components/events/forms/removeContractEvent";

import { identityRemoveSuccess, identityRemoveError } from "lib/notifications";

export const RemoveContractEventModal = ({
  contractEvent,
  isOpen,
  onClose,
  onRemoveSuccess,
}) => {
  const [isSubmittingRemoveContractEvent, setIsSubmittingRemoveContractEvent] = useState(false);
  const { toast } = useToast();

  const handleRemoveContractEvent = async () => {
    setIsSubmittingRemoveContractEvent(true);
    try {
      await onRemoveContractEventFormSubmit({
        start_ledger: contractEvent.start_ledger,
        rpc_url: contractEvent.rpc_url,
      });
      toast({
        title: "Success",
        description: "Contract event removed successfully",
      });
      onClose();
      onRemoveSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove contract event",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRemoveContractEvent(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Contract Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this contract event?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="start_ledger" className="text-sm font-medium">
              Start Ledger
            </label>
            <Input
              id="start_ledger"
              value={contractEvent.start_ledger}
              disabled
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="rpc_url" className="text-sm font-medium">
              RPC URL
            </label>
            <Input
              id="rpc_url"
              value={contractEvent.rpc_url}
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleRemoveContractEvent}
            disabled={isSubmittingRemoveContractEvent}
          >
            {isSubmittingRemoveContractEvent ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
