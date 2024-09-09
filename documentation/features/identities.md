# Identities in SORA

Identities are a crucial component of your Soroban development workflow in SORA. They represent the accounts you use to interact with the Stellar network, providing a user-friendly interface to manage your Stellar keys and addresses.

::: tip
New to SORA? Watch our comprehensive demo video to get started quickly!

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

![Generate New Identity](/public/features/identities/generate-identity.png)

</div>

3. Fill in the following details:
   - **Identity Name**: Enter a name for your new identity.
   - **Network Passphrase**: Enter the network passphrase (optional).
   - **Network**: Select the network (e.g., Public, Testnet, Futurenet).
   - **RPC URL**: Enter the RPC URL for the selected network.
4. Click "**Create"** to generate your new identity.

::: info
Generating a new identity creates a new Stellar account with a unique public and private key pair.
:::

## Adding an Existing Identity

To add an existing identity:

1. Click the **"Create New Identity"** button.
2. Select the **"Add Identity"** tab in the modal.

<div class="image-border">

![Add Existing Identity](/public/features/identities/add-identity.png)

</div>

3. Provide the following information:
   - **Identity Name**: Enter a name for your identity.
   - **Seed Phrase**: Enter your 12-word seed phrase.
   - **Secret Key**: Enter your secret key.
   - **Options**: Additional options for identity configuration.
4. Click **"Add"** to import your existing identity.

::: tip
You can add various types of identities, including keypairs, ledger devices, and macOS keychain entries.
:::

## Funding an Identity

For testing purposes, you can fund an identity on test networks:

<div class="image-border">

![Fund Identity](/public/features/identities/fund-identity.png)

</div>

1. Click the **"Fund"** button next to an identity.
2. Select the **network name** (e.g., "Hello Soroban" testnet).
3. Enter the **network passphrase** and **RPC URL.**
4. **Click "Fund"** to add test funds to your identity.

::: warning
Funding is **only available on test networks** and should not be used on the public Stellar network.
:::

## Removing an Identity

To remove an identity from SORA:

<div class="image-border">

![Remove Identity](/public/features/identities/remove-identity.png)

</div>

1. Click the **"Remove" button** next to an identity.
2. **Confirm** the identity name.
3. Choose whether to use global config or specify a config directory.
4. **Click "Remove" to delete** the identity from SORA.

::: danger IMPORTANT
Be cautious when removing identities, especially if they hold real assets.
:::

## Tips for Efficient Use

1. **Use Descriptive Names**: Choose clear, unique names for your identities to easily distinguish between them.
2. **Regular Backups**: Always keep secure backups of your seed phrases and private keys.
3. **Test Network Usage**: Use test networks for development and testing to avoid risking real assets.
4. **Identity Organization**: Use the search function to quickly find specific identities as your list grows.

## Behind the Scenes

SORA uses the **Stellar CLI's** `keys` command to manage identities. Here are some of the operations performed:

- `stellar keys add`: Add a new identity
- `stellar keys generate`: Generate a new identity with a seed phrase
- `stellar keys fund`: Fund an identity on a test network
- `stellar keys ls`: List identities
- `stellar keys rm`: Remove an identity

While SORA provides a user-friendly interface for these operations, understanding the underlying commands can be helpful for advanced users and troubleshooting.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>

