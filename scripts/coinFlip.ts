import { ethers } from "hardhat";

async function main() {

  const address = "0x23B885A00e804b41d052C0B03775C7b76d491247";
  const abi = ['function fn() returns (bool) @29000000'];
  const signer = (await ethers.getSigners())[0];
  
  const expolitContract = new ethers.Contract(address, abi, signer);

  for(let i = 7; i <= 10; i++){
    const tx = await expolitContract.fn({ gasPrice: 3 * 1_000_000_000 });
    console.log(tx.hash)
    await tx.wait();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
