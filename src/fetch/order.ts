import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import { Order } from '../../generated/schema';
import { createOrder } from '../create/order';

export function fetchOrder(
  orderHash: Bytes,
  token?: Address,
  tokenId?: BigInt,
  seller?: Address
): Order {
  let order = Order.load(orderHash.toHex())
  if (order == null) order = createOrder(orderHash, token, tokenId, seller)
  return order as Order
}
