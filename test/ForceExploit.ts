import { expect } from "chai";
import { ethers } from "hardhat";

describe("Force", function (){
	it("Should accept ETH", async function(){
		const [ deployer ] = await ethers.getSigners();

		// const forceContract = await (
		// 	await ethers.getContractFactory("Force")
		// ).deploy();

		// const exploitContract = await (
		// 	await ethers.getContractFactory("ForceExploit")
		// ).deploy();

		// const tx = await deployer.sendTransaction({
		// 	value: ethers.utils.parseEther("1"),
		// 	to: forceContract.address,
		// 	gasLimit: 100_000
		// });
		
		// const tx = await exploitContract.transferEth(forceContract.address, {
		// 	value: 1
		// });

		// const tx = await deployer.sendTransaction({
		// 	value: ethers.utils.parseEther("1"),
		// 	to: forceContract.address,
		// 	data: "0x01",
		// 	gasLimit: 100_000,
		// });

		// step 0: start node (ganache)
		// save the generated mnemonic string
		// step 1: deploy contract Force
		// step 2: paste address
		const contractAddress = "0x72A43A3B7087C422cd8D83DE7192eD0624aad6D6";

		// step 3: restart node and make the miner as the contract address
		// with these flags
		// --database.dbPath: path to store the blockchain status (keep the deployed contract)
		// -m "MNEMONIC": get the accounts that has ETH
		// --miner.coinbase CONTRACT_ADDRESS: will get the block reward for every block mined

		// step 4: send a transaction to create a new block
		// METHOD 1
		// this method works but i have edited this solution
		// because of the warning while testing
		// if you want to test it you should install waffle
		// const tx = await deployer.sendTransaction({
		// 	value: ethers.utils.parseEther("1"),
		// 	to: deployer.address,
		// });
		// await tx.wait();
		// // check contract balance
		// const provider = waffle.provider;
		// const balance = await provider.getBalance(contractAddress);
		// console.log(balance);

		// METHOD 2
		// another method of checking the balance
		// see: https://hardhat.org/hardhat-chai-matchers/docs/overview#balance-changes
		// if you want to see the exact block reward remove the "not"
		// .to.changeEtherBalance(contractAddress, 0)

		await expect(() =>
			deployer.sendTransaction({
				value: 1,
				to: deployer.address,
			})
		).to.not.changeEtherBalance(contractAddress, 0);
	})
})