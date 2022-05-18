// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Multisig {

    // array of addresses of owners
    address[] public owners;
    // maps addresses as owner
    mapping(address => bool) public isOwner;
    // whitelist for new members to be added as owner
    address[] public newMembers;
    // number of confirmations required for invoking a transaction
    uint public numConfirmationsRequired;
    // society name
    string societyName;
    // intial deposit to join society and become an owner
    uint256 deposit;

    // struct for intiating a transaction to pay for a service
    struct ServiceTransaction {
        // address to be paid
        address to;
        // amount to be paid
        uint256 amount;
        // description of transaction
        bytes data;
        // is transaction executed
        bool executed;
        // number of confirmations received for said transaction
        uint256 numConfirmations;
    }

    // array to store service transactions
    ServiceTransaction[] public serviceTransactions;

    // maps transaction index to transactions
    mapping(uint256 => ServiceTransaction) serviceTransactionsMaps;

    // mapping to check if owner has provided confirmation for a txn index
    mapping(uint256 => mapping(address => bool)) isConfirmed;

    // modifier to check for owner
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    // called whenever new instance is deployed first time
    constructor(
        string memory _societyName,
        uint256 _deposit
    ) {
        newMembers.push(msg.sender);
        societyName = _societyName;
        // superowner to pay the deposit
        deposit = _deposit;
    }

    // function to add new member to whitelist
    function addNewMember(address _newMember) external onlyOwner {
        newMembers.push(_newMember);
    }

    // add new member as owner after receving deposit
    function newOwner() public payable {
        require(msg.value == deposit, "Value is not equal to deposit value.");
        require(msg.sender.balance > msg.value, "Insufficient balance. Please add funds.");
        owners.push(msg.sender);
        isOwner[msg.sender] = true;
        console.log(address(this).balance);
    }

    // function to request payment for service
    function submitTransactionProposal(address _to, uint256 _amount, bytes memory _data)
        public
        onlyOwner {
            uint txIndex = serviceTransactions.length + 1;

        serviceTransactions.push(ServiceTransaction(
            {
                to: _to,
                amount: _amount,
                data: _data,
                executed: false,
                numConfirmations: 0
            }
        ));
    }
}
