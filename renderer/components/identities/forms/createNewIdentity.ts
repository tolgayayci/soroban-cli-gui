import * as z from "zod";

export const newIdentityFormSchema = z.object({
  identity_name: z
    .string()
    .min(3, "Identity name must be at least 3 characters long.")
    .max(255, "Identity name must be at most 255 characters long."),
  seed: z.string().optional(),
  as_secret: z.boolean().optional(),
  global: z.boolean().optional(),
  hd_path: z
    .string()
    .regex(
      /^(m\/)?(\d+'?\/)*(\d+'?)$/,
      "HD path must follow a structure like m/44'/0'/0'/0."
    )
    .optional(),
  default_seed: z.boolean().optional(),
  config_dir: z.string().optional(),
  rpc_url: z.string().url("RPC URL must be a valid URL."),
  network_passphrase: z.string(),
  network: z.string(),
});

export async function onNewIdentityFormSubmit(
  data: z.infer<typeof newIdentityFormSchema>
) {
  try {
    const command = "keys";
    const subcommand = "generate";
    const args = [data.identity_name];
    const flags = [
      data.seed ? `--seed "${data.seed}"` : null,
      data.as_secret ? "--as-secret" : null,
      data.global ? "--global" : null,
      data.hd_path ? `--hd-path "${data.hd_path}"` : null,
      data.default_seed ? "--default-seed" : null,
      data.rpc_url ? `--rpc-url "${data.rpc_url}"` : null,
      data.network_passphrase
        ? `--network-passphrase "${data.network_passphrase}"`
        : null,
      data.network ? `--network "${data.network}"` : null,
    ].filter(Boolean);

    const result = await window.sorobanApi
      .runSorobanCommand(command, subcommand, args, flags)
      .then(async () => {
        await window.sorobanApi.manageIdentities("add", {
          name: data.identity_name,
          active: false,
        });
      });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
