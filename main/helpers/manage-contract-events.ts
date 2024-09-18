export function handleContractEvents(store, action, contractSettings) {
  let contracts = store.get("contractEvents", []);

  switch (action) {
    case "add":
      if (
        typeof contractSettings === "object" &&
        !Array.isArray(contractSettings) &&
        contractSettings.start_ledger &&
        contractSettings.rpc_url &&
        contractSettings.network_passphrase &&
        contractSettings.network
      ) {
        contracts.push(contractSettings);
      } else {
        throw new Error("Invalid contract settings");
      }
      break;

    case "update":
      if (
        typeof contractSettings === "object" &&
        !Array.isArray(contractSettings) &&
        contractSettings.original_rpc_url &&
        contractSettings.original_start_ledger
      ) {
        const index = contracts.findIndex(
          (c) => c.rpc_url === contractSettings.original_rpc_url && c.start_ledger === contractSettings.original_start_ledger
        );
        if (index !== -1) {
          // Remove the temporary fields used for identification
          delete contractSettings.original_start_ledger;
          delete contractSettings.original_rpc_url;
          
          contracts[index] = { ...contracts[index], ...contractSettings };
        } else {
          throw new Error("Contract to update not found");
        }
      } else {
        throw new Error("Invalid contract settings for update");
      }
      break;

    case "remove":
      if (
        typeof contractSettings === "object" &&
        !Array.isArray(contractSettings) &&
        contractSettings.start_ledger &&
        contractSettings.rpc_url
      ) {
        contracts = contracts.filter(
          (c) => !(c.start_ledger === contractSettings.start_ledger && c.rpc_url === contractSettings.rpc_url)
        );
      } else {
        throw new Error("Invalid contract settings for remove");
      }
      break;

    case "get":
      if (contractSettings.start_ledger && contractSettings.rpc_url) {
        const contract = contracts.find(
          (c) => c.start_ledger === contractSettings.start_ledger && c.rpc_url === contractSettings.rpc_url
        );
        return contract || null;
      }
      return contracts;

    case "list":
      return contracts;

    default:
      throw new Error("Invalid action");
  }

  store.set("contractEvents", contracts);
  return contracts;
}
