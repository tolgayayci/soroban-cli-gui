import * as z from "zod";

export const fundIdentityFormSchema = z.object({
  identity_name: z
    .string()
    .min(3, "Identity name must be at least 3 characters long.")
    .max(255, "Identity name must be at most 255 characters long.")
    .regex(
      /^[A-Za-z0-9.\-_@]+$/,
      "Only the characters ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-_@0123456789 are valid in identity names."
    ),
  hd_path: z
    .string()
    .regex(
      /^(m\/)?(\d+'?\/)*(\d+'?)$/,
      "HD path must follow a structure like m/44'/0'/0'/0."
    )
    .optional(),
  global: z.boolean().optional(),
  rpc_url: z.string().url("RPC URL must be a valid URL."),
  network_passphrase: z.string(),
  network_name: z.string(),
  config_dir: z.string().optional(),
});

export async function onFundIdentityFormSubmit(
  data: z.infer<typeof fundIdentityFormSchema>
) {
  try {
    const command = "keys";
    const subcommand = "fund";
    const args = [data.identity_name];
    const flags = [
      data.hd_path ? `--hd-path "${data.hd_path}"` : null,
      data.global ? "--global" : null,
      data.rpc_url ? `--rpc-url "${data.rpc_url}"` : null,
      data.network_passphrase
        ? `--network-passphrase "${data.network_passphrase}"`
        : null,
      data.network_name ? `--network "${data.network_name}"` : null,
      data.config_dir ? `--config-dir "${data.config_dir}"` : null,
    ].filter(Boolean);

    await window.sorobanApi.runSorobanCommand(command, subcommand, args, flags);
    await window.sorobanApi.reloadApplication();
  } catch (error) {
    throw error;
  }
}
