const fixPath = require("fix-path");
fixPath();

import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
const { readFile } = require("fs").promises;
const readline = require('readline');

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
import * as OpenAIHelper from "./helpers/openai-helper";

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
        "rpc_url",
        "network_passphrase",
        "network",
      ],
    },
  },
  conversation: {
    type: "object",
    default: {
      threadId: "",
      assistantId: "",
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
    height: 710,
    minWidth: 1250,
    minHeight: 710,
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

  ipcMain.handle("openai:saveApiKey", async (_, apiKey: string) => {
    return await OpenAIHelper.saveApiKey(apiKey);
  });

  ipcMain.handle("openai:getApiKey", async () => {
    return await OpenAIHelper.getApiKey();
  });

  ipcMain.handle("openai:deleteApiKey", async () => {
    return await OpenAIHelper.deleteApiKey();
  });

  ipcMain.handle("openai:createGeneralAssistant", async () => {
    return await OpenAIHelper.createGeneralAssistant();
  });

  ipcMain.handle("openai:createCliAssistant", async () => {
    return await OpenAIHelper.createCliAssistant();
  });

  ipcMain.handle("openai:createThread", async (_, initialMessage?: string) => {
    return await OpenAIHelper.createThread(initialMessage);
  });

  ipcMain.handle(
    "openai:sendMessage",
    async (_, threadId: string, message: string) => {
      return await OpenAIHelper.sendMessage(threadId, message);
    }
  );

  ipcMain.handle(
    "openai:runAssistant",
    async (_, threadId: string, assistantId: string) => {
      return await OpenAIHelper.runAssistant(threadId, assistantId);
    }
  );

  ipcMain.handle(
    "openai:getRunStatus",
    async (_, threadId: string, runId: string) => {
      return await OpenAIHelper.getRunStatus(threadId, runId);
    }
  );

  ipcMain.handle("openai:getMessages", async (_, threadId: string) => {
    return await OpenAIHelper.getMessages(threadId);
  });

  ipcMain.handle(
    "openai:saveConversation",
    async (
      _,
      threadId: string,
      assistantId: string,
      assistantType: "general" | "cli"
    ) => {
      return await OpenAIHelper.saveConversation(
        store,
        threadId,
        assistantId,
        assistantType
      );
    }
  );

  ipcMain.handle(
    "openai:clearConversation",
    async (_, assistantType: "general" | "cli") => {
      return await OpenAIHelper.clearConversation(store, assistantType);
    }
  );

  ipcMain.handle(
    "openai:getConversation",
    async (_, assistantType: "general" | "cli") => {
      return await OpenAIHelper.getConversation(store, assistantType);
    }
  );

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
            command === "lab" ||
            command === "xdr")
        ) {
          const formattedResult = result
            ? `Result: ${JSON.stringify(result)}`
            : "";

          // Check the installed CLI type
          const versionOutput = await executeSorobanCommand("--version");
          const cliType = versionOutput.trim().startsWith("stellar")
            ? "stellar"
            : "soroban";

          commandLog.info(
            cliType,
            command,
            subcommand ? subcommand : "",
            args ? args.join(" ") : "",
            flags ? flags.join(" ") : "",
            path ? path : "",
            formattedResult
          );
        }

        return result;
      } catch (error) {
        log.error("Error while executing command:", error);

        if (
          command &&
          (command === "contract" ||
            command === "lab" ||
            command === "xdr" )
        ) {
          // Check the installed CLI type
          const versionOutput = await executeSorobanCommand("--version");
          const cliType = versionOutput.trim().startsWith("stellar")
            ? "stellar"
            : "soroban";

          commandLog.error(
            cliType,
            command,
            subcommand ? subcommand : "",
            args ? args.join(" ") : "",
            flags ? flags.join(" ") : "",
            path ? path : "",
            `Error: ${error.message}`
          );
        }

        throw error;
      }
    }
  );

  // Add an IPC handler to fetch the logs
  ipcMain.handle("fetch-logs", async () => {
    try {
      const lines = [];
      
      const fileStream = fs.createReadStream(logFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      for await (const line of rl) {
        lines.push(line);
        if (lines.length > 50) {
          lines.shift();
        }
      }

      return lines.join('\n');
    } catch (error) {
      console.error("Error reading logs:", error);
      throw error;
    }
  });

  ipcMain.handle("fetch-command-logs", async () => {
    try {
      const commandLogFilePath = commandLog.transports.file.getFile().path;
      const lines = [];
      
      const fileStream = fs.createReadStream(commandLogFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      for await (const line of rl) {
        lines.push(line);
        if (lines.length > 75) {
          lines.shift();
        }
      }

      return lines.join('\n');
    } catch (error) {
      console.error("Error reading command logs:", error);
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
        const result = await handleContractEvents(store, action, contractEvents);
        return result;
      } catch (error) {
        console.error("Error on contract events:", error);
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

      // Check if it's a workspace
      if (parsedToml.workspace) {
        // Check if soroban-sdk is in workspace dependencies
        if (
          parsedToml.workspace.dependencies &&
          "soroban-sdk" in parsedToml.workspace.dependencies
        ) {
          return true;
        }

        // Check if members include "contracts/*"
        if (
          parsedToml.workspace.members &&
          parsedToml.workspace.members.includes("contracts/*")
        ) {
          // It's likely a Soroban project, but let's check a contract to be sure
          const contractsDir = path.join(directoryPath, "contracts");
          if (fs.existsSync(contractsDir)) {
            const contractDirs = fs
              .readdirSync(contractsDir, { withFileTypes: true })
              .filter((dirent) => dirent.isDirectory())
              .map((dirent) => dirent.name);

            for (const contractDir of contractDirs) {
              const contractCargoToml = path.join(
                contractsDir,
                contractDir,
                "Cargo.toml"
              );
              if (fs.existsSync(contractCargoToml)) {
                const contractTomlContent = fs.readFileSync(
                  contractCargoToml,
                  "utf8"
                );
                const contractParsedToml = toml.parse(contractTomlContent);
                if (
                  contractParsedToml.dependencies &&
                  "soroban-sdk" in contractParsedToml.dependencies
                ) {
                  return true;
                }
              }
            }
          }
        }
      } else {
        // If it's not a workspace, check for soroban-sdk in the root Cargo.toml
        if (
          parsedToml.dependencies &&
          "soroban-sdk" in parsedToml.dependencies
        ) {
          return true;
        }
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
        const trimmedResult = result.trim();

        if (trimmedResult.startsWith("stellar")) {
          const versionMatch = trimmedResult.match(/stellar (\d+\.\d+\.\d+)/);
          if (versionMatch) {
            return {
              installed: true,
              type: "stellar",
              version: versionMatch[1],
            };
          }
        } else if (trimmedResult.startsWith("soroban")) {
          const versionMatch = trimmedResult.match(/soroban (\d+\.\d+\.\d+)/);
          if (versionMatch) {
            return {
              installed: true,
              type: "soroban",
              version: versionMatch[1],
            };
          }
        }

        // If we couldn't parse the version, but it starts with stellar or soroban
        if (
          trimmedResult.startsWith("stellar") ||
          trimmedResult.startsWith("soroban")
        ) {
          return {
            installed: true,
            type: trimmedResult.startsWith("stellar") ? "stellar" : "soroban",
            version: "unknown",
          };
        }

        // If we get here, the command succeeded but the output was unexpected
        return {
          installed: false,
          type: null,
          version: null,
          error: "Unexpected output format",
        };
      } else {
        console.error("Main window not found");
        return {
          installed: false,
          type: null,
          version: null,
          error: "Main window not found",
        };
      }
    } catch (error) {
      console.error(`Error while checking for Soroban installation: ${error}`);
      return {
        installed: false,
        type: null,
        version: null,
        error: error.message || "Unknown error",
      };
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

      const currentIdentities = identityNames.map((name) => ({ name }));

      store.set("identities", currentIdentities);

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

