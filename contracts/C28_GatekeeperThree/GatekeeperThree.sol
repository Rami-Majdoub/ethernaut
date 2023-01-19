// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleTrick {
  // slot 0
  GatekeeperThree public target;
  // slot 1
  address public trick; // this contract
  // slot 2
  uint private password = block.timestamp; // get storage slot index 2

  constructor (address payable _target) {
    target = GatekeeperThree(_target);
  }
    
  // every time you call this, password will change
  function checkPassword(uint _password) public returns (bool) {
    if (_password == password) {
      return true;
    }
    password = block.timestamp;
    return false;
  }
    
  function trickInit() public {
    trick = address(this);
  }
    
  // not called!
  function trickyTrick() public {
    if (address(this) == msg.sender && address(this) != trick) {
      target.getAllowance(password);
    }
  }
}

contract GatekeeperThree {
  address public owner;
  address public entrant;
  // TODO: you need to get the password of `SimpleTrick`
  // and pass it to `getAllowance()`
  // await web3.eth.getStorageAt(await contract.trick(), "2")
  bool public allow_enterance = true; //  = false; done
  SimpleTrick public trick;

  function construct0r() public { // anyone can call this
      owner = msg.sender;
  }

  // contract created is owner => called construct0r()
  modifier gateOne() {
    require(msg.sender == owner);
    require(tx.origin != owner);
    _;
  }

  modifier gateTwo() { // getAllowance() // done
    require(allow_enterance == true);
    _;
  }

  // transfer more than 0.001 ether // done
  // owner (contract) should not accept ether // done
  modifier gateThree() {
    if (address(this).balance > 0.001 ether && payable(owner).send(0.001 ether) == false) {
      _;
    }
  }

  function getAllowance(uint _password) public {
    if (trick.checkPassword(_password)) { // pass this // done
        allow_enterance = true;
    }
  }

  // not called
  // MAYBE called after contract creation by the deployer
  // if trick != 0x0 => this function has been called
  // deployer did not call this, need to init it to update `allow_enterance`
  function createTrick() public {
    trick = new SimpleTrick(payable(address(this)));
    trick.trickInit();
  }

  // player call contract => contract call this
  function enter() public gateOne gateTwo gateThree returns (bool entered) {
    entrant = tx.origin;
    return true;
  }

  receive () external payable {}
}