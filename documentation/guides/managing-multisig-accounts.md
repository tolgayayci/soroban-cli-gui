# Managing Multi-Signature Accounts with SORA

This guide will demonstrate how to set up and manage a multi-signature account on the Stellar network using SORA.

::: tip Quick Start
New to multi-sig accounts? Watch our [video tutorial](https://example.com/multisig-tutorial) on setting up secure multi-signature accounts with SORA!
:::

## Creating Multiple Identities

::: info Step-by-Step
1. Open SORA and navigate to the [Identities dashboard](/features/identities.md#identities-dashboard).
2. Click "**Create New Identity**" for each required signer (e.g., three times for a 2-of-3 multisig).
3. For each identity:
   - Enter a name (e.g., "Signer1", "Signer2", "Signer3")
   - Select "**Generate Identity**" and choose the network (e.g., "Testnet")
   - Complete the creation process
:::

## Funding the Identities

1. In the Identities dashboard, click the "**Fund**" button next to each identity.
2. Select the network (e.g., "Testnet") and complete the funding process.

::: warning Note
Funding is only available on test networks. For mainnet, you'll need to acquire XLM through other means.
:::

## Setting Up the Multi-Sig Account

1. Go to the [Contracts dashboard](/features/contracts.md#contracts-dashboard) in SORA.
2. Click on "**Invoke**" and select the "set_options" operation.
3. In the invoke modal:
   - Source Account: Select one of your identities (e.g., Signer1)
   - Add the other identities as signers
   - Set the medium threshold to 2 (for a 2-of-3 multisig)
   - Set the master weight to 1
4. Click "**Invoke**" to set up the multi-sig configuration.

::: tip Multi-Sig Best Practices
- Choose a threshold that balances security and convenience
- Consider using different thresholds for different operation types
- Regularly review and update your multi-sig configuration
:::

## Creating a Multi-Sig Transaction

1. In the Contracts dashboard, click "**Invoke**" and select the operation you want to perform.
2. Fill in the transaction details.
3. Select the multi-sig account as the source account.
4. Click "**Create Transaction**" instead of "Invoke".
5. SORA will generate the transaction XDR.

## Signing the Multi-Sig Transaction

1. In the [Lab feature](/features/lab.md) of SORA, select the "**sign**" command.
2. Paste the transaction XDR.
3. Select one of the signer identities.
4. Click "**Run Command**" to sign the transaction.
5. Repeat this process with another signer identity.

::: warning Security Note
Always verify the transaction details before signing. Once a transaction is signed and submitted, it cannot be reversed.
:::

## Submitting the Multi-Sig Transaction

1. In the Lab feature, select the "**send**" command.
2. Paste the fully signed transaction XDR.
3. Click "**Run Command**" to submit the transaction to the network.

## How SORA Simplifies the Workflow

Without SORA, this process would involve:
- Using the Stellar CLI or SDK to create and manage identities
- Manually constructing and encoding transactions
- Using separate tools for transaction signing and submission

**SORA simplifies this by providing a unified interface for identity management, transaction creation, signing, and submission**, making multi-sig operations more accessible and less error-prone.

::: tip Advanced Multi-Sig Features
Explore SORA's [advanced multi-sig features](/features/contracts.md#advanced-multisig) to set up time-bound transactions, conditional approvals, and more!
:::

Ready to explore more? Check out our guide on [issuing and managing custom assets](/guides/issuing-managing-custom-assets.md) to further enhance your Stellar development skills!