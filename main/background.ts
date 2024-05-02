const fixPath = require("fix-path");
fixPath();

import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";

// Analytics
import { initialize } from "@aptabase/electron/main";
import { trackEvent } from "@aptabase/electron/main";

import { createWindow } from "./helpers";
import { executeSorobanCommand } from "./helpers/soroban-helper";
import { handleProjects } from "./helpers/manage-projects";
import { handleIdentities } from "./helpers/manage-identities";
import { findContracts } from "./helpers/find-contracts";

const path = require("node:path");
const fs = require("fs");
const toml = require("toml");
const { shell } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

const isProd = process.env.NODE_ENV === "production";

const Store = require("electron-store");

const schema = {
  projects: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        path: { type: "string" },
        active: { type: "boolean" },
      },
      required: ["name", "path"],
    },
  },
  identities: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        address: { type: "string" },
      },
    },
  },
};

const store = new Store({ schema });
initialize("A-EU-8145589126");

store.set("identities", []);

// Set up logging for the auto updater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!canceled) {
    return filePaths[0];
  }
}

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  trackEvent("app_started");
  autoUpdater.checkForUpdatesAndNotify();

  const mainWindow = createWindow("main", {
    width: 1500,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("app:reload", () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  ipcMain.handle("open-external-link", async (event, url) => {
    if (url) {
      trackEvent("external_link_opened", { url });
      await shell.openExternal(url);
    }
  });

  ipcMain.handle(
    "soroban-command",
    async (event, command, subcommand, args?, flags?, path?) => {
      try {
        trackEvent("command_executed", { command, subcommand, args, flags });
        const result = await executeSorobanCommand(
          command,
          subcommand,
          args,
          flags,
          path
        );

        return result;
      } catch (error) {
        console.error(`Error while executing Soroban command: ${error}`);
        throw error;
      }
    }
  );

  ipcMain.handle("dialog:openDirectory", handleFileOpen);

  // Store: Projects Handler
  ipcMain.handle("store:manageProjects", async (event, action, project) => {
    try {
      trackEvent("project_action", { action, project });
      const result = await handleProjects(store, action, project);
      return result;
    } catch (error) {
      console.error("Error on projects:", error);
      throw error;
    }
  });

  ipcMain.handle("contracts:list", async (event, directoryPath) => {
    try {
      const contractFiles = findContracts(directoryPath);
      return contractFiles;
    } catch (error) {
      console.error("Error on projects:", error);
      return false;
    }
  });

  ipcMain.handle(
    "store:manageIdentities",
    async (event, action, identity, newIdentity?) => {
      try {
        trackEvent("identity_action", { action, identity, newIdentity });
        const result = await handleIdentities(
          store,
          action,
          identity,
          newIdentity
        );
        return result;
      } catch (error) {
        console.error("Error on identities:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("is-soroban-project", async (event, directoryPath) => {
    try {
      const cargoTomlPath = path.join(directoryPath, "Cargo.toml");
      if (!fs.existsSync(cargoTomlPath)) {
        return false;
      }

      const cargoTomlContent = fs.readFileSync(cargoTomlPath, "utf8");
      const parsedToml = toml.parse(cargoTomlContent);

      if (parsedToml.dependencies && "soroban-sdk" in parsedToml.dependencies) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error while checking for Soroban project: ${error}`);
      return false;
    }
  });

  ipcMain.handle("is-soroban-installed", async (event) => {
    try {
      if (mainWindow) {
        const result = await executeSorobanCommand("--version");
        const isSorobanInstalled = result.trim().startsWith("soroban");
        return isSorobanInstalled;
      } else {
        console.error("Main window not found");
      }
    } catch (error) {
      console.error(`Error while checking for Soroban installation: ${error}`);
      return false;
    }
  });

  // IPC handler for reading the JSON file
  ipcMain.handle("json:read", async (event, filePath, directoryPath) => {
    try {
      const data = fs.readFileSync(path.join(filePath, directoryPath), "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read file", error);
      return null; // or handle error as needed
    }
  });

  // IPC handler for updating the JSON file
  ipcMain.handle(
    "json:update",
    async (event, filePath, directoryPath, jsonContent) => {
      try {
        fs.writeFileSync(
          path.join(filePath, directoryPath),
          JSON.stringify(jsonContent, null, 2),
          "utf8"
        );
        return true; // success
      } catch (error) {
        console.error("Failed to write file", error);
        return false; // or handle error as needed
      }
    }
  );

  async function retrieveAndStoreIdentities() {
    try {
      const result = await executeSorobanCommand("keys", "ls");
      const identityNames = result
        .split("\n")
        .filter(
          (identity) => identity.trim() !== "" && identity.trim() !== "*"
        );

      for (const name of identityNames) {
        // Create an identity object
        const identity = {
          name: name,
        };

        // Add each identity to the store
        try {
          await handleIdentities(store, "add", identity);
        } catch (error) {
          console.error(`Error adding identity '${name}':`, error);
        }
      }
    } catch (error) {
      console.error("Error retrieving identities:", error);
    }
  }

  ipcMain.handle("identity:refresh", async (event) => {
    try {
      const envVars = retrieveAndStoreIdentities();
      return envVars;
    } catch (error) {
      console.error("Failed to read identities from soroban:", error);
      return { error };
    }
  });

  await retrieveAndStoreIdentities();

  if (isProd) {
    await mainWindow.loadURL("app://./projects");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/projects`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  trackEvent("app_closed");
  app.quit();
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
