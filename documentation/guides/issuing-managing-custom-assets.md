# Issuing and Managing Custom Assets with SORA

This guide will show you how to create, issue, and manage custom assets on the Stellar network using SORA.

::: tip Quick Start
New to custom assets? Check out our [video tutorial](https://example.com/custom-assets-tutorial) on creating and managing Stellar assets with SORA!
:::

## Creating Issuer and Distributor Identities

::: info Step-by-Step
1. Open SORA and navigate to the [Identities dashboard](/features/identities.md#identities-dashboard).
2. Click "**Create New Identity**" twice.
3. For each identity:
   - Enter a name (e.g., "AssetIssuer", "AssetDistributor")
   - Select "**Generate Identity**" and choose the network (e.g., "Testnet")
   - Complete the creation process
:::

## Funding the Identities

1. In the Identities dashboard, click the "**Fund**" button next to each identity.
2. Select the network (e.g., "Testnet") and complete the funding process.

::: warning Note
Funding is only available on test networks. For mainnet, you'll need to acquire XLM through other means.
:::

## Creating the Asset

1. Navigate to the [Lab feature](/features/lab.md) in SORA.
2. Select the "**encode**" command.
3. Enter the asset details:
   - Asset Code: Your chosen asset code (e.g., "MYASSET")
   - Issuer Public Key: The public key of your AssetIssuer identity
4. Click "**Run Command**" to encode the asset.

::: tip Asset Code Best Practices
- Use 1-4 characters for alphanumeric codes (e.g., "BTC", "USD")
- Use 5-12 characters for alphanumeric codes representing longer names
- Avoid using special characters or spaces
:::

## Setting Up Trust

1. Go to the [Contracts dashboard](/features/contracts.md#contracts-dashboard) in SORA.
2. Click "**Invoke**" and select the "change_trust" operation.
3. In the invoke modal:
   - Source Account: Select your AssetDistributor identity
   - Asset: Enter your asset code and issuer public key
   - Limit: Set your desired trust line limit
4. Click "**Invoke**" to create the trust line.

## Issuing the Asset

1. In the Contracts dashboard, click "**Invoke**" and select the "payment" operation.
2. In the invoke modal:
   - Source Account: Select your AssetIssuer identity
   - Destination: Enter the public key of your AssetDistributor identity
   - Asset: Enter your asset code and issuer public key
   - Amount: Enter the amount to issue
3. Click "**Invoke**" to issue the asset.

::: warning Security Note
Always double-check the destination address and amount before issuing assets to prevent errors.
:::

## Managing the Asset

### Checking Balances

1. In the Lab feature, select the "**account**" command.
2. Enter the public key of either the issuer or distributor.
3. Click "**Run Command**" to view the account details, including balances.

### Sending Payments

1. In the Contracts dashboard, use the "payment" operation as described in the Issuing step.
2. Adjust the source, destination, and amount as needed.

### Modifying Trust Lines

1. Use the "change_trust" operation in the Contracts dashboard.
2. Adjust the limit to modify the trust line, or set it to 0 to remove the trust line.

::: tip Asset Management Best Practices
- Regularly audit your asset issuance and distribution
- Use [multi-signature accounts](/guides/managing-multisig-accounts.md) for added security
- Keep detailed records of all asset-related transactions
:::

## How SORA Simplifies the Workflow

Without SORA, this process would involve:
- Using the Stellar CLI or SDK to create and manage identities
- Manually encoding asset details and constructing transactions
- Using separate tools for different operations (e.g., creating trust lines, making payments)

**SORA simplifies this by providing a unified interface for all these operations**, from identity management to asset issuance and management. It eliminates the need to switch between different tools and remember complex CLI commands, making custom asset management more accessible and efficient.

Ready to explore more? Check out our guide on [creating and deploying smart contracts](/guides/creating-deploying-smart-contracts.md) to enhance your Stellar development skills!