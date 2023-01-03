import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("DenialExploit", [
		"0x591D1BA9f14D843D4BCF44cbd8f940979a0D1E5a",
	]);
  console.log(`Contract deployed at: ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
