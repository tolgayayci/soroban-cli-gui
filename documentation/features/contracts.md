# Contracts in SORA

Contracts form the backbone of Soroban development, and SORA provides a powerful, intuitive interface to manage, deploy, and interact with your smart contracts on the Stellar network.

::: tip SHOWCASE CLIP
New to SORA? Check out our **Contracts** showcase clip to see how to manage, deploy, and interact with your smart contracts on the Stellar network!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Contracts Dashboard

The Contracts Dashboard is your central hub for managing all Stellar contracts across your projects in SORA.

<div class="image-border">

![Contracts Dashboard](/public/features/contracts/dashboard.png)

</div>

<!-- ![Contracts List](/public/features/contracts/contracts-list.png) -->

Key features of the Contracts Dashboard include:

1. **Contract List**: Displays all your contracts with their main contract name and associated project name.
2. **Search Bar**: Allows you to quickly find specific contracts across all your projects.
3. **Contract Actions**: A button for each contract to access detailed actions and information.

::: warning
The dashboard shows all `lib` contracts across all projects registered in SORA. Always ensure you're working with the correct contract for your current project.
:::

### Using the Contracts Dashboard

- **Searching for Contracts**: Use the search bar to filter contracts by name or project.
- **Accessing Contract Details**: Click the "Contract Actions" button to view and interact with a specific contract.

## Contract Actions

The Contract Actions page is your command center for interacting with and managing individual contracts. It provides a comprehensive set of tools to build, deploy, and interact with your Soroban smart contracts.

<div class="image-border">

![Contract Actions](/public/features/contracts/builder.png)

</div>

<!-- ![Contract Details](/public/features/contracts/contract-details.png) -->

Key components of the Contract Actions page:

1. **Command Display**: Shows the current Soroban CLI command being constructed based on your selections and inputs.
2. **Command Options**: Interface to select and configure command options, including a command dropdown and option fields.
3. **View Output**: Button to view the full command output in a modal.
4. **Command Generator**: An AI-powered tool to help you create Soroban CLI commands.
5. **View All Contracts**: Button to return to the main Contracts dashboard.

## Command Output

After executing any contract action, SORA provides detailed output. The output is color-coded and structured to provide clear information about the execution results, including:


<div class="image-border">

![Command Output](/public/features/contracts/output.png)

</div>

<!-- ![Command Execution](/public/features/contracts/command-execution.png) -->

You can view this output directly in the SORA interface or copy it for further analysis.

## AI-Powered Command Generator

SORA includes an AI-powered command generator to help you create Soroban CLI commands using natural language:

![Command Output](/public/features/contracts/ai.png)


1. Click the **"Command Generator"** button in the top right corner.
2. Type your request **in natural language**.
3. The AI will generate the **appropriate Stellar CLI command**.
4. You can then execute this command directly or copy it for later use.

This feature is particularly helpful for users who are new to Soroban CLI or those who want to quickly test ideas without remembering exact command syntax.


## Best Practices

1. **Version Control**: Use git or another version control system to track changes to your contracts.
2. **Testing**: Thoroughly test your contracts on testnets before deploying to mainnet.
3. **Security**: Never share or expose your private keys. Use environment variables for sensitive information.
4. **Documentation**: Keep clear documentation for your contract functions and their expected inputs/outputs.
5. **Regular Updates**: Keep your SORA installation up to date for the latest features and security patches.

## Behind the Scenes

When you use the Command Generator or execute actions in SORA, the application is constructing and executing Stellar CLI commands. For example:

- When you build a contract, SORA might run a command like `stellar contract build`.
- Deploying a contract could translate to `stellar contract deploy`.
- Invoking a function might use `stellar contract invoke`.

The AI-powered Command Generator uses natural language processing to interpret your requests and translate them into the appropriate Soroban CLI commands. This abstraction allows you to focus on development rather than remembering complex CLI syntax.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>