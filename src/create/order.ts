import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import { Bid, Block, Order, Sale } from '../../generated/schema';
import { fetchERC1155Token, fetchERC721Token } from '../fetch/token';
import { fetchERC1155, fetchERC721 } from '../fetch/factory';
import { fetchAccount } from '../fetch/account';
import { fetchOrder } from '../fetch/order';

export function createOrder(
  orderHash: Bytes,
  orderType: i32,
  tokenStandard: String,
  quantity: i32,
  price: i32,
  endPrice: i32,
  endBlock: i32,
  tokenId: BigInt,
  sellerAddress: Address,
  contractAddress: Address,
  block: Block
): Order {
  let order = new Order(orderHash.toHex())
  let seller = fetchAccount(sellerAddress)
  order.hash = orderHash
  order.quantity = quantity
  order.price = price
  order.endPrice = endPrice
  order.endBlock = endBlock
  order.hash = orderHash
  order.canceled = false
  order.seller = seller.id
  order.block = block.id
  if (tokenStandard == '721') {
    let contract = fetchERC721(contractAddress, null)
    let token = fetchERC721Token(contract, sellerAddress, tokenId, null)
    order.ERC721token = token.id
    order.ERC721contract = contract.id
  } else {
    let contract = fetchERC1155(contractAddress, null)
    let token = fetchERC1155Token(contract, tokenId, null)
    order.ERC1155token = token.id
    order.ERC1155contract = contract.id
  }
  order.save()

  // @todo update token price / volume counters after we confirm the token.id and other parameters

  return order as Order
}

export function createSale(
  orderHash: Bytes,
  tokenId: BigInt,
  takerAddress: Address,
  price: BigInt,
  block?: Block
): Sale {
  let order = fetchOrder(orderHash)
  let taker = fetchAccount(takerAddress)
  let sale = new Sale(orderHash.toHexString().concat('/').concat(takerAddress.toHexString()))
  sale.price = price
  sale.block = block.id
  sale.save()
  order.sale = sale.id
  order.taker = taker.id
  order.save()

  // @todo update token price / volume counters after we confirm the token.id parameter

  return sale as Sale
}

export function createBid(
  orderHash: Bytes,
  tokenId: BigInt,
  price: BigInt,
  bidderAddress: Address,
  contractAddress: Address,
  block: Block
): Bid {
  let order = fetchOrder(orderHash)
  let bidder = fetchAccount(bidderAddress)
  let bid = new Bid(orderHash.toHexString().concat('/').concat(bidderAddress.toHexString()))
  bid.price = price
  bid.block = block.id
  bid.order = order.id
  bid.owner = bidder.id
  bid.save()

  // @todo update token price / volume counters after we confirm the token.id parameter

  return bid as Bid
}
