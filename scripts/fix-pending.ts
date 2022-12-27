import { ethers } from "hardhat";

async function main() {
  const providerEndpoint = process.env.PROVIDER_ENDPOINT_GOERLI;
  const walletPrivateKey = process.env.DEPLOYER_PRIVATE_KEY || "";

  const provider = new ethers.providers.JsonRpcProvider(providerEndpoint);

  const wallet = new ethers.Wallet(walletPrivateKey, provider);
  const address = await wallet.address;
  const tx = await wallet.sendTransaction({
  	to: address,
  	value: 0,
  	
  	nonce: 160,
  	gasPrice: 20_000_000_000,
    gasLimit: 825_000,
  });
  console.log(tx.hash);
  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
