import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import { Account, Bid, Order, Sale } from '../../generated/schema';
import { fetchERC1155Token, fetchERC721Token } from '../fetch/token';
import { fetchERC1155, fetchERC721 } from '../fetch/factory';
import { fetchAccount } from '../fetch/account';
import { fetchOrder } from '../fetch/order';
import {
  ERC721Marketplace,
  ERC721Marketplace__orderInfoResult as OrderInfo721,
} from '../../generated/ERC721Marketplace/ERC721Marketplace';
import { ethereum } from '@graphprotocol/graph-ts';
import { integer, decimal, DEFAULT_DECIMALS, ZERO_ADDRESS } from '@protofire/subgraph-toolkit'
import {
  ERC1155Marketplace,
  ERC1155Marketplace__orderInfoResult as OrderInfo1155
} from '../../generated/ERC1155Marketplace/ERC1155Marketplace';

export function createOrder(
  tokenStandard: String,
  orderHash: Bytes,
  tokenId: BigInt,
  quantity: BigInt | null,
  sellerAddress: Address,
  contractAddress: Address,
  marketplaceAddress: Address,
  block: ethereum.Block
): Order {
  if (tokenStandard == '721') {
    let marketplace721interface = ERC721Marketplace.bind(Address.fromBytes(marketplaceAddress))
    let try_orderInfo = marketplace721interface.try_orderInfo(orderHash)
    let orderInfo: OrderInfo721 = try_orderInfo.value
    let order = new Order(orderHash.toHex())
    if (orderInfo) {
      let seller = fetchAccount(sellerAddress)
      order.hash = orderHash
      order.type = orderInfo.getOrderType()
      order.endPrice = orderInfo.getEndPrice()
      order.endTime = orderInfo.getEndTime()
      order.startPrice = orderInfo.getStartPrice()
      order.startTime = orderInfo.getStartTime()
      order.canceled = false
      order.seller = seller.id
      let contract = fetchERC721(contractAddress)
      let token = fetchERC721Token(contract, sellerAddress, tokenId, block.timestamp)
      order.ERC721token = token.id
      order.ERC721contract = contract.id
      token.order = order.id
      token.timestamp = block.timestamp
      token.save()
    }
    order.save()
    return order as Order
  } else {
    let marketplace1155interface = ERC1155Marketplace.bind(Address.fromBytes(marketplaceAddress))
    let try_orderInfo = marketplace1155interface.try_orderInfo(orderHash)
    let orderInfo: OrderInfo1155 = try_orderInfo.value
    let order = new Order(orderHash.toHex())
    if (orderInfo) {
      let seller = fetchAccount(sellerAddress)
      order.hash = orderHash
      order.type = orderInfo.getOrderType()
      order.endPrice = orderInfo.getEndPrice()
      order.endTime = orderInfo.getEndTime()
      order.startPrice = orderInfo.getStartPrice()
      order.startTime = orderInfo.getStartTime()
      order.quantity = quantity as BigInt
      order.canceled = false
      order.seller = seller.id
      let contract = fetchERC1155(contractAddress)
      let token = fetchERC1155Token(contract, tokenId, null)
      order.ERC1155token = token.id
      order.ERC1155contract = contract.id
      token.order = order.id
      token.timestamp = block.timestamp
      token.save()
    }
    order.save()
    return order as Order
  }
}

export function createSale(
  tokenStandard: String,
  orderHash: Bytes,
  tokenId: BigInt,
  takerAddress: Address,
  contractAddress: Address,
  marketplaceAddress: Address,
  price: BigInt,
  block?: ethereum.Block
): Sale {
  let order = fetchOrder(orderHash)
  let taker = fetchAccount(takerAddress)
  let sale = new Sale(orderHash.toHexString().concat('/').concat(takerAddress.toHexString()))
  sale.price = price
  sale.order = order.id
  sale.save()
  order.sale = sale.id
  order.taker = taker.id
  order.save()
  if (tokenStandard == '721') {
    let contract = fetchERC721(contractAddress)
    let token = fetchERC721Token(contract, takerAddress, tokenId, block.timestamp)
    token.timestamp = block.timestamp
    token.lastPrice = price
    token.order = null
    // Set the volume counts
    let amount = decimal.max(
      decimal.ZERO,
      decimal.fromBigInt(price, DEFAULT_DECIMALS)
    )
    token.volume = (token.volume > 0 ? token.volume + 1 : 1)
    token.volumePrice = token.volumePrice + amount
    token.save()
    contract.volume = (contract.volume > 0 ? contract.volume + 1 : 1)
    contract.volumePrice = contract.volumePrice + amount
    contract.save()
    let ownerAccount = Account.load(contract.owner as Bytes) as Account
    ownerAccount.volume = (ownerAccount.volume > 0 ? ownerAccount.volume + 1 : 1)
    ownerAccount.volumePrice = ownerAccount.volumePrice + amount
    ownerAccount.save()
  } else {
    let contract = fetchERC1155(contractAddress)
    let token = fetchERC1155Token(contract, tokenId, null)
    token.timestamp = block.timestamp
    token.lastPrice = price
    // Set the volume counts
    let amount = decimal.max(
      decimal.ZERO,
      decimal.fromBigInt(price, DEFAULT_DECIMALS)
    )
    token.volume = (token.volume > 0 ? token.volume + 1 : 1)
    token.volumePrice = token.volumePrice + amount
    token.save()
    contract.volume = (contract.volume > 0 ? contract.volume + 1 : 1)
    contract.volumePrice = contract.volumePrice + amount
    contract.save()
    let ownerAccount = Account.load(contract.owner as Bytes) as Account
    ownerAccount.volume = (ownerAccount.volume > 0 ? ownerAccount.volume + 1 : 1)
    ownerAccount.volumePrice = ownerAccount.volumePrice + amount
    ownerAccount.save()
  }
  return sale as Sale
}

export function createBid(
  orderHash: Bytes,
  tokenId: BigInt,
  price: BigInt,
  bidderAddress: Address,
  contractAddress: Address,
  block: ethereum.Block
): Bid {
  let order = fetchOrder(orderHash)
  let bidder = fetchAccount(bidderAddress)
  let bid = new Bid(orderHash.toHexString().concat('/').concat(bidderAddress.toHexString()))
  bid.price = price
  bid.order = order.id
  bid.owner = bidder.id
  bid.save()

  // @todo update token price / volume counters after we confirm the token.id parameter

  return bid as Bid
}
