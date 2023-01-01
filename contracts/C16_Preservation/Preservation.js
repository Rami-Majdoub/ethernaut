await contract.timeZone1Library()
await contract.timeZone2Library()
await contract.owner()
await web3.eth.getStorageAt(contract.address, 3, console.log)

// timeZone1Library
timeZone1LibraryAddress = 0x9f6F8698306cA3FE9135979bFfba4186032Cb61e

// timeZone2Library
timeZone2LibraryAddress = 0x424696691AAf82ca057eD8eDD249Db1D0d19745b
// in timeZone2Library contract
// function setSecondTime(uint _timeStamp) public {
// // equal to timeZone1Library = _timeStamp // this will be exploit contract address
//   timeZone2Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
// }


await web3.eth.getStorageAt("0x9f6f8698306ca3fe9135979bffba4186032cb61e", 0, console.log)
await web3.eth.getStorageAt("0x9f6f8698306ca3fe9135979bffba4186032cb61e", 1, console.log)
await web3.eth.getStorageAt("0x9f6f8698306ca3fe9135979bffba4186032cb61e", 2, console.log)

await web3.eth.getStorageAt("0x424696691AAf82ca057eD8eDD249Db1D0d19745b", 0, console.log)
await web3.eth.getStorageAt("0x424696691AAf82ca057eD8eDD249Db1D0d19745b", 1, console.log)
await web3.eth.getStorageAt("0x424696691AAf82ca057eD8eDD249Db1D0d19745b", 2, console.log)

