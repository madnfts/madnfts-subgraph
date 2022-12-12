import { Address } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';
import { createDefaultContract1155 } from '../create/factory';
import { BigInt } from '@graphprotocol/graph-ts';

export function fetchERC721(
  address: Address
): ERC721Contract {
  return ERC721Contract.load(address) as ERC721Contract
}

export function fetchERC1155(
  address: Address,
  timestamp: BigInt
): ERC1155Contract {
  let contract = ERC1155Contract.load(address)
  if (contract == null) {
    contract = createDefaultContract1155(address, timestamp)
  }
  return contract as ERC1155Contract
}

export function fetchSplitter(
  address: Address
): Splitter {
  return Splitter.load(address) as Splitter
}
