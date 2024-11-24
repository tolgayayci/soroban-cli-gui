import axios from "axios";
import semver from "semver";
import chalk from "chalk";
import Conf from "conf";
import { promises as fs } from "fs";
import { homedir } from "os";
import { join } from "path";
import ora from "ora";
import { execa } from "execa";
import readline from "readline";
import { findGlobalStellarCLI } from "./detect.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

const inquirer = (await import("inquirer")).default;

const AutocompletePrompt = (await import("inquirer-autocomplete-prompt"))
  .default;

inquirer.registerPrompt("autocomplete", AutocompletePrompt);

const config = new Conf({
  projectName: "svm",
  defaults: {
    currentVersion: null,
  },
});

const SVM_HOME = join(homedir(), ".svm");

const VERSIONS_DIR = join(SVM_HOME, "versions");

const CURRENT_DIR = join(SVM_HOME, "current");

const SVM_DIR = join(homedir(), ".svm");

async function ensureDirs() {
  await fs.mkdir(SVM_HOME, { recursive: true });

  await fs.mkdir(VERSIONS_DIR, { recursive: true });
}

async function getVersionDir(version) {
  return join(VERSIONS_DIR, version);
}

async function getBinPath(version) {
  const versionDir = await getVersionDir(version);

  return join(versionDir, "bin");
}

async function setupPath() {
  try {
    const svmBinDir = join(SVM_DIR, "bin");
    await fs.mkdir(svmBinDir, { recursive: true });

    // Update shell config
    const shellType = process.env.SHELL?.includes("zsh") ? "zsh" : "bash";
    const rcFile = join(homedir(), shellType === "zsh" ? ".zshrc" : ".bashrc");

    let rcContent = "";
    try {
      rcContent = await fs.readFile(rcFile, "utf8");
    } catch (error) {
      // Create file if it doesn't exist
      await fs.writeFile(rcFile, "", "utf8");
    }

    // Remove any existing SVM PATH entries
    rcContent = rcContent
      .split("\n")
      .filter((line) => !line.includes("# SVM Path"))
      .join("\n");

    // Add new PATH entry at the beginning
    const pathLine = `\n# SVM Path\nexport PATH="${svmBinDir}:$PATH"\n`;
    await fs.writeFile(rcFile, pathLine + rcContent);

    console.log(
      `\nNOTE: To complete the setup, please run:\n  source ${rcFile}\n`
    );
  } catch (error) {
    console.error("Failed to setup PATH:", error.message);
  }
}

// Add this utility function to verify the current installation
async function verifyInstallation() {
  try {
    const svmBinDir = join(SVM_DIR, "bin");
    const stellar = join(svmBinDir, "stellar");
    const { stdout } = await execa(stellar, ["--version"]);
    return stdout;
  } catch (error) {
    return null;
  }
}

export async function list() {
  try {
    // Get SVM-managed versions
    const versions = await fs.readdir(VERSIONS_DIR).catch(() => []);
    const currentVersion = config.get("currentVersion");

    // Get global version
    const globalInstallation = await findGlobalStellarCLI();
    let globalVersion = null;
    if (globalInstallation) {
      const versionMatch = globalInstallation.rawVersion.match(
        /stellar ([0-9]+\.[0-9]+\.[0-9]+)/
      );
      if (versionMatch) {
        globalVersion = versionMatch[1];
      }
    }

    // Display versions
    if (globalVersion) {
      if (currentVersion === "global") {
        console.log(chalk.green(`${globalVersion} (global) *`));
      } else {
        console.log(`${globalVersion} (global)`);
      }
    }

    versions.forEach((version) => {
      if (version === currentVersion) {
        console.log(chalk.green(`${version} *`));
      } else {
        console.log(version);
      }
    });

    if (!versions.length && !globalVersion) {
      console.log("No versions installed");
    }
  } catch (error) {
    console.error("Failed to list versions");
    console.error(error.message);
  }
}

