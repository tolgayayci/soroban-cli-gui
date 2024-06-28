"use client";

import { useState } from "react";

import { Checkbox } from "components/ui/checkbox";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";

import {
  Form,
  FormControl,
  FormDescription,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  editContractEventFormSchema,
  onEditContractEventFormSubmit,
} from "components/events/forms/editContractEvent";

import { useToast } from "components/ui/use-toast";
import {
  identityCreateSuccess,
  identityCreateError,
  identityAddSuccess,
  identityAddError,
} from "lib/notifications";

export const EditContractEventModal = ({ contractEvent, isOpen, onClose }) => {
  const [isSubmittingEditContractEvent, setIsSubmittingEditContractEvent] =
    useState(false);

  const { toast } = useToast();

  const editContractEventForm = useForm<
    z.infer<typeof editContractEventFormSchema>
  >({
    resolver: zodResolver(editContractEventFormSchema),
  });

  const handleEditContractEventFormSubmit = async (data) => {
    setIsSubmittingEditContractEvent(true);
    try {
      await onEditContractEventFormSubmit(data).then((res) => {
        //@ts-ignore
        if (res) {
          //   toast(identityAddSuccess(data.identity_name));
          editContractEventForm.reset();
        }
      });
    } catch (error) {
      //   toast(identityAddError(data.identity_name, error));
    } finally {
      setIsSubmittingEditContractEvent(false);
    }
  };

  async function getDirectoryPath() {
    try {
      const result = await window.sorobanApi.openDirectory();
      return result;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Form {...editContractEventForm}>
          <form
            onSubmit={editContractEventForm.handleSubmit(
              handleEditContractEventFormSubmit
            )}
          >
            <DialogHeader className="space-y-3">
              <DialogTitle>Edit Contract Event</DialogTitle>
              <DialogDescription>
                You can edit this contract event.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(70vh-106px)] overflow-y-auto pr-1">
              <div>
                <div className="space-y-4 py-4 pb-6">
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="start_ledger"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">
                            Start Ledger *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="start_ledger"
                              type="number"
                              placeholder="123123123"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="cursor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">Cursor *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="cursor"
                              placeholder="123123123"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="network_passphrase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">
                            Network Passphrase *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} id="network_passphrase" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">
                            Network *
                          </FormLabel>
                          <FormControl>
                            <Input {...field} id="network" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="rpc_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">
                            RPC Url *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="rpc_url"
                              placeholder="http://localhost:1234"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">Count</FormLabel>
                          <FormControl>
                            <Input {...field} id="count" placeholder="10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="options">
                      <AccordionTrigger>Filters</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <FormField
                              control={editContractEventForm.control}
                              name="contract_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small">
                                    Id
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      id="contract_id"
                                      placeholder="0000000000000000"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-3">
                            <FormField
                              control={editContractEventForm.control}
                              name="topic_filters"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small">
                                    Topic
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      id="topic_filters"
                                      placeholder="AAAABQAAAAdDT1VOVEVSAA==,*"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-3">
                            <FormLabel className="text-small">Type</FormLabel>
                            <FormField
                              control={editContractEventForm.control}
                              name="event_type"
                              render={({ field }) => (
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select an example" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["all", "contract", "system"].map(
                                        (exampleValue) => (
                                          <SelectItem
                                            key={exampleValue}
                                            value={exampleValue}
                                          >
                                            {exampleValue}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="testing-options">
                      <AccordionTrigger>Testing Options</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <FormField
                              control={editContractEventForm.control}
                              name="config_dir"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small">
                                    Config Directory
                                  </FormLabel>
                                  <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                      <Input
                                        type="text"
                                        readOnly
                                        value={field.value}
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          getDirectoryPath().then((path) => {
                                            if (path) {
                                              field.onChange(path);
                                            }
                                          });
                                        }}
                                      >
                                        Select
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="space-y-3">
                    <FormField
                      control={editContractEventForm.control}
                      name="is_global"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Global</FormLabel>
                            <FormDescription>Use global config</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <ScrollBar />
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              {isSubmittingEditContractEvent ? (
                <Button disabled>
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Editing...
                </Button>
              ) : (
                <Button type="submit">Edit Contract Event</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
