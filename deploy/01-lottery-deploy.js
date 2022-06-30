const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChain,
  VRFCoordinatorV2MockFunding,
} = require("../helper.hardhat.config.js");

const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, logs } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];

  let VRFCoordinatorV2Address, subscriptionId;
  if (developmentChain.includes(network.name)) {
    VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    VRFCoordinatorV2Address = await VRFCoordinatorV2Mock.address;
    const subscriptionIdResponse =
      await VRFCoordinatorV2Mock.createSubscription();
    const subscriptionIdRecipt = await subscriptionIdResponse.wait(1);
    subscriptionId = subscriptionIdRecipt.events[0].args.subId;

    await VRFCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRFCoordinatorV2MockFunding
    );
  } else {
    VRFCoordinatorV2Address = networkConfig[chainId]["VRFCoordinator"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

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

  if (!developmentChain.includes(network.name)) {
    console.log("Verifying...");
    await verify(rottery.address, arguments);
  }
};

module.exports.tags = ["all", "Rottery"];
