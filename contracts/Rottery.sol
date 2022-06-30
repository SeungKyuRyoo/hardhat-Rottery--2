//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Rottery is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface private immutable i_COORDINATOR;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant i_requestConfirmations = 3;
    uint32 private constant i_numWords = 1;
    uint256 public s_requestId;
    uint256[] public s_randomWords;

    event RequestRandomWords(uint256 indexed s_requestId);

    constructor(
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        address VRFCoordinator
    ) VRFConsumerBaseV2(VRFCoordinator) {
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_COORDINATOR = VRFCoordinatorV2Interface(VRFCoordinator);
    }

    function requestRandomWords() external {
        s_requestId = i_COORDINATOR.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            i_numWords
        );
        emit RequestRandomWords(s_requestId);
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords)
        internal
        override
    {
        s_randomWords = randomWords;
    }

    function getGasLane() public view returns (bytes32) {
        return i_gasLane;
    }

    function getCallbackGasLimit() public view returns (uint32) {
        return i_callbackGasLimit;
    }

    function getRequestConfirmations() public pure returns (uint16) {
        return i_requestConfirmations;
    }

    function getNumWords() public pure returns (uint32) {
        return i_numWords;
    }

    function getSubscriptionId() public view returns (uint64) {
        return i_subscriptionId;
    }

    function getRandomWords() public view returns (uint256[] memory) {
        return s_randomWords;
    }
}
