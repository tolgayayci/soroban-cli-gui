# SORA

<p align="center">
  <img src="https://github.com/tolgayayci/sora/assets/37740842/5b644571-e581-4126-b87c-005e43be89ca" alt="Your Image Description" style="width: 50%;">
</p>
<br>

SORA is a cross platform, electron based application designed to streamline the use of the Soroban CLI. It offers a user-friendly interface for managing projects, identities, networks, and contract methods with ease.

You can watch the how-to-use demo [here](https://drive.google.com/file/d/1qHP7ZM4MlGhPxSExTLoUOV9m_2jbDKet/view?usp=drive_link).

## Installation

To use this application, you must have `soroban-cli` installed on your operating system. 

> This application is compatible with latest soroban v0.23.1, please make sure you have installed this version or newer of soroban!

- To install soroban, follow the instructions in link below:
  - [Install Soroban](https://soroban.stellar.org/docs/getting-started/setup)

- To verify that soroban properly installed, run:
```soroban --version```

Now that you have soroban installed, you can install the SORA by following the instructions below.

###  macOS (Apple Silicon | Intel)

1. Download the latest release for macOS 
   1. [Apple Silicon](https://github.com/tolgayayci/soroban-cli-gui/releases/download/v0.1.1/soroban-cli-gui-0.1.1-arm64.dmg)
   2. [Intel](https://github.com/tolgayayci/soroban-cli-gui/releases/download/v0.1.1/soroban-cli-gui-0.1.1-universal.dmg)
2. Open the downloaded file and drag the Sora to the Applications directory.

### 🐧 Linux

1. Download the latest release for Linux 
   1. [App Image](https://github.com/tolgayayci/soroban-cli-gui/releases/download/v0.1.1/soroban-cli-gui-0.1.1.AppImage)
   2. [Snap](https://github.com/tolgayayci/soroban-cli-gui/releases/download/v0.1.1/sora_0.1.1_amd64.snap)

2. Follow the general instructions to install the application on your Linux distribution.
   1. [App Image](https://docs.appimage.org/introduction/quickstart.html#ref-quickstart)
   2. [Snap](https://snapcraft.io/docs/installing-snapd)

### 💻 Windows (Through WSL 2)

You can still use the SORA application on Windows by following the instructions below.

1. Install WSL 2 by following the instructions [on microsoft docs](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Once you have WSL installed, you can install `soroban-cli` by following the instructions for Linux. 
3. Follow the instructions for Linux to install the SORA.
   
---

## Key Features

**Project Management:** This feature allows users to efficiently manage their projects. It includes capabilities to create new projects, add existing ones from your device, and delete projects that are no longer needed. 

| Projects Page  |  Create/Add Project | 
|---|---|
| <img width="1500" alt="projects-main" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/3c1fd9d1-d71c-4f44-8c54-4c2522214c7e"> | <img width="1500" alt="projects-form" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/1c674dc9-858b-415e-8c6d-ac9adfb6bab0"> |  

**Identity Management:** This component focuses on managing user identities. Users can generate new identities, add existing ones, delete unnecessary identities, and seamlessly switch between different identities. 

| Identities Page  | Generate/Add Identity  |  Fund Identity | 
|---|---|---|
| <img width="1500" alt="identities-main" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/de849bc6-ada3-4cf5-9a23-f3bdaea1b089"> | <img width="1500" alt="identities-modal" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/39924852-3552-4954-8c96-789dd4784011"> | <img width="1500" alt="identities-fund" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/5294a9f1-9ac7-4103-ba59-2e09e34340d8"> |

**Contract Interactions:** This feature is centered around interactions with contracts (project based). Users can interact with them using a variety of contract commands, arguments, and flags through a user-friendly interface.

| Contracts Page  | Command Selector  | 
|---|---|
| <img width="1500" alt="contracts-main" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/22fb2b33-dc43-46f7-b50e-ddea694045e3"> |  <img width="1500" alt="contracts-command" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/0b17a242-2c2e-4cf3-a9d1-6b804add3a67"> |  

**Network Management:** Network management is facilitated through the ability to add and remove networks. Users can also display the list of networks.

| Config Page  | Add Network  |
|---|---|
| <img width="1500" alt="config-main" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/0ef7fcf7-1fc7-4b1a-a1be-f4bfe26521d0">  |  <img width="1500" alt="config-modal" src="https://github.com/tolgayayci/soroban-cli-gui/assets/40897846/a90a1c64-d20e-45c8-a528-a7fa803d9eff">  | 

> **P.S:** Review the [latest release notes](https://github.com/tolgayayci/soroban-cli-gui/releases/tag/v0.1.0) for more information about the features and capabilities of the SORA application.

## Contributing

Contributions are welcomed! If you have feature requests, bug notifications or want to contribute some code, please follow the instructions below.
-  **Feature Requests:** Use the [feature requests issue](https://github.com/tolgayayci/soroban-cli-gui/issues/new?assignees=tolgayayci&labels=enhancement&projects=&template=feature_request.md&title=%5BFEAT%5D) template.
-  **Bug Reports:** Use the [bug reports issue](https://github.com/tolgayayci/soroban-cli-gui/issues/new?assignees=tolgayayci&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D) template. 
-  **Code Contributions**
   -  Fork this repository 
   -  Create a new branch
   -  Make your changes
   -  Commit your changes
   -  Push to the branch that you opened
   -  Create a new pull request with some details about your changes
  
## License

SORA is released under the **MIT**. See ([LICENSE](https://github.com/tolgayayci/soroban-cli-gui/blob/main/LICENSE)) for more details.
