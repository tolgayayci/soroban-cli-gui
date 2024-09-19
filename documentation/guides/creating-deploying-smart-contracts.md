# Creating and Deploying Smart Contracts with SORA

This guide will walk you through the process of creating, testing, and deploying smart contracts on the Stellar network using SORA.

::: tip Quick Start
New to SORA? Watch our [comprehensive video tutorial](https://example.com/sora-tutorial) to get started quickly!
:::

## Creating a New Smart Contract Project

::: info Step-by-Step
1. Open SORA and navigate to the [Projects dashboard](/features/projects.md#projects-dashboard).
2. Click the "**Create New Project**" button in the top right corner.
3. In the modal that appears:
   - Enter a name for your project (e.g., "MyFirstContract")
   - Choose a project path
   - Toggle "**With Example**" on to include a sample contract
   - Select an example contract from the dropdown (e.g., "hello-world")
   - Click "**Create**"
:::

::: warning Note
Make sure you have enough disk space before creating a new project. SORA will check this for you, but it's good to be aware!
:::

## Editing Your Smart Contract

1. In the Projects dashboard, find your newly created project.
2. Click the "**Open With**" button and select your preferred code editor.
3. Navigate to the `src/lib.rs` file in your project directory.
4. Modify the contract code as needed.

::: tip Pro Tip
Use SORA's [built-in code snippets](/features/projects.md#code-snippets) to quickly add common Soroban patterns to your contract!
:::

## Building Your Contract

1. In SORA, go to the [Contracts dashboard](/features/contracts.md#contracts-dashboard).
2. Select your project from the list.
3. Click on the "**Build**" button.
4. SORA will execute the build command and display the output.

## Testing Your Contract

1. In the Contracts dashboard, click on the "Test" button for your contract.
2. SORA will run the test suite and display the results.

## Deploying Your Contract

1. In the Contracts dashboard, click on the "Deploy" button for your contract.
2. In the deployment modal:
   - Select the network you want to deploy to (e.g., "Testnet")
   - Choose the identity to use for deployment
   - Click "Deploy"
3. SORA will handle the deployment process and display the contract ID upon successful deployment.

## Interacting with Your Contract

1. After deployment, click on the "Invoke" button for your contract.
2. In the invoke modal:
   - Select the function you want to call
   - Enter the required parameters
   - Click "Invoke"
3. SORA will execute the function and display the result.

## How SORA Simplifies the Workflow

Without SORA, this process would involve:
- Manually setting up a Rust environment
- Using the Soroban CLI to create, build, and deploy contracts
- Managing network configurations and identities through command-line interfaces
- Writing and executing test scripts manually

SORA simplifies this by providing a unified, visual interface for all these steps, reducing the need for complex CLI commands and streamlining the entire development process.