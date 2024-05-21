import { useEffect, useState } from "react";

interface Project {
  name: string;
  path: string;
  active: boolean;
}

// This hook returns an array of Project objects.
export function useProjects(): Project[] {
  const [projects, setProjects] = useState<Project[]>([]);

  async function fetchProjects(): Promise<void> {
    try {
      const result = await window.sorobanApi.manageProjects("get");
      const projectsData: Project[] = result.map((project: any) => ({
        name: project.name,
        path: project.path,
        active: project.active,
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // In case of an error, it might be wise to handle it accordingly,
      // for example, by setting the projects to an empty array or handling the error state differently.
      setProjects([]);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []); // Empty dependency array means this effect runs once on mount.

  return projects;
}
