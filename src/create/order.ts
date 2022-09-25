import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import { Bid, Block, Order, Sale } from '../../generated/schema';
import { fetchERC1155Token, fetchERC721Token } from '../fetch/token';
import { fetchERC1155, fetchERC721 } from '../fetch/factory';
import { fetchAccount } from '../fetch/account';
import { fetchOrder } from '../fetch/order';
import {
  ERC721Marketplace,
  ERC721Marketplace__orderInfoResult as OrderInfo,
} from '../../generated/ERC721Marketplace/ERC721Marketplace';

export function createOrder(
  tokenStandard: String,
  orderHash: Bytes,
  tokenId: BigInt,
  sellerAddress: Address,
  contractAddress: Address,
  marketplaceAddress: Address,
  block: Block
): Order {
  let marketplace721interface = ERC721Marketplace.bind(Address.fromBytes(marketplaceAddress))
  let try_orderInfo = marketplace721interface.try_orderInfo(orderHash)
  let orderInfo: OrderInfo = try_orderInfo.value
  let order = new Order(orderHash.toHex())
  if (orderInfo) {
    let seller = fetchAccount(sellerAddress)
    order.hash = orderHash
    order.type = orderInfo.getOrderType()
    order.price = orderInfo.getStartPrice()
    order.endPrice = orderInfo.getEndPrice()
    order.endBlock = orderInfo.getEndBlock()
    order.canceled = false
    order.seller = seller.id
    order.block = block.id
    if (tokenStandard == '721') {
      let contract = fetchERC721(contractAddress)
      let token = fetchERC721Token(contract, sellerAddress, tokenId, null)
      order.ERC721token = token.id
      order.ERC721contract = contract.id
      token.onSaleType = orderInfo.getOrderType()
      token.onSale = true
      token.price = orderInfo.getStartPrice()
      token.save()
    } else {
      let contract = fetchERC1155(contractAddress)
      let token = fetchERC1155Token(contract, tokenId, null)
      order.ERC1155token = token.id
      order.ERC1155contract = contract.id
      token.onSaleType = orderInfo.getOrderType()
      token.onSale = true
      token.price = orderInfo.getStartPrice()
      token.save()
    }
    order.save()
  }
  return order as Order
}

export function createSale(
  tokenStandard: String,
  orderHash: Bytes,
  tokenId: BigInt,
  takerAddress: Address,
  contractAddress: Address,
  marketplaceAddress: Address,
  price: BigInt,
  block?: Block
): Sale {
  let order = fetchOrder(orderHash)
  let taker = fetchAccount(takerAddress)
  let sale = new Sale(orderHash.toHexString().concat('/').concat(takerAddress.toHexString()))
  sale.price = price
  sale.block = block.id
  sale.order = order.id
  sale.save()
  order.sale = sale.id
  order.taker = taker.id
  order.save()
  if (tokenStandard == '721') {
    let contract = fetchERC721(contractAddress)
    let token = fetchERC721Token(contract, takerAddress, tokenId, null)
    token.onSaleType = 0
    token.onSale = false
    token.price = price
    token.lastPrice = price
    // Set the volume counts
    token.volume = (token.volume > 0 ? token.volume + 1 : 1)
    token.save()
    contract.volume = (contract.volume > 0 ? contract.volume + 1 : 1)
    contract.save()
  } else {
    let contract = fetchERC1155(contractAddress)
    let token = fetchERC1155Token(contract, tokenId, null)
    token.onSaleType = 0
    token.onSale = false
    token.price = price
    token.lastPrice = price
    // Set the volume counts
    token.volume = (token.volume > 0 ? token.volume + 1 : 1)
    token.save()
    contract.volume = (contract.volume > 0 ? contract.volume + 1 : 1)
    contract.save()
  }
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
