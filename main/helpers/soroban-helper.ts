import { spawn } from "child_process";

export function executeSorobanCommand(
  command: string,
  subcommand?: string,
  args?: string[],
  flags?: string[],
  path?: string
): Promise<string> {
  const argStr = args || [];
  const flagStr = flags || [];
  const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(Boolean);

  return new Promise((resolve, reject) => {
    // Check if stellar is available
    const checkStellar = spawn("stellar", ["--version"], { shell: true });

    checkStellar.on("error", () => {
      // If stellar command fails, use soroban
      const commandStr = `soroban ${allArgs.join(" ")}`;
      const child = spawn("soroban", allArgs, { cwd: path, shell: true });
      handleChildProcess(child, commandStr, resolve, reject);
    });

    checkStellar.on("close", (code) => {
      if (code === 0) {
        // If stellar is available, use stellar
        const commandStr = `stellar ${allArgs.join(" ")}`;
        const child = spawn("stellar", allArgs, { cwd: path, shell: true });
        handleChildProcess(child, commandStr, resolve, reject);
      } else {
        // If stellar check fails, use soroban
        const commandStr = `soroban ${allArgs.join(" ")}`;
        const child = spawn("soroban", allArgs, { cwd: path, shell: true });
        handleChildProcess(child, commandStr, resolve, reject);
      }
    });
  });
}

function handleChildProcess(
  child: ReturnType<typeof spawn>,
  commandStr: string,
  resolve: (value: string | PromiseLike<string>) => void,
  reject: (reason?: any) => void
) {
  let stdoutData = "";
  let stderrData = "";

  child.stdout.on("data", (data) => {
    stdoutData += data;
  });

  child.stderr.on("data", (data) => {
    stderrData += data;
  });

  child.on("error", (error) => {
    reject(error);
  });

  child.on("close", (code) => {
    if (code !== 0) {
      reject(
        new Error(
          `Command "${commandStr}" failed with exit code ${code}: ${stderrData}`
        )
      );
    } else {
      const combinedOutput = stdoutData + stderrData;
      resolve(combinedOutput.trim());
    }
  });
}
