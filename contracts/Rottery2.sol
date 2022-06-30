//SPDX-License-Identifier: MIT

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
