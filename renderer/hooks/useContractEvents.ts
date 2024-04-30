import { useEffect, useState } from "react";

interface ContractEvent {
  startLedger: number;
  cursor: string;
  output: string;
  count: number;
  contractId: string;
  topicFilters: string;
  eventType: string;
  useGlobalConfig: boolean;
  configDir: string;
  rpcUrl: string;
  networkPassphrase: string;
  network: string;
}

// This hook returns either a Project object or null if the project is not found.
export function useContractEvents(): ContractEvent[] | null {
  const [contractEvents, setContractEvents] = useState<ContractEvent[] | null>(
    null
  );

  async function fetchContractEvents(): Promise<void> {
    try {
      const result = await window.sorobanApi.manageContractEvents("list");

      const projectsData: ContractEvent[] = result.map((event: any) => ({
        startLedger: event.start_ledger,
        cursor: event.cursor,
        output: event.output,
        count: event.count,
        contractId: event.contract_id,
        topicFilters: event.topic_filters,
        eventType: event.event_type,
        useGlobalConfig: event.is_global,
        configDir: event.config_dir,
        rpcUrl: event.rpc_url,
        networkPassphrase: event.network_passphrase,
        network: event.network,
      }));

      setContractEvents(projectsData);
    } catch (error) {
      console.error("Error fetching project:", error);
      setContractEvents(null);
    }
  }

  useEffect(() => {
    fetchContractEvents();
  }, []);

  return contractEvents;
}