export async function install(version) {
  const spinner = ora("Checking environment...").start();

  try {
    // Check if cargo is installed and accessible
    try {
      await execa("cargo", ["--version"]);
    } catch (error) {
      spinner.fail("Cargo is not accessible");
      console.error(
        chalk.red("\nError: Cargo is not accessible in the current shell.")
      );
      console.log(
        chalk.yellow(
          "\nPlease ensure Cargo is installed and your PATH is set correctly:"
        )
      );
      console.log(
        "1. Run: " +
          chalk.cyan(
            "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
          )
      );
      console.log("2. Then run: " + chalk.cyan("source $HOME/.cargo/env"));
      console.log("\nAfter that, try the installation again.");
      return;
    }

    spinner.text = "Fetching available versions...";

    // Setup PATH first
    await setupPath();

    // Get available versions from crates.io
    const response = await axios.get(
      "https://crates.io/api/v1/crates/stellar-cli/versions"
    );

    const versions = response.data.versions
      .map((v) => v.num)
      .filter((v) => semver.valid(v))
      .sort(semver.rcompare);

    // Get installed versions to filter out
    const installedVersions = await fs.readdir(VERSIONS_DIR).catch(() => []);

    // Check for global installation
    const globalInstallation = await findGlobalStellarCLI();
    if (globalInstallation) {
      const versionMatch = globalInstallation.rawVersion.match(
        /stellar ([0-9]+\.[0-9]+\.[0-9]+)/
      );
      if (versionMatch) {
        installedVersions.push(versionMatch[1]);
      }
    }

    // Filter out already installed versions
    const availableVersions = versions.filter(
      (v) => !installedVersions.includes(v)
    );

    spinner.stop();

    if (availableVersions.length === 0) {
      console.log("All versions are already installed");
      return;
    }

    if (!version) {
      const { selectedVersion } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedVersion",
          message: "Select version to install:",
          choices: availableVersions,
        },
      ]);
      version = selectedVersion;
    }

    if (!versions.includes(version)) {
      console.error(`Version ${version} not found`);
      return;
    }

    if (installedVersions.includes(version)) {
      console.error(`Version ${version} is already installed`);
      return;
    }

    const versionDir = join(VERSIONS_DIR, version);
    await fs.mkdir(versionDir, { recursive: true });

    console.log(`\nInstalling stellar-cli ${version}...`);

    // Install to the .cargo/bin directory within the version directory
    const cargoDir = join(versionDir, ".cargo");
    await fs.mkdir(cargoDir, { recursive: true });

    try {
      const installProcess = execa(
        "cargo",
        [
          "install",
          "--locked",
          "stellar-cli",
          "--version",
          version,
          "--features",
          "opt",
          "--root",
          cargoDir,
        ],
        {
          stdout: "inherit",
          stderr: "inherit",
          env: {
            ...process.env,
            CARGO_HOME: cargoDir,
          },
        }
      );

      // Show real-time output
      installProcess.stdout?.pipe(process.stdout);
      installProcess.stderr?.pipe(process.stderr);

      await installProcess;
    } catch (error) {
      // Clean up the version directory if installation fails
      await fs.rm(versionDir, { recursive: true, force: true }).catch(() => {});
      throw error;
    }

    // Ensure SVM bin directory exists
    const svmBinDir = join(SVM_DIR, "bin");
    await fs.mkdir(svmBinDir, { recursive: true });

    // Create direct symlinks to the installed binaries
    const stellarBin = join(cargoDir, "bin", "stellar");
    const sorobanBin = join(cargoDir, "bin", "soroban");

    // First remove any existing symlinks
    await fs.unlink(join(svmBinDir, "stellar")).catch(() => {});
    await fs.unlink(join(svmBinDir, "soroban")).catch(() => {});

    // Create new symlinks
    await fs.symlink(stellarBin, join(svmBinDir, "stellar"));
    await fs.symlink(sorobanBin, join(svmBinDir, "soroban"));

    // Set as current version if no version is currently set
    if (!config.get("currentVersion")) {
      config.set("currentVersion", version);
    }

    console.log(chalk.green(`\nSuccessfully installed stellar-cli ${version}`));

    // Switch to the newly installed version
    await use(version);
  } catch (error) {
    spinner.fail("Installation failed");
    console.error(`Failed to install stellar-cli ${version}`);
    if (error.message) {
      console.error(chalk.red(error.message));
      // Add more specific error messages
      if (error.message.includes("ENOENT")) {
        console.error(
          chalk.yellow("\nTip: Make sure Rust and Cargo are installed:")
        );
        console.log(
          chalk.cyan(
            "\ncurl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
          )
        );
      }
    }
    process.exit(1);
  }
}

