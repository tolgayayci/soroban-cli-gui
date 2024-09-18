import * as z from "zod";

export const removeContractEventFormSchema = z.object({
  start_ledger: z.string(),
  rpc_url: z.string(),
});

export async function onRemoveContractEventFormSubmit(
  data: z.infer<typeof removeContractEventFormSchema>
) {
  try {
    const result = await window.sorobanApi.manageContractEvents("remove", {
      start_ledger: data.start_ledger,
      rpc_url: data.rpc_url,
    });
    return result;
  } catch (error) {
    throw error;
  }
}
