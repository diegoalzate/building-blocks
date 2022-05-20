// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Multisig.sol";
import "hardhat/console.sol";

contract MultisigFactory {
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
}
