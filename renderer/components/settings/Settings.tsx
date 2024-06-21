"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import { Checkbox } from "components/ui/checkbox";

import { Avatar, AvatarImage } from "components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CodeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import NetworkModal from "components/settings/network-modal";
import NoNetworks from "./no-network";

import {
  removeNetworkFormSchema,
  onRemoveNetworkFormSubmit,
} from "components/settings/forms/removeNetwork";

import { useToast } from "components/ui/use-toast";
import { networkRemoveSuccess, networkRemoveError } from "lib/notifications";

const NetworkCard = ({
  network,
  onNetworkChange,
}: {
  network: {
    name: string;
    rpc_url: string;
  };
  onNetworkChange: () => void;
}) => {
  const [showRemoveNetworkDialog, setShowRemoveNetworkDialog] = useState(false);
  const [isSubmittingRemoveNetwork, setIsSubmittingRemoveNetwork] =
    useState(false);

  const { toast } = useToast();

  const removeNetworkForm = useForm<z.infer<typeof removeNetworkFormSchema>>({
    resolver: zodResolver(removeNetworkFormSchema),
    defaultValues: {
      network_name: network.name,
      global: false,
    },
  });

  const handleRemoveNetworkFormSubmit = async (data) => {
    setIsSubmittingRemoveNetwork(true);
    try {
      await onRemoveNetworkFormSubmit(data).then(() => {
        toast(networkRemoveSuccess(data.network_name));
        setShowRemoveNetworkDialog(false);
        removeNetworkForm.reset();
        onNetworkChange();
      });
    } catch (error) {
      toast(networkRemoveError(data.network_name, error));
    } finally {
      setIsSubmittingRemoveNetwork(false);
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
    <Card className="col-span-1" key={network.name}>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${network.name}.png`}
              alt={network.name}
            />
          </Avatar>
          <div className="flex flex-col space-y-1 overflow-hidden">
            <CardTitle className="text-medium">{network.name}</CardTitle>
            <CardDescription className="truncate inline-flex items-center">
              {network.rpc_url}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <Button
          className="w-full"
          onClick={() => setShowRemoveNetworkDialog(true)}
        >
          Remove
        </Button>
        <Dialog
          open={showRemoveNetworkDialog}
          onOpenChange={() => setShowRemoveNetworkDialog(false)}
        >
          <DialogContent>
            <Form {...removeNetworkForm}>
              <form
                onSubmit={removeNetworkForm.handleSubmit(
                  handleRemoveNetworkFormSubmit
                )}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Remove "{network.name}"</DialogTitle>
                  <DialogDescription>
                    Remove this network from Soroban
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="py-4 pb-6 space-y-3">
                    <div className="space-y-3">
                      <FormField
                        control={removeNetworkForm.control}
                        name="network_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Network Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="project_name"
                                placeholder={network.name}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="options" className="pt-0">
                        <AccordionTrigger>Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <FormField
                                control={removeNetworkForm.control}
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
                            <div className="space-y-3">
                              <FormField
                                control={removeNetworkForm.control}
                                name="config_dir"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-small">
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
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowRemoveNetworkDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingRemoveNetwork ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </Button>
                  ) : (
                    <Button type="submit" variant="destructive">
                      Remove
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default function SettingsComponent() {
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [networks, setNetworks] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function checkNetworks() {
    try {
      const output = await window.sorobanApi.runSorobanCommand(
        "network",
        "ls",
        ["--long"]
      );

      const networkBlockPattern = /Name:\s*(\S+)[\s\S]*?rpc_url:\s*"([^"]+)"/g;
      let match;
      const networks = [];

      while ((match = networkBlockPattern.exec(output)) !== null) {
        if (match.index === networkBlockPattern.lastIndex) {
          networkBlockPattern.lastIndex++;
        }

        const networkInfo = {
          name: match[1],
          rpc_url: match[2],
        };

        networks.push(networkInfo);
      }

      setNetworks(networks);
    } catch (error) {
      console.log("Error listing networks:", error);
      setNetworks([]);
    }
  }

  const refreshNetworks = async () => {
    await checkNetworks();
  };

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    checkNetworks();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <div className="flex items-center justify-between">
        <Alert className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <CodeIcon className="h-5 w-5 mr-4" />
            <div>
              <AlertTitle>
                You have {networks?.length ? networks?.length : "0"} networks
              </AlertTitle>
              <AlertDescription>
                You can add or remove your networks on this page.
              </AlertDescription>
            </div>
          </div>
          <Button onClick={() => setShowCreateProjectDialog(true)}>
            Create New Network
          </Button>
        </Alert>
        <NetworkModal
          showNewNetworkDialog={showCreateProjectDialog}
          setShowNewNetworkDialog={setShowCreateProjectDialog}
          onNetworkChange={refreshNetworks}
        />
      </div>
      {networks?.length > 0 ? (
        <div>
          <div className="my-6">
            <Input
              type="search"
              placeholder={`Search for a network between ${networks.length} networks`}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto">
            <div className="grid grid-cols-3 gap-8">
              {networks
                .filter((network) =>
                  network.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((network) => (
                  <NetworkCard
                    key={network.name}
                    network={network}
                    onNetworkChange={refreshNetworks}
                  />
                ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : (
        <NoNetworks />
      )}
    </div>
  );
}
