import { ERC1155Contract, ERC1155Token, ERC721Contract, ERC721Token } from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts/index';
import { createERC1155Token, createERC721Token } from '../create/token';
import { Address } from '@graphprotocol/graph-ts';

export function fetchERC721Token(
  contract: ERC721Contract,
  ownerAddress: Address,
  tokenId: BigInt,
  timestamp: BigInt | null
): ERC721Token {
  let token = ERC721Token.load(contract.id.toHex().concat('/').concat(tokenId.toHex()))
  if (token == null) token = createERC721Token(ownerAddress, contract.id, contract.baseUri, tokenId, timestamp)
  return token as ERC721Token
}

export function fetchERC1155Token(
  contract: ERC1155Contract,
  tokenId: BigInt,
  timestamp: BigInt | null
): ERC1155Token {
  let token = ERC1155Token.load(contract.id.toHex().concat('/').concat(tokenId.toHex()))
  if (token == null) token = createERC1155Token(contract.id, contract.baseUri, tokenId, timestamp)
  return token as ERC1155Token
}




