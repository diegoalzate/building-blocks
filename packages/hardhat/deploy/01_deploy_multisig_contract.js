// deploy/01_deploy_multisig_contract
const { ethers } = require("hardhat");
const { network } = require("hardhat/config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ["Test Society", 1];

  // fetches the deployed MultisigFactory contract
  const MultisigFactory = await ethers.getContract("MultisigFactory");

  // Interacts with MultisigFactory to create new multisig instance
  await MultisigFactory.createMultisig("Test Society", 1);

  // console.log("Test Society multisig deployed at", testMultisig.address);

  // const MultisigContract = await deploy("Multisig", {
  //   // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //   args: args,
  //   from: deployer,
  //   log: true,
  // });
};
module.exports.tags = ["all", "multisig"];
