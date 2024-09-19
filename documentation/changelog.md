# Changelog

All notable changes to SORA will be documented in this file. You can find the changelog for each release in the [releases](https://github.com/tolgayayci/sora/releases) section.

## [0.2.2] - 2024-01-19

You can have a better experience with SORA by updating to this version, most of the issues are fixed and it's more stable.

::: warning
At this version, SORA requires **stellar v21.2.0** or higher. Look at the [installation guide](./getting-started/installation.md) to update your Stellar CLI.
:::

### Added
- Added support for VS Code Insiders and Cursor as project editors.
- Implemented "address" and "public key" commands for identities.
- Added toggle help buttons for all subcommands in the contract form.
- Added tooltips for all form arguments.
- Added the ability to edit OpenAI API keys with Command Generator and Ask Sor.AI.
- Added support for Stellar CLI version 21.2.0 or higher.

### Changed
- Removed the "Project name must only contain letters and digits" limitation to align with stellar-cli.
- Changed "Config" label to "Networks" on the configuration page for clarity.
- Set a minimum width for the SORA application.
- Updated the About SORA section to be consistent with other pages.
- Improved the import project functionality to check for workspace dependencies.
- Enhanced the command execution toast to support wrapping.
- Updated the logs page to sort by both date and time for accurate chronological order.
- Improved the visibility and functionality of the AI chat interface.
- Improved logs parsing and implemented a system to keep only the last 70 logs for better performance.
- Changed the color of identities to dynamic.


### Fixed
- Corrected the alignment of the delete icon in project components.
- Removed references to "canisters" in error messages.
- Resolved the non-functional close button in the "Open with Editor" dialog.
- Fixed the inability to remove identities.
- Resolved an issue where the popup didn't close when clicking "View Output".
- Fixed the network addition functionality.
- Corrected log filtering issues, including XDR filtering and contract highlighting.
- Resolved sorting issues in the logs page.
- Fixed XDR command execution in the logs page.
- Corrected form focus overflow issues.
- Fixed command execution popup behavior to always show the most recent output.
- Resolved issues with adding and displaying events in the Events page.
- Fixed the Event Detail page implementation.
- Corrected the pre-filling of the Edit Contract Event form.
- Fixed the inability to delete created events.
- Resolved issues with reopening the Command Generator and Ask Sor.AI after closing.
- Fixed visual inconsistencies in AI chat interfaces and dropdowns.
- Corrected scrolling behavior in the "With Examples" dropdown.



[0.2.2]: https://github.com/tolgayayci/sora/releases/tag/v0.2.2

## [0.2.1] - 2023-07-25

### Changed
- SORA is now compatible with both `stellar-cli` and `soroban-cli`
- App logo and icon updated

### Fixed
- Resolved compatibility issues with different CLI versions
- Improved overall stability and performance

[0.2.1]: https://github.com/tolgayayci/sora/releases/tag/v0.2.1

## [0.2.0] - 2023-07-14

### Added
- **Events Page:** Monitor and filter Soroban contract events
  - Real-time event tracking
  - Customizable filters for event types and contracts
- **Lab Page:** Explore Soroban's experimental features
  - Sandbox environment for testing new Soroban features
  - Integration with latest Soroban updates
- **AI Command Constructor:** Natural language input for Soroban CLI commands
  - Intuitive interface for generating complex CLI commands
  - Contextual suggestions based on project structure
- **Soroban AI Assistant:** Instant support for Soroban commands and usage
  - In-app documentation and examples
  - Context-aware help for specific Soroban concepts
- **VS Code Helper Extension:** Side window for executing contract commands directly in VS Code
  - Seamless integration with VS Code workflow
  - Quick access to SORA features without leaving the editor

### Changed
- Improved UI/UX across all pages for better user experience
- Enhanced performance for large-scale Soroban projects
- Updated documentation to reflect new features and workflows

### Fixed
- Various bug fixes and stability improvements
- Resolved issues with contract deployment and interaction

[0.2.0]: https://github.com/tolgayayci/sora/releases/tag/v0.2.0

## [0.1.1] - 2023-03-17

### Fixed
- Resolved bug #3: Issue with project creation in certain environments
- Fixed bug #4: Inconsistent behavior in identity management
- Improved error handling and reporting throughout the application

### Changed
- Minor UI tweaks for better usability
- Updated dependencies to latest stable versions

[0.1.1]: https://github.com/tolgayayci/sora/releases/tag/v0.1.1

## [0.1.0] - 2023-02-14

### Added
- **Projects Page:** Create, import, and manage Soroban projects
  - Intuitive project creation wizard
  - Support for multiple project templates
  - Easy import of existing Soroban projects
- **Contracts Page:** List and interact with main contracts
  - Visual interface for contract deployment
  - Interactive contract method invocation
  - Real-time contract state viewer
- **Identities Page:** Generate, add, and manage identities
  - Secure key generation and storage
  - Support for multiple identity types
  - Easy switching between identities for different operations
- **Config Page:** Add and manage networks
  - Support for custom network configurations
  - Easy switching between testnet, mainnet, and custom networks
  - Network health monitoring and status display

[0.1.0]: https://github.com/tolgayayci/sora/releases/tag/v0.1.0

