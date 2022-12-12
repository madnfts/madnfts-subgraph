import {
  Bid as ERC721Bid,
  CancelOrder as ERC721CancelOrder,
  Claim as ERC721Claim,
  MakeOrder as ERC721MakeOrder,
} from '../generated/ERC721Marketplace/ERC721Marketplace';

import {
  Bid as ERC1155Bid,
  CancelOrder as ERC1155CancelOrder,
  Claim as ERC1155Claim,
  MakeOrder as ERC1155MakeOrder,
} from '../generated/ERC1155Marketplace/ERC1155Marketplace';

import { cancelSale, createBid, createOrder, createSale } from './create/order';

// 721 Marketplace events

export function handle721Bid(event: ERC721Bid): void {
  createBid(
    '721',
    event.params.hash,
    event.params.id,
    event.params.bidPrice,
    event.params.bidder,
    event.params.token,
    event.block
  )
}

export function handle721CancelOrder(event: ERC721CancelOrder): void {
  cancelSale(
    '721',
    event.params.hash,
    event.params.token,
    event.block
  )
}

export function handle721Claim(event: ERC721Claim): void  {
  createSale(
    '721',
    event.params.hash,
    event.params.id,
    event.params.taker,
    event.params.token,
    event.address,
    event.params.price,
    event.block
  )
}

export function handle721MakeOrder(event: ERC721MakeOrder): void {
  createOrder(
    '721',
    event.params.hash,
    event.params.id,
    null,
    event.params.seller,
    event.params.token,
    event.address,
    event.block
  )
}

// 1155 Marketplace events

export function handle1155Bid(event: ERC1155Bid): void {
  createBid(
    '1155',
    event.params.hash,
    event.params.id,
    event.params.bidPrice,
    event.params.bidder,
    event.params.token,
    event.block
  )
}

export function handle1155CancelOrder(event: ERC1155CancelOrder): void {
  cancelSale(
    '1155',
    event.params.hash,
    event.params.token,
    event.block
  )
}

export function handle1155Claim(event: ERC1155Claim): void {
  createSale(
    '1155',
    event.params.hash,
    event.params.id,
    event.params.taker,
    event.params.token,
    event.address,
    event.params.price,
    event.block
  )
}

export function handle1155MakeOrder(event: ERC1155MakeOrder): void {
  createOrder(
    '1155',
    event.params.hash,
    event.params.id,
    event.params.amount,
    event.params.seller,
    event.params.token,
    event.address,
    event.block
  )
}
