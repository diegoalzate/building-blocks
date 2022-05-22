// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// ability to console log within smart contracts
import "hardhat/console.sol";
import "./interfaces/IMultisig.sol";
import "./PriceConverter.sol";

contract Multisig {
    event NewOwner(
        address indexed owner,
        uint256 depositAmount,
        uint256 contractBalance
    );

    event SubmitTransactionProposal(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        string data
    );

    event ApproveTransactionPropasal(
        address indexed owner,
        uint256 indexed txIndex
    );

    event RevokeApproval(address indexed owner, uint256 indexed txIndex);

    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    // array of addresses of owners. Do we need it? It will cost more gas
    address[] public owners;
    // maps addresses as owner
    mapping(address => bool) public isOwner;
    // whitelist for new members to be added as owner. Do we need it? It will cost more gas so use a mapping?
    // address[] public newMembers;
    mapping(address => bool) public isNewMember;
    // number of Approvals required for invoking a transaction
    uint256 public numApprovalsRequired;

    // society name
    string public societyName;
    // intial deposit to join society and become an owner
    uint256 public deposit;

    // struct for intiating a transaction to pay for a service
    struct ServiceTransaction {
        // address to be paid
        address to;
        // amount to be paid
        uint256 amount;
        // description of transaction
        string data;
        // is transaction executed
        bool executed;
        // number of Approvals received for said transaction
        uint256 numApprovals;
    }

    // array to store service transactions
    ServiceTransaction[] public serviceTransactions;

    // maps transaction index to transactions
    // mapping(uint256 => ServiceTransaction) serviceTransactionsMaps;

    // mapping to check if owner has provided Approval for a txn index
    mapping(uint256 => mapping(address => bool)) isApproved;

    // modifier to check for owner
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    // functions to check is txn proposal exists
    modifier txExists(uint256 _txIndex) {
        require(_txIndex < serviceTransactions.length, "tx does not exist");
        _;
    }

    // Check if proposal/ payment has already been executed
    modifier notExecuted(uint256 _txIndex) {
        require(!serviceTransactions[_txIndex].executed, "tx already executed");
        _;
    }

    // check if the owner has already submitted Approval
    modifier notApproved(uint256 _txIndex) {
        require(!isApproved[_txIndex][msg.sender], "tx is already approved");
        _;
    }

    // called whenever new instance is deployed first time

    constructor(
        string memory _societyName,
        uint256 _deposit,
        address _owner
    ) {
        isNewMember[_owner] = true;
        societyName = _societyName;
        // superowner to pay the deposit
        // deposit = _deposit * 10 ** 18;
        deposit = _deposit;
    }

    // function to add new member to whitelist
    function addNewMember(address _newMember) external onlyOwner {
        isNewMember[_newMember] = true;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        newOwner();
    }

    // add new member as owner after receving deposit
    function newOwner() public payable {
        console.log(msg.sender);
        console.log(isNewMember[msg.sender]);
        console.log("The deposit amount is", deposit);
        require(
            isNewMember[msg.sender],
            "You are not a new member. You cannot interact with this function."
        );
        // check if the value being sent is equal to the required deposit
        require(msg.value == deposit, "Value is not equal to deposit value.");

        // check if person has enough funds
        require(
            msg.sender.balance > msg.value,
            "Insufficient balance. Please add funds."
        );
        isNewMember[msg.sender] = false;
        // add member to the list of owners

        owners.push(msg.sender);
        // add new oner to the owner mapping
        isOwner[msg.sender] = true;
        // console log balance of new multisig contract
        console.log(address(this).balance);

        emit NewOwner(msg.sender, deposit, address(this).balance);
    }

    // function to request payment for service

    function submitTransactionProposal(
        address _to,
        uint256 _amount,
        string memory _data
    ) public onlyOwner {
        uint256 txIndex = serviceTransactions.length;

        serviceTransactions.push(
            ServiceTransaction({
                to: _to,
                // amount: _amount * 10 ** 18,
                amount: _amount,
                data: _data,
                executed: false,
                numApprovals: 0
            })
        );

        // emit event when a request for transaction service is submitted
        emit SubmitTransactionProposal(
            msg.sender,
            txIndex,
            _to,
            _amount,
            _data
        );
    }

    // function for owners to approve transaction
    // check if service transaction request exists, if payment for same has been made
    // and if owner has already approved
    function approveTransactionProposal(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notApproved(_txIndex)
    {
        // calls txn details from array
        ServiceTransaction storage serviceTransaction = serviceTransactions[
            _txIndex
        ];

        isApproved[_txIndex][msg.sender] = true;
        serviceTransaction.numApprovals++;

        emit ApproveTransactionPropasal(msg.sender, _txIndex);
    }

    function revokeApproval(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        ServiceTransaction storage serviceTransaction = serviceTransactions[
            _txIndex
        ];

        require(isApproved[_txIndex][msg.sender], "tx not confirmed");

        isApproved[_txIndex][msg.sender] = false;
        serviceTransaction.numApprovals--;

        emit RevokeApproval(msg.sender, _txIndex);
    }

    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        ServiceTransaction storage serviceTransaction = serviceTransactions[
            _txIndex
        ];

        require(
            serviceTransaction.numApprovals >= numApprovalsRequired,
            "Not enough approvals to execute transaction"
        );

        serviceTransaction.executed = true;

        (bool success, ) = payable(serviceTransaction.to).call{
            value: serviceTransaction.amount
        }(abi.encode(serviceTransaction.data));
        require(success, "Transaction failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    // function to get owners
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getMultisigBalance() public view returns (uint) {
        return address(this).balance;
    }
}
