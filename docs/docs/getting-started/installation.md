---
title: Installation
sidebar_label: Installation
---

# Installing Sora

This guide will walk you through the process of installing Sora on your system.

## System Requirements

- **Operating System:** macOS 10.15+, Ubuntu 20.04+, or Windows 10+ (with WSL2)
- **Soroban CLI:** v0.23.1 or newer
- **Node.js:** v14.0.0 or newer

## Installation Steps

###  macOS (Apple Silicon | Intel)

1. Download the latest release for macOS 
   1. [Apple Silicon](https://github.com/tolgayayci/sora/releases/download/v0.2.0/sora-0.2.0-arm64.dmg)
   2. [Intel](https://github.com/tolgayayci/sora/releases/download/v0.2.0/sora-0.2.0-universal.dmg)
2. Open the downloaded file and drag the Sora to the Applications directory.

### 🐧 Linux

1. Download the latest release for Linux 
   1. [App Image](https://github.com/tolgayayci/sora/releases/download/v0.2.0/sora-0.2.0.AppImage)
   2. [Snap](https://github.com/tolgayayci/sora/releases/download/v0.2.0/sora_0.2.0_amd64.snap)

2. Follow the general instructions to install the application on your Linux distribution.
   1. [App Image](https://docs.appimage.org/introduction/quickstart.html#ref-quickstart)
   2. [Snap](https://snapcraft.io/docs/installing-snapd)

### 💻 Windows (Through WSL 2)

You can still use the SORA application on Windows by following the instructions below.

1. Install WSL 2 by following the instructions [on microsoft docs](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Once you have WSL installed, you can install `soroban-cli` by following the instructions for Linux. 
3. Follow the instructions for Linux to install the SORA.

## Verifying the Installation

After installation, open Sora and navigate to the "About" section to verify the version number.