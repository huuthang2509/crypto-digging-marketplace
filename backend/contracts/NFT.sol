// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
  uint public tokenCount;

  constructor() ERC721("Crypto Digging Marketplace", "CDM") {}

  function mintNFT(string memory _tokenUri) external returns(uint) {
    // Increase tokenCount
    tokenCount ++;

    _safeMint(msg.sender, tokenCount);
    _setTokenURI(tokenCount, _tokenUri);

    return tokenCount;
  }
}
