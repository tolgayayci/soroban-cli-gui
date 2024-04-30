import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2 } from "lucide-react";

import { useToast } from "components/ui/use-toast";

import {
  removeContractEventFormSchema,
  onRemoveContractEventFormSubmit,
} from "components/events/forms/removeContractEvent";

import { identityRemoveSuccess, identityRemoveError } from "lib/notifications";

export const RemoveContractEventModal = ({
  contractEvent,
  isOpen,
  onClose,
}) => {
  const [isSubmittingRemoveContractEvent, setIsSubmittingRemoveContractEvent] =
    useState(false);

  const removeContractEventForm = useForm<
    z.infer<typeof removeContractEventFormSchema>
  >({
    resolver: zodResolver(removeContractEventFormSchema),
    defaultValues: {
      startLedger: contractEvent?.startLedger,
      contractId: contractEvent?.contractId,
    },
  });

  const { toast } = useToast();

  const handleRemoveContractEventFormSubmit = async (data) => {
    setIsSubmittingRemoveContractEvent(true);
    try {
      await onRemoveContractEventFormSubmit(data).then(() => {
        toast(identityRemoveSuccess(data.identity_name));
        removeContractEventForm.reset();
      });
    } catch (error) {
      toast(identityRemoveError(data.identity_name, error));
    } finally {
      setIsSubmittingRemoveContractEvent(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Form {...removeContractEventForm}>
          <form
            onSubmit={removeContractEventForm.handleSubmit(
              handleRemoveContractEventFormSubmit
            )}
          >
            <DialogHeader className="space-y-3">
              <DialogTitle>Remove "{contractEvent?.startLedger}"</DialogTitle>{" "}
              <DialogDescription>
                You can remove this contract event on events list.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="py-4 pb-6 space-y-3">
                <div className="space-y-3">
                  <FormField
                    control={removeContractEventForm.control}
                    name="startLedger"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-small">
                          Start Ledger
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="startLedger"
                            placeholder={contractEvent.startLedger}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <FormField
                    control={removeContractEventForm.control}
                    name="contractId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-small">
                          Contract Id
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="path"
                            placeholder={contractEvent.contractId}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              {isSubmittingRemoveContractEvent ? (
                <Button type="button" disabled>
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </Button>
              ) : (
                <Button variant="destructive" type="submit">
                  Remove
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
