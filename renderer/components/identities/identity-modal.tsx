"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Checkbox } from "components/ui/checkbox";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2 } from "lucide-react";
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  onNewIdentityFormSubmit,
  newIdentityFormSchema,
} from "components/identities/forms/createNewIdentity";

import {
  addIdentityFormSchema,
  onAddIdentityFormSubmit,
} from "components/identities/forms/addNewIdentity";

import { useToast } from "components/ui/use-toast";
import {
  identityCreateSuccess,
  identityCreateError,
  identityAddSuccess,
  identityAddError,
} from "lib/notifications";

export default function IdentityModal({
  showCreateIdentityDialog,
  setShowCreateIdentityDialog,
  onIdentityChange,
}) {
  const [isSubmittingCreateIdentity, setIsSubmittingCreateIdentity] =
    useState(false);
  const [isSubmittingAddIdentity, setIsSubmittingAddIdentity] = useState(false);

  const { toast } = useToast();

  const newIdentityForm = useForm<z.infer<typeof newIdentityFormSchema>>({
    resolver: zodResolver(newIdentityFormSchema),
  });

  const addIdentityForm = useForm<z.infer<typeof addIdentityFormSchema>>({
    resolver: zodResolver(addIdentityFormSchema),
  });

  const handleCreateNewIdentity = async (data) => {
    setIsSubmittingCreateIdentity(true);
    try {
      await onNewIdentityFormSubmit(data).then(() => {
        toast(identityCreateSuccess(data.identity_name));
        setShowCreateIdentityDialog(false);
        newIdentityForm.reset();
        onIdentityChange();
      });
    } catch (error) {
      toast(identityCreateError(data.identity_name, error));
    } finally {
      setIsSubmittingCreateIdentity(false);
    }
  };

  const handleAddIdentity = async (data) => {
    try {
      await onAddIdentityFormSubmit(data).then((res) => {
        //@ts-ignore
        if (res) {
          toast(identityAddSuccess(data.identity_name));
          setShowCreateIdentityDialog(false);
        }
      });
    } catch (error) {
      toast(identityAddError(data.identity_name, error));
    } finally {
      setShowCreateIdentityDialog(false);
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
    <Dialog
      open={showCreateIdentityDialog}
      onOpenChange={() => setShowCreateIdentityDialog(false)}
    >
      <DialogContent>
        <Tabs defaultValue="generate">
          <TabsList className="mb-4">
            <TabsTrigger value="generate">Generate Identity</TabsTrigger>
            <TabsTrigger value="add">Add Identity</TabsTrigger>
          </TabsList>
          <TabsContent value="generate">
            <Form {...newIdentityForm}>
              <form
                onSubmit={newIdentityForm.handleSubmit(handleCreateNewIdentity)}
              >
                <DialogHeader className="space-y-3 mx-1 mb-2">
                  <DialogTitle>Generate New Identity</DialogTitle>
                  <DialogDescription>
                    Identities you will add are global. They are not confined to
                    a specific project context.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(70vh-106px)] overflow-y-auto pr-2">
                  <div>
                    <div className="space-y-5 py-4 pb-6">
                      <div className="space-y-3 mx-1">
                        <FormField
                          control={newIdentityForm.control}
                          name="identity_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small flex items-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Name of the identity</p>
                                  </TooltipContent>
                                </Tooltip>
                                Identity Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="identity_name"
                                  placeholder="alice"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-3 mx-1">
                        <FormField
                          control={newIdentityForm.control}
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
                          control={newIdentityForm.control}
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
                                Network
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
                          control={newIdentityForm.control}
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
                                RPC Url
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
                        <AccordionItem value="options">
                          <AccordionTrigger className="mx-1 -mt-4">Options</AccordionTrigger>
                          <AccordionContent >
                            <div className="space-y-5">
                              <div className="space-y-3 mx-1">
                                <FormField
                                  control={newIdentityForm.control}
                                  name="seed"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-small flex items-center">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Optional seed to use when generating seed phrase. Random otherwise</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        Seed
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          id="seed"
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
                                  control={newIdentityForm.control}
                                  name="hd_path"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-small flex items-center">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>When generating a secret key, which `hd_path` should be used from the original `seed_phrase`</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        Hd Path
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
                                              getDirectoryPath().then(
                                                (path) => {
                                                  if (path) {
                                                    field.onChange(path);
                                                  }
                                                }
                                              );
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
                              <div className="space-y-3 mx-1">
                                <FormField
                                  control={newIdentityForm.control}
                                  name="as_secret"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>As Secret</FormLabel>
                                        <FormDescription>
                                          Output the generated identity as a
                                          secret key
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="space-y-3 mx-1">
                                <FormField
                                  control={newIdentityForm.control}
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
                                  control={newIdentityForm.control}
                                  name="default_seed"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>Default Seed</FormLabel>
                                        <FormDescription>
                                          Generate the default seed phrase.
                                          Useful for testing. Equivalent to
                                          --seed 0000000000000000
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="testing-options">
                          <AccordionTrigger className="mx-1">Testing Options</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div className="space-y-3 mx-1">
                                <FormField
                                  control={newIdentityForm.control}
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
                                              getDirectoryPath().then(
                                                (path) => {
                                                  if (path) {
                                                    field.onChange(path);
                                                  }
                                                }
                                              );
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
                  <ScrollBar />
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateIdentityDialog(false)}
                  >
                    Cancel
                  </Button>
                  {isSubmittingCreateIdentity ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </Button>
                  ) : (
                    <Button type="submit">Create</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="add">
            <Form {...addIdentityForm}>
              <form onSubmit={addIdentityForm.handleSubmit(handleAddIdentity)}>
                <DialogHeader className="space-y-3 mx-1 mb-2">
                  <DialogTitle>Add Identity</DialogTitle>
                  <DialogDescription>
                    Add a new identity (keypair, ledger, macOS keychain)
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(70vh-106px)] overflow-y-auto pr-2">
                  <div>
                    <div className="space-y-6 py-4 pb-6">
                      <div className="space-y-3 mx-1">
                        <FormField
                          control={addIdentityForm.control}
                          name="identity_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small flex items-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Name of the identity</p>
                                  </TooltipContent>
                                </Tooltip>
                                Identity Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="identity_name"
                                  placeholder="alice"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-3 mx-1">
                        <FormField
                          control={addIdentityForm.control}
                          name="seed_phrase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small flex items-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Seed phrase for the identity</p>
                                  </TooltipContent>
                                </Tooltip>
                                Seed Phrase
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="seed_phrase"
                                  placeholder="YOUR_SEED_PHRASE"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-3 mx-1">
                        <FormField
                          control={addIdentityForm.control}
                          name="secret_key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small flex items-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Secret key for the identity</p>
                                  </TooltipContent>
                                </Tooltip>
                                Secret Key
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="secret_key"
                                  placeholder="YOUR_SECRET_KEY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Accordion type="multiple">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="mx-1 -mt-4">Options</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-6">
                              <div className="space-y-3 mx-1">
                                <FormField
                                  control={addIdentityForm.control}
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
                                  control={addIdentityForm.control}
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
                                              getDirectoryPath().then(
                                                (path) => {
                                                  if (path) {
                                                    field.onChange(path);
                                                  }
                                                }
                                              );
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
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateIdentityDialog(false)}
                  >
                    Cancel
                  </Button>
                  {isSubmittingAddIdentity ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </Button>
                  ) : (
                    <Button type="submit">Add</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
