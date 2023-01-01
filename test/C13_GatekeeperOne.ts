import { expect } from "chai";
import { ethers } from "hardhat";

describe("GatekeeperOne", function () {
  it("Should make it past the gatekeeper", async function () {
    // init
    const [ deployer ] = await ethers.getSigners();
    console.log(deployer.address);
    

    const gatekeeperContract = await (
      await ethers.getContractFactory("GatekeeperOne")
    ).deploy();
    await gatekeeperContract.deployed();

    console.log('Contract deployed at:'+ gatekeeperContract.address);

    // hack
    const exploitContract = await (
      await ethers.getContractFactory("GatekeeperOneExploit")
    ).deploy();
    await exploitContract.deployed();

    console.log('Contract deployed at:'+ exploitContract.address);    
    
    await exploitContract.callEnter(
      gatekeeperContract.address,
      100_000,
      8191
    );

    // check
    expect(
      await gatekeeperContract.entrant()
    ).to.equal(deployer.address);
  });
});
