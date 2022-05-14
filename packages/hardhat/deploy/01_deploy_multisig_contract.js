// deploy/01_deploy_multisig_contract

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [
    "0x0000000000000000000000000000000000000000",
    "Test Society",
    "10",
  ];
  await deploy("Multisig", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    args: args,
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["all", "multisig"];
