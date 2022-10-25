import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';
import { fetchAccount } from '../fetch/account';
import { fetchSplitter } from '../fetch/factory';
import { ERC721Basic as ERC721BasicTemplate } from '../../generated/templates/ERC721Basic/ERC721Basic';
import { ERC1155Basic as ERC1155BasicTemplate } from '../../generated/templates/ERC1155Basic/ERC1155Basic';
import { ERC721Basic } from '../../generated/templates';
import { ERC1155Basic } from '../../generated/templates';
import { decimal, DEFAULT_DECIMALS } from '@protofire/subgraph-toolkit/index';

export function createSplitter(
  contractAddress: Address,
  ownerAddress: Address,
  payees: Address[],
  percents: BigInt[],
  flag: BigInt
): void {
  let splitter = new Splitter(contractAddress)
  let payeesFormatted: string[] = []
  for (let i = 0; i < payees.length; ++i) {
    payeesFormatted.push(payees[i].toHexString())
  }
  splitter.payees = payeesFormatted
  splitter.percents = percents
  splitter.owner = ownerAddress
  splitter.flag = flag
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
  let mintPriceDecimal = decimal.max(
    decimal.ZERO,
    decimal.fromBigInt(mintPrice, DEFAULT_DECIMALS)
  )
  if (standard === '721') {
    let erc721interface = ERC721BasicTemplate.bind(Address.fromBytes(contractAddress))
    let try_baseUri = erc721interface.try_getBaseURI()
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
    contract.baseUri = try_baseUri.reverted ? 'mad://' : try_baseUri.value
    contract.name = name
    contract.symbol = symbol
    contract.maxSupply = maxSupply
    contract.mintPrice = mintPriceDecimal
    contract.royalties = royalties
    contract.volume = 0
    contract.volumePrice = decimal.ZERO
    contract.royaltyRecipient = creatorAccount.id
    contract.save()
    contractAccount.asERC721 = contractAddress
    contractAccount.save()
  } else {
    let erc1155interface = ERC1155BasicTemplate.bind(Address.fromBytes(contractAddress))
    let try_baseUri = erc1155interface.try_getURI()
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
    contract.baseUri = try_baseUri.reverted ? 'mad://' : try_baseUri.value
    contract.name = name
    contract.symbol = symbol
    contract.maxSupply = maxSupply
    contract.mintPrice = mintPriceDecimal
    contract.royalties = royalties
    contract.volume = 0
    contract.volumePrice = decimal.ZERO
    contract.royaltyRecipient = creatorAccount.id
    contract.save()
    contractAccount.asERC1155 = contractAddress
    contractAccount.save()
  }
}
