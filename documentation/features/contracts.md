# Contracts in SORA

Contracts form the backbone of Soroban development, and SORA provides a powerful, intuitive interface to manage, deploy, and interact with your smart contracts. 

This comprehensive guide will walk you through every aspect of the Contracts in SORA, from basic management to advanced usage scenarios.

::: tip
New to SORA? Watch our comprehensive demo video to get started quickly with managing contracts!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Contracts Dashboard

The Contracts Dashboard is your central hub for managing all Soroban contracts across your projects in SORA.

<div class="image-border">

![Contracts Dashboard](/public/features/contracts/dashboard.png)

</div>

Key features of the Contracts Dashboard include:

1. **Contract List**: Displays all your contracts with their main contract name and associated project name.
2. **Search Bar**: Allows you to quickly find specific contracts across all your projects.
3. **Contract Actions**: A button for each contract to access detailed actions and information.
4. **Pagination**: Navigate through your contracts if you have more than fit on one page.
5. **Rows per Page**: Adjust the number of contracts displayed per page.

::: warning
The dashboard shows all `lib` contracts across all projects registered in SORA. Always ensure you're working with the correct contract for your current project.
:::

### Using the Contracts Dashboard

- **Searching for Contracts**: Use the search bar to filter contracts by name or project. For example, typing "hello" will show all contracts with "hello" in their name or project name.
- **Sorting Contracts**: Click on the column headers to sort contracts by Main Contract or Project Name.
- **Accessing Contract Details**: Click the "Contract Actions" button to view and interact with a specific contract.

## Contract Actions

The Contract Actions page is your command center for interacting with and managing individual contracts.

<div class="image-border">

![Contract Actions](/public/features/contracts/contract-actions.png)

</div>

Key components of the Contract Actions page:

1. **Project Name**: Clearly displayed at the top of the page for context (e.g., "hellosoroban").
2. **View Output**: Button to view the full command output in a modal.
3. **Command Generator**: An AI-powered tool to help you create Soroban CLI commands.
4. **View All Contracts**: Button to return to the main Contracts dashboard.
5. **Command Display**: Shows the current Soroban CLI command being constructed.
6. **Command Options**: Interface to select and configure command options.

### Using the Command Generator

The Command Generator allows you to interact with your contract using Soroban CLI commands through an intuitive graphical interface.

1. **Select a Command**: Choose from the dropdown list of available Soroban contract commands (e.g., build, deploy, invoke).
2. **Set Options and Flags**: 
   - Check boxes to enable flags.
   - Fill in text inputs for options that require values.
   - Hover over question mark icons for detailed explanations of each option.
3. **Review Generated Command**: The command is automatically displayed in the gray box at the top as you make selections.
4. **Execute the Command**: Click "Run Command" to execute the generated command.

<div class="image-border">

![Command Output](/public/features/contracts/command-output.png)

</div>

5. **View Results**: After running a command, view its output in the Command Output modal. This includes both successful results and error messages for debugging.

## AI-Powered Command Generation

SORA includes an AI-powered command generator to help you create Soroban CLI commands using natural language.

<div class="image-border">

![AI Command Generator](/public/features/contracts/ai-command-generator.png)

</div>

To use this feature:

1. Click on the "Command Generator" button in the top right corner.
2. Type your request in natural language (e.g., "How can I deploy a contract?").
3. The AI will generate the appropriate Soroban CLI command.
4. You can then execute this command directly or copy it for later use.

This feature is particularly helpful for users who are new to Soroban CLI or those who want to quickly test ideas without remembering exact command syntax.

## Use Case Scenarios

Let's walk through some common scenarios you might encounter when working with contracts in SORA.

### Scenario 1: Building a Contract

1. Navigate to the Contract Actions page for your contract.
2. In the Command Generator, select "build" from the command dropdown.
3. Set the appropriate options:
   - Check "--help" if you need more information about the build command.
   - Specify the "--manifest-path" if your Cargo.toml is not in the current directory.
4. Click "Run Command" to build your contract.
5. View the output to confirm successful build or address any errors.

### Scenario 2: Deploying a Contract

1. Ensure your contract is built successfully.
2. Select "deploy" from the command dropdown.
3. Set the required options:
   - Specify the "--wasm" path to your compiled contract.
   - Set the "--network" option to choose between testnet or futurenet.
4. Run the command and view the output for your contract's address on the network.

### Scenario 3: Invoking a Contract Function

1. Select "invoke" from the command dropdown.
2. Set the necessary options:
   - Specify the "--id" of your deployed contract.
   - Set the "--function" to the name of the function you want to call.
   - Add any required "--args" for the function.
3. Run the command to invoke your contract function.
4. Review the output to see the result of the function call.

### Scenario 4: Optimizing a Contract

1. Choose "optimize" from the command list.
2. Specify the path to your WASM file in the "--wasm" option.
3. Run the command to create an optimized version of your contract.
4. Check the output for the location of the optimized WASM file.

## Advanced Usage

### Contract Inspection

To inspect the details of a compiled contract:

1. Select "inspect" from the command dropdown.
2. Provide the path to your WASM file in the "--wasm" option.
3. Run the command to see a detailed breakdown of your contract's functions and metadata.

### Generating Bindings

For creating language-specific bindings:

1. Choose "bindings" from the command list.
2. Specify the target language (e.g., "--lang rust").
3. Provide the contract ID or WASM file path.
4. Run the command to generate the bindings.

## Troubleshooting

Common issues and their solutions:

1. **Build Failures**: 
   - Ensure all dependencies are correctly specified in your Cargo.toml.
   - Check that you're using a compatible Rust version.

2. **Deployment Errors**:
   - Verify you have sufficient funds in your account for the network you're deploying to.
   - Double-check that you're using the correct network URL.

3. **Invocation Issues**:
   - Confirm that you're using the correct contract ID.
   - Ensure all function arguments are correctly formatted.

For persistent issues, refer to the Logs section in SORA or consult the official Soroban documentation.

## Best Practices

1. **Version Control**: Use git or another version control system to track changes to your contracts.
2. **Testing**: Thoroughly test your contracts on testnets before deploying to mainnet.
3. **Security**: Never share or expose your private keys. Use environment variables for sensitive information.
4. **Documentation**: Keep clear documentation for your contract functions and their expected inputs/outputs.
5. **Regular Updates**: Keep your SORA installation up to date for the latest features and security patches.

## Behind the Scenes

While SORA provides a user-friendly interface for contract management, it's powered by Soroban's CLI tools under the hood. The app handles the complex command-line operations for you, making Soroban development more accessible.

When you use the Command Generator or execute actions in SORA, the application is constructing and executing Soroban CLI commands. For example:

- When you build a contract, SORA might run a command like `soroban contract build`.
- Deploying a contract could translate to `soroban contract deploy`.
- Invoking a function might use `soroban contract invoke`.

The AI-powered Command Generator uses natural language processing to interpret your requests and translate them into the appropriate Soroban CLI commands. This abstraction allows you to focus on development rather than remembering complex CLI syntax.

SORA also manages your project configurations, network settings, and identity information, automatically including these in the generated commands as needed. This seamless integration of various components of Soroban development streamlines your workflow and reduces the potential for errors.

Remember, SORA is designed to streamline your Soroban development process. If you encounter any issues or have questions about contract management, don't hesitate to check the Logs section or reach out to the SORA support team.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>