const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  networkConfig,
  developmentChain,
} = require("../../helper.hardhat.config.js");

describe("constants", function () {
  let rottery, VRFCoordinatorV2Mock, accounts;
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
      await deployments.fixture(["all"]);
    }
    accounts = await ethers.getSigners();
    rottery = await ethers.getContract("Rottery", deployer);
    VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock",
      deployer
    );
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
      console.log(`Running on ${network.name}`);

      const additionalEntrances = 3;
      const startingIndex = 1;
      for (
        let i = startingIndex;
        i < additionalEntrances + startingIndex;
        i++
      ) {
        rotteryNonDeployer = rottery.connect(accounts[i]);
        await rottery.enterRaffle();
      }
      if (developmentChain.includes(network.name)) {
        await VRFCoordinatorV2Mock.fulfillRandomWords(
          requestId,
          rottery.address
        );
      }
      const RandomNumberArray = await rottery.getRandomWords();
      console.log(`Random number is : ${RandomNumberArray.toString()}`);
      const numberOfPlayers = await rottery.getnumberOfPlayer();
      console.log(`Number of Players : ${numberOfPlayers}`);
      const Winner = await rottery.getWinner();
      console.log(`Winner : ${Winner}`);
    });
  });
});
