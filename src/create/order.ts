import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts/index';
import {
  Account,
  Bid,
  ERC1155Contract,
  ERC1155Token,
  ERC721Contract,
  ERC721Token,
  Order,
  Sale,
} from '../../generated/schema';
import { fetchERC1155Token, fetchERC721Token } from '../fetch/token';
import { fetchERC1155, fetchERC721 } from '../fetch/factory';
import { fetchAccount } from '../fetch/account';
import { fetchOrder } from '../fetch/order';
import {
  ERC721Marketplace,
  ERC721Marketplace__orderInfoResult as OrderInfo721,
} from '../../generated/ERC721Marketplace/ERC721Marketplace';
import { ethereum } from '@graphprotocol/graph-ts';
import {
  ERC1155Marketplace,
  ERC1155Marketplace__orderInfoResult as OrderInfo1155
} from '../../generated/ERC1155Marketplace/ERC1155Marketplace';
import { constants, decimals } from '@amxx/graphprotocol-utils/index';

export function createOrder(
  version: String,
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
      order.version = version.toString()
      order.type = orderInfo.value9
      order.quantity = constants.BIGINT_ONE
      order.hash = orderHash
      order.endTime = orderInfo.value4
      order.startTime = orderInfo.value3
      order.startPrice = decimals.toDecimals(orderInfo.value1)
      order.startPriceExact = orderInfo.value1
      order.endPrice = decimals.toDecimals(orderInfo.value2)
      order.endPriceExact = orderInfo.value2
      order.bidPrice = constants.BIGDECIMAL_ZERO
      order.bidPriceExact = constants.BIGINT_ZERO
      order.timestamp = block.timestamp
      order.created = block.timestamp
      order.canceled = false
      order.seller = seller.id
      let contract = fetchERC721(contractAddress)
      let token = fetchERC721Token(contract, sellerAddress, tokenId, block.timestamp, sellerAddress)
      order.ERC721token = token.id
      order.ERC721contract = contract.id
      token.timestamp = block.timestamp
      token.save()
      contract.timestamp = block.timestamp
      contract.save()
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
      order.version = version.toString()
      order.type = orderInfo.value10
      order.hash = orderHash
      order.quantity = quantity as BigInt
      order.endTime = orderInfo.value5
      order.startTime = orderInfo.value4
      order.startPrice = decimals.toDecimals(orderInfo.value2)
      order.startPriceExact = orderInfo.value2
      order.endPrice = decimals.toDecimals(orderInfo.value3)
      order.endPriceExact = orderInfo.value3
      order.bidPrice = constants.BIGDECIMAL_ZERO
      order.bidPriceExact = constants.BIGINT_ZERO
      order.canceled = false
      order.timestamp = block.timestamp
      order.created = block.timestamp
      order.seller = seller.id
      let contract = fetchERC1155(contractAddress, block.timestamp)
      let token = fetchERC1155Token(contract, tokenId, block.timestamp, seller.id)
      order.ERC1155token = token.id
      order.ERC1155contract = contract.id
      token.timestamp = block.timestamp
      token.save()
      contract.timestamp = block.timestamp
      contract.save()
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
  sale.price = decimals.toDecimals(price)
  sale.priceExact = price
  sale.order = order.id
  sale.created = block.timestamp
  sale.save()
  order.timestamp = block.timestamp
  order.sale = sale.id
  order.taker = taker.id
  order.save()
  if (tokenStandard == '721') {
    let contract = fetchERC721(contractAddress)
    let token = fetchERC721Token(contract, takerAddress, tokenId, block.timestamp, takerAddress)
    token.timestamp = block.timestamp
    token.lastPrice = decimals.toDecimals(price)
    token.lastPriceExact = price
    // Set the volume counts
    token.volume = (token.volume > 0 ? token.volume + 1 : 1)
    token.volumePrice = token.volumePrice.plus(decimals.toDecimals(price))
    token.volumePriceExact = token.volumePriceExact.plus(price)
    token.save()
    contract.timestamp = block.timestamp
    contract.volume = (contract.volume > 0 ? contract.volume + 1 : 1)
    contract.volumePrice = contract.volumePrice.plus(decimals.toDecimals(price))
    contract.volumePriceExact = contract.volumePriceExact.plus(price)
    contract.save()
    let ownerAccount = Account.load(contract.owner as Bytes) as Account
    ownerAccount.volume = (ownerAccount.volume > 0 ? ownerAccount.volume + 1 : 1)
    ownerAccount.volumePrice = ownerAccount.volumePrice.plus(decimals.toDecimals(price))
    ownerAccount.volumePriceExact = ownerAccount.volumePriceExact.plus(price)
    ownerAccount.save()
  } else {
    let contract = fetchERC1155(contractAddress, block.timestamp)
    let token = fetchERC1155Token(contract, tokenId, block.timestamp, takerAddress)
    token.timestamp = block.timestamp
    token.lastPrice = decimals.toDecimals(price)
    token.lastPriceExact = price
    // Set the volume counts
    token.volume = (token.volume > 0 ? token.volume + 1 : 1)
    token.volumePrice = token.volumePrice.plus(decimals.toDecimals(price))
    token.volumePriceExact = token.volumePriceExact.plus(price)
    token.save()
    contract.timestamp = block.timestamp
    contract.volume = (contract.volume > 0 ? contract.volume + 1 : 1)
    contract.volumePrice = contract.volumePrice.plus(decimals.toDecimals(price))
    contract.volumePriceExact = contract.volumePriceExact.plus(price)
    contract.save()
    let ownerAccount = Account.load(contract.owner as Bytes) as Account
    ownerAccount.volume = (ownerAccount.volume > 0 ? ownerAccount.volume + 1 : 1)
    ownerAccount.volumePrice = ownerAccount.volumePrice.plus(decimals.toDecimals(price))
    ownerAccount.volumePriceExact = ownerAccount.volumePriceExact.plus(price)
    ownerAccount.save()
  }
  return sale as Sale
}

