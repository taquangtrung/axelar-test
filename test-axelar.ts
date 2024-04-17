import {
  createNetwork,
  relay,
  Network,
} from "@axelar-network/axelar-local-dev";
import { ethers, Wallet, Contract, providers } from "ethers";

async function printEthBalance(network: Network, wallet: Wallet) {
  const address = wallet.address;
  const balance = await wallet.getBalance();
  console.log(`[${network.name}]: ${address}, Bal: ${balance} wei`);
}

async function printEthBalanceWallets(network: Network, wallets: Wallet[]) {
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    const address = wallet.address;
    const balance = await wallet.getBalance();
    console.log(`[${network.name}]: ${address}, Bal: ${balance} wei`);
  }
}

async function printCustomTokenBalance(
  network: Network,
  wallet: Wallet,
  tokenContract: Contract,
  tokenSymbol: string
) {
  const balance = await tokenContract.balanceOf(wallet.address);
  console.log(
    `[${network.name}]: ${wallet.address}, Bal: ${balance} ${tokenSymbol}`
  );
}

async function printGatewayBalance(
  network: Network,
  tokenContract: Contract,
  tokenSymbol: string
) {
  const gateway = network.gateway;
  const balance = await tokenContract.balanceOf(gateway.address);
  console.log(
    `[${network.name}]: Axelar Gateway: ${gateway.address}, Bal: ${balance} ${tokenSymbol}`
  );
}

async function printContractBalance(
  network: Network,
  tokenContract: Contract,
  tokenSymbol: string
) {
  const balance = await tokenContract.balanceOf(tokenContract.address);
  console.log(
    `[${network.name}]: Token Contract: ${tokenContract.address}, Bal: ${balance} ${tokenSymbol}`
  );
}

function printTransaction(
  network: Network,
  tx: ethers.providers.TransactionResponse
) {
  console.log(`[${network.name}]: Transaction: ${JSON.stringify(tx, null, 2)}`);
}

