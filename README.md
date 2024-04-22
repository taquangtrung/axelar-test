# Using Axelar Local Dev

## Prerequisite

- Install dependencies:
  ```sh
  npm install .
  ```

- Install `ts-node` to run TypeScript file:
  ```sh
  npm install -g ts-node typescript '@types/node'
  ```

## Usage

- Fork mainnet for testing

  ```sh
  const { forkAndExport } = '@axelar-network/axelar-local-dev';
  forkAndExport();
  ```

- Run test script:
  ```sh
  ts-node test-axelar.ts
  ```

# Running Axelar Core Network
## Installation

```sh
git clone https://github.com/axelarnetwork/axelar-core
cd axelar-core
make build
```

`
