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
  isSorobanProject: (projectPath) => Promise<boolean>;
  isSorobanInstalled: () => Promise<boolean>;
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
}

interface Window {
  sorobanApi: Versions;
}
