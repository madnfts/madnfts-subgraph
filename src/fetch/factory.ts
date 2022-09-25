import { Address } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';

export function fetchERC721(
  address: Address
): ERC721Contract {
  return ERC721Contract.load(address) as ERC721Contract
}

export function fetchERC1155(
  address: Address
): ERC1155Contract {
  return ERC1155Contract.load(address) as ERC1155Contract
}

export function fetchSplitter(
  address: Address
): Splitter {
  return Splitter.load(address) as Splitter
}
