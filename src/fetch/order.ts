import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import { Bid, Order, Sale } from '../../generated/schema';

export function fetchOrder(
  orderHash: Bytes
): Order {
  return Order.load(orderHash.toHex()) as Order
}

export function fetchSale(
  orderHash: Bytes,
  tokenId: BigInt,
  takerAddress: Address
): Sale {
  return Sale.load(orderHash.toHexString().concat('/').concat(takerAddress.toHexString())) as Sale
}

export function fetchBid(
  orderHash: Bytes,
  bidderAddress: Address
): Bid {
  return Bid.load(orderHash.toHexString().concat('/').concat(bidderAddress.toHexString())) as Bid
}
