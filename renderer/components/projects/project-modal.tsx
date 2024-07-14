"use client";

import { useState } from "react";

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
  DialogTrigger,
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Switch } from "components/ui/switch";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2 } from "lucide-react";

import {
  createNewProjectFormSchema,
  onCreateNewProjectForm,
} from "components/projects/forms/createNewProject";

import {
  addExistingProjectFormSchema,
  onAddExistingProjectForm,
} from "components/projects/forms/addExistingProject";

import { useToast } from "components/ui/use-toast";
import {
  projectCreateSuccess,
  projectCreateError,
  projectImportSuccess,
  projectImportError,
} from "lib/notifications";

export default function ProjectModal({
  showNewProjectDialog,
  setShowNewProjectDialog,
  onProjectChange,
}) {
  const [isSubmittingNewProject, setIsSubmittingNewProject] = useState(false);
  const [isSubmittingExistingProject, setIsSubmittingExistingProject] =
    useState(false);

  const { toast } = useToast();

  const createNewProjectform = useForm<
    z.infer<typeof createNewProjectFormSchema>
  >({
    resolver: zodResolver(createNewProjectFormSchema),
    defaultValues: {
      include_examples: false,
    },
  });

  const addExistingProjectForm = useForm<
    z.infer<typeof addExistingProjectFormSchema>
  >({
    resolver: zodResolver(addExistingProjectFormSchema),
  });

  // Modify your form submit handler to use setIsSubmitting
  const handleNewProjectFormSubmit = async (data) => {
    setIsSubmittingNewProject(true);
    try {
      await onCreateNewProjectForm(data).then(() => {
        toast(projectCreateSuccess(data.project_name));
        setShowNewProjectDialog(false);
        createNewProjectform.reset();
        onProjectChange();
      });
    } catch (error) {
      toast(projectCreateError(data.project_name, error));
    } finally {
      setIsSubmittingNewProject(false);
    }
  };

  const handleExistingProjectFormSubmit = async (data) => {
    setIsSubmittingExistingProject(true);
    try {
      const result = await window.sorobanApi.isSorobanProject(
        data.path as string
      );

      if (result) {
        await onAddExistingProjectForm(data).then(async () => {
          toast(projectImportSuccess(data.project_name));
          setShowNewProjectDialog(false);
          addExistingProjectForm.reset();
          onProjectChange();
        });
      } else {
        toast(projectImportError(data.project_name));
        setShowNewProjectDialog(false);
        addExistingProjectForm.reset();
        onProjectChange();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsSubmittingExistingProject(false);
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
      open={showNewProjectDialog}
      onOpenChange={() => setShowNewProjectDialog(false)}
    >
      <DialogContent>
        <Tabs defaultValue="create-project">
          <TabsList className="mb-4">
            <TabsTrigger value="create-project">New Project</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
          </TabsList>
          <TabsContent value="create-project">
            <Form {...createNewProjectform}>
              <form
                onSubmit={createNewProjectform.handleSubmit(
                  handleNewProjectFormSubmit
                )}
              >
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Initialize a Soroban project with an example contract
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(70vh-106px)] overflow-y-auto">
                  <div>
                    <div className="space-y-4 py-4 pb-4">
                      <div>
                        <FormField
                          control={createNewProjectform.control}
                          name="project_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small">
                                Project Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Hello Soroban"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={createNewProjectform.control}
                          name="path"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small">
                                Project Path
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
                      <div className="space-y-4">
                        <FormLabel className="text-small"> Options</FormLabel>
                        <div className="space-y-3">
                          <FormField
                            control={createNewProjectform.control}
                            name="include_examples"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    With Example
                                  </FormLabel>
                                  <FormDescription className="mr-4">
                                    Specify Soroban example contracts to
                                    include. A hello-world contract will be
                                    included by default
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        {createNewProjectform.watch("include_examples") && (
                          <div className="space-y-3">
                            <FormField
                              control={createNewProjectform.control}
                              name="with_example"
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
                                      {[
                                        "account",
                                        "alloc",
                                        "atomic_multiswap",
                                        "atomic_swap",
                                        "auth",
                                        "cross_contract",
                                        "custom_types",
                                        "deep_contract_auth",
                                        "deployer",
                                        "errors",
                                        "eth_abi",
                                        "events",
                                        "fuzzing",
                                        "increment",
                                        "liquidity_pool",
                                        "logging",
                                        "mint_lock",
                                        "simple_account",
                                        "single_offer",
                                        "timelock",
                                        "token",
                                        "upgradeable_contract",
                                        "workspace",
                                      ].map((exampleValue) => (
                                        <SelectItem
                                          key={exampleValue}
                                          value={exampleValue}
                                        >
                                          {exampleValue}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ScrollBar />
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowNewProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingNewProject ? (
                    <Button type="button" disabled>
                      {" "}
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
          <TabsContent value="import">
            <Form {...addExistingProjectForm}>
              <form
                onSubmit={addExistingProjectForm.handleSubmit(
                  handleExistingProjectFormSubmit
                )}
              >
                <DialogHeader>
                  <DialogTitle>Import Existing Project</DialogTitle>
                  <DialogDescription>
                    Import existing Soroban project from your computer
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="space-y-4 py-4 pb-4">
                    <div>
                      <FormField
                        control={addExistingProjectForm.control}
                        name="project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="My Social Project"
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={addExistingProjectForm.control}
                        name="path"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Path
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
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowNewProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingExistingProject ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </Button>
                  ) : (
                    <Button type="submit">Import</Button>
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
