import * as z from "zod";

export const removeNetworkFormSchema = z.object({
  network_name: z
    .string()
    .min(3, "Network name must be at least 3 characters long.")
    .max(50, "Network name must be at most 50 characters long."),
  global: z.boolean().optional(),
  config_dir: z.string().optional(),
});

export async function onRemoveNetworkFormSubmit(
  data: z.infer<typeof removeNetworkFormSchema>
) {
  try {
    const command = "network";
    const subcommand = "rm";
    const args = [data.network_name];
    const flags = [
      data.global ? "--global" : null,
      data.config_dir ? `--config-dir "${data.config_dir}"` : null,
    ].filter(Boolean);

    await window.sorobanApi.runSorobanCommand(command, subcommand, args, flags);
    await window.sorobanApi.reloadApplication();
  } catch (error) {
    throw error;
  }
}
