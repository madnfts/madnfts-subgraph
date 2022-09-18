import {
  AuctionSettingsUpdated as ERC721AuctionSettingsUpdated,
  Bid as ERC721Bid,
  CancelOrder as ERC721CancelOrder,
  Claim as ERC721Claim,
  FactoryUpdated as ERC721FactoryUpdated,
  MakeOrder as ERC721MakeOrder,
  OwnerUpdated as ERC721OwnerUpdated,
  Paused as ERC721Paused,
  Unpaused as ERC721Unpaused,
} from '../generated/ERC721Marketplace/ERC721Marketplace';

import {
  AuctionSettingsUpdated as ERC1155AuctionSettingsUpdated,
  Bid as ERC1155Bid,
  CancelOrder as ERC1155CancelOrder,
  Claim as ERC1155Claim,
  FactoryUpdated as ERC1155FactoryUpdated,
  MakeOrder as ERC1155MakeOrder,
  OwnerUpdated as ERC1155OwnerUpdated,
  Paused as ERC1155Paused,
  Unpaused as ERC1155Unpaused,
} from '../generated/ERC1155Marketplace/ERC1155Marketplace';
import { fetchOrder } from './fetch/order';
import { fetchERC721 } from './fetch/factory';

// 721 Marketplace events

export function handle721AuctionSettingsUpdated(event: ERC721AuctionSettingsUpdated): void {}

export function handle721Bid(event: ERC721Bid): void {}

export function handle721CancelOrder(event: ERC721CancelOrder): void {
  let order = fetchOrder(
    event.params.hash,
    event.params.token,
    event.params.id,
    event.params.seller
  )
  order.canceled = true
  order.save()
}

export function handle721Claim(event: ERC721Claim): void {}

export function handle721MakeOrder(event: ERC721MakeOrder): void {
  // @todo we need th orderType - auction / buy and end block / price, can we retrieve this from hash?
  let contract = fetchERC721(event.address, event.block.timestamp)
  let order = fetchOrder(
    event.params.hash,
    event.params.token,
    event.params.id,
    event.params.seller
  )
}

export function handle721FactoryUpdated(event: ERC721FactoryUpdated): void {}
export function handle721OwnerUpdated(event: ERC721OwnerUpdated): void {}
export function handle721Paused(event: ERC721Paused): void {}
export function handle721Unpaused(event: ERC721Unpaused): void {}

// 1155 Marketplace events

export function handle1155AuctionSettingsUpdated(event: ERC1155AuctionSettingsUpdated): void {}
export function handle1155Bid(event: ERC1155Bid): void {}
export function handle1155CancelOrder(event: ERC1155CancelOrder): void {}
export function handle1155Claim(event: ERC1155Claim): void {}
export function handle1155FactoryUpdated(event: ERC1155FactoryUpdated): void {}
export function handle1155MakeOrder(event: ERC1155MakeOrder): void {}
export function handle1155OwnerUpdated(event: ERC1155OwnerUpdated): void {}
export function handle1155Paused(event: ERC1155Paused): void {}
export function handle1155Unpaused(event: ERC1155Unpaused): void {}
