// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Multisig.sol";

contract MultisigFactory {
    struct MultisigStruct {
        // foundation id
        uint256 _multisigIndex;
        // owner address
        address _owner;
        // contract address created
        address _contract;
    }

    mapping(uint256 => MultisigStruct) public allMultisig;
    // Number of Goverences that have been created
    uint256 public numMultisigs;

    function createMultisig(string memory societyName, string memory deposit)
        public
    {
        Multisig multisig = new Multisig(msg.sender, societyName, deposit);
        allMultisig[numMultisigs] = (
            MultisigStruct(numMultisigs, msg.sender, address(multisig))
        );
        numMultisigs++;
    }

    function getMultisigDetails(uint256 _tokenId)
        public
        view
        returns (MultisigStruct memory)
    {
        return allMultisig[_tokenId];
    }
}
