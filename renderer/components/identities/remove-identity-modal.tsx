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
  removeIdentityFormSchema,
  onRemoveIdentityFormSubmit,
} from "components/identities/forms/removeIdentity";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Checkbox } from "components/ui/checkbox";
import { Loader2 } from "lucide-react";

import { useToast } from "components/ui/use-toast";

import { identityRemoveSuccess, identityRemoveError } from "lib/notifications";

export const RemoveIdentityModal = ({ identity, isOpen, onClose }) => {
  const [isSubmittingRemoveIdentity, setIsSubmittingRemoveIdentity] =
    useState(false);

  const removeIdentityForm = useForm<z.infer<typeof removeIdentityFormSchema>>({
    resolver: zodResolver(removeIdentityFormSchema),
    defaultValues: {
      identity_name: identity.name,
      global: false,
    },
  });

  const { toast } = useToast();

  const handleRemoveIdentityFormSubmit = async (data) => {
    setIsSubmittingRemoveIdentity(true);
    try {
      await onRemoveIdentityFormSubmit(data).then(() => {
        toast(identityRemoveSuccess(data.identity_name));
        removeIdentityForm.reset();
      });
    } catch (error) {
      toast(identityRemoveError(data.identity_name, error));
    } finally {
      setIsSubmittingRemoveIdentity(false);
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
        <Form {...removeIdentityForm}>
          <form
            onSubmit={removeIdentityForm.handleSubmit(
              handleRemoveIdentityFormSubmit
            )}
          >
            <DialogHeader className="space-y-3 mx-1 mb-2">
              <DialogTitle>Remove "{identity.name}"</DialogTitle>
              <DialogDescription>
                Remove an identity from Soroban
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-5 py-4 pb-6">
                <div className="space-y-3 mx-1">
                  <FormField
                    control={removeIdentityForm.control}
                    name="identity_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-small flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Identity to remove</p>
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
                <Accordion type="multiple">
                  <AccordionItem value="options" className="pt-0">
                    <AccordionTrigger className="mx-1 -mt-4">Options</AccordionTrigger>
                    <AccordionContent >
                      <div className="space-y-5">
                        <div className="space-y-3 mx-1">
                          <FormField
                            control={removeIdentityForm.control}
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
                            control={removeIdentityForm.control}
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
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              {isSubmittingRemoveIdentity ? (
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
