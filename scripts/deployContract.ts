import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("GatekeeperTwoExploit");
  const contract = await Contract.deploy("0x35fD6578e0c124C34d08249d848ea5E87eA01e26");

  await contract.deployed();
  console.log(contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
