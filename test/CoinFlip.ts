import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("t1", function () {
  it("fn", async function () {
    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const coinFlip = await CoinFlip.deploy();
    await coinFlip.deployed();

    console.log('CoinFlip deployed at:'+ coinFlip.address);

    const Exploit = await ethers.getContractFactory("Exploit");
    const exploit = await Exploit.deploy(coinFlip.address);

    await exploit.deployed();

    console.log('Exploit deployed at:'+ exploit.address);

	for (let i = 0; i < 10; i++)
	    await exploit.fn();
	    
	expect(
		await coinFlip.consecutiveWins()
	).to.equal(10)
    

  });
});
