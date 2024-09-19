"use client";

import { useState } from "react";

import { Checkbox } from "components/ui/checkbox";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2, HelpCircle } from "lucide-react";

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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "components/ui/tooltip";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  addContractEventFormSchema,
  onAddContractEventFormSubmit,
} from "components/events/forms/addContractEvent";

import { useToast } from "components/ui/use-toast";

export default function ContractEventModal({
  showCreateContractEventDialog,
  setShowCreateContractEventialog,
}) {
  const [isSubmittingContractEvent, setIsSubmittingContractEvent] =
    useState(false);

  const { toast } = useToast();

  const handleAddContractEvent = async (data) => {
    setIsSubmittingContractEvent(true);
    try {
      const result = await onAddContractEventFormSubmit(data);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setShowCreateContractEventialog(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingContractEvent(false);
    }
  };

  const addContractEventForm = useForm<
    z.infer<typeof addContractEventFormSchema>
  >({
    resolver: zodResolver(addContractEventFormSchema),
  });

  async function getDirectoryPath() {
    try {
      const result = await window.sorobanApi.openDirectory();
      return result;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <Dialog
      open={showCreateContractEventDialog}
      onOpenChange={() => setShowCreateContractEventialog(false)}
    >
      <DialogContent>
        <Form {...addContractEventForm}>
          <form
            onSubmit={addContractEventForm.handleSubmit(handleAddContractEvent)}
          >
            <DialogHeader className="space-y-3 mx-1 mb-2">
              <DialogTitle>Add New Contract Event</DialogTitle>
              <DialogDescription>
                Contract events you will add are global, you can show them
                later.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(70vh-106px)] overflow-y-auto pr-2">
              <div>
                <div className="space-y-6 py-4 pb-6">
                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
                      name="start_ledger"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The first ledger sequence number in the range to pull events</p>
                              </TooltipContent>
                            </Tooltip>
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

                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
                      name="network_passphrase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Network passphrase to sign the transaction sent to the RPC server</p>
                              </TooltipContent>
                            </Tooltip>
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

                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
                      name="network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Name of network to use from config</p>
                              </TooltipContent>
                            </Tooltip>
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

                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
                      name="rpc_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>RPC server endpoint</p>
                              </TooltipContent>
                            </Tooltip>
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

                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
                      name="cursor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The cursor corresponding to the start of the event range</p>
                              </TooltipContent>
                            </Tooltip>
                            Cursor
                          </FormLabel>
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

                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The maximum number of events to display</p>
                              </TooltipContent>
                            </Tooltip>
                            Count
                          </FormLabel>
                          <FormControl>
                            <Input {...field} id="count" placeholder="10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Accordion type="multiple">
                    <AccordionItem value="options">
                      <AccordionTrigger className="mx-1 -mt-4">Filters</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6">
                          <div className="space-y-3 mx-1">
                            <FormField
                              control={addContractEventForm.control}
                              name="contract_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small flex items-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>A set of (up to 5) contract IDs to filter events on</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    Contract ID
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
                          <div className="space-y-3 mx-1">
                            <FormField
                              control={addContractEventForm.control}
                              name="topic_filters"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small flex items-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>A set of (up to 4) topic filters to filter event topics on</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    Topic Filters
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
                          <div className="space-y-3 mx-1">
                            <FormLabel className="text-small flex items-center">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Specifies which type of contract events to display</p>
                                </TooltipContent>
                              </Tooltip>
                              Event Type
                            </FormLabel>
                            <FormField
                              control={addContractEventForm.control}
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
                      <AccordionTrigger className="mx-1 mb-2">Testing Options</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6">
                          <div className="space-y-3 mx-1">
                            <FormField
                              control={addContractEventForm.control}
                              name="config_dir"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small flex items-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Location of config directory</p>
                                      </TooltipContent>
                                    </Tooltip>
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
                  <div className="space-y-3 mx-1">
                    <FormField
                      control={addContractEventForm.control}
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
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowCreateContractEventialog(false)}
              >
                Cancel
              </Button>
              {isSubmittingContractEvent ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </Button>
              ) : (
                <Button type="submit">Add Contract Event</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