export async function use(version) {
  try {
    // First check if we have a global installation and get its version
    const globalInstallation = await findGlobalStellarCLI();
    let globalVersion = null;
    if (globalInstallation) {
      const versionMatch = globalInstallation.rawVersion.match(
        /stellar ([0-9]+\.[0-9]+\.[0-9]+)/
      );
      if (versionMatch) {
        globalVersion = versionMatch[1];
      }
    }

    if (!version) {
      const versions = await fs.readdir(VERSIONS_DIR).catch(() => []);

      if (versions.length === 0 && !globalInstallation) {
        console.log("No versions installed");
        return;
      }

      const choices = [];
      if (globalInstallation) {
        choices.push(`${globalVersion} (global)`);
      }
      choices.push(...versions);

      const { selectedVersion } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedVersion",
          message: "Select version to use:",
          choices: choices,
        },
      ]);

      // Handle the (global) suffix in selection
      version = selectedVersion.includes("(global)")
        ? "global"
        : selectedVersion;
    }

    // Handle global version - FIXED THIS PART
    if (version === "global" || (globalVersion && version === globalVersion)) {
      if (!globalInstallation) {
        console.error("Global stellar-cli installation not found");
        return;
      }

      // Update config to use global
      config.set("currentVersion", "global");

      // Update symlinks to point to global binary
      const svmBinDir = join(SVM_DIR, "bin");
      await fs.mkdir(svmBinDir, { recursive: true });

      // Remove existing symlinks if they exist
      await fs.rm(join(svmBinDir, "stellar")).catch(() => {});
      await fs.rm(join(svmBinDir, "soroban")).catch(() => {});

      try {
        await fs.symlink(
          globalInstallation.binPath.stellar,
          join(svmBinDir, "stellar")
        );
        await fs.symlink(
          globalInstallation.binPath.soroban,
          join(svmBinDir, "soroban")
        );
      } catch (error) {
        // If symlinks fail, try force removing and creating again
        await fs
          .rm(join(svmBinDir, "stellar"), { force: true })
          .catch(() => {});
        await fs
          .rm(join(svmBinDir, "soroban"), { force: true })
          .catch(() => {});
        await fs.symlink(
          globalInstallation.binPath.stellar,
          join(svmBinDir, "stellar")
        );
        await fs.symlink(
          globalInstallation.binPath.soroban,
          join(svmBinDir, "soroban")
        );
      }

      console.log(`✔ Switched to global stellar-cli ${globalVersion}`);
      return;
    }

    // Rest of the function for SVM-managed versions...
    const versionDir = join(VERSIONS_DIR, version);
    const stellarBin = join(versionDir, ".cargo/bin/stellar");
    const sorobanBin = join(versionDir, ".cargo/bin/soroban");

    // Verify binaries exist
    try {
      await fs.access(stellarBin);
      await fs.access(sorobanBin);
    } catch (error) {
      console.error(`Version ${version} is not properly installed`);
      return;
    }

    // Update symlinks
    const svmBinDir = join(SVM_DIR, "bin");
    await fs.mkdir(svmBinDir, { recursive: true });

    // Always remove existing symlinks first
    await fs.rm(join(svmBinDir, "stellar")).catch(() => {});
    await fs.rm(join(svmBinDir, "soroban")).catch(() => {});

    try {
      // Create new symlinks
      await fs.symlink(stellarBin, join(svmBinDir, "stellar"));
      await fs.symlink(sorobanBin, join(svmBinDir, "soroban"));
    } catch (error) {
      // If symlinks fail, try force removing and creating again
      await fs.rm(join(svmBinDir, "stellar"), { force: true }).catch(() => {});
      await fs.rm(join(svmBinDir, "soroban"), { force: true }).catch(() => {});
      await fs.symlink(stellarBin, join(svmBinDir, "stellar"));
      await fs.symlink(sorobanBin, join(svmBinDir, "soroban"));
    }

    // Update config
    config.set("currentVersion", version);

    console.log(`✔ Switched to stellar-cli ${version}`);
  } catch (error) {
    console.error("Failed to switch version:", error.message);
  }
}

