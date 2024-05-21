export function handleProjects(store, action, project) {
  let projects = store.get("projects", []);

  switch (action) {
    case "add":
      // Check if the project already exists
      if (projects.some((p) => p.path === project.path)) {
        throw new Error("Project already exists");
      }
      projects.push(project);
      break;

    case "update":
      // Find the index of the project
      const existingProjectIndex = projects.findIndex(
        (p) => p.path === project.path
      );
      if (existingProjectIndex === -1) {
        throw new Error("Project not found");
      }

      // Set all projects to inactive
      projects.forEach((p) => (p.active = false));

      // Update the selected project and set it to active
      projects[existingProjectIndex] = { ...project, active: true };
      break;

    case "delete":
      const projectIndexToRemove = projects.findIndex(
        (p) => p.path === project.path
      );
      if (projectIndexToRemove === -1) {
        throw new Error("Project not found");
      }
      projects.splice(projectIndexToRemove, 1);
      break;

    case "get":
      if (project && project.path) {
        // Return the requested project
        const requestedProject = projects.find((p) => p.path === project.path);
        return requestedProject || null; // Return null if not found
      }
      // Return all projects if no specific project is requested
      return projects;

    default:
      throw new Error("Invalid action");
  }

  // Update the store (not necessary for 'get' action)
  store.set("projects", projects);

  // Return the updated projects array (not necessary for 'get' action)
  return projects;
}
