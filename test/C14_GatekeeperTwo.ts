import { expect } from "chai";
import { ethers } from "hardhat";

describe("GatekeeperTwo", function () {
  it("Should make it past the gatekeeper", async function () {
    // init
    const [ deployer ] = await ethers.getSigners();
    console.log("Deployer address: " + deployer.address);
    
    const gatekeeperContract = await (
      await ethers.getContractFactory("GatekeeperTwo")
    ).deploy();
    await gatekeeperContract.deployed();

    console.log('Contract deployed at: '+ gatekeeperContract.address);

    // hack
    const exploitContract = await (
      await ethers.getContractFactory("GatekeeperTwoExploit")
    ).deploy(gatekeeperContract.address);
    await exploitContract.deployed();

    console.log('Contract deployed at: '+ exploitContract.address);    
    
    // await exploitContract.callEnter();

    // check
    expect(
      await gatekeeperContract.entrant()
    ).to.equal(deployer.address);
  });
});
