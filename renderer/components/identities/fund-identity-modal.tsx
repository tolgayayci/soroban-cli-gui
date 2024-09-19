import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "components/ui/tooltip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  fundIdentityFormSchema,
  onFundIdentityFormSubmit,
} from "components/identities/forms/fundIdentity";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Checkbox } from "components/ui/checkbox";
import { Loader2 } from "lucide-react";

import { useToast } from "components/ui/use-toast";

import { identityFundSuccess, identityFundError } from "lib/notifications";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

export const FundIdentityModal = ({ identity, isOpen, onClose }) => {
  const [isSubmittingFundIdentity, setIsSubmittingFundIdentity] =
    useState(false);

  const fundIdentityForm = useForm<z.infer<typeof fundIdentityFormSchema>>({
    resolver: zodResolver(fundIdentityFormSchema),
    defaultValues: {
      identity_name: identity.name,
      global: false,
    },
  });

  const { toast } = useToast();

  const handleFundIdentityFormSubmit = async (data) => {
    setIsSubmittingFundIdentity(true);
    try {
      await onFundIdentityFormSubmit(data).then(() => {
        toast(identityFundSuccess(data.identity_name));
        fundIdentityForm.reset();
      });
    } catch (error) {
      toast(identityFundError(data.identity_name, error));
    } finally {
      setIsSubmittingFundIdentity(false);
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
        <Form {...fundIdentityForm}>
          <form
            onSubmit={fundIdentityForm.handleSubmit(
              handleFundIdentityFormSubmit
            )}
          >
            <DialogHeader className="space-y-3 mx-1 mb-2">
              <DialogTitle>Fund "{identity.name}"</DialogTitle>
              <DialogDescription>
                Fund an identity on a test network
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(70vh-106px)] overflow-y-auto pr-2">
              <div>
                <div className="space-y-5 py-4 pb-6">
                  <div className="space-y-3 mx-1">
                    <FormField
                      control={fundIdentityForm.control}
                      name="identity_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small flex items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Name of identity to lookup, default test identity used if not provided</p>
                              </TooltipContent>
                            </Tooltip>
                            Identity Name
                          </FormLabel>
                          {identity ? (
                            <FormControl>
                              <Input
                                {...field}
                                id="identity_name"
                                defaultValue={identity.name}
                                disabled
                              />
                            </FormControl>
                          ) : null}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3 mx-1">
                    <FormField
                      control={fundIdentityForm.control}
                      name="network_name"
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
                            Network Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="testnet"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3 mx-1">
                    <FormField
                      control={fundIdentityForm.control}
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
                            Network Passphrase
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
                      control={fundIdentityForm.control}
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
                            RPC URL
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
                  <Accordion type="multiple">
                    <AccordionItem value="options" className="pt-0">
                      <AccordionTrigger className="mx-1 -mt-4">Options</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-5">
                          <div className="space-y-3 mx-1">
                            <FormField
                              control={fundIdentityForm.control}
                              name="global"
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
                                    <FormDescription>
                                      Use global config
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-3 mx-1">
                            <FormField
                              control={fundIdentityForm.control}
                              name="hd_path"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small flex items-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>If identity is a seed phrase use this HD path, default is 0</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    HD Path
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      id="hd_path"
                                      placeholder="m/44'/148'/0'"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-3 mx-1">
                            <FormField
                              control={fundIdentityForm.control}
                              name="config_dir"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small flex items-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Location of config directory, default is "."</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    Config Directory (Testing)
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
                </div>
              </div>
              <ScrollBar className="w-2"/>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              {isSubmittingFundIdentity ? (
                <Button type="button" disabled>
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Funding...
                </Button>
              ) : (
                <Button type="submit">Fund</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
