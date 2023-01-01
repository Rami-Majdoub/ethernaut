// tasks
import { task, types } from "hardhat/config";

task("abi", "prints the ABI of a contract")
  .addParam("contract", "contract path", undefined, types.inputFile, false)
  .setAction(async ({ contract }, { ethers, artifacts }) => {

    // get contract fully qualified name
    const allContracts = await artifacts.getAllFullyQualifiedNames()
    const contractName = allContracts.find((e) => e.startsWith(contract)) || contract
    
    // read contract
    const contractArtifact = await artifacts.readArtifact(contractName)
    const contractFactory = await ethers.getContractFactoryFromArtifact(contractArtifact) as any

    const format = ethers.utils.FormatTypes.json // full minimal json
    const abi = contractFactory.interface.format(format)
    
    console.log(abi);
});

task("deploy", "deploys a contract")
.addParam("contract", "contract path", undefined, types.inputFile, false)
//  .addParam("contract", "contract name") // v0
  .setAction(async ({ contract }, { ethers, artifacts }) => {
    // v1
    // get contract fully qualified name
    const allContracts = await artifacts.getAllFullyQualifiedNames()
    const contractName = allContracts.find((e) => e.startsWith(contract)) || ""
    
    // read contract
    const contractArtifact = await artifacts.readArtifact(contractName)
    const contractFactory = await ethers.getContractFactoryFromArtifact(contractArtifact) as any

    // v0
    //const contractFactory = await ethers.getContractFactory(contract) as any

    // deploy
    const contractDeployed = await contractFactory.deploy()
    
    console.log(`Contract ${contract} deployed at address: `, contractDeployed.address)
});

task("mnemonic", "Prints a new valid mnemonic to use instead of default one")
  .setAction(async (_, { ethers }) => {
    const { mnemonic: { phrase: mnemonicPhrase } } = ethers.Wallet.createRandom()
    console.log(mnemonicPhrase);
  }
)

// if config.networks.hardhat.accounts is set
// the private keys are not shown by the hardhat node
task("hardhat-account-infos", "Prints more informations about the accounts used by hardhat",
  async ( _, hre) => {
    const { accounts } = hre.config.networks.hardhat;
    await hre.run("account-info", accounts)
});

// general use purpose
// you have a mnemonic and you want to get the accounts infos
task("account-info", "Prints the accounts informations from a mnemonic")
  .addParam("mnemonic", "should be valid")
  .addOptionalParam("count", "number of addresses to print", 20, types.int)
  .addOptionalParam("path", "", "m/44'/60'/0'/0/")
  .addOptionalParam("initialIndex", "first account index", 0, types.int)
  .setAction(async ({ mnemonic, count, path, initialIndex, passphrase }, { ethers } ) => {
    
    Array(count).fill(0).map((_, i) => {
      const PATH = path + (i + initialIndex).toString()
      const wallet = ethers.Wallet.fromMnemonic(mnemonic, PATH)

      console.log("Mnemonic: ", wallet.mnemonic.phrase);
      console.log("Address: ", wallet.address);
      console.log("privateKey: ", wallet.privateKey);
      console.log("publicKey: ", wallet.publicKey);
      console.log("----------")
    })
  })
