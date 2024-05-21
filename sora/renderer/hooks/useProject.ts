import { useEffect, useState } from "react";

interface Project {
  name: string;
  path: string;
  active: boolean;
}

// This hook returns either a Project object or null if the project is not found.
export function useProject(projectPath: string): Project | null {
  const [project, setProject] = useState<Project | null>(null);

  async function fetchProject(): Promise<void> {
    try {
      const result = await window.sorobanApi.manageProjects("get", {
        path: projectPath,
      });
      if (result) {
        setProject({
          name: result.name,
          path: result.path,
          active: result.active,
        });
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [projectPath]);

  return project;
}
