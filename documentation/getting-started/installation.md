---
title: Installation
lang: en-US
---

# Installing SORA

This guide will walk you through the process of installing SORA and its prerequisite, the Stellar CLI.

## Installing Stellar CLI

Before installing SORA, you need to install the Stellar CLI, which is used for Soroban smart contract development and Stellar operations.

::: info
The Stellar CLI is supported on Linux, macOS, and Windows (via WSL).
:::

To install the Stellar CLI:

1. Open your terminal.
2. Install Rust if you haven't already:
   ```sh
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
3. Install the Stellar CLI:
   ```sh
   cargo install --locked stellar-cli
   ```
4. Verify the installation:
   ```sh
   stellar --version
   ```

::: tip
If you're using a machine with Apple silicon, you may need to have Rosetta installed. You can install Rosetta by running `softwareupdate --install-rosetta` in your terminal.
:::

For more detailed instructions or alternative installation methods, refer to the [official Stellar CLI installation guide](https://developers.stellar.org/docs/tools/stellar-cli/).

## System Requirements for SORA

Before installing SORA, ensure your system meets these requirements:

* **Operating System:**
  * macOS 10.15+
  * Ubuntu 20.04+
  * Windows 10+ (with WSL2)
* **Stellar CLI:** v0.23.1 or newer (installed in the previous step)
* **Node.js:** v14.0.0 or newer

## Installing SORA

### 🍎 macOS (Apple Silicon | Intel)

1. Download the latest release for macOS:
   * [Apple Silicon](https://github.com/tolgayayci/sora/releases/download/v0.2.2/sora-0.2.2-arm64.dmg)
   * [Intel](https://github.com/tolgayayci/sora/releases/download/v0.2.2/sora-0.2.2-universal.dmg)
2. Open the downloaded .dmg file.
3. Drag the SORA icon to the Applications folder.
4. Open SORA from your Applications folder.

### 🐧 Linux

1. Download the latest release for Linux:
   * [AppImage](https://github.com/tolgayayci/sora/releases/download/v0.2.2/sora-0.2.2.AppImage)
   * [Snap](https://github.com/tolgayayci/sora/releases/download/v0.2.2/sora_0.2.2_amd64.snap)
2. For AppImage:
   * Make the AppImage executable: `chmod +x sora-0.2.0.AppImage`
   * Run the AppImage: `./sora-0.2.0.AppImage`
3. For Snap:
   * Install the snap: `sudo snap install sora_0.2.0_amd64.snap --dangerous --classic`

### 💻 Windows (Through WSL 2)

1. Install WSL 2 by following the instructions [on Microsoft docs](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Once you have WSL installed, follow the Linux installation instructions above within your WSL environment.
3. You may need to install additional dependencies like `libwebkit2gtk-4.0-dev` and `libgtk-3-dev` for the AppImage to run correctly.

## Verifying the Installation

After installation, follow these steps to verify that SORA is correctly installed:

1. Open **SORA** from your applications menu or by running the AppImage/Snap.
2. Navigate to the **"About"** section in the sidebar.
3. Check the version number displayed to ensure it matches the version you downloaded.
4. Verify that the Stellar CLI version is correctly detected by SORA.

## Troubleshooting

If you encounter any issues during installation:

1. Ensure you have the latest version of the Stellar CLI installed.
2. Check that your system meets the minimum requirements.
3. For Linux users, make sure you have the necessary dependencies installed for running AppImage or Snap packages.
4. If problems persist, open an issue on [GitHub](https://github.com/tolgayayci/sora/issues).

## Updating SORA

To update SORA to the latest version:

1. Download the latest release for your operating system from the [SORA GitHub releases page](https://github.com/tolgayayci/sora/releases).
2. Follow the installation steps for your operating system as described above.
3. The new version will replace the old one, preserving your settings and data.

Always check the release notes for any important updates or changes that might affect your workflow.

## Additional Resources

* [Stellar Documentation](https://developers.stellar.org/docs/)
* [SORA GitHub Repository](https://github.com/tolgayayci/sora)
* [SORA VS Code Extension](https://marketplace.visualstudio.com/items?itemName=tolgayayci.stellar-suite)

For support, visit [GitHub issues page](https://github.com/tolgayayci/sora/issues).
