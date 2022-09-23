import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';
import { fetchAccount } from '../fetch/account';
import { fetchSplitter } from '../fetch/factory';
import { ERC721Basic } from '../../generated/templates';
import { ERC1155Basic } from '../../generated/templates';

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
  let splitter = fetchSplitter(splitterAddress)
  if (standard === '721') {
    // Create the indexing for the new contract address
    ERC721Basic.create(contractAddress)
    // Create the entity
    let contract = new ERC721Contract(contractAddress)
    contract.timestamp = timestamp
    contract.splitter = splitter.id
    contract.type = contractType
    contract.publicMintState = false
    contract.paused = false
    contract.owner = creatorAccount.id
    contract.baseUri = 'ipfs://'
    contract.name = name
    contract.symbol = symbol
    contract.maxSupply = maxSupply
    contract.mintPrice = mintPrice
    contract.royalties = royalties
    contract.volume = 0
    contract.royaltyRecipient = creatorAccount.id
    contract.save()
    contractAccount.asERC721 = contractAddress
    contractAccount.save()
  } else {
    // Create the indexing for the new contract address
    ERC1155Basic.create(contractAddress)
    // Create the entity
    let contract = new ERC1155Contract(contractAddress)
    contract.timestamp = timestamp
    contract.splitter = splitter.id
    contract.type = contractType
    contract.publicMintState = false
    contract.paused = false
    contract.owner = creatorAccount.id
    contract.baseUri = 'ipfs://'
    contract.name = name
    contract.symbol = symbol
    contract.maxSupply = maxSupply
    contract.mintPrice = mintPrice
    contract.royalties = royalties
    contract.volume = 0
    contract.royaltyRecipient = creatorAccount.id
    contract.save()
    contractAccount.asERC1155 = contractAddress
    contractAccount.save()
  }
}
