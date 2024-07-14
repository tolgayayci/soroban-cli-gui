import * as z from "zod";

export const addContractEventFormSchema = z.object({
  start_ledger: z.string().min(1, "Start ledger must be at least 1."),
  cursor: z.string().optional(),
  output: z
    .enum(["pretty", "plain", "json"])
    .refine((value) => ["pretty", "plain", "json"].includes(value), {
      message: "Output must be 'pretty', 'plain', or 'json'.",
    })
    .optional(),
  count: z.string().min(1, "Count must be at least 1.").optional(),
  contract_id: z
    .string()
    .max(200, "A maximum of 5 contract IDs allowed.")
    .optional(),
  topic_filters: z
    .string()
    .max(200, "A maximum of 4 topic filters allowed.")
    .optional(),
  event_type: z
    .enum(["all", "contract", "system"])
    .refine((value) => ["all", "contract", "system"].includes(value), {
      message: "Event type must be 'all', 'contract', or 'system'.",
    })
    .optional(),
  is_global: z.boolean().optional(),
  config_dir: z.string().optional(),
  rpc_url: z.string().min(1, "RPC URL cannot be empty."),
  network_passphrase: z.string().min(1, "Network passphrase cannot be empty."),
  network: z.string().min(1, "Network cannot be empty."),
});

export async function onAddContractEventFormSubmit(
  data: z.infer<typeof addContractEventFormSchema>
) {
  try {
    const command = "soroban";
    const subcommand = "events";
    const args = [
      `--start-ledger ${data.start_ledger}`,
      `--cursor "${data.cursor}"`,
      data.rpc_url ? `--rpc-url "${data.rpc_url}"` : "",
      data.network_passphrase
        ? `--network-passphrase "${data.network_passphrase}"`
        : "",
      data.network ? `--network "${data.network}"` : "",
    ].filter(Boolean);
    const flags = [
      data.output ? `--output ${data.output}` : null,
      data.count ? `--count ${data.count}` : null,
      data.contract_id ? `--id ${data.contract_id}` : null,
      data.topic_filters ? `--topic ${data.topic_filters}` : null,
      data.event_type ? `--type ${data.event_type}` : null,
      data.is_global ? "--global" : null,
      data.config_dir ? `--config-dir "${data.config_dir}"` : null,
    ].filter(Boolean);

    await window.sorobanApi.manageContractEvents("add", data);
    await window.sorobanApi.reloadApplication();
  } catch (error) {
    console.error("Error on adding contract event:", error);
    throw error;
  }
}
