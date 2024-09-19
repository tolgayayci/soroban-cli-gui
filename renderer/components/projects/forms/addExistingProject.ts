import * as z from "zod";

export const addExistingProjectFormSchema = z.object({
  project_name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters long" })
    .max(40, { message: "Project name must be at most 40 characters long" }),
  path: z
    .string()
    .min(3, {
      message: "You must select a path",
    })
    .max(255),
});

export async function onAddExistingProjectForm(
  data: z.infer<typeof addExistingProjectFormSchema>
) {
  try {
    const result = await window.sorobanApi
      .isSorobanProject(data.path)
      .then(async () => {
        await window.sorobanApi.manageProjects("add", {
          name: data.project_name,
          path: data.path,
        });
      });

    return result;
  } catch (error) {
    throw error;
  }
}
