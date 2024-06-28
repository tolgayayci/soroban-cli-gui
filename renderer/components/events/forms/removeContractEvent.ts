import * as z from "zod";

export const removeContractEventFormSchema = z.object({
  startLedger: z.string(),
  contractId: z.string().optional(),
});

export async function onRemoveContractEventFormSubmit(
  data: z.infer<typeof removeContractEventFormSchema>
) {
  try {
    const result = await window.sorobanApi.manageContractEvents("remove", {
      startLedger: data.startLedger,
      contractId: data.contractId ? data.contractId : undefined,
    });
  } catch (error) {
    throw error;
  }
}
