const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { networkConfig } = require("../../helper.hardhat.config.js");

describe("constants", function () {
  let rottery, VRFCoordinatorV2Mock;
  const chainId = network.config.chainId;

  beforeEach(async function () {
    const { deployer } = await getNamedAccounts();
    function isLocalEnv(envName) {
      return !!{
        hardhat: true,
        localhost: true,
      }[envName];
    }
    if (isLocalEnv(network.name)) {
      await deployments.fixture("Rottery");
    }
    rottery = await ethers.getContract("Rottery", deployer);
    // VRFCoordinatorV2Mock = await ethers.getContract(
    //   "VRFCoordinatorV2Mock",
    //   deployer
    // );
  });

  describe("constructor", async function () {
    it("Initializes the raffle correctly", async function () {
      const gasLane = await rottery.getGasLane();
      //   const subscriptionId = await Raffle.getSubscriptionId();
      const callbackGasLimit = await rottery.getCallbackGasLimit();
      const requestConfirmations = await rottery.getRequestConfirmations();
      const numWords = await rottery.getNumWords();
      const getSubscriptionId = await rottery.getSubscriptionId();
      assert.equal(gasLane, networkConfig[chainId]["gasLane"]);
      assert.equal(
        callbackGasLimit,
        networkConfig[chainId]["callbackGasLimit"]
      );
      assert.equal(requestConfirmations, 3);
      assert.equal(numWords, 1);
      console.log(`subscription Id is : ${getSubscriptionId}`);
    });
  });

  describe("RequestRandomWords", async function () {
    it("Request properly requested", async function () {
      const requestRandomWordsResponse = await rottery.requestRandomWords();
      const requestRandomWordsRecipt = await requestRandomWordsResponse.wait(1);
      const requestId = await requestRandomWordsRecipt.events[1].args
        .s_requestId;
      console.log(`requested Id is ${requestId.toString()}`);
    });
  });
  describe("fullfillRandomWords", async function () {
    it("Is random number shown?", async function () {
      const requestRandomWordsResponse = await rottery.requestRandomWords();
      const requestRandomWordsRecipt = await requestRandomWordsResponse.wait(1);
      const requestId = await requestRandomWordsRecipt.events[1].args
        .s_requestId;
      console.log(`requested Id is ${requestId.toString()}`);
      const RandomNumberArray = await rottery.getRandomWords();
      console.log(RandomNumberArray.toString());
    });
  });
});
