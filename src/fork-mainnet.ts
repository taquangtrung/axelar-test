import {
  forkAndExport,
  createAndExport,
} from "@axelar-network/axelar-local-dev";
import { ethers, Wallet, Contract, providers } from "ethers";

/**
 * Main function.
 */
async function main() {
  // Create an run local networks
  createAndExport({
    chainOutputPath: "./info/local.json",
    chains: ["Ethereum", "Avalance"],
    accountsToFund: [],
  });

  // // Fork mainnets and run
  // forkAndExport({
  //   chainOutputPath: "./info/local.json",
  //   chains: ["Subnet", "Ethereum", "Avalance"],
  //   accountsToFund: [],
  // });
}

main();
