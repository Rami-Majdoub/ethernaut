// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GatekeeperOne {

  address public entrant;

  // use smart contract
  modifier gateOne() {
	// console.log("", gasleft());
	// console.log("", gasleft());
	// console.log("", gasleft());
	// msg.sender != tx.origin; // 898,899 gas
	// console.log("", gasleft());
	// console.log("", gasleft());
	// gasleft() % 8191 == 0; // 190,191 gas

    require(msg.sender != tx.origin);
    _;
  }

  // gaslesft = 8191 * X
  modifier gateTwo() {
    require(gasleft() % 8191 == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
	// 2^10 = 1024
	// 2^9 = 512
	// 2^8 = 256 = 8bits = 1 byte (0x11)
	// 1 byte £[0..256] = 0..2^8
	// uint64 = 8 bytes (64 / (8 bits) ), 0..2^64
	// uint32 = 4 bytes (32 / (8 bits) ), 0..2^32
	// uint16 = 2 bytes
	//
	// uint256 = 32 bytes
	// 256 / 64 = 4
	// 32 bytes / 4 bytes = 8
	// 1122334455667788 1122334455667788 1122334455667788 1122334455667788 
	// 0..16^8 = 0..2^(4*8) = 0..2^32

	// 0xB2C9F6ACF44e8aafD9595eE30296e800fD03AaB3
	// bytes8 => 0xb2c9f6ac00008aaf ,0xB2C9F6AC00008aaf
      require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)), "GatekeeperOne: invalid gateThree part one");
	// 
      require(uint32(uint64(_gateKey)) != uint64(_gateKey), "GatekeeperOne: invalid gateThree part two");
	  // 0xb2c9f6ac00008aaf => 0xb2c9f6ac0000aab3
      require(uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)), "GatekeeperOne: invalid gateThree part three");
    _;
  }

  function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin; // tx.origin = player address
    return true;
  }
}