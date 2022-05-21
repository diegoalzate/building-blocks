// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IMultisig {
    // array of addresses of owners
    function owners() external view returns (address[] memory);
    // maps addresses as owner
    function isOwner(address) external view returns (bool);
    // whitelist for new members to be added as owner
    function isNewMember(address) external view returns (bool); 
    // number of confirmations required for invoking a transaction
    function numConfirmationsRequired() external view returns (uint);
    // society name
    function societyName() external view returns (string memory);
    // intial deposit to join society and become an owner
    function deposit() external view returns (uint);

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
    function serviceTransactions() external view returns (ServiceTransaction[] memory);

    // maps transaction index to transactions
    function serviceTransactionsMaps(uint) external view returns (ServiceTransaction memory);
    // mapping to check if owner has provided confirmation for a txn index
    // TODO: mapping(uint256 => mapping(address => bool)) isConfirmed;
    // function to add new member to whitelist

    function addNewMember(address _newMember) external;

    // add new member as owner after receving deposit
    function newOwner() external payable;

    // function to request payment for service
    function submitTransactionProposal(
        address _to,
        uint256 _amount,
        bytes memory _data
    ) external;

}