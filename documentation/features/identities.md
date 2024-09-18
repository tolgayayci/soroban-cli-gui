# Identities in SORA

Identities are a crucial component of your Stellar workflow in SORA. They represent the accounts you use to interact with the Stellar network, providing a user-friendly interface to manage your Stellar keys and addresses.

::: tip SHOWCASE CLIP
New to SORA? Check out our **Identities** showcase clip to see how to create, manage, and use your Stellar identities in SORA!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Identities Dashboard

Central hub for managing Stellar identities in SORA.

<div class="image-border">

![Identities Dashboard](/public/features/identities/dashboard.png)

</div>

The Identities dashboard provides an overview of all your Stellar identities. Here's what you'll find:

1. **Identity List**: Displays all your identities with color-coded icons and names.
2. **Identity Count**: Shows the total number of identities you have.
3. **Search Bar**: Allows you to quickly find specific identities.
4. **Create New Identity**: A button to initiate the identity creation process.

::: warning
Always keep your identity information, especially private keys and seed phrases, secure and confidential.
:::

## Generating a New Identity

To generate a new identity:

1. Click the **"Create New Identity"** button in the top right corner.
2. Select the **"Generate Identity"** tab in the modal that appears.

<div class="image-border">

![Generate New Identity](/public/features/identities/generate.png)

</div>

3. Fill in the following details:
   - **Identity Name**: Enter a name for your new identity.
   - **Network Passphrase**: Enter the network passphrase.
   - **Network**: Select the network (e.g., Public, Testnet, Futurenet).
   - **RPC URL**: Enter the RPC URL for the selected network.
4. (Optional) Expand the "Options" section to configure advanced settings:
   - **Seed**: Specify a custom seed for key generation.
   - **HD Path**: Set a custom HD derivation path.
   - **As Secret**: Output the generated identity as a secret key.
   - **Global**: Use global config.
   - **Default Seed**: Generate the default seed phrase (useful for testing).
5. Click "**Create"** to generate your new identity.

::: info
Generating a new identity creates a new Stellar account with a unique public and private key pair.
:::

## Adding an Existing Identity

To add an existing identity:

1. Click the **"Create New Identity"** button.
2. Select the **"Add Identity"** tab in the modal.

<div class="image-border">

![Add Existing Identity](/public/features/identities/add.png)

</div>

3. Provide the following information:
   - **Identity Name**: Enter a name for your identity.
   - **Seed Phrase**: Enter your 12-word seed phrase.
   - **Secret Key**: Enter your secret key.
4. (Optional) Expand the "Options" section to configure:
   - **Global**: Use global config.
   - **Config Directory**: Specify a custom config directory for testing.
5. Click **"Add"** to import your existing identity.

## Funding an Identity

For testing purposes, you can fund an identity on test networks:

<div class="image-border">

![Fund Identity](/public/features/identities/fund.png)

</div>

1. Click the **"Fund"** button next to an identity.
2. Enter the following details:
   - **Network Name**: e.g., "Futurenet" or "Testnet".
   - **Network Passphrase**: The passphrase for the selected network.
   - **RPC URL**: The RPC endpoint for the network.
3. (Optional) Configure additional options like HD Path or using global config.
4. Click "Fund" to add test funds to your identity.

::: warning
Funding is **only available on test networks** and should not be used on the public Stellar network.
:::

## Removing an Identity

To remove an identity from SORA:

<div class="image-border">

![Remove Identity](/public/features/identities/remove.png)

</div>

1. Click the **"Remove" button** next to an identity.
2. Confirm the identity name.
3. (Optional) Configure options like using global config or specifying a config directory.
4. Click "Remove" to delete the identity from SORA.

::: danger IMPORTANT
Be cautious when removing identities, especially if they hold real assets. This action cannot be undone.
:::

## Viewing Identity Details

SORA allows you to view detailed information about each identity:

![Remove Identity](/public/features/identities/details.png)


1. Click the **"Info"** button next to an identity.
2. A dialog will show the identity's:
   - **Private Key**: The secret key for the identity.
   - **Public Address**: The public Stellar address.

::: warning
Never share your private key. Keep it secure at all times.
:::

## Using Identities in Soroban Development

Identities in SORA are essential for interacting with the Soroban smart contract platform([1](https://developers.stellar.org/docs/smart-contracts/getting-started)):

1. **Contract Deployment**: Use your identity to sign and deploy smart contracts to the Stellar network.
2. **Contract Invocation**: Interact with deployed contracts using your identity for authentication.
3. **Asset Management**: Create and manage custom assets on the Stellar network.
4. **Testing**: Utilize different identities to simulate various user interactions with your contracts.

## Tips for Efficient Use

1. **Use Descriptive Names**: Choose clear, unique names for your identities to easily distinguish between them.
2. **Regular Backups**: Always keep secure backups of your seed phrases and private keys.
3. **Test Network Usage**: Use test networks for development and testing to avoid risking real assets.
4. **Identity Organization**: Use the search function to quickly find specific identities as your list grows.
5. **Network-Specific Identities**: Consider creating separate identities for different Stellar networks (e.g., Testnet, Futurenet, Mainnet).

## Behind the Scenes

SORA uses the Stellar CLI's `keys` command to manage identities. Here are some of the operations performed:

- `stellar keys add`: Add a new identity
- `stellar keys generate`: Generate a new identity with a seed phrase
- `stellar keys fund`: Fund an identity on a test network
- `stellar keys ls`: List identities
- `stellar keys rm`: Remove an identity
- `stellar keys show`: Display identity details

While SORA provides a user-friendly interface for these operations, understanding the underlying commands can be helpful for advanced users and troubleshooting.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>

