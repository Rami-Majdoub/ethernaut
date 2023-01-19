import { ethers } from "hardhat";

/**
 * Created this script to call the `balances` function in `Coin` contract.
 * 
 * There has been a problem with etherscan
 * in showing recently confirmed transactions.
 * 
 * I needed to check that the transaction contains
 * a transfer of a large amount of coins.
 */
async function main() {
	
	const coinAddress = "0x5c84190EBA31161b0e9FB3B1De8Ab42b26474A44";
	const exploitContractAddress = "0x0A5c905BB5D376cf6c62AEbE6ecd230FD3ec59F5";

	const coinContract = await ethers.getContractAt("Coin",	coinAddress);

	console.log(
		await coinContract.balances(exploitContractAddress)
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
