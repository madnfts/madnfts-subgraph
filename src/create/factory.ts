import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';
import { fetchAccount } from '../fetch/account';
import { ERC721Basic as ERC721 } from '../../generated/templates/ERC721/ERC721Basic';
import { ERC1155Basic as ERC1155 } from '../../generated/templates/ERC1155/ERC1155Basic';

export function createSplitter(
  contractAddress: Address,
  ownerAddress: Address,
  payees: Address[],
  percents: BigInt[]
): void {
  let splitter = new Splitter(contractAddress.toString())
  // @todo unable to match these types
  // splitter.payees = payees
  splitter.percents = percents
  splitter.owner = ownerAddress
  splitter.save()
}

export function createContract(
  contractAddress: Address,
  splitterAddress: Address,
  creatorAddress: Address,
  contractType: string,
  timestamp: BigInt,
  standard: string
): void {
  let creatorAccount = fetchAccount(creatorAddress)
  let contractAccount = fetchAccount(contractAddress)
  if (standard === '721') {
    let contract = new ERC721Contract(contractAddress)
    let contractInterface = ERC721.bind(contractAddress)
    contract.timestamp = timestamp
    contract.splitter = splitterAddress.toString()
    contract.type = contractType
    contract.publicMintState = false
    contract.paused = false
    contract.owner = creatorAccount.id
    contract.baseUri = contractInterface.try_getBaseURI().reverted ? '' : contractInterface.try_getBaseURI().value
    contract.name = contractInterface.try_name().reverted ? '' : contractInterface.try_name().value
    contract.symbol = contractInterface.try_symbol().reverted ? '' : contractInterface.try_symbol().value
    contract.save()
    contractAccount.asERC721 = contractAddress
    contractAccount.save()
  } else {
    let contract = new ERC1155Contract(contractAddress)
    let contractInterface = ERC1155.bind(contractAddress)
    contract.timestamp = timestamp
    contract.splitter = splitterAddress.toString()
    contract.type = contractType
    contract.publicMintState = false
    contract.owner = creatorAccount.id
    contract.baseUri = contractInterface.try_getURI().reverted ? '' : contractInterface.try_getURI().value
    contractAccount.asERC1155 = contractAddress
    contractAccount.save()
  }
}
