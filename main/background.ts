const fixPath = require("fix-path");
fixPath();

import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
const { readFile } = require("fs").promises;

// Analytics
import { initialize } from "@aptabase/electron/main";
import { trackEvent } from "@aptabase/electron/main";

import { createWindow } from "./helpers";
import { executeSorobanCommand } from "./helpers/soroban-helper";
import { handleProjects } from "./helpers/manage-projects";
import { handleIdentities } from "./helpers/manage-identities";
import { findContracts } from "./helpers/find-contracts";
import { checkEditors } from "./helpers/check-editors";
import { openProjectInEditor } from "./helpers/open-project-in-editor";
import { handleContractEvents } from "./helpers/manage-contract-events";

const path = require("node:path");
const fs = require("fs");
const toml = require("toml");
const { shell } = require("electron");
const log = require("electron-log/main");
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
  contractEvents: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        start_ledger: { type: "string" },
        cursor: { type: "string" },
        output: {
          type: "string",
          enum: ["pretty", "plain", "json"],
          default: "pretty",
        },
        count: { type: "string" },
        contract_id: {
          type: "string",
        },
        topic_filters: {
          type: "string",
        },
        event_type: {
          type: "string",
          enum: ["all", "contract", "system"],
          default: "all",
        },
        is_global: { type: "boolean", default: false },
        config_dir: { type: "string", default: "." },
        rpc_url: { type: "string" },
        network_passphrase: { type: "string" },
        network: { type: "string" },
      },
      required: [
        "start_ledger",
        "cursor",
        "rpc_url",
        "network_passphrase",
        "network",
      ],
    },
  },
};

const store = new Store({ schema });

// Aptabase Analytics
initialize("A-EU-8145589126");

// Set up logging
const commandLog = log.create("command");
commandLog.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}]  {text}";
commandLog.transports.file.fileName = "soroban-commands.log";
commandLog.transports.file.file = path.join(
  app.getPath("userData"),
  "soroban-commands.log"
);

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
log.transports.file.fileName = "sora.log";
log.transports.file.file = path.join(app.getPath("userData"), "app.log");
const logFilePath = log.transports.file.getFile().path;

async function handleFileOpen() {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (!canceled) {
      log.info("File open dialog completed. Selected directory:", filePaths[0]);
      trackEvent("directory_opened", { path: filePaths[0] });
      return filePaths[0];
    }
  } catch (error) {
    log.error("Error occurred while opening the file dialog:", error);
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

  ipcMain.handle("check-editors", async () => {
    return await checkEditors();
  });

  ipcMain.handle("open-editor", async (event, projectPath, editor) => {
    return await openProjectInEditor(projectPath, editor);
  });

  ipcMain.handle("get-app-version", async () => {
    const packagePath = path.join(app.getAppPath(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageJson.version;
  });

  ipcMain.handle("get-soroban-version", async () => {
    const versionOutput = await executeSorobanCommand("--version");

    const versionData = {
      sorobanVersion: "Loading...",
      sorobanEnvVersion: "Loading...",
      sorobanEnvInterfaceVersion: "Loading...",
      stellarXdrVersion: "Loading...",
      xdrCurrVersion: "Loading...",
    };

    const lines = versionOutput.split("\n");
    lines.forEach((line) => {
      if (line.includes("soroban ")) {
        versionData.sorobanVersion = line.split(" ")[1];
      } else if (line.includes("soroban-env ")) {
        if (line.includes("interface version")) {
          versionData.sorobanEnvInterfaceVersion = line.split(" ")[3];
        } else {
          versionData.sorobanEnvVersion = line.split(" ")[1];
        }
      } else if (line.includes("stellar-xdr ")) {
        versionData.stellarXdrVersion = line.split(" ")[1];
      } else if (line.includes("xdr curr ")) {
        versionData.xdrCurrVersion = line.split(" ")[2];
      }
    });

    return versionData;
  });

  ipcMain.handle("check-file-exists", async (event, filePath) => {
    return fs.existsSync(filePath);
  });

  ipcMain.handle(
    "soroban-command",
    async (event, command, subcommand, args?, flags?, path?) => {
      try {
        trackEvent("command_executed", {
          command,
          subcommand,
          args,
          flags,
          path,
        });

        const result = await executeSorobanCommand(
          command,
          subcommand,
          args,
          flags,
          path
        );

        if (
          command &&
          (command === "contract" ||
            command === "lab xdr" ||
            command === "events")
        ) {
          const formattedResult = result
            ? `Result: ${JSON.stringify(result)}`
            : "";

          commandLog.info(
            "soroban",
            command ? command : "",
            subcommand ? subcommand : "",
            args ? args.join(" ") : "",
            flags ? flags.join(" ") : "",
            path ? path : "",
            formattedResult
          );
        }

        return result;
      } catch (error) {
        log.error("Error while executing Soroban command:", error);
        throw error;
      }
    }
  );

  // Add an IPC handler to fetch the logs
  ipcMain.handle("fetch-logs", async () => {
    try {
      const data = await readFile(logFilePath, "utf-8");
      return data;
    } catch (error) {
      log.error(`Error reading log file: ${error}`);
      throw error;
    }
  });

  ipcMain.handle("fetch-command-logs", async () => {
    try {
      const commandLogFilePath = commandLog.transports.file.getFile().path;
      const data = await readFile(commandLogFilePath, "utf-8");
      return data;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle("dialog:openDirectory", handleFileOpen);

  // Store: Projects Handler
  ipcMain.handle("store:manageProjects", async (event, action, project) => {
    try {
      trackEvent("project_action", { action, project });
      log.info(
        "Project Interaction. Action:",
        action,
        project ? "Project: " + project : ""
      );
      const result = await handleProjects(store, action, project);
      return result;
    } catch (error) {
      log.error("Error on managing projects:", error);
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
        log.info(
          "Identity Interaction.",
          action ? "Action: " + action : "",
          identity ? "Identity: " + identity : "",
          newIdentity ? "New Identity: " + newIdentity : ""
        );
        const result = await handleIdentities(
          store,
          action,
          identity,
          newIdentity
        );
        return result;
      } catch (error) {
        log.error("Error on managing identities:", error);
        throw error;
      }
    }
  );

  ipcMain.handle(
    "store:manageContractEvents",
    async (event, action, contractEvents) => {
      try {
        const result = await handleContractEvents(
          store,
          action,
          contractEvents
        );
        return result;
      } catch (error) {
        console.error("Error on contracts:", error);
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

app.on("before-quit", () => {
  log.info("App is about to quit.");
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
