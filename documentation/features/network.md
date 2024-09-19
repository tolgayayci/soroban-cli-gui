# Networks in SORA

Networks are a fundamental component of your Soroban development workflow in SORA. They represent the different Stellar networks you can interact with, providing a user-friendly interface to manage your network configurations.

::: tip SHOWCASE CLIP
New to SORA? Watch our comprehensive demo video to get started quickly with managing networks!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Networks Dashboard

The Networks Dashboard is your central hub for managing all Stellar networks in SORA.

<div class="image-border">

![Networks Dashboard](/public/features/network/dashboard.png)

</div>

Key features of the Networks Dashboard include:

1. **Network List**: Displays all your networks with color-coded icons and network names.
2. **Network Count**: Shows the total number of networks you have configured.
3. **Search Bar**: Allows you to quickly find specific networks.
4. **Create New Network**: A button to initiate the network creation process.

## Creating a New Network

To create a new network:

1. Click the **"Create New Network"** button in the top right corner.
2. A modal will appear with fields to configure your new network.

<div class="image-border">

![Create New Network](/public/features/network/create.png)

</div>

Fill in the following details:

1. **Network Name**: Enter a name for your new network.
2. **RPC URL**: The RPC server endpoint for the network.
3. **Network Passphrase**: The network passphrase for the Stellar network.
4. (Optional) Expand the "Options" section to configure:
   - **Global**: Use global config.
   - **Config Directory**: Specify a custom config directory for testing.

Click "Add" to create your new network.

::: tip
Using descriptive names for your networks can help you easily identify them later, especially when working with multiple environments (e.g., "Testnet", "Futurenet", "Local Devnet").
:::

## Removing a Network

To remove a network from SORA:

1. Locate the network you want to remove in the dashboard.
2. Click the **"Remove"** button for that network.
3. Confirm the network name in the dialog that appears.
4. (Optional) Configure additional options like using global config or specifying a config directory.
5. Click "Remove" to delete the network from SORA.

<div class="image-border">

![Remove Network](/public/features/network/remove.png)

</div>

::: danger IMPORTANT
Be cautious when removing networks. This action cannot be undone and may affect projects using this network configuration.
:::

## Tips for Efficient Use

To make the most of the Networks dashboard:

1. **Use Descriptive Names**: Choose clear, unique names for your networks to easily distinguish between different environments.
2. **Regular Maintenance**: Remove networks you no longer use to keep your dashboard organized.
3. **Consistent Naming**: Use a consistent naming convention for networks across different projects.
4. **Document Custom Networks**: If you add custom networks, make sure to document their purpose and configuration details.

## Behind the Scenes

When you use the Networks feature in SORA, the application is constructing and executing Stellar CLI commands. For example:

- `stellar network add`: Adds a new network configuration.
- `stellar network remove`: Removes an existing network configuration.
- `stellar network ls`: Lists all configured networks.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>

