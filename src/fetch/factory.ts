import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract } from '../../generated/schema';

export function fetchERC721(
  address: Address,
  timestamp: BigInt | null
): ERC721Contract {
  let contract = ERC721Contract.load(address) as ERC721Contract
  if (timestamp) {
    contract.timestamp = timestamp
    contract.save()
  }
  return contract as ERC721Contract
}

export function fetchERC1155(
  address: Address,
  timestamp: BigInt | null
): ERC1155Contract {
  let contract = ERC1155Contract.load(address) as ERC1155Contract
  if (timestamp) {
    contract.timestamp = timestamp
    contract.save()
  }
  return contract as ERC1155Contract
}
