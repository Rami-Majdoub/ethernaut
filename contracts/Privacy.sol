// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Privacy {

  bool public locked = true; // slot 0
  uint256 public ID = block.timestamp; // slot 1 32 bytes
  // uint8 £ [0..2^8-1] => 8 bytes
  uint8 private flattening = 10; // slot 2 , remainig 32-8=24
  uint8 private denomination = 255; // slot 2 remaining 24-8=16
  uint16 private awkwardness = uint16(block.timestamp); // slot 2 remainig 0
  bytes32[3] private data; // slot 3 data[0], slot 4 data[1], slot 5 data[2]
  // bytes32 to bytes 16 
  // 0x9b0375034746bb1279d292c78ae4cbce47bc913230ef0164b02b74f5908ce949
  // 0x0000000000000000000000000000000047bc913230ef0164b02b74f5908ce949 // wrong
  // 0x9b0375034746bb1279d292c78ae4cbce // correct

  constructor(bytes32[3] memory _data) {
    data = _data;
  }
  
  function unlock(bytes16 _key) public {
    require(_key == bytes16(data[2]));
    locked = false;
  }

  /*
    A bunch of super advanced solidity algorithms...

      ,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`
      .,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,
      *.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^         ,---/V\
      `*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.    ~|__(o.o)
      ^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'  UU  UU
  */
}