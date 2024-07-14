import * as os from "os";
import * as path from "path";

export function getLogFilePath(): string {
  let logFilePath = "";

  switch (os.platform()) {
    case "linux":
      logFilePath = path.join(
        os.homedir(),
        ".config",
        "sora",
        "logs",
        "soroban-commands.log"
      );
      break;
    case "darwin":
      logFilePath = path.join(
        os.homedir(),
        "Library",
        "Logs",
        "sora",
        "soroban-commands.log"
      );
      break;
    case "win32":
      logFilePath = path.join(
        os.homedir(),
        "AppData",
        "Roaming",
        "sora",
        "logs",
        "soroban-commands.log"
      );
      break;
    default:
      logFilePath = path.join(
        os.homedir(),
        ".config",
        "sora",
        "logs",
        "soroban-commands.log"
      );
  }

  return logFilePath;
}
