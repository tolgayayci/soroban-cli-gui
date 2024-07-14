import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { get } from "http";

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  runSorobanCommand: async (command, subcommand, args, flags, path) => {
    return ipcRenderer.invoke(
      "soroban-command",
      command,
      subcommand,
      args,
      flags,
      path
    );
  },
  openDirectory: async () => {
    return ipcRenderer.invoke("dialog:openDirectory");
  },
  manageProjects: async (action, project) => {
    return ipcRenderer.invoke("store:manageProjects", action, project);
  },
  manageIdentities: async (action, identity, newIdentity) => {
    return ipcRenderer.invoke(
      "store:manageIdentities",
      action,
      identity,
      newIdentity
    );
  },
  manageContractEvents: async (action, contractSettings) => {
    return ipcRenderer.invoke(
      "store:manageContractEvents",
      action,
      contractSettings
    );
  },
  isSorobanProject: async (directoryPath) => {
    return ipcRenderer.invoke("is-soroban-project", directoryPath);
  },
  isSorobanInstalled: async () => {
    return ipcRenderer.invoke("is-soroban-installed");
  },
  listContracts: async (directoryPath) => {
    return ipcRenderer.invoke("contracts:list", directoryPath);
  },
  jsonRead: async (filePath, directoryPath) => {
    return ipcRenderer.invoke("json:read", filePath, directoryPath);
  },
  jsonWrite: async (filePath, directoryPath, data) => {
    return ipcRenderer.invoke("json:update", filePath, directoryPath, data);
  },
  reloadApplication: async () => {
    console.log("Reloading application");
    return ipcRenderer.invoke("app:reload");
  },
  openExternalLink: async (url) => {
    return ipcRenderer.invoke("open-external-link", url);
  },
  refreshIdentities: async () => {
    return ipcRenderer.invoke("identity:refresh");
  },
  readLogs: async () => {
    return ipcRenderer.invoke("fetch-logs");
  },
  readCommandLogs: async () => {
    return ipcRenderer.invoke("fetch-command-logs");
  },
  openEditor: async (projectPath, editor) => {
    return ipcRenderer.invoke("open-editor", projectPath, editor);
  },
  checkEditors: async () => {
    return ipcRenderer.invoke("check-editors");
  },
  getAppVersion: async () => {
    return ipcRenderer.invoke("get-app-version");
  },
  getSorobanVersion: async () => {
    return ipcRenderer.invoke("get-soroban-version");
  },
  checkFileExists: async (filePath) => {
    return ipcRenderer.invoke("check-file-exists", filePath);
  },
  saveApiKey: async (apiKey: string) => {
    return ipcRenderer.invoke("openai:saveApiKey", apiKey);
  },
  getApiKey: async () => {
    return ipcRenderer.invoke("openai:getApiKey");
  },
  deleteApiKey: async () => {
    return ipcRenderer.invoke("openai:deleteApiKey");
  },
  createGeneralAssistant: async () => {
    return ipcRenderer.invoke("openai:createGeneralAssistant");
  },
  createCliAssistant: async () => {
    return ipcRenderer.invoke("openai:createCliAssistant");
  },
  createThread: async (initialMessage?: string) => {
    return ipcRenderer.invoke("openai:createThread", initialMessage);
  },
  sendMessage: async (threadId: string, message: string) => {
    return ipcRenderer.invoke("openai:sendMessage", threadId, message);
  },
  runAssistant: async (threadId: string, assistantId: string) => {
    return ipcRenderer.invoke("openai:runAssistant", threadId, assistantId);
  },
  getRunStatus: async (threadId: string, runId: string) => {
    return ipcRenderer.invoke("openai:getRunStatus", threadId, runId);
  },
  getMessages: async (threadId: string) => {
    return ipcRenderer.invoke("openai:getMessages", threadId);
  },
  saveConversation: async (
    threadId: string,
    assistantId: string,
    assistantType: "general" | "cli"
  ) => {
    return ipcRenderer.invoke(
      "openai:saveConversation",
      threadId,
      assistantId,
      assistantType
    );
  },
  clearConversation: async (assistantType: "general" | "cli") => {
    return ipcRenderer.invoke("openai:clearConversation", assistantType);
  },
  getConversation: async (assistantType: "general" | "cli") => {
    return ipcRenderer.invoke("openai:getConversation", assistantType);
  },
};

contextBridge.exposeInMainWorld("sorobanApi", handler);

export type IpcHandler = typeof handler;
