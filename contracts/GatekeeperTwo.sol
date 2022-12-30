// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GatekeeperTwo {

  address public entrant;

  // from contract
  modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
  }

  /// @dev extcodesize: https://ethereum.stackexchange.com/a/15642
  modifier gateTwo() {
    uint x;
	// caller() = msg.sender => caller should not have code
    assembly { 
		x := extcodesize(caller()) 
	}
    require(x == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    require(
		// 0..2^64 2^(4*16), uint64 = bytes8
		// => keccak256(abi.encodePacked(msg.sender) ^ key = ff..ff
		// => key = ff..ff ^ keccak256(abi.encodePacked(msg.sender)
		uint64(
			bytes8(
				keccak256(abi.encodePacked(msg.sender)
		))) ^ // 0 ^ 1 = 1
		uint64(_gateKey) 
		== type(uint64).max); //FFFF FFFF FFFF FFFF
    _;
  }

  function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
  }
}