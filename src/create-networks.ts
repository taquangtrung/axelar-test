import {
  createNetwork,
  relay,
  Network,
  EvmRelayer,
  createAndExport,
  forkAndExport,
} from "@axelar-network/axelar-local-dev";
import { ethers, Wallet, Contract, providers } from "ethers";

/**
 * Deploy aUSDC and fund the given addresses with 1e12 aUSDC.
 * @param {*} chain - chain to deploy aUSDC on
 * @param {*} toFund - addresses to fund with aUSDC
 */
async function deployAndFundUsdc(chain: Network, toFund: string[]) {
  await chain.deployToken(
    "Axelar Wrapped aUSDC",
    "aUSDC",
    6,
    BigInt(100_000e6)
  );

  for (const address of toFund) {
    await chain.giveToken(address, "aUSDC", BigInt(1e6));
  }
}

/**
 * Main function
 */
async function main() {
  // Define the path where chain configuration files with deployed contract addresses will be stored
  const outputPath = "./info/local.json";

  // A list of addresses to be funded with the native token
  // const fundAddresses = ["0x1..", "0x2.."];
  const fundAddresses: string[] = [];

  // A callback function that takes a Network object and an info object as parameters
  // The info object should look similar to this file: https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/info/testnet.json.
  const callback = (chain: Network, info: any) => {};

  // A list of EVM chain names to be initialized
  const chains = ["Avalanche", "Ethereum", "Fantom"];

  // Define the chain stacks that the networks will relay transactions between
  const relayers = { evm: new EvmRelayer() };

  // // Here we are setting up for EVM chains only. If you want to add more networks like NEAR, you have to create a new instance of the relayer for that network,
  // // and then include it in your relayers object. Each relayer should be aware of the others to facilitate transactions between them.
  // // For example, if you want to relay transactions between EVM and Near network, you have to set it like this
  // // const nearRelayer = new NearRelayer()
  // const relayers = { evm: new EvmRelayer({ nearRelayer }), near: nearRelayer };

  // Number of milliseconds to periodically trigger the relay function and send all pending crosschain transactions to the destination chain
  const relayInterval = 5000;

  // A port number for the RPC endpoint. The endpoint for each chain can be accessed by the 0-based index of the chains array.
  // For example, if your chains array is ["Avalanche", "Fantom", "Moonbeam"], then http://localhost:8500/0 is the endpoint for the local Avalanche chain.
  const port = 8500;

  await createAndExport({
    chainOutputPath: outputPath,
    // accountsToFund: fundAddresses,
    accountsToFund: [],
    callback: (chain, _info) => deployAndFundUsdc(chain, fundAddresses),
    // callback: callback,
    chains,
    relayInterval,
    relayers,
    port,
  });
}

main();
