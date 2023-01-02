import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { Opcode } from "hardhat/internal/hardhat-network/stack-traces/opcodes";

// RESOURCES

// https://github.com/e18r
// EVM bytecode programming: https://hackmd.io/@e18r/r1yM3rCCd 

// Solidity Docs - Inline Assembly: https://docs.soliditylang.org/en/develop/assembly.html
// Ethereum Virtual Machine Opcodes: https://ethervm.io/
// Online Solidity Decompiler: https://ethervm.io/decompile
// 3 Examples Of How To Use Assembly In Solidity: https://jamesbachini.com/assembly-in-solidity/
// Solidity Bytecode and Opcode Basics: https://medium.com/@blockchain101/solidity-bytecode-and-opcode-basics-672e9b1a88c2
// Using Solidity's 'Return' Opcode: https://decentraland.org/blog/technology/using-the-solidity-return-opcode/
// A deep-dive into Solidity - contract creation and the init code: https://leftasexercise.com/2021/09/05/a-deep-dive-into-solidity-contract-creation-and-the-init-code/

async function main() {

  const bytecode 
  // a contract with 0x0 as bytecode
  /*
   = [
    // push 0 in memory
    Opcode.PUSH1,
    0x00,
    Opcode.PUSH1,
    0x00,
    Opcode.MSTORE,

    // return 1 byte starting from 0 (from memory)
    Opcode.PUSH1,
    0x01,
    Opcode.PUSH1,
    0x00,
    Opcode.RETURN,
   ];
   */
   
  // a contract that returns "hola mundo"
  // = "601d600c600039601d6000f36020600052600a60205269686f6c61206d756e646f60405260606000f3";
  /* = [
    Opcode.PUSH1, 0x1d, // copy 1d bytes
    Opcode.PUSH1, 0x0c, // which are in code position 0c
    Opcode.PUSH1, 0x00, // to memory position 0
    Opcode.CODECOPY,    // do it
    Opcode.PUSH1, 0x1d, // return 1d     bytes
    Opcode.PUSH1, 0x00, // which are in memory position 0
    Opcode.RETURN,    // do it

    // put a '32' in memory position '00'
    Opcode.PUSH1, 0x20,
    Opcode.PUSH1, 0x00,
    Opcode.MSTORE,

    // put a '10' in memory position '32'
    Opcode.PUSH1, 0x0a,
    Opcode.PUSH1, 0x20,
    Opcode.MSTORE,

    // put 'hola mundo' in memory position '64'
    Opcode.PUSH10, 0x68, 0x6f, 0x6c, 0x61, 0x20, 0x6d, 0x75, 0x6e, 0x64, 0x6f,
    Opcode.PUSH1, 0x40,
    Opcode.MSTORE,

    // tell f3 the size and position of what we want to return
    Opcode.PUSH1, 0x60,
    Opcode.PUSH1, 0x00,

    // return it
    Opcode.RETURN,
  ]
  */
  = [
    Opcode.PUSH1, 0x0a, // copy 10 bytes
    Opcode.PUSH1, 0x0c, // which are in code position 0c
    Opcode.PUSH1, 0x00, // to memory position 0
    Opcode.CODECOPY,    // do it
    Opcode.PUSH1, 0x0a, // return 10     bytes
    Opcode.PUSH1, 0x00, // which are in memory position 0
    Opcode.RETURN,    // do it

    // opcode that return 42
    // put a '32' in memory position '00'
    Opcode.PUSH1, 0x2a, // 42
    Opcode.PUSH1, 0x00,
    Opcode.MSTORE,

    // tell f3 the size and position of what we want to return
    Opcode.PUSH1, 0x20,
    Opcode.PUSH1, 0x00,

    // return it
    Opcode.RETURN, // 10 bytes => a // 10 Opcodes = ok 
  ]
  
  // opcodes generated (without optimization)
  // = "0x608060405234801561001057600080fd5b5060b98061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063650500c114602d575b600080fd5b60336047565b604051603e9190606a565b60405180910390f35b6000602a905090565b600060ff82169050919050565b6064816050565b82525050565b6000602082019050607d6000830184605d565b9291505056fea2646970667358221220d633d0751bef6d32afb0b0c962850fb5a75f2e46091dd804eb96b7deec29100364736f6c634300080c0033";

  const abi = [
    "function whatIsTheMeaningOfLife() external pure returns(uint8)"
  ];
  // to get the bytecode i only need to compile the contract (MagicNumber resolver)
  const [ signer ] = await ethers.getSigners();
  
  // The factory we use for deploying contracts
  const factory = new ContractFactory(abi, bytecode, signer)
  
  // Deploy an instance of the contract
  const contract = await factory.deploy(); // is this Magic number challenge ?
  
  // The address is available immediately, but the contract
  // is NOT deployed yet
  console.log(`Contract deployed at: ${contract.address}`);
  
  await contract.deployTransaction.wait();

  // The transaction that the signer sent to deploy
  console.log(contract.deployTransaction);

  console.log(await contract.whatIsTheMeaningOfLife());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
