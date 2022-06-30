const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChain,
} = require("../helper.hardhat.config.js");

const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, logs } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];

  let VRFCoordinatorV2Address, subscriptionId;

  VRFCoordinatorV2Address = networkConfig[chainId]["VRFCoordinator"];
  subscriptionId = networkConfig[chainId]["subscriptionId"];

  const arguments = [
    gasLane,
    subscriptionId,
    callbackGasLimit,
    VRFCoordinatorV2Address,
  ];
  const rottery = await deploy("Rottery", {
    from: deployer,
    log: true,
    args: arguments,
    waitConfirmations: 1,
  });

  console.log("Verifying...");
  await verify(rottery.address, arguments);
};

module.exports.tags = ["all", "Rottery"];
