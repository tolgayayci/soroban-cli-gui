import { useEffect, useState } from "react";
import { useProjects } from "hooks/useProjects";

import { createContractsColumns } from "components/contracts/contracts-columns";
import { ContractsDataTable } from "components/contracts/contracts-data-table";
import NoContracts from "components/contracts/no-contracts";
import Loading from "components/common/loading";

export default function CanistersComponent() {
  const [allContracts, setAllContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const projects = useProjects();

  async function checkContracts(projectPath) {
    setIsLoading(true);
    try {
      const contractFiles = await window.sorobanApi.listContracts(projectPath);

      const contractsArray = contractFiles.map((filePath) => {
        const name = filePath.split("/").pop().replace(".rs", "");

        return {
          name,
          filePath,
          projectName:
            projects.find((p) => p.path === projectPath)?.name ||
            "Unknown Project",
          projectPath,
        };
      });

      setAllContracts((prevContracts) => [...prevContracts, ...contractsArray]);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (projects.length) {
      setAllContracts([]);
      projects.forEach((project) => {
        checkContracts(project.path);
      });
    }
  }, [projects]);

  const columns = createContractsColumns();

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      {isLoading ? (
        <Loading />
      ) : allContracts.length > 0 ? (
        <ContractsDataTable columns={columns} data={allContracts} />
      ) : (
        <NoContracts />
      )}
    </div>
  );
}
