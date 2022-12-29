import { expect } from "chai";
import { ethers } from "hardhat";

describe("Elevator", function () {
  it("Should go to top floor", async function () {
    // init
    const elevatorContract = await (
      await ethers.getContractFactory("Elevator")
    ).deploy();
    await elevatorContract.deployed();

    console.log('Contract deployed at:'+ elevatorContract.address);

    // hack
    const exploitContract = await (
      await ethers.getContractFactory("ElevatorExploit")
    ).deploy();
    await exploitContract.deployed();

    console.log('Contract deployed at:'+ exploitContract.address);    
    
    await exploitContract.callGoto(elevatorContract.address);

    // check
    expect(
      await elevatorContract.top()
    ).to.equal(true);
  });
});
