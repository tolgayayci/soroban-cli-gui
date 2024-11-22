export const commands = [
  {
    label: "build",
    value: "build",
    description: "Build a contract from source. Builds all crates that are referenced by the cargo manifest (Cargo.toml) that have cdylib as their crate-type. Crates are built for the wasm32 target.",
    args: [],
    options: [
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
      {
        name: "--manifest-path",
        type: "argument",
        placeholder: "<MANIFEST_PATH>",
        description: "Path to Cargo.toml. [default: Cargo.toml]",
      },
      {
        name: "--package",
        type: "argument",
        placeholder: "<PACKAGE>",
        description:
          "Package to build. If omitted, all packages that build for crate-type cdylib are built.",
      },
      {
        name: "--profile",
        type: "argument",
        placeholder: "<PROFILE>",
        description: "Build with the specified profile. [default: release]",
      },
      {
        name: "--out-dir",
        type: "argument",
        placeholder: "<OUT_DIR>",
        description:
          "Directory to copy wasm files to. If provided, wasm files can be found in the cargo target directory, and the specified directory. If omitted, wasm files are written only to the cargo target directory.",
      },
      {
        name: "--features",
        type: "argument",
        placeholder: "<FEATURES>",
        description:
          "Build with the list of features activated, space or comma separated.",
      },
      {
        name: "--all-features",
        type: "flag",
        description: "Build with all features activated.",
      },
      {
        name: "--no-default-features",
        type: "flag",
        description: "Build with the default feature not activated.",
      },
      {
        name: "--print-commands-only",
        type: "flag",
        description: "Print commands to build without executing them.",
      },
    ],
  },
  {
    label: "extend",
    value: "extend",
    description: "Extend the time to live ledger of a contract-data ledger entry. If no keys are specified the contract itself is extended.",
    args: [],
    options: [
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
      {
        name: "--ledgers-to-extend",
        type: "argument",
        placeholder: "<LEDGERS_TO_EXTEND>",
        description: "Number of ledgers to extend the entries",
      },
      {
        name: "--ttl-ledger-only",
        type: "flag",
        description: "Only print the new Time To Live ledger",
      },
      {
        name: "--id",
        type: "argument",
        placeholder: "<CONTRACT_ID>",
        description:
          "Contract ID to which owns the data entries. If no keys provided the Contract's instance will be extended",
      },
      {
        name: "--key",
        type: "argument",
        placeholder: "<KEY>",
        description: "Storage key (symbols only)",
      },
      {
        name: "--key-xdr",
        type: "argument",
        placeholder: "<KEY_XDR>",
        description: "Storage key (base64-encoded XDR)",
      },
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "Path to Wasm file of contract code to extend",
      },
      {
        name: "--wasm-hash",
        type: "argument",
        placeholder: "<WASM_HASH>",
        description: "Path to Wasm file of contract code to extend",
      },
      {
        name: "--durability",
        type: "argument",
        placeholder: "<DURABILITY>",
        description:
          "Storage entry durability. Possible values: persistent, temporary",
      },
      {
        name: "--source-account",
        type: "argument",
        placeholder: "<SOURCE_ACCOUNT>",
        description:
          "Account that signs the final transaction. Can be an identity, a secret key, or a seed phrase. Default: `identity generate --default-seed`",
      },
      {
        name: "--hd-path",
        type: "argument",
        placeholder: "<HD_PATH>",
        description:
          "If using a seed phrase, which hierarchical deterministic path to use, e.g., `m/44'/148'/{hd_path}`. Default: `0`",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
      {
        name: "--fee",
        type: "argument",
        placeholder: "<FEE>",
        description:
          "Fee amount for transaction, in stroops. 1 stroop = 0.0000001 xlm",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
  {
    label: "deploy",
    value: "deploy",
    description: "Deploy a wasm contract",
    args: [],
    options: [
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "WASM file to deploy",
      },
      {
        name: "--wasm-hash",
        type: "argument",
        placeholder: "<WASM_HASH>",
        description: "Hash of the already installed/deployed WASM file",
      },
      {
        name: "--source-account",
        type: "argument",
        placeholder: "<SOURCE_ACCOUNT>",
        description:
          "Account that signs the final transaction. Can be an identity, a secret key, or a seed phrase. Default: `identity generate --default-seed`",
      },
      {
        name: "--hd-path",
        type: "argument",
        placeholder: "<HD_PATH>",
        description:
          "If using a seed phrase, which hierarchical deterministic path to use, e.g., `m/44'/148'/{hd_path}`. Default: `0`",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--ignore-checks",
        type: "flag",
        alias: "-i",
        description: "Whether to ignore safety checks when deploying contracts",
      },
      {
        name: "--salt",
        type: "argument",
        placeholder: "<SALT>",
        description: "Custom salt 32-byte salt for the token id",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
      {
        name: "--fee",
        type: "argument",
        placeholder: "<FEE>",
        description:
          "Fee amount for transaction, in stroops. 1 stroop = 0.0000001 xlm",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
  {
    label: "fetch",
    value: "fetch",
    description: "Fetch a contract's Wasm binary",
    args: [],
    options: [
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
      {
        name: "--id",
        type: "argument",
        placeholder: "<CONTRACT_ID>",
        description: "Contract ID to fetch",
      },
      {
        name: "--out-file",
        type: "argument",
        alias: "-o",
        placeholder: "<OUT_FILE>",
        description: "Where to write output otherwise stdout is used",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
    ],
  },
  {
    label: "init",
    value: "init",
    description: "Initialize a Soroban project with an example contract",
    args: [
      {
        name: "PROJECT_PATH",
        type: "argument",
        description: "Path where the Soroban project will be initialized",
      },
    ],
    options: [
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
      {
        name: "--with-example",
        type: "argument",
        alias: "-w",
        placeholder: "<WITH_EXAMPLE>...",
        description:
          "An optional flag to specify Soroban example contracts to include. A hello-world contract will be included by default. Possible values: account, alloc, atomic-multiswap, atomic-swap, auth, cross-contract, custom-types, deep-contract-auth, deployer, errors, events, fuzzing, increment, liquidity-pool, logging, simple-account, single-offer, timelock, token, upgradeable-contract",
      },
    ],
  },
  {
    label: "inspect",
    value: "inspect",
    description: "Inspect a WASM file listing contract functions, meta, etc",
    options: [
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "Path to wasm binary",
      },
      {
        name: "--output",
        type: "argument",
        placeholder: "<OUTPUT>",
        description:
          "Output format. Possible values: xdr-base64, xdr-base64-array, docs. [default: docs]",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
  {
    label: "install",
    value: "install",
    description: "Install a WASM file to the ledger without creating a contract instance",
    options: [
      {
        name: "--source-account",
        type: "argument",
        placeholder: "<SOURCE_ACCOUNT>",
        description:
          "Account that signs the final transaction. Can be an identity, a secret key, or a seed phrase. Default: `identity generate --default-seed`",
      },
      {
        name: "--hd-path",
        type: "argument",
        placeholder: "<HD_PATH>",
        description:
          "If using a seed phrase, which hierarchical deterministic path to use, e.g., `m/44'/148'/{hd_path}`. Default: `0`",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "Path to wasm binary",
      },
      {
        name: "--ignore-checks",
        type: "flag",
        alias: "-i",
        description: "Whether to ignore safety checks when deploying contracts",
      },
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
      {
        name: "--fee",
        type: "argument",
        placeholder: "<FEE>",
        description:
          "Fee amount for transaction, in stroops. 1 stroop = 0.0000001 xlm",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
  {
    label: "invoke",
    value: "invoke",
    description: "Invoke a contract function. Generates an 'implicit CLI' for the specified contract on-the-fly using the contract's schema.",
    args: [
      {
        name: "CONTRACT_FN_AND_ARGS",
        type: "argument",
        description:
          "Function name as subcommand, then arguments for that function as `--arg-name value`",
      },
    ],
    options: [
      {
        name: "--id",
        type: "argument",
        placeholder: "<CONTRACT_ID>",
        description: "Contract ID to invoke",
      },
      {
        name: "--cost",
        type: "flag",
        description: "Output the cost execution to stderr",
      },
      {
        name: "--source-account",
        type: "argument",
        placeholder: "<SOURCE_ACCOUNT>",
        description:
          "Account that signs the final transaction. Can be an identity, a secret key, or a seed phrase. Default: `identity generate --default-seed`",
      },
      {
        name: "--hd-path",
        type: "argument",
        placeholder: "<HD_PATH>",
        description:
          "If using a seed phrase, which hierarchical deterministic path to use, e.g., `m/44'/148'/{hd_path}`. Default: `0`",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
      {
        name: "--fee",
        type: "argument",
        placeholder: "<FEE>",
        description:
          "Fee amount for transaction, in stroops. 1 stroop = 0.0000001 xlm",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
  {
    label: "optimize",
    value: "optimize",
    description: "Optimize a WASM file",
    options: [
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "Path to wasm binary",
      },
      {
        name: "--wasm-out",
        type: "argument",
        placeholder: "<WASM_OUT>",
        description:
          "Path to write the optimized WASM file to (defaults to same location as --wasm with .optimized.wasm suffix)",
      },
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
    ],
  },
  {
    label: "read",
    value: "read",
    description: "Print the current value of a contract-data ledger entry",
    options: [
      {
        name: "--output",
        type: "argument",
        placeholder: "<OUTPUT>",
        description:
          "Type of output to generate. Possible values: string, json, xdr. [default: string]",
      },
      {
        name: "--id",
        type: "argument",
        placeholder: "<CONTRACT_ID>",
        description:
          "Contract ID to which owns the data entries. If no keys provided the Contract's instance will be extended",
      },
      {
        name: "--key",
        type: "argument",
        placeholder: "<KEY>",
        description: "Storage key (symbols only)",
      },
      {
        name: "--key-xdr",
        type: "argument",
        placeholder: "<KEY_XDR>",
        description: "Storage key (base64-encoded XDR)",
      },
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "Path to Wasm file of contract code to extend",
      },
      {
        name: "--wasm-hash",
        type: "argument",
        placeholder: "<WASM_HASH>",
        description: "Path to Wasm file of contract code to extend",
      },
      {
        name: "--durability",
        type: "argument",
        placeholder: "<DURABILITY>",
        description:
          "Storage entry durability. Possible values: persistent, temporary",
      },
      {
        name: "--source-account",
        type: "argument",
        placeholder: "<SOURCE_ACCOUNT>",
        description:
          "Account that signs the final transaction. Can be an identity, a secret key, or a seed phrase. Default: `identity generate --default-seed`",
      },
      {
        name: "--hd-path",
        type: "argument",
        placeholder: "<HD_PATH>",
        description:
          "If using a seed phrase, which hierarchical deterministic path to use, e.g., `m/44'/148'/{hd_path}`. Default: `0`",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
  {
    label: "restore",
    value: "restore",
    description: "Restore an evicted value for a contract-data ledger entry. If no keys are specified the contract itself is restored.",
    options: [
      {
        name: "--id",
        type: "argument",
        placeholder: "<CONTRACT_ID>",
        description:
          "Contract ID to which owns the data entries. If no keys provided the Contract's instance will be extended",
      },
      {
        name: "--key",
        type: "argument",
        placeholder: "<KEY>",
        description: "Storage key (symbols only)",
      },
      {
        name: "--key-xdr",
        type: "argument",
        placeholder: "<KEY_XDR>",
        description: "Storage key (base64-encoded XDR)",
      },
      {
        name: "--wasm",
        type: "argument",
        placeholder: "<WASM>",
        description: "Path to Wasm file of contract code to extend",
      },
      {
        name: "--wasm-hash",
        type: "argument",
        placeholder: "<WASM_HASH>",
        description: "Path to Wasm file of contract code to extend",
      },
      {
        name: "--durability",
        type: "argument",
        placeholder: "<DURABILITY>",
        description:
          "Storage entry durability. Possible values: persistent, temporary",
      },
      {
        name: "--ledgers-to-extend",
        type: "argument",
        placeholder: "<LEDGERS_TO_EXTEND>",
        description: "Number of ledgers to extend the entry",
      },
      {
        name: "--ttl-ledger-only",
        type: "flag",
        description: "Only print the new Time To Live ledger",
      },
      {
        name: "--source-account",
        type: "argument",
        placeholder: "<SOURCE_ACCOUNT>",
        description:
          "Account that signs the final transaction. Can be an identity, a secret key, or a seed phrase. Default: `identity generate --default-seed`",
      },
      {
        name: "--hd-path",
        type: "argument",
        placeholder: "<HD_PATH>",
        description:
          "If using a seed phrase, which hierarchical deterministic path to use, e.g., `m/44'/148'/{hd_path}`. Default: `0`",
      },
      {
        name: "--global",
        type: "flag",
        description: "Use global config",
      },
      {
        name: "--help",
        type: "flag",
        alias: "-h",
        description: "Print help",
      },
      {
        name: "--rpc-url",
        type: "argument",
        placeholder: "<RPC_URL>",
        description: "RPC server endpoint",
      },
      {
        name: "--network-passphrase",
        type: "argument",
        placeholder: "<NETWORK_PASSPHRASE>",
        description:
          "Network passphrase to sign the transaction sent to the rpc server",
      },
      {
        name: "--network",
        type: "argument",
        placeholder: "<NETWORK>",
        description: "Name of network to use from config",
      },
      {
        name: "--fee",
        type: "argument",
        placeholder: "<FEE>",
        description:
          "Fee amount for transaction, in stroops. 1 stroop = 0.0000001 xlm",
      },
      {
        name: "--config-dir",
        type: "argument",
        placeholder: "<CONFIG_DIR>",
        description: "Location of config directory, default is '.'",
      },
    ],
  },
];
