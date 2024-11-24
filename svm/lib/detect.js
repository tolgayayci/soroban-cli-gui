import { execa } from "execa";
import { join } from "path";
import { promises as fs } from "fs";
import { homedir } from "os";
import chalk from "chalk";

const SVM_HOME = join(homedir(), ".svm");
const VERSIONS_DIR = join(SVM_HOME, "versions");

export async function findGlobalStellarCLI() {
  try {
    // Check direct cargo binary path first
    const cargoHome = process.env.CARGO_HOME || join(homedir(), ".cargo");
    const binDir = join(cargoHome, "bin");
    const stellarPath = join(binDir, "stellar");
    const sorobanPath = join(binDir, "soroban");

    // Check if binary exists and is executable
    const exists = await fs
      .access(stellarPath, fs.constants.X_OK)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      return null;
    }

    // Get stellar version (now should be the actual binary)
    const { stdout } = await execa(stellarPath, ["--version"]);
    const versionMatch = stdout.match(/stellar ([0-9]+\.[0-9]+\.[0-9]+)/);
    const version = versionMatch ? versionMatch[1] : stdout;

    return {
      version: "global",
      binPath: {
        stellar: stellarPath,
        soroban: sorobanPath,
      },
      rawVersion: stdout,
      installedAt: (await fs.stat(stellarPath)).mtime,
      isGlobal: true,
      parsedVersion: version,
    };
  } catch (error) {
    return null;
  }
}

export async function getInstalledVersions() {
  try {
    const installations = {};

    // Check for global installation first
    const globalInstallation = await findGlobalStellarCLI();
    if (globalInstallation) {
      installations["global"] = globalInstallation;
    }

    // Then check SVM-managed versions
    try {
      const versions = await fs.readdir(VERSIONS_DIR);

      for (const version of versions) {
        const binPath = join(VERSIONS_DIR, version, ".cargo", "bin", "stellar");
        try {
          const { stdout } = await execa(binPath, ["--version"]);
          const versionMatch = stdout.match(/stellar ([0-9]+\.[0-9]+\.[0-9]+)/);
          const fullVersion = versionMatch ? versionMatch[1] : stdout;

          installations[version] = {
            version,
            binPath: {
              stellar: binPath,
              soroban: join(VERSIONS_DIR, version, ".cargo", "bin", "soroban"),
            },
            fullVersion: fullVersion,
            rawVersion: stdout,
            installedAt: (await fs.stat(binPath)).mtime,
            isGlobal: false,
          };
        } catch (error) {
          // Skip if version check fails
          continue;
        }
      }
    } catch (error) {
      // VERSIONS_DIR might not exist yet, which is fine
    }

    return installations;
  } catch (error) {
    // If everything fails, return empty object
    return {};
  }
}
