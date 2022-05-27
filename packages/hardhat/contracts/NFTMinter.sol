// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTMinter is ERC721, Ownable {
    using Strings for uint256;

    mapping(uint256 => string) _tokenURIs;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal {
        _tokenURIs[_tokenId] = _tokenURI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(_tokenId));
        string memory _tokenURI = _tokenURIs[_tokenId];
        return _tokenURI;
    }

    // mint a doc/ service payment
    function mint(address recipient, uint256 _tokenId, string memory _tokenURI) public {
        _mint(recipient, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }
}