import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes"; // Add this import

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
import { Loader2, Trash2, FolderOpen, Search, Folder } from "lucide-react";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ProjectModal from "components/projects/project-modal";
import EditorModal from "components/projects/editor-modal";

import {
  removeProjectFormSchema,
  onRemoveProjectFormSubmit,
} from "components/projects/forms/removeProject";

import { useToast } from "components/ui/use-toast";
import { projectRemoveSuccess, projectRemoveError } from "lib/notifications";

const ProjectCard = ({ project, onProjectChange }) => {
  const [showRemoveProjectDialog, setShowRemoveProjectDialog] = useState(false);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [isSubmittingRemoveProject, setIsSubmittingRemoveProject] =
    useState(false);

  const { toast } = useToast();

  const removeProjectForm = useForm({
    resolver: zodResolver(removeProjectFormSchema),
    defaultValues: {
      project_name: project.name,
      path: project.path,
    },
  });

  const handleRemoveProjectFormSubmit = async (data) => {
    setIsSubmittingRemoveProject(true);
    try {
      await onRemoveProjectFormSubmit(data);
      toast(projectRemoveSuccess(data.project_name));
      setShowRemoveProjectDialog(false);
      removeProjectForm.reset();
      onProjectChange();
    } catch (error) {
      console.error(error);
      toast(projectRemoveError(data.project_name, error.message));
    } finally {
      setIsSubmittingRemoveProject(false);
    }
  };

  const handleCloseRemoveDialog = () => {
    setShowRemoveProjectDialog(false);
    removeProjectForm.reset();
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow overflow-hidden">
            <Avatar className="mr-3 h-10 w-10">
              <AvatarImage
                src={`https://avatar.vercel.sh/${project.name}.png`}
                alt={project.name}
              />
            </Avatar>
            <div className="flex flex-col space-y-1 overflow-hidden">
              <CardTitle className="text-medium truncate">
                {project.name}
              </CardTitle>
              <CardDescription className="truncate">
                {project.path.split("/").slice(-2).join("/")}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:text-red-500 ml-2"
            onClick={() => setShowRemoveProjectDialog(true)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowEditorDialog(true)}
        >
          Open With
        </Button>
        <Link href={`/contracts/${encodeURIComponent(project.path)}`}>
          <Button className="w-full">Contracts</Button>
        </Link>
      </CardContent>

      <Dialog
        open={showRemoveProjectDialog}
        onOpenChange={(open) => {
          if (!open) handleCloseRemoveDialog();
        }}
      >
        <DialogContent>
          <Form {...removeProjectForm}>
            <form
              onSubmit={removeProjectForm.handleSubmit(
                handleRemoveProjectFormSubmit
              )}
            >
              <DialogHeader>
                <DialogTitle>Remove "{project.name}"</DialogTitle>
                <DialogDescription>
                  You can remove your project from the application. This doesn't
                  remove your project folder from your system.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <FormField
                  control={removeProjectForm.control}
                  name="project_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={removeProjectForm.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Path</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCloseRemoveDialog}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmittingRemoveProject}
                >
                  {isSubmittingRemoveProject ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <EditorModal
        showEditorDialog={showEditorDialog}
        setShowEditorDialog={setShowEditorDialog}
        projectName={project.name}
        projectPath={project.path}
      />
    </Card>
  );
};

const ProjectsComponent = () => {
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { theme } = useTheme();

  async function checkProjects() {
    try {
      const fetchedProjects = await window.sorobanApi.manageProjects("get", "");
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  const refreshProjects = () => {
    checkProjects();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    checkProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <Alert className="flex items-center justify-between py-6">
        <div className="flex items-center">
          <Folder className="h-5 w-5 mr-4" />
          <div>
            <AlertTitle>You have {projects.length} projects</AlertTitle>
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

      {projects.length > 0 ? (
        <div className="mt-6 space-y-6">
          <Input
            type="search"
            placeholder={`Search for a project between ${projects.length} projects`}
            onChange={handleSearchChange}
            value={searchQuery}
          />
          <ScrollArea className="h-[calc(100vh-300px)]">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.path}
                    project={project}
                    onProjectChange={refreshProjects}
                  />
                ))}
              </div>
            ) : (
              <div className="h-[calc(100vh-300px)] w-full rounded-md border flex flex-col items-center justify-center">
                <div className="flex items-center justify-center -mt-8">
                  <Image
                    src={
                      theme === "dark"
                        ? "/icons/not_found_light.svg"
                        : "/icons/not_found_dark.svg"
                    }
                    alt="Projects"
                    width={220}
                    height={220}
                  />
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
                  <p className="text-lg">No Projects Found</p>
                  <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
                    No projects match your search query "{searchQuery}".
                    <br />
                    Try adjusting your search or create a new project.
                  </p>

                  <Button onClick={() => setShowCreateProjectDialog(true)}>
                    Create New Project
                  </Button>
                </div>
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : (
        <div className="h-[calc(100vh-10px)] w-full rounded-md border flex flex-col items-center justify-center mt-3">
          <div className="flex items-center justify-center -mt-8">
            <Image
              src={
                theme === "dark"
                  ? "/icons/not_found_light.svg"
                  : "/icons/not_found_dark.svg"
              }
              alt="Projects"
              width={250}
              height={250}
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
            <p className="text-lg">No Projects Found</p>
            <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
              You haven't created any projects yet. <br />
              Start by creating a new project to begin your development journey.
            </p>
            <Button onClick={() => setShowCreateProjectDialog(true)}>
              Create New Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsComponent;
