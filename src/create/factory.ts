import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';
import { fetchAccount } from '../fetch/account';
import { ERC721Basic as ERC721 } from '../../generated/templates/ERC721/ERC721Basic';
import { ERC1155Basic as ERC1155 } from '../../generated/templates/ERC1155/ERC1155Basic';
import { fetchSplitter } from '../fetch/factory';
import { Bytes } from '@graphprotocol/graph-ts';

export function createSplitter(
  contractAddress: Address,
  ownerAddress: Address,
  payees: Address[],
  percents: BigInt[]
): void {
  let splitter = new Splitter(contractAddress)
  let payeesFormatted: string[] = []
  for (let i = 0; i < payees.length; ++i) {
    payeesFormatted.push(payees[i].toHexString())
  }
  splitter.payees = payeesFormatted
  splitter.percents = percents
  splitter.owner = ownerAddress
  splitter.save()
}

export function createContract(
  contractAddress: Address,
  splitterAddress: Address,
  creatorAddress: Address,
  timestamp: BigInt,
  contractType: string,
  standard: string,
  name: string,
  symbol: string,
  maxSupply: BigInt,
  mintPrice: BigInt,
  royalties: BigInt
): void {
  let creatorAccount = fetchAccount(creatorAddress)
  let contractAccount = fetchAccount(contractAddress)
  if (standard === '721') {
    let contract = new ERC721Contract(contractAddress)
    let contractInterface = ERC721.bind(contractAddress)
    let splitter = fetchSplitter(splitterAddress)
    contract.timestamp = timestamp
    contract.splitter = splitter.id
    contract.type = contractType
    contract.publicMintState = false
    contract.paused = false
    contract.owner = creatorAccount.id
    contract.baseUri = contractInterface.try_getBaseURI().reverted ? '' : contractInterface.try_getBaseURI().value
    contract.name = name
    contract.symbol = symbol
    contract.maxSupply = maxSupply
    contract.mintPrice = mintPrice
    contract.royalties = royalties
    contract.save()
    contractAccount.asERC721 = contractAddress
    contractAccount.save()
  } else {
    let contract = new ERC1155Contract(contractAddress)
    let contractInterface = ERC1155.bind(contractAddress)
    let splitter = fetchSplitter(splitterAddress)
    contract.timestamp = timestamp
    contract.splitter = splitter.id
    contract.type = contractType
    contract.publicMintState = false
    contract.owner = creatorAccount.id
    contract.baseUri = contractInterface.try_getURI().reverted ? '' : contractInterface.try_getURI().value
    contract.name = name
    contract.symbol = symbol
    contract.maxSupply = maxSupply
    contract.mintPrice = mintPrice
    contract.royalties = royalties
    contractAccount.asERC1155 = contractAddress
    contractAccount.save()
  }
}
