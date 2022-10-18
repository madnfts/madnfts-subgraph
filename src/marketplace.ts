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

import { fetchOrder } from './fetch/order';
import { createBid, createOrder, createSale } from './create/order';
import { fetchERC1155Token, fetchERC721Token } from './fetch/token';
import { fetchERC1155, fetchERC721 } from './fetch/factory';

// 721 Marketplace events

// @todo test the bid event mappings
export function handle721Bid(event: ERC721Bid): void {
  // createBid(
  //   event.params.hash, // @todo - confirm this is the orders hash, or is is unique to the bid?
  //   event.params.id, // @todo - check this represents the token.id?
  //   event.params.bidPrice,
  //   event.params.bidder,
  //   event.address,
  //   event.block
  // )
}

export function handle721CancelOrder(event: ERC721CancelOrder): void {
  let order = fetchOrder(event.params.hash)
  order.canceled = true
  order.save()
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

// @todo test the bid event mappings
export function handle1155Bid(event: ERC1155Bid): void {
  // createBid(
  //   event.params.hash, // @todo - confirm this is the orders hash, or is is unique to the bid?
  //   event.params.id, // @todo - check this represents the token.id?
  //   event.params.bidPrice,
  //   event.params.bidder,
  //   event.address,
  //   event.block
  // )
}

export function handle1155CancelOrder(event: ERC1155CancelOrder): void {
  let order = fetchOrder(event.params.hash)
  order.canceled = true
  order.save()
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
