import * as z from "zod";

export const addIdentityFormSchema = z.object({
  identity_name: z
    .string()
    .min(3, "Identity name must be at least 3 characters long.")
    .max(255, "Identity name must be at most 255 characters long."),
  secret_key: z.string(),
  seed_phrase: z.string(),
  global: z.boolean().optional(),
  config_dir: z.string().optional(),
});

export async function onAddIdentityFormSubmit(
  data: z.infer<typeof addIdentityFormSchema>
) {
  try {
    const command = "keys";
    const subcommand = "add";
    const args = [data.identity_name];
    const flags = [
      data.secret_key ? `--secret-key "${data.secret_key}"` : null,
      data.seed_phrase ? `--seed-phrase "${data.seed_phrase}"` : null,
      data.global ? "--global" : null,
      data.config_dir ? `--config-dir "${data.config_dir}"` : null,
    ].filter(Boolean);

    await window.sorobanApi.runSorobanCommand(command, subcommand, args, flags);
    await window.sorobanApi.reloadApplication();
  } catch (error) {
    throw error;
  }
}
