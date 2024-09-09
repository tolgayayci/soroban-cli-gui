import * as z from "zod";

export const renameProjectFormSchema = z.object({
  from_project_name: z
    .string()
    .min(3, "Project name must be at least 3 characters long.")
    .max(50, "Project name must be at most 50 characters long."),
  to_project_name: z
    .string()
    .min(3, "Project name must be at least 3 characters long.")
    .max(50, "Project name must be at most 50 characters long."),
  path: z.string(),
});

export async function onRenameProjectFormSubmit(
  data: z.infer<typeof renameProjectFormSchema>
) {
  try {
    const { to_project_name, path } = data;

    const existingProject = await window.sorobanApi.manageProjects("get", {
      path: path,
    });

    if (!existingProject) {
      throw new Error("Project not found");
    }

    const updatedProject = { ...existingProject, name: to_project_name };

    const result = await window.sorobanApi.manageProjects(
      "update",
      updatedProject
    );

    return result;
  } catch (error) {
    throw error;
  }
}
