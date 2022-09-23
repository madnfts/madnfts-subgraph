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
import { fetchBlock } from './fetch/block';
import { createBid, createOrder, createSale } from './create/order';

// 721 Marketplace events

export function handle721Bid(event: ERC721Bid): void {
  createBid(
    event.params.hash, // @todo - confirm this is the orders hash, or is is unique to the bid?
    event.params.id, // @todo - check this represents the token.id?
    event.params.bidPrice,
    event.params.bidder,
    event.address,
    fetchBlock(event.block)
  )
}

export function handle721CancelOrder(event: ERC721CancelOrder): void {
  let order = fetchOrder(event.params.hash)
  order.canceled = true
  order.save()
}

export function handle721Claim(event: ERC721Claim): void {
  createSale(
    event.params.hash, // @todo - confirm this is the orders hash, or is is unique to the sale?
    event.params.id, // @todo - check this represents the token.id?
    event.params.taker,
    event.params.price,
    fetchBlock(event.block)
  )
}

export function handle721MakeOrder(event: ERC721MakeOrder): void {
  createOrder(
    event.params.hash,
    0, // @todo - add to event data
    '721',
    0, // @todo - add to event data
    0, // @todo - add to event data
    0, // @todo - add to event data
    0, // @todo - add to event data
    event.params.id, // @todo - check this represents the token.id?
    event.params.seller,
    event.address,
    fetchBlock(event.block)
  )
}

// 1155 Marketplace events

export function handle1155Bid(event: ERC1155Bid): void {
  createBid(
    event.params.hash, // @todo - confirm this is the orders hash, or is is unique to the bid?
    event.params.id, // @todo - check this represents the token.id?
    event.params.bidPrice,
    event.params.bidder,
    event.address,
    fetchBlock(event.block)
  )
}

export function handle1155CancelOrder(event: ERC1155CancelOrder): void {
  let order = fetchOrder(event.params.hash)
  order.canceled = true
  order.save()
}

export function handle1155Claim(event: ERC1155Claim): void {
  createSale(
    event.params.hash, // @todo - confirm this is the orders hash, or is is unique to the sale?
    event.params.id, // @todo - check this represents the token.id?
    event.params.taker,
    event.params.price,
    fetchBlock(event.block)
  )
}

export function handle1155MakeOrder(event: ERC1155MakeOrder): void {
  createOrder(
    event.params.hash,
    0, // @todo - add to event data
    '1155',
    0, // @todo - add to event data
    0, // @todo - add to event data
    0, // @todo - add to event data
    0, // @todo - add to event data
    event.params.id,
    event.params.seller,
    event.address,
    fetchBlock(event.block)
  )
}
