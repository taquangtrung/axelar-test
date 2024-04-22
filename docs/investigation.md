# Axelar Local Dev

## Testing Axelar

- Create and export new networks:

  ```typescript
  import { forkAndExport, createAndExport } from "@axelar-network/axelar-local-dev";
  createAndExport({
      chainOutputPath: './info/local.json',
      chains: chainsToFork,
      accountsToFund: toFund,
  });
  ```

  Output:

  ```sh
  Registerring ITS for 3 other chain for Subnet...
  Done
  Registerring ITS for 3 other chain for Ethereum...
  Done
  Registerring ITS for 3 other chain for Avalance...
  Done
  Serving 3 networks on port 8500
  ```

- Fork mainnet for testing:

  ```typescript
  // Fork mainnets and run
  forkAndExport({
    chainOutputPath: "./info/local.json",
    chains: ["Ethereum", "Avalance"],
    accountsToFund: [],
  });
  ```

## Set up a standalone cross-chain EVM network

- https://github.com/axelarnetwork/axelar-local-dev/blob/078ff52dd7dfb9f9b4dea0942c207fa9cc835523/docs/guide_create_and_exports.md

