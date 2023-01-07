// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract DexHackToken is ERC20, Ownable {

	constructor() ERC20("DexHackToken", "DHT"){
		_mint(msg.sender, 1_000_000);
	}

	function mint(address to, uint amount) public onlyOwner {
		_mint(to, amount);
	}
	

}
