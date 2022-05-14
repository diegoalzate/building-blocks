// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Multisig {
    address _owner;
    string _societyName;
    string _deposit;

    constructor(
        address owner,
        string memory societyName,
        string memory deposit
    ) {
        _owner = owner;
        _societyName = societyName;
        _deposit = deposit;
    }
}
