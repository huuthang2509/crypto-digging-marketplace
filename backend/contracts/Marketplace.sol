// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
  // Data types
  address payable public immutable feeAccount;
  uint public immutable feePercent;
  uint public itemCount;

  struct Item {
    uint id;
    uint tokenId;
    IERC721 nftRef;
    uint price;
    address payable seller;
    bool sold;
  }

  // Events
  event Offered (
    uint id,
    uint tokenId,
    address indexed nftRef,
    uint price,
    address indexed seller
  );
  event Bought (
    uint id,
    uint tokenId,
    address indexed nftRef,
    uint price,
    address indexed seller,
    address indexed buyer
  );

  // Mappings
  mapping(uint => Item) public items;

  constructor(uint _feePercent) {
    feeAccount = payable(msg.sender);
    feePercent = _feePercent;
  }

  function sendItemToMarket(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
    require(_price > 0, "Price is not allowed (greater than 0)");

    itemCount ++;
    _nft.transferFrom(msg.sender, address(this), _tokenId);
    items[itemCount] = Item (
      itemCount,
      _tokenId,
      _nft,
      _price,
      payable(msg.sender),
      false
    );

    emit Offered (
      itemCount,
      _tokenId,
      address(_nft),
      _price,
      msg.sender
    );
  }

  function purchaseItemFromMarket(uint _itemId) external payable nonReentrant {
    require(_itemId > 0 && _itemId <= itemCount, "Invalid itemId");

    uint transactPrice = priceWithFee(_itemId);
    require(msg.value >= transactPrice, "Not enough money");

    Item storage item = items[_itemId];
    require(!item.sold, "Item sold");

    item.seller.transfer(item.price);
    feeAccount.transfer(transactPrice - item.price);
    item.sold = true;
    item.nftRef.transferFrom(address(this), msg.sender, item.tokenId);

    emit Bought (
      _itemId,
      item.tokenId,
      address(item.nftRef),
      item.price,
      item.seller,
      msg.sender
    );
  }

  function priceWithFee(uint _itemId) view public returns(uint) {
    return items[_itemId].price*(100 + feePercent)/100;
  }
}
