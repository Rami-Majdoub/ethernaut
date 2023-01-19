import { expect } from "chai";
import { ethers } from "hardhat"

describe("GatekeeperThree", function(){
	it("Should pass the gate", async function(){
		const [ deployer, player ] = await ethers.getSigners();

		const contract = await (
			await ethers.getContractFactory("GatekeeperThree")
		).deploy();
		await contract.deployTransaction.wait();

		await player.sendTransaction({
			to: contract.address,
			value: ethers.utils.parseEther("1") // more than 0.001
		});

		const exploitContract = await (
			await ethers.getContractFactory("GatekeeperThreeExploit")
		).deploy();
		await exploitContract.deployTransaction.wait();

		await exploitContract.connect(player).callEnter(contract.address);

		expect(
			await contract.entrant()
		).to.equal(player.address);

	})
})