// deploy/01_deploy_multisig_contract
// const { ethers } = require("hardhat");
// const { network } = require("hardhat/config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [
    "Test Society",
    1,
    "0x0000000000000000000000000000000000000000",
    "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"
  ];

  // fetches the deployed MultisigFactory contract
  // const MultisigFactory = await ethers.getContract("MultisigFactory");

  // Interacts with MultisigFactory to create new multisig instance
  // await MultisigFactory.createMultisig("Test Society", 1);

  // deploys a multisig contract to get abi into next-app
  await deploy("Multisig", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    args: args,
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["all", "multisig"];
