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

  const commandStr = `soroban ${allArgs.join(" ")}`;

  return new Promise((resolve, reject) => {
    const child = spawn("soroban", allArgs, { cwd: path, shell: true });

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
  });
}
