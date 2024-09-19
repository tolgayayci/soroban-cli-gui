import * as z from "zod";

// Updated schema to include rpc-url and network-passphrase
export const createNetworkFormSchema = z.object({
  network_name: z
    .string()
    .min(3, "Network name must be at least 3 characters long.")
    .max(50, "Network name must be at most 50 characters long.")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Network name must include only letters and numbers, no special characters or spaces."
    ),
  rpc_url: z.string().url("RPC URL must be a valid URL."),
  network_passphrase: z.string().min(1, "Network passphrase is required."),
  global: z.boolean().optional(),
  config_dir: z.string().optional(),
});

export async function onCreateNetworkFormSubmit(
  data: z.infer<typeof createNetworkFormSchema>
) {
  try {
    const command = "network";
    const subcommand = "add";
    const args = [data.network_name];
    const flags = [
      `--rpc-url "${data.rpc_url}"`,
      `--network-passphrase "${data.network_passphrase}"`,
      data.global ? "--global" : null,
      data.config_dir ? `--config-dir ${data.config_dir}` : null,
    ].filter(Boolean);

    await window.sorobanApi.runSorobanCommand(command, subcommand, args, flags);
    await window.sorobanApi.reloadApplication();
  } catch (error) {
    throw error;
  }
}
