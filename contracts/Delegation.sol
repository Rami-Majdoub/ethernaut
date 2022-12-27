// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Delegate {

  address public owner;

  constructor(address _owner) {
    owner = _owner;
  }

  function pwn() public {
    owner = msg.sender;
  }
}

contract Delegation {

  address public owner;
  Delegate delegate;

  constructor(address _delegateAddress) {
    delegate = Delegate(_delegateAddress);
    owner = msg.sender;
  }

  fallback() external {
	console.log("Fallback called");
    // (bool result,) = address(delegate).delegatecall(data);
    (bool result,) = address(delegate).delegatecall(msg.data);
    if (result) {
      this;
    }
  }
  
//   bytes public data = abi.encodeWithSignature("pwn()");
}