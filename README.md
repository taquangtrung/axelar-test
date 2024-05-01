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

- Build from source

  ```sh
  git clone https://github.com/axelarnetwork/axelar-core
  cd axelar-core
  make build         # output is build to `bin/axelard`
  ```

- Build a local Axelar node running inside a Docker images
  + Prerequisites
    ```sh
    # docker-buildx
    sudo apt install docker-buildx

    # mod
    go install github.com/matryer/moq@latest
    ```

  + Build
    ```sh
    # Build
    make docker-image
    ```

  + Import bytecode from gateway contracts

    NOTE: need to download the correct contract version

    ```sh
    # See more prerequisites in Makefile
    go install golang.org/x/tools/cmd/stringer
    pip3 install mdformat
    ```
