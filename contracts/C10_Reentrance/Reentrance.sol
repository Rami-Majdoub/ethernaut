// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Reentrance {
  
  using SafeMath for uint256;
  mapping(address => uint) public balances;

  function donate(address _to) public payable {
		console.log("Vul got donation of ", msg.value, "wei from ", msg.sender);
    balances[_to] = balances[_to].add(msg.value);
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    if(balances[msg.sender] >= _amount) {
      (bool result,) = msg.sender.call{value:_amount}("");
      if(result) {
        _amount;
      }
      balances[msg.sender] -= _amount;
      // console.log("Vul ", msg.sender, " has ", balances[msg.sender]);
    }
  }

	function getBalance() view public returns (uint){
		return address(this).balance;
	}

  receive() external payable {
		console.log("Vul received ", msg.value, "wei from ", msg.sender);
  }
}