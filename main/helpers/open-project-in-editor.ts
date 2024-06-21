const { spawn } = require("child_process");

export const openProjectInEditor = (projectPath, editor) => {
  const { name } = editor;

  if (name === "Visual Studio Code") {
    if (process.platform === "darwin") {
      // For macOS
      spawn("open", ["-a", "Visual Studio Code", projectPath]);
    } else if (process.platform === "win32") {
      // For Windows
      spawn("code", [projectPath], { detached: true });
    } else {
      // For Linux
      spawn("code", [projectPath], { detached: true });
    }
  } else if (name === "WebStorm") {
    if (process.platform === "darwin") {
      // For macOS
      spawn("open", ["-a", "WebStorm", projectPath]);
    } else if (process.platform === "win32") {
      // For Windows
      spawn("webstorm", [projectPath], { detached: true });
    } else {
      // For Linux
      spawn("webstorm", [projectPath], { detached: true });
    }
  } else if (name === "CLion") {
    if (process.platform === "darwin") {
      // For macOS
      spawn("open", ["-a", "CLion", projectPath]);
    } else if (process.platform === "win32") {
      // For Windows
      spawn("clion", [projectPath], { detached: true });
    } else {
      // For Linux
      spawn("clion", [projectPath], { detached: true });
    }
  } else {
    console.error("Unsupported editor:", name);
  }
};
