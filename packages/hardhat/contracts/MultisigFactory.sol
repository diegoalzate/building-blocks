// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Multisig.sol";
import "hardhat/console.sol";
import "./interfaces/IMultisig.sol";

contract MultisigFactory {
    IMultisig multisig;
    struct MultisigStruct {
        // foundation id
        uint256 _multisigIndex;
        // owner address
        // address[] _owners;
        // contract address created
        address _contract;
    }

    mapping(uint256 => MultisigStruct) public allMultisig;
    // Number of Goverences that have been created
    uint256 public numMultisigs;

    // function to create a new multisig instance for each society
    function createMultisig(string memory _societyName, uint256 _deposit)
        public
    {
        // uses the Multisig.sol contract as ref for new multisig
        Multisig multisig = new Multisig(_societyName, _deposit);

        // add new multisig to Multisig mapping
        allMultisig[numMultisigs] = (
            MultisigStruct(numMultisigs, address(multisig))
        );

        // Logs address of new multisig instacne
        console.log("New multisig deployed at", address(multisig));

        numMultisigs++;
    }
    
    // function to fetch multisig details
    function getMultisigDetails(uint256 _multisigIndex)
        public
        view
        returns (MultisigStruct memory)
    {
        return allMultisig[_multisigIndex];
    }

    function checkIfUserIsOwner(address _multisigAddress, address _memberAddress) public returns (bool){
        multisig = IMultisig(_multisigAddress);
        return multisig.isOwner(_memberAddress);
    }

    function checkIfUserIsMember(address _multisigAddress, address _memberAddress) public returns (bool){
        multisig = IMultisig(_multisigAddress);
        return multisig.isMember(_memberAddress);
    }

    function getAllMultigFromUser(address _address) public returns (address[] memory) {
        address[] memory multisigs = new address[](numMultisigs);
        for(uint i = 0; i < numMultisigs; i++) {
            bool isOwner = checkIfUserIsOwner(allMultisig[i]._contract, _address);
            if (isOwner) {
                multisigs[i] = allMultisig[i]._contract;
            }
        }
        return multisigs;
    }
}
