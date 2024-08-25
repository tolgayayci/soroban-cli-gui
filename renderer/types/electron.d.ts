interface Versions {
  node: string;
  chrome: string;
  electron: string;
  runSorobanCommand: (
    command,
    subcommand?,
    args?,
    flags?,
    path?
  ) => Promise<string>;
  openDirectory: () => Promise<string>;
  manageProjects: (action, path?) => Promise<any>;
  manageIdentities: (action, identity?, newIdentity?) => Promise<any>;
  manageContractEvents: (action, contractSettings?) => Promise<any>;
  isSorobanProject: (projectPath) => Promise<boolean>;
  isSorobanInstalled: () => Promise<any>;
  listContracts: (directoryPath) => Promise<any>;
  jsonRead: (filePath, directoryPath) => Promise<any>;
  jsonWrite: (filePath, directoryPath, data) => Promise<any>;
  reloadApplication: () => Promise<void>;
  openExternalLink: (url) => Promise<void>;
  refreshIdentities: () => Promise<void>;
  readLogs: () => Promise<string>;
  readCommandLogs: () => Promise<string>;
  openEditor: (projectPath, editor) => Promise<void>;
  checkEditors: () => Promise<any>;
  getAppVersion: () => Promise<any>;
  getSorobanVersion: () => Promise<any>;
  checkFileExists: (filePath) => Promise<boolean>;
  saveApiKey: (apiKey: string) => Promise<boolean>;
  getApiKey: () => Promise<string | null>;
  deleteApiKey: () => Promise<boolean>;
  createGeneralAssistant: () => Promise<any>;
  createCliAssistant: () => Promise<any>;
  createThread: (initialMessage?: string) => Promise<any>;
  sendMessage: (threadId: string, message: string) => Promise<any>;
  runAssistant: (threadId: string, assistantId: string) => Promise<any>;
  getRunStatus: (threadId: string, runId: string) => Promise<string>;
  getMessages: (threadId: string) => Promise<any[]>;
  saveConversation: (
    threadId: string,
    assistantId: string,
    assistantType: "general" | "cli"
  ) => Promise<void>;
  clearConversation: (assistantType: "general" | "cli") => Promise<void>;
  getConversation: (assistantType: "general" | "cli") => Promise<any>;
}

interface Window {
  sorobanApi: Versions;
}
