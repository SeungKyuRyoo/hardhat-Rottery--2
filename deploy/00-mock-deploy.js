const { network } = require("hardhat");
const {
  developmentChain,
  BASE_FEE,
  GAS_PRICE_LINK,
} = require("../helper.hardhat.config.js");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, logs } = await deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  arguments = [BASE_FEE, GAS_PRICE_LINK];
  if (developmentChain.includes(network.name)) {
    console.log("Mock deploying initiated....");
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: arguments,
    });
    console.log("Deploy Ended.......");
    console.log("-----------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
