import * as z from "zod";

export const removeIdentityFormSchema = z.object({
  identity_name: z
    .string()
    .min(3, "Identity name must be at least 3 characters long.")
    .max(255, "Identity name must be at most 255 characters long."),
  global: z.boolean().optional(),
  config_dir: z.string().optional(),
});

export async function onRemoveIdentityFormSubmit(
  data: z.infer<typeof removeIdentityFormSchema>
) {
  try {
    const command = "keys";
    const subcommand = "rm";
    const args = [data.identity_name];
    const flags = [
      data.global ? "--global" : null,
      data.config_dir ? `--config-dir "${data.config_dir}"` : null,
    ].filter(Boolean);

    await window.sorobanApi.runSorobanCommand(command, subcommand, args, flags);

    await window.sorobanApi.manageIdentities("delete", {
      name: data.identity_name,
    });

    await window.sorobanApi.reloadApplication();
  } catch (error) {
    throw error;
  }
}
