import * as z from "zod";

export const addContractEventFormSchema = z.object({
  start_ledger: z.string().min(1, "Start ledger is required."),
  cursor: z.string().optional(), // Changed back to optional
  output: z
    .enum(["pretty", "plain", "json"])
    .default("pretty")
    .optional(),
  count: z.string().optional(),
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
    .default("all")
    .optional(),
  is_global: z.boolean().optional(),
  config_dir: z.string().optional(),
  rpc_url: z.string().min(1, "RPC URL is required."),
  network_passphrase: z.string().min(1, "Network passphrase is required."),
  network: z.string().min(1, "Network is required."),
});

export async function onAddContractEventFormSubmit(
  data: z.infer<typeof addContractEventFormSchema>
) {
  try {
    await window.sorobanApi.manageContractEvents("add", data);
    await window.sorobanApi.reloadApplication();
    return { success: true, message: "Contract event added successfully." };
  } catch (error) {
    console.error("Error on adding contract event:", error);
    return { success: false, message: "Failed to add contract event." };
  }
}
