import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import { Order } from '../../generated/schema';

export function createOrder(
  orderHash: Bytes,
  token?: Address,
  tokenId?: BigInt,
  seller?: Address
): Order {
  let order = new Order(orderHash.toHex())
  order.seller = seller
  order.hash = orderHash
  order.canceled = false
  order.save()
  return order as Order
}
