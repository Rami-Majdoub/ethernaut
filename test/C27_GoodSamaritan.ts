import { expect } from "chai";
import { ethers } from "hardhat"

describe("GoodSamaritan", function(){
	it("Should drain all the balance from his wallet", async function(){
		const [ deployer, player ] = await ethers.getSigners();

		const contract = await (
			await ethers.getContractFactory("GoodSamaritan")
		).deploy();
		await contract.deployTransaction.wait();

		const exploitContract = await (
			await ethers.getContractFactory("GoodSamaritanExploit")
		).deploy();
		await exploitContract.deployTransaction.wait();

		const coinContract = await ethers.getContractAt(
			"Coin",
			await contract.coin()
		);

		// player can request
		// await contract.connect(player).requestDonation();
		// expect(await coinContract.balances(player.address)).to.be.equal(10);
		// console.log(await coinContract.balances(player.address));

		await expect(exploitContract.connect(player).requestDonation(
			contract.address
		)).to.not.be.reverted;

		console.log(await coinContract.balances(exploitContract.address));
		

		expect(await coinContract.balances(exploitContract.address)).to.be.above(10);
	})
})