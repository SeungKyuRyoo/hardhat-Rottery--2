const { ethers } = require("hardhat");
const networkConfig = {
  4: {
    name: "rinkeby",
    VRFCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: "7534",
    callbackGasLimit: "500000",
  },
  31337: {
    name: "hardhat",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGasLimit: "500000",
  },
};
const BASE_FEE = 1;
const GAS_PRICE_LINK = 1e9;
const VRFCoordinatorV2MockFunding = 1e15;
const developmentChain = ["hardhat"];
module.exports = {
  networkConfig,
  developmentChain,
  BASE_FEE,
  GAS_PRICE_LINK,
  VRFCoordinatorV2MockFunding,
};
