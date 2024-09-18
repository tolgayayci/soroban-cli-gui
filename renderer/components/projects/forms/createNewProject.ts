import * as z from "zod";

export const createNewProjectFormSchema = z.object({
  project_name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters long" })
    .max(40, { message: "Project name must be at most 40 characters long" }),
  path: z
    .string()
    .min(3, {
      message: "You must select a path",
    })
    .max(255),
  include_examples: z.boolean(),
  with_example: z
    .enum([
      "account",
      "alloc",
      "atomic_multiswap",
      "atomic_swap",
      "auth",
      "cross_contract",
      "custom_types",
      "deep_contract_auth",
      "deployer",
      "errors",
      "eth_abi",
      "events",
      "fuzzing",
      "increment",
      "liquidity_pool",
      "logging",
      "mint_lock",
      "simple_account",
      "single_offer",
      "timelock",
      "token",
      "ttl",
      "upgradeable_contract",
      "workspace",
    ])
    .optional(),
  frontend_template: z
    .string()
    .url({ message: "Frontend template must be a valid URL" })
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  if (data.include_examples && !data.with_example) {
    return false;
  }
  return true;
}, {
  message: "You must select an example when 'With Example' is enabled",
  path: ["with_example"], // This specifies which field the error is associated with
});

export async function onCreateNewProjectForm(
  data: z.infer<typeof createNewProjectFormSchema>
) {
  try {
    const command = "contract";
    const subcommand = "init";
    const args = [data.path + "/" + data.project_name];
    const flags = [
      data.include_examples ? `-w ${data.with_example}` : null,
      data.frontend_template ? `-f ${data.frontend_template}` : null,
    ].filter(Boolean);

    const result = await window.sorobanApi
      .runSorobanCommand(command, subcommand, args, flags)
      .then(async () => {
        await window.sorobanApi.manageProjects("add", {
          name: data.project_name,
          path: data.path + "/" + data.project_name,
        });
      });

    return result;
  } catch (error) {
    throw error;
  }
}
