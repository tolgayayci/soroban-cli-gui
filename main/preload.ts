import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

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
};

contextBridge.exposeInMainWorld("sorobanApi", handler);

export type IpcHandler = typeof handler;
