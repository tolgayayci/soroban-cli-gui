import * as z from "zod";

export const editContractEventFormSchema = z.object({
  start_ledger: z.string().min(1, "Start ledger is required."),
  cursor: z.string().optional(),
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

export const onEditContractEventFormSubmit = async (data) => {
  try {
    const result = await window.sorobanApi.manageContractEvents("update", data);
    if (result) {
      return { success: true, message: "Contract event updated successfully" };
    } else {
      return { success: false, message: "Failed to update contract event" };
    }
  } catch (error) {
    console.error("Error updating contract event:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};
