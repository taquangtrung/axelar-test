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

### Build an Axelar client to connect to the Axelar network:

  ```sh
  git clone https://github.com/axelarnetwork/axelar-core
  cd axelar-core

  # Use the latest stable release: v0.35.6
  # https://github.com/axelarnetwork/axelar-core/releases
  git checkout tags/v0.35.6 -b v0.35.6
  make build
  ```

  After the above step, a binary file should be built to `bin/axelard`.

###  Build Axelar docker images to run as local network:

- Build Axelar Docker images
  ```sh
  make docker-image
  ```

- If errors occur, may need to install some dependencies below, see more in Makefile:
  ```sh
  sudo apt install docker-buildx
  go install github.com/matryer/moq@latest
  ```

### Import bytecode of the gateway contracts.
- Find the required contract version is stored in `axelar-core/contracts/contracts.json`.
  For example, Axelar v0.35.6 uses the gateway contract version v6.1.0

- Download the corresponding contract version from: https://github.com/axelarnetwork/axelar-cgp-solidity/releases, and unzip the downloaded contract files under `axelar-core/contract-artifacts`

- Build contract bytecode
  ```sh
  make generate

  # If errors occur, need to install some dependencies below. See more in Makefile
  go install golang.org/x/tools/cmd/stringer
  pip3 install mdformat
  ```

## Running Axelar Node

- https://docs.axelar.dev/node/basic
