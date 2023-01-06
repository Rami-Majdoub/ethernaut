import { expect } from "chai";
import { ethers } from "hardhat";

describe("Shop", function(){
	it("Should get the item for less than the price asked", async function(){
		// init
		const [ deployer, player ] = await ethers.getSigners();

		const contract = await ethers.deployContract("Shop");

		// hack
		const exploitContract = await (
			await ethers.getContractFactory("ShopExplit")
		).deploy();
		
		const tx = await (
			await exploitContract.callBuy(
				contract.address,
				100_000,
				100_000,
				90_000,
				5
			, {
				// gasLimit: 100_000
			})
		).wait();
		// console.log('Gas used: ' + tx.gasUsed.toNumber());

		// yes, i wrote this!
		/*
		console.log(
			"function signature hash: " + 
			ethers.utils.keccak256("callBuy(address)").substring(0, 10)
		);
		
		await player.sendTransaction({
			to: exploitContract.address,
			data: ethers.utils.keccak256("callBuy(address)").substring(0, 10),
		})
		*/

		console.log(await contract.price());

		// check
		expect(
			await contract.isSold()
		).to.equal(true);

		expect(
			await contract.price()
		).to.be.below(100);

	})
})