"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import { Avatar, AvatarImage } from "components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Loader2, Trash2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CodeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import ProjectModal from "components/projects/project-modal";
import NoProjects from "components/projects/no-project";
import EditorModal from "components/projects/editor-modal";

import {
  removeProjectFormSchema,
  onRemoveProjectFormSubmit,
} from "components/projects/forms/removeProject";

import { useToast } from "components/ui/use-toast";
import { projectRemoveSuccess, projectRemoveError } from "lib/notifications";

const ProjectCard = ({
  project,
  onProjectChange,
}: {
  project: {
    name: string;
    path: string;
    active: boolean;
  };
  onProjectChange: () => void;
}) => {
  const [showRemoveProjectDialog, setShowRemoveProjectDialog] = useState(false);
  const [showEditorDialog, setShowEditorDialog] = useState(false);

  const [isSubmittingRemoveProject, setIsSubmittingRemoveProject] =
    useState(false);

  const { toast } = useToast();

  const removeProjectForm = useForm<z.infer<typeof removeProjectFormSchema>>({
    resolver: zodResolver(removeProjectFormSchema),
    defaultValues: {
      project_name: project.name,
      path: project.path,
    },
  });

  const handleRemoveProjectFormSubmit = async (data) => {
    setIsSubmittingRemoveProject(true);
    try {
      await onRemoveProjectFormSubmit(data).then(() => {
        toast(projectRemoveSuccess(data.project_name));
        setShowRemoveProjectDialog(false);
        removeProjectForm.reset();
        onProjectChange();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingRemoveProject(false);
    }
  };

  return (
    <Card className="col-span-1" key={project.name}>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-3 h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${project.name}.png`}
              alt={project.name}
            />
          </Avatar>
          <div className="flex flex-col space-y-1 overflow-hidden">
            <CardTitle className="text-medium">{project.name}</CardTitle>
            <CardDescription className="truncate inline-flex items-center">
              {project.path.split("/").slice(-2)[0] +
                "/" +
                project.path.split("/").slice(-2)[1]}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className=" hover:text-red-500 ml-5"
            onClick={() => setShowRemoveProjectDialog(true)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {/*  */}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowEditorDialog(true)}
        >
          Open With
        </Button>
        <EditorModal
          showEditorDialog={showEditorDialog}
          setShowEditorDialog={setShowEditorDialog}
          projectName={project.name}
          projectPath={project.path}
        />
        <Link href={`/contracts/${encodeURIComponent(project.path)}`}>
          <Button>Contracts</Button>
        </Link>
        <Dialog
          open={showRemoveProjectDialog}
          onOpenChange={() => setShowRemoveProjectDialog(false)}
        >
          <DialogContent>
            <Form {...removeProjectForm}>
              <form
                onSubmit={removeProjectForm.handleSubmit(
                  handleRemoveProjectFormSubmit
                )}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Remove "{project.name}"</DialogTitle>
                  <DialogDescription>
                    You can remove your project on application, this doesn't
                    remove your project folder on your system.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="py-4 pb-6 space-y-3">
                    <div className="space-y-3">
                      <FormField
                        control={removeProjectForm.control}
                        name="project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="project_name"
                                placeholder={project.name}
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
                        control={removeProjectForm.control}
                        name="path"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">Path</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="path"
                                placeholder={project.path}
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowRemoveProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingRemoveProject ? (
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

export default function ProjectsComponent() {
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");

  async function checkProjects() {
    try {
      const projects = await window.sorobanApi.manageProjects("get", "");

      setProjects(projects);
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  const refreshProjects = async () => {
    await checkProjects();
  };

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    checkProjects();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <div className="flex items-center justify-between">
        <Alert className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <CodeIcon className="h-5 w-5 mr-4" />
            <div>
              <AlertTitle>
                You have {projects?.length ? projects?.length : "0"} projects
              </AlertTitle>
              <AlertDescription>
                You can add, remove, or edit your projects on this page.
              </AlertDescription>
            </div>
          </div>
          <Button onClick={() => setShowCreateProjectDialog(true)}>
            Create New Project
          </Button>
        </Alert>
        <ProjectModal
          showNewProjectDialog={showCreateProjectDialog}
          setShowNewProjectDialog={setShowCreateProjectDialog}
          onProjectChange={refreshProjects}
        />
      </div>
      {projects?.length > 0 ? (
        <div>
          <div className="my-6">
            <Input
              type="search"
              placeholder={`Search for a project between ${projects.length} projects`}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto">
            <div className="grid grid-cols-3 gap-8">
              {projects
                .filter((project) =>
                  project.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((project) => (
                  <ProjectCard
                    key={project.path}
                    project={project}
                    onProjectChange={refreshProjects}
                  />
                ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : (
        <NoProjects />
      )}
    </div>
  );
}