export function createBid(
  tokenStandard: String,
  orderHash: Bytes,
  tokenId: BigInt,
  price: BigInt,
  bidderAddress: Address,
  contractAddress: Address,
  block: ethereum.Block
): Bid {
  let order = fetchOrder(orderHash)
  let bidder = fetchAccount(bidderAddress)
  let bid = new Bid(orderHash.toHexString().concat('/').concat(bidderAddress.toHexString()).concat(price.toString()))
  bid.price = decimals.toDecimals(price)
  bid.priceExact = price
  bid.order = order.id
  bid.owner = bidder.id
  bid.timestamp = block.timestamp
  bid.created = block.timestamp
  bid.save()
  order.bidPrice = decimals.toDecimals(price)
  order.bidPriceExact = price
  order.timestamp = block.timestamp
  order.save()
  if (tokenStandard === '721') {
    let contract = fetchERC721(contractAddress)
    contract.timestamp = block.timestamp
    contract.save()
    let token = ERC721Token.load(order.ERC721token as string) as ERC721Token
    token.timestamp = block.timestamp
    token.save()
  } else {
    let contract = fetchERC1155(contractAddress, block.timestamp)
    contract.timestamp = block.timestamp
    contract.save()
    let token = ERC1155Token.load(order.ERC1155token as string) as ERC1155Token
    token.timestamp = block.timestamp
    token.save()
  }
  return bid as Bid
}

export function cancelSale(
  tokenStandard: String,
  orderHash: Bytes,
  contractAddress: Address,
  block?: ethereum.Block
): Order {
  let order = fetchOrder(orderHash)
  order.canceled = true
  order.save()
  if (tokenStandard == '721') {
    let contract = ERC721Contract.load(contractAddress) as ERC721Contract
    contract.timestamp = block.timestamp
    contract.save()
    let token = ERC721Token.load(order.ERC721token as string) as ERC721Token
    token.timestamp = block.timestamp
    token.save()
  } else {
    let contract = ERC1155Contract.load(contractAddress) as ERC1155Contract
    contract.timestamp = block.timestamp
    contract.save()
    let token = ERC1155Token.load(order.ERC1155token as string) as ERC1155Token
    token.timestamp = block.timestamp
    token.save()
  }
  return order as Order
}
