import { expect } from "chai";
import { ethers } from "hardhat";

describe("CoinFlip", function () {
  it("Should make 10 consecutive correct guesses", async function () {
    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const coinFlip = await CoinFlip.deploy();
    await coinFlip.deployed();

    console.log('CoinFlip deployed at:'+ coinFlip.address);

    const Exploit = await ethers.getContractFactory("CoinFlipExploit");
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
