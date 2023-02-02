import { ERC1155Token, ERC721Token } from '../../generated/schema';
import { ERC721Basic } from '../../generated/templates/ERC721Basic/ERC721Basic';
import { ERC1155Basic } from '../../generated/templates/ERC1155Basic/ERC1155Basic';
import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { Bytes } from '@graphprotocol/graph-ts';
import { fetchAccount } from '../fetch/account';
import { constants } from '@amxx/graphprotocol-utils/index';

export function createERC721Token(
  ownerAddress: Address,
  contractAddress: Bytes,
  baseUri: String,
  tokenId: BigInt,
  timestamp: BigInt
): ERC721Token {
  let owner = fetchAccount(ownerAddress)
  let id = contractAddress.toHex().concat('/').concat(tokenId.toHex())
  let token = new ERC721Token(id)
  let erc721interface = ERC721Basic.bind(Address.fromBytes(contractAddress))
  let try_tokenURI = erc721interface.try_tokenURI(tokenId)
  let try_name = erc721interface.try_name()
  let try_symbol = erc721interface.try_symbol()
  token.tokenId = tokenId
  token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value
  token.name = try_name.reverted ? '' : try_name.value
  token.symbol = try_symbol.reverted ? '' : try_symbol.value
  token.lastPrice = constants.BIGDECIMAL_ZERO
  token.lastPriceExact = constants.BIGINT_ZERO
  token.volumePrice = constants.BIGDECIMAL_ZERO
  token.volumePriceExact = constants.BIGINT_ZERO
  token.volume = 0
  token.timestamp = timestamp
  token.created = timestamp
  token.owner = owner.id
  token.contract = contractAddress
  token.save()
  return token as ERC721Token;
}

export function createERC1155Token(
  contractAddress: Bytes,
  baseUri: String,
  tokenId: BigInt,
  timestamp: BigInt
): ERC1155Token {
  let id = contractAddress.toHex().concat('/').concat(tokenId.toHex())
  let token = new ERC1155Token(id)
  let erc1155interface = ERC1155Basic.bind(Address.fromBytes(contractAddress))
  let try_tokenURI = erc1155interface.try_uri(tokenId)
  token.tokenId = tokenId
  token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value
  token.lastPrice = constants.BIGDECIMAL_ZERO
  token.lastPriceExact = constants.BIGINT_ZERO
  token.volumePrice = constants.BIGDECIMAL_ZERO
  token.volumePriceExact = constants.BIGINT_ZERO
  token.volume = 0
  token.timestamp = timestamp
  token.created = timestamp
  token.contract = contractAddress
  token.save()
  return token as ERC1155Token;
}