export async function current() {
  const version = config.get("currentVersion");

  if (version === "global") {
    // If global, get the actual version number
    const globalInstallation = await findGlobalStellarCLI();
    if (globalInstallation) {
      const versionMatch = globalInstallation.rawVersion.match(
        /stellar ([0-9]+\.[0-9]+\.[0-9]+)/
      );
      if (versionMatch) {
        console.log(chalk.green(`${versionMatch[1]} (global)`));
        return;
      }
    }
    console.log(chalk.yellow("Global version not found"));
  } else if (version) {
    console.log(chalk.green(version));
  } else {
    console.log(chalk.yellow("No version currently active"));
  }
}

export async function info() {
  try {
    const separator = chalk.gray("─".repeat(50));

    // Get current version from config
    const currentVersion = config.get("currentVersion");

    // Get global installation info
    const globalInstallation = await findGlobalStellarCLI();
    let globalVersionInfo = null;
    if (globalInstallation) {
      const versionMatch = globalInstallation.rawVersion.match(
        /stellar ([0-9]+\.[0-9]+\.[0-9]+)/
      );
      if (versionMatch) {
        globalVersionInfo = {
          version: versionMatch[1],
          paths: globalInstallation.binPath,
        };
      }
    }

    // Get all SVM-managed versions
    const managedVersions = await fs.readdir(VERSIONS_DIR).catch(() => []);
    const managedVersionsInfo = {};

    for (const version of managedVersions) {
      const versionDir = join(VERSIONS_DIR, version);
      const stellarPath = join(versionDir, ".cargo/bin/stellar");
      const sorobanPath = join(versionDir, ".cargo/bin/soroban");

      try {
        await fs.access(stellarPath);
        await fs.access(sorobanPath);
        managedVersionsInfo[version] = {
          paths: {
            stellar: stellarPath,
            soroban: sorobanPath,
          },
        };
      } catch (error) {
        // Skip if binaries don't exist
        continue;
      }
    }

    // Display information
    console.log(chalk.bold("\nStellar Version Manager (SVM) Info:"));
    console.log(separator);

    console.log(chalk.bold("\nSVM Home:"));
    console.log(`${SVM_DIR}`);
    console.log(separator);

    console.log(chalk.bold("\nCurrent Active Version:"));
    if (!currentVersion) {
      console.log(chalk.yellow("No version currently active"));
    } else if (currentVersion === "global") {
      if (globalVersionInfo) {
        console.log(
          `${globalVersionInfo.version} (global) ${chalk.green("✓ active")}`
        );
      } else {
        console.log(chalk.yellow("Global version not found"));
      }
    } else {
      console.log(`${currentVersion} ${chalk.green("✓ active")}`);
    }
    console.log(separator);

    // Show global installation
    console.log(chalk.bold("\nGlobal Installation:"));
    if (globalVersionInfo) {
      console.log(`Version: ${globalVersionInfo.version}`);
      console.log("Binary Paths:");
      console.log(`  stellar: ${globalVersionInfo.paths.stellar}`);
      console.log(`  soroban: ${globalVersionInfo.paths.soroban}`);
    } else {
      console.log(chalk.yellow("No global installation found"));
    }
    console.log(separator);

    // Show SVM-managed versions
    console.log(chalk.bold("\nSVM Managed Versions:"));
    if (Object.keys(managedVersionsInfo).length === 0) {
      console.log(chalk.yellow("No SVM-managed versions installed"));
    } else {
      for (const [version, info] of Object.entries(managedVersionsInfo)) {
        console.log(
          `\nVersion: ${version}${
            currentVersion === version ? chalk.green(" ✓ active") : ""
          }`
        );
        console.log("Binary Paths:");
        console.log(`  stellar: ${info.paths.stellar}`);
        console.log(`  soroban: ${info.paths.soroban}`);
      }

      // Only show symbolic links if there are managed versions
      console.log(chalk.bold("\nActive Symbolic Links:"));
      const svmBinDir = join(SVM_DIR, "bin");
      try {
        const stellarLink = await fs
          .readlink(join(svmBinDir, "stellar"))
          .catch(() => null);
        const sorobanLink = await fs
          .readlink(join(svmBinDir, "soroban"))
          .catch(() => null);

        if (stellarLink || sorobanLink) {
          if (stellarLink) console.log(`stellar -> ${stellarLink}`);
          if (sorobanLink) console.log(`soroban -> ${sorobanLink}`);
        } else {
          console.log(chalk.yellow("No active symbolic links found"));
        }
      } catch (error) {
        console.log(chalk.yellow("No active symbolic links found"));
      }
    }
    console.log(separator);
    console.log(chalk.gray("\nDeveloped by Sora | https://thesora.app"));
    console.log(); // Empty line at the end
  } catch (error) {
    console.error("Failed to get version info:", error.message);
  }
}

