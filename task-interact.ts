import { Contract } from "ethers";
import { task, types } from "hardhat/config";
import { Artifacts } from "hardhat/types";
import prompts, { PromptObject } from "prompts";
import chalk from "chalk";

/**
 * Ask the user to select the contract name
 * @param artifacts hardhat artifacts
 * @returns {string} the contract fully qualified name
 */
const selectContractName = async (artifacts: Artifacts) => {
	const allQualifiedNames = await artifacts.getAllFullyQualifiedNames();

	const response = await prompts({
		type: "select",
		name: "contract",
		message: "Contract Name",
		choices: getChoices(allQualifiedNames),
	});
	const selectedName = response.contract as string;

	return selectedName;
};

/**
 * Ask the user for the contract address
 * @returns contract address provided by the user
 */
const selectContractAddress = async () => {
	const response = await prompts({
		type: "text",
		name: "contractAddress",
		message: "Contract address",
	});

	return response.contractAddress as string;
};

/**
 * Ask the user to select a function from the contract functions
 * @param contract the
 * @typedef {{func: Function, funcName: string}} retType
 * @returns {retType} the contract function and its name
 */
const selectContractFunction = async (contract: Contract) => {
	// Get unique function names
	const functionNames = Object.keys(contract.interface.functions);
	//
	const functions = contract.functions;

	// Ask the user
	const response = await prompts({
		type: "select",
		name: "func",
		message: "Function",
		choices: getChoices(functionNames),
	});

	const selectedFunctionName: string = response.func as string;
	const selectedFunction = functions[selectedFunctionName];

	return { func: selectedFunction, funcName: selectedFunctionName };
};

const inputFunctionArgs = async (args: any[]) => {
	const boolConfig = (name: string): PromptObject<string> => {
		return {
			type: "toggle",
			name: name,
			message: name,
			active: "true",
			inactive: "false",
		};
	};

	const numberConfig = (name: string): PromptObject<string> => {
		return {
			type: "number",
			name: name,
			message: name,
		};
	};

	const textConfig = (name: string): PromptObject<string> => {
		return {
			type: "text",
			name: name,
			message: name,
		};
	};

	// TODO: type check (check each argument for the type)
	// Solidity types: address bool string bytes uint int
	// Not full supprted: fixed ufixed

	const solidityTypesToPromptTypes = {
		bool: boolConfig,
		uint8: numberConfig,
		uint16: numberConfig,
		uint32: numberConfig,
		uint40: numberConfig,
		uint48: numberConfig,
		// all other uints & ints
		uint240: numberConfig,
		uint248: numberConfig,
		uint256: numberConfig,
		_default: textConfig,
	};

	// // generate an array of string from "uint8" to "uint256"
	// // "uint" is ignored as it is equal to uint256
	// const uints = Array(256 / 8)
	// 	.fill("")
	// 	.map((_, index: number) => "uint" + (index + 1) * 8);

	// // from "int8" to "int256"
	// const ints = Array(256 / 8)
	// 	.fill("")
	// 	.map((_, index: number) => "int" + (index + 1) * 8);

	// // from "bytes1" to "bytes32"
	// const fixedBytes = Array(32)
	// 		.fill("")
	// 		.map((_, index: number) => "bytes" + (index + 1));

	// const uintsAndInts = [...uints, ...ints];

	const questions: PromptObject<string>[] = args.map((arg) => {
		const { name } = arg;

		const type: keyof typeof solidityTypesToPromptTypes = arg.type;
		const fn =
			solidityTypesToPromptTypes[type] ||
			solidityTypesToPromptTypes["_default"];
		return fn(name);
	});

	const response = await prompts(questions);

	return response;
};

/**
 * Transforms an array of strings to an array of prompts.Choice
 * @param choices array of string
 * @returns {prompts.Choice} array of prompts.Choice
 */
const getChoices = (choices: string[]): prompts.Choice[] => {
	return choices.map((choice) => {
		return {
			title: choice,
			value: choice,
		};
	});
};

/**
 * Ask the user whether to exit the loop or not
 * @returns {boolean} response of the user
 */
const end = async () => {
	const response = await prompts({
		type: "select",
		name: "end",
		message: "Exit",
		choices: [
			{
				title: "No",
				value: false,
			},
			{
				title: "Yes",
				value: true,
			},
		],
		initial: false,
	});
	return response.end as boolean;
};

task("interact", "Calls a function of a contract")
	.addOptionalParam(
		"accountId",
		"Id of the account to connect with, default: Account #0",
		0,
		types.int
	)
	.addOptionalParam("contractAddress", "Address of the contract")
	.setAction(
		async (
			{ accountId, contractAddress: contractAddress_ },
			{ ethers, artifacts, run }
		) => {
			const signer = (await ethers.getSigners())[accountId];

			console.log(`Connected as: ${await signer.getAddress()}`);

			const contractName = await selectContractName(artifacts);

			const contractAddress = contractAddress_
				? contractAddress_
				: await selectContractAddress();

			const contract = await ethers.getContractAtFromArtifact(
				await artifacts.readArtifact(contractName),
				contractAddress,
				signer
			);

			const contractAbi = (await artifacts.readArtifact(contractName)).abi;

			let exit = false;
			while (!exit) {
				const { func, funcName: funcHeader } = await selectContractFunction(
					contract
				);

				// Transformation: setValue(uint) => setValue
				const funcName = funcHeader.substring(0, funcHeader.indexOf("("));

				// Find the function in the abi
				const abiFunctionDef = contractAbi.filter(
					(funcDef) => funcDef.name == funcName
				);

				// Get the parameters of the function from the inputs array
				const abiFunctionInput = abiFunctionDef[0].inputs || [];

				// Ask for parameter values
				const args = await inputFunctionArgs(abiFunctionInput);

				try {
					// Values provided by the user
					const paramValues = Object.values(args);

					const tx = await func(...paramValues);

					// Does the transaction require confirmation or it is a view function
					const txRequireConfirmation: boolean = tx.wait ? true : false;

					if (txRequireConfirmation) {
						console.log(`Waiting for tx confirmation: ${tx.hash}`);
						await tx.wait();
						console.log(chalk.green("Transaction confirmed"));
					} else {
						console.log(`Returned: ${tx[0]}`);
					}
				} catch (error: any) {
					console.error(chalk.red("Transaction reverted: " + error.reason));
				}

				exit = await end();

				console.log();
			}
		}
	);
