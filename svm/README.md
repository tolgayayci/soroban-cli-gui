# SVM (Stellar Version Manager)

A version manager for Stellar CLI that allows you to install and switch between different versions of stellar-cli.

## Features

- 📦 Install multiple versions of stellar-cli
- 🔄 Switch between versions seamlessly
- 🌍 Manage both global and SVM-managed installations
- 🔍 List available and installed versions
- 🔄 Automatic environment setup

## Installation

```bash
npm install -g svm-cli
```

### Prerequisites

Before installing stellar-cli versions, ensure you have Rust and Cargo installed:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Updating

To update to the latest version:
```bash
npm update -g svm-cli
```

Or you can reinstall:
```bash
npm install -g svm-cli@latest
```

## Usage

### List Available Commands
```bash
svm --help
```

### Install a Specific Version
```bash
# Interactive selection
svm install

# Install specific version
svm install 22.0.0
```

### Switch Versions
```bash
# Interactive selection
svm use

# Switch to specific version
svm use 22.0.0
```

### List Installed Versions
```bash
svm list
```

### View System Information
```bash
svm info
```

### Uninstall a Version
```bash
# Interactive selection
svm uninstall

# Uninstall specific version
svm uninstall 22.0.0
```

### Remove SVM
```bash
svm self-remove
```

## Command Details

### `svm install [version]`
- Install a specific version of stellar-cli
- Interactive version selection if no version specified
- Shows real-time installation progress
- Prevents duplicate installations
- Automatic Cargo availability check
- Enhanced error handling with clear guidance
- Direct binary management with symlinks

### `svm use <version>`
- Switch to a different version of stellar-cli
- Updates system PATH
- Handles both global and SVM-managed versions
- Robust symlink management
- Automatic environment verification

### `svm list`
- Shows all installed versions
- Indicates current active version
- Shows global installation if present

### `svm info`
- Displays detailed system information
- Shows installation paths
- Lists all managed versions
- Shows global installation details
- Comprehensive symlink information

### `svm uninstall [version]`
- Uninstall a specific version
- Interactive version selection if no version specified
- Safety confirmation before uninstalling
- Proper cleanup of symlinks and directories
- Automatic version switching if needed

### `svm self-remove`
- Removes SVM and all installed versions
- Cleans up system paths and symlinks
- Complete environment cleanup

## System Requirements

- Node.js 16 or higher
- Rust and Cargo installed
- macOS, Linux, or WSL (Windows Subsystem for Linux)

## Directory Structure

SVM manages installations in the following directory structure:
```
~/.svm/
├── versions/         # Isolated version directories
│   ├── 21.4.1/      # Each version has its own directory
│   │   └── .cargo/  # Version-specific cargo installation
│   └── 22.0.0/
├── bin/             # Symlinks to active binaries
│   ├── stellar      # Symlink to active stellar binary
│   └── soroban      # Symlink to active soroban binary
└── current/         # Symlink to current active version
```

## Dependencies

- axios: API requests to crates.io
- semver: Version comparison and sorting
- inquirer: Interactive prompts
- execa: Process execution
- conf: Configuration management
- chalk: Terminal styling
- ora: Terminal spinners

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## About

Developed by [Sora](https://thesora.app) | Your easy-to-use developer tools for the Stellar ecosystem.