export async function uninstall(version) {
  try {
    // Get available versions
    const versions = await fs.readdir(VERSIONS_DIR).catch(() => []);

    if (versions.length === 0) {
      console.log("No versions installed");
      return;
    }

    // If no version specified, prompt for selection
    if (!version) {
      const { selectedVersion } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedVersion",
          message: "Select version to uninstall:",
          choices: versions,
        },
      ]);
      version = selectedVersion;
    }

    // Confirm uninstallation
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to uninstall stellar-cli ${version}?`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.blue("\nOperation cancelled."));
      return;
    }

    const spinner = ora(`Uninstalling stellar-cli ${version}...`).start();

    const versionDir = join(VERSIONS_DIR, version);
    const svmBinDir = join(SVM_DIR, "bin");

    // Check if version exists
    if (
      !(await fs
        .access(versionDir)
        .then(() => true)
        .catch(() => false))
    ) {
      spinner.fail(`Version ${version} is not installed`);
      return;
    }

    // Check if it's the current version
    const currentVersion = config.get("currentVersion");

    // First remove the symlinks if they exist and point to this version
    try {
      const stellarLink = await fs
        .readlink(join(svmBinDir, "stellar"))
        .catch(() => null);
      const sorobanLink = await fs
        .readlink(join(svmBinDir, "soroban"))
        .catch(() => null);

      if (stellarLink && stellarLink.includes(version)) {
        await fs.unlink(join(svmBinDir, "stellar")).catch(() => {});
      }
      if (sorobanLink && sorobanLink.includes(version)) {
        await fs.unlink(join(svmBinDir, "soroban")).catch(() => {});
      }
    } catch (error) {
      // Ignore symlink errors
    }

    // Remove version directory
    await fs.rm(versionDir, { recursive: true, force: true });

    // Get remaining versions after removal
    const remainingVersions = await fs.readdir(VERSIONS_DIR).catch(() => []);

    // If no versions remain, remove all symlinks and clear current version
    if (remainingVersions.length === 0) {
      try {
        await fs.unlink(join(svmBinDir, "stellar")).catch(() => {});
        await fs.unlink(join(svmBinDir, "soroban")).catch(() => {});
        config.delete("currentVersion");
        spinner.succeed(
          `Successfully uninstalled stellar-cli ${version}\nNo versions remain installed. Please install a new version to use stellar-cli.`
        );
        return;
      } catch (error) {
        // Ignore symlink removal errors
      }
    }

    // If we're removing the current version, we need to switch to another version
    if (currentVersion === version) {
      if (remainingVersions.length > 0) {
        // Switch to the most recent remaining version
        const newVersion = remainingVersions.sort(semver.rcompare)[0];
        const newVersionDir = join(VERSIONS_DIR, newVersion);

        // Create new symlinks
        await fs
          .symlink(
            join(newVersionDir, ".cargo/bin/stellar"),
            join(svmBinDir, "stellar")
          )
          .catch(() => {});
        await fs
          .symlink(
            join(newVersionDir, ".cargo/bin/soroban"),
            join(svmBinDir, "soroban")
          )
          .catch(() => {});

        config.set("currentVersion", newVersion);
        spinner.succeed(
          `Successfully uninstalled stellar-cli ${version} and switched to ${newVersion}`
        );
      } else {
        // Try to switch to global installation
        const globalInstallation = await findGlobalStellarCLI();
        if (globalInstallation) {
          // Create symlinks to global installation
          await fs
            .symlink(
              globalInstallation.binPath.stellar,
              join(svmBinDir, "stellar")
            )
            .catch(() => {});
          await fs
            .symlink(
              globalInstallation.binPath.soroban,
              join(svmBinDir, "soroban")
            )
            .catch(() => {});

          config.set("currentVersion", "global");
          spinner.succeed(
            `Successfully uninstalled stellar-cli ${version} and switched to global installation`
          );
        } else {
          config.delete("currentVersion");
          spinner.succeed(
            `Successfully uninstalled stellar-cli ${version}\nNo other versions available. Please install a new version.`
          );
        }
      }
    } else {
      spinner.succeed(`Successfully uninstalled stellar-cli ${version}`);
    }
  } catch (error) {
    console.error("Failed to uninstall:", error.message);
    throw error;
  }
}

export async function selfRemove() {
  const rl = readline.createInterface({
    input: process.stdin,

    output: process.stdout,
  });

  console.log(
    chalk.yellow(
      "\nWarning: This will remove SVM and all installed versions of stellar-cli."
    )
  );

  console.log(chalk.yellow("The following will be deleted:"));

  console.log(chalk.red(`- ${SVM_HOME}`));

  console.log(chalk.red("- SVM configuration"));

  console.log(chalk.red("- All installed stellar-cli versions"));

  const answer = await new Promise((resolve) => {
    rl.question("\nAre you sure you want to continue? (y/N) ", resolve);
  });

  rl.close();

  if (answer.toLowerCase() !== "y") {
    console.log(chalk.blue("\nOperation cancelled."));

    return;
  }

  const spinner = ora("Removing SVM...").start();

  try {
    // Remove SVM home directory and all its contents

    await fs.rm(SVM_HOME, { recursive: true, force: true });

    // Clear configuration

    config.clear();

    spinner.succeed("SVM has been successfully removed");

    console.log(
      chalk.yellow(
        "\nPlease remove the following line from your shell config file (~/.bashrc or ~/.zshrc):"
      )
    );

    console.log(chalk.cyan(`export PATH="${CURRENT_DIR}:$PATH"`));
  } catch (error) {
    spinner.fail("Failed to remove SVM");

    console.error(chalk.red("Error:", error.message));
  }
}
