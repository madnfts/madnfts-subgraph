import { ERC1155Token, ERC721Token } from '../../generated/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC721Basic as ERC721 } from '../../generated/templates/ERC721/ERC721Basic';
import { ERC1155Basic as ERC1155 } from '../../generated/templates/ERC1155/ERC1155Basic';
import { fetchIpfsERC1155, fetchIpfsERC721 } from '../fetch/ipfs';
import { Bytes } from '@graphprotocol/graph-ts';

export function createERC721Token(
  contractAddress: Bytes,
  baseUri: String,
  tokenId: BigInt,
  timestamp: BigInt | null
): ERC721Token {
  let id = contractAddress.toHex().concat('/').concat(tokenId.toHex())
  let token = new ERC721Token(id)
  let erc721interface = ERC721.bind(Address.fromBytes(contractAddress))
  let try_tokenURI = erc721interface.try_tokenURI(tokenId)
  token.contract = contractAddress
  token.tokenId = tokenId
  token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value
  token.timestamp = timestamp
  if (token.uri) {
    fetchIpfsERC721(token, contractAddress, baseUri.toString())
  }
  token.save()
  return token as ERC721Token;
}

export function createERC1155Token(
  contractAddress: Bytes,
  baseUri: String,
  tokenId: BigInt,
  timestamp: BigInt | null
): ERC1155Token {
  let id = contractAddress.toHex().concat('/').concat(tokenId.toHex())
  let token = new ERC1155Token(id)
  let erc1155interface = ERC1155.bind(Address.fromBytes(contractAddress))
  let try_uri = erc1155interface.try_uri(tokenId)
  token.contract = contractAddress
  token.tokenId = tokenId
  token.uri = try_uri.reverted ? '' : try_uri.value
  token.timestamp = timestamp
  if (token.uri) {
    fetchIpfsERC1155(token, contractAddress, baseUri.toString())
  }
  token.save()
  return token as ERC1155Token;
}