async function main() {
  // Configurations
  const networkName1 = "Ethereum";
  const networkName2 = "Avalance";
  const tokenName = "Northern Trust Carbon Credit Token";
  const tokenSymbol = "NTCC";

  // Initialize a network 1
  console.log("=====================================");
  console.log(`Configure ${networkName1} network...`);
  const network1 = await createNetwork({ name: networkName1, seed: "111" });
  console.log(`All ${networkName1} user wallets:`);
  await printEthBalanceWallets(network1, network1.userWallets);
  console.log(
    `[${network1.name}] [Axelar Gateway]: ${network1.gateway.address}`
  );

  // Initialize a network 2
  console.log("=====================================");
  console.log("Configure Avalance network...");
  const network2 = await createNetwork({ name: networkName2, seed: "222" });
  console.log("=====================================");
  console.log("All Avalance user wallets:");
  await printEthBalanceWallets(network2, network2.userWallets);

  // Deploy Northern Trust Carbon Credit token on the network 1
  console.log("=====================================");
  console.log(`Deploy ${tokenSymbol} on ${networkName1}:`);
  await network1.deployToken(tokenName, tokenSymbol, 6, BigInt(100_000e6));

  console.log("=====================================");
  console.log(`${networkName1}: all user wallets:`);
  await printEthBalanceWallets(network1, network1.userWallets);

  console.log("=====================================");
  console.log(`Checking ${tokenSymbol} token contract on ${networkName1}`);
  const tokenContract1 = await network1.getTokenContract(tokenSymbol);
  await printGatewayBalance(network1, tokenContract1, tokenSymbol);

  // const provider = ethers.getDefaultProvider();
  // const balance1 = await provider.getBalance(contract1.address);
  // console.log(`Contract1: ${contract1.address}, balance: ${balance1}`);

  // Deploy Norhtern Trust Carbon Credit token on the Avalanche network
  console.log("=====================================");
  console.log(`Deploy ${tokenSymbol} on ${networkName2}:`);
  await network2.deployToken(tokenName, tokenSymbol, 6, BigInt(100_000e6));

  console.log("=====================================");
  console.log(`Checking ${tokenSymbol} token contract on ${networkName2}`);
  const tokenContract2 = await network2.getTokenContract(tokenSymbol);
  console.log(`Token contract addr: ${tokenContract2.address}`);

  // Prepare some user wallets
  const [n1user1, n1user2] = network1.userWallets;
  const [n2user1, n2user2] = network2.userWallets;

  // Sending Ethers between 2 wallets
  console.log("=====================================");
  const internalEthAmt = 1;
  console.log(
    `${networkName1}: Sending ${internalEthAmt} Ether from ${n1user1.address} to ${n1user2.address}...`
  );
  await printEthBalance(network1, n1user1);
  await printEthBalance(network1, n1user2);
  const transferEthNetwork1Tx = await n1user1.sendTransaction({
    to: n1user2.address,
    value: ethers.utils.parseUnits(`${internalEthAmt}`, "ether"),
  });
  printTransaction(network1, transferEthNetwork1Tx);
  await printEthBalance(network1, n1user1);
  await printEthBalance(network1, n1user2);

  // Mint tokens on the source chain (Ethereum)
  console.log("=====================================");
  const customTokenMintAmt = BigInt(100e6);
  console.log(
    `${networkName1}: minting ${customTokenMintAmt} ${tokenSymbol} to ${n1user1.address}...`
  );
  await network1.giveToken(n1user1.address, tokenSymbol, customTokenMintAmt);
  await printCustomTokenBalance(network1, n1user1, tokenContract1, tokenSymbol);
  await printCustomTokenBalance(network1, n1user2, tokenContract1, tokenSymbol);

  // Sending tokens between 2 wallets
  console.log("=====================================");
  const customTokenInternalTransferAmt = 1000;
  console.log(
    `${networkName1}: Sending ${customTokenInternalTransferAmt} ${tokenSymbol} from ${n1user1.address} to ${n1user2.address}...`
  );
  await printEthBalance(network1, n1user1);
  await printCustomTokenBalance(network1, n1user1, tokenContract1, tokenSymbol);
  await printEthBalance(network1, n1user2);
  await printCustomTokenBalance(network1, n1user2, tokenContract1, tokenSymbol);
  const transferCustomTokenTx = await tokenContract1
    .connect(n1user1)
    .transfer(n1user2.address, customTokenInternalTransferAmt);
  printTransaction(network1, transferCustomTokenTx);
  await printEthBalance(network1, n1user1);
  await printCustomTokenBalance(network1, n1user1, tokenContract1, tokenSymbol);
  await printEthBalance(network1, n1user2);
  await printCustomTokenBalance(network1, n1user2, tokenContract1, tokenSymbol);

  // Approve the gateway to use tokens on the source chain (network 1)
  console.log("=====================================");
  const crosschainAmt = 5e6;
  console.log(
    `Approve Axelar Gateway to use ${crosschainAmt} ${tokenSymbol} of [${networkName1}] ${n1user1.address}...`
  );
  await printGatewayBalance(network1, tokenContract1, tokenSymbol);
  const approveNetwork1GatewayTx = await tokenContract1
    .connect(n1user1)
    .approve(network1.gateway.address, crosschainAmt);
  await approveNetwork1GatewayTx.wait();
  printTransaction(network1, approveNetwork1GatewayTx);
  await printEthBalance(network1, n1user1);
  await printCustomTokenBalance(network1, n1user1, tokenContract1, tokenSymbol);
  await printCustomTokenBalance(network1, n1user2, tokenContract1, tokenSymbol);
  await printGatewayBalance(network1, tokenContract1, tokenSymbol);
  await printEthBalance(network2, n2user1);
  await printCustomTokenBalance(network2, n2user1, tokenContract2, tokenSymbol);
  await printCustomTokenBalance(network2, n2user2, tokenContract2, tokenSymbol);
  await printGatewayBalance(network2, tokenContract2, tokenSymbol);

  // Request the network 1 gateway to send tokens to the network 2
  console.log("=====================================");
  console.log(
    `Request Axelar Gateway to send ${crosschainAmt} ${tokenSymbol} from [${networkName1}] ${n1user1.address} to [${networkName2}] ${n2user1.address} ...`
  );
  await printGatewayBalance(network1, tokenContract1, tokenSymbol);
  const network1GatewayTx = await network1.gateway
    .connect(n1user1)
    .sendToken(network2.name, n2user1.address, tokenSymbol, crosschainAmt);
  await network1GatewayTx.wait();
  printTransaction(network1, approveNetwork1GatewayTx);
  await printEthBalance(network1, n1user1);
  await printCustomTokenBalance(network1, n1user1, tokenContract1, tokenSymbol);
  await printCustomTokenBalance(network1, n1user2, tokenContract1, tokenSymbol);
  await printGatewayBalance(network1, tokenContract1, tokenSymbol);
  await printEthBalance(network2, n2user1);
  await printCustomTokenBalance(network2, n2user1, tokenContract2, tokenSymbol);
  await printCustomTokenBalance(network2, n2user2, tokenContract2, tokenSymbol);
  await printGatewayBalance(network2, tokenContract2, tokenSymbol);

  // Relay the transactions
  console.log("=====================================");
  console.log("Relaying the transaction...");
  await relay();

  console.log("=====================================");
  console.log("Checking balance after transfering...");
  await printEthBalance(network1, n1user1);
  await printCustomTokenBalance(network1, n1user1, tokenContract1, tokenSymbol);
  await printCustomTokenBalance(network1, n1user2, tokenContract1, tokenSymbol);
  await printGatewayBalance(network1, tokenContract1, tokenSymbol);
  await printEthBalance(network2, n2user1);
  await printCustomTokenBalance(network2, n2user1, tokenContract2, tokenSymbol);
  await printCustomTokenBalance(network2, n2user2, tokenContract2, tokenSymbol);
  await printGatewayBalance(network2, tokenContract2, tokenSymbol);
}

main();
