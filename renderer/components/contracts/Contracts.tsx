import { useEffect, useState } from "react";
import { useProjects } from "hooks/useProjects";
import { useTheme } from "next-themes";
import Image from "next/image";

import { createContractsColumns } from "components/contracts/contracts-columns";
import { ContractsDataTable } from "components/contracts/contracts-data-table";
import Loading from "components/common/loading";
import { Button } from "components/ui/button"; 
import Link from "next/link";

export default function ContractsComponent() {
  const [allContracts, setAllContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

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
        <div className="h-[calc(100vh-10px)] w-full rounded-md border flex flex-col items-center justify-center mt-3">
          <div className="flex items-center justify-center -mt-8">
            <Image
              src={
                theme === "dark"
                  ? "/icons/not_found_light.svg"
                  : "/icons/not_found_dark.svg"
              }
              alt="Contracts"
              width={250}
              height={250}
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
            <p className="text-lg">No Contracts Found</p>
            <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
              Create a new project to get started or add an existing project to list your contracts.
            </p>
            <Link href="/projects">
              <Button>Go to Projects</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
