import { Address, BigInt } from '@graphprotocol/graph-ts/index';
import { ERC1155Contract, ERC721Contract, Splitter } from '../../generated/schema';
import { fetchAccount } from '../fetch/account';
import { fetchSplitter } from '../fetch/factory';
import { ERC721Basic as ERC721BasicTemplate } from '../../generated/templates/ERC721Basic/ERC721Basic';
import { ERC1155Basic as ERC1155BasicTemplate } from '../../generated/templates/ERC1155Basic/ERC1155Basic';
import { ERC721Basic } from '../../generated/templates';
import { ERC1155Basic } from '../../generated/templates';
import { constants, decimals } from '@amxx/graphprotocol-utils/index';

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
  version: string,
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
    let erc721interface = ERC721BasicTemplate.bind(Address.fromBytes(contractAddress))
    let try_baseUri = erc721interface.try_getBaseURI()
    // Create the indexing for the new contract address
    ERC721Basic.create(contractAddress)
    // Create the contract entity
    let contract = new ERC721Contract(contractAddress)
    contract.type = contractType
    contract.name = name
    contract.symbol = symbol
    contract.baseUri = try_baseUri.reverted ? 'mad://' : try_baseUri.value
    contract.maxSupply = maxSupply
    contract.royalties = royalties
    contract.mintPrice = decimals.toDecimals(mintPrice)
    contract.mintPriceExact = mintPrice
    contract.volumePrice = constants.BIGDECIMAL_ZERO
    contract.volumePriceExact = constants.BIGINT_ZERO
    contract.volume = 0
    contract.paused = false
    contract.publicMintState = false
    contract.version = version
    contract.timestamp = timestamp
    contract.owner = creatorAccount.id
    contract.splitter = splitter.id
    contract.royaltyRecipient = creatorAccount.id
    contract.save()
    // Save the contract account
    contractAccount.asERC721 = contractAddress
    contractAccount.save()
  } else {
    let erc1155interface = ERC1155BasicTemplate.bind(Address.fromBytes(contractAddress))
    let try_baseUri = erc1155interface.try_getURI()
    // Init template indexing for the new contract address
    ERC1155Basic.create(contractAddress)
    // Create the entity
    let contract = new ERC1155Contract(contractAddress)
    contract.type = contractType
    contract.name = name
    contract.symbol = symbol
    contract.baseUri = try_baseUri.reverted ? 'mad://' : try_baseUri.value
    contract.maxSupply = maxSupply
    contract.royalties = royalties
    contract.mintPrice = decimals.toDecimals(mintPrice)
    contract.mintPriceExact = mintPrice
    contract.volumePrice = constants.BIGDECIMAL_ZERO
    contract.volumePriceExact = constants.BIGINT_ZERO
    contract.volume = 0
    contract.paused = false
    contract.publicMintState = false
    contract.version = version
    contract.timestamp = timestamp
    contract.owner = creatorAccount.id
    contract.splitter = splitter.id
    contract.royaltyRecipient = creatorAccount.id
    contract.save()
    // Save the contract account
    contractAccount.asERC1155 = contractAddress
    contractAccount.save()
  }
}

export function createDefaultContract1155(
  contractAddress: Address,
  timestamp: BigInt
): ERC1155Contract {
  let erc1155interface = ERC1155BasicTemplate.bind(Address.fromBytes(contractAddress))
  const try_baseUri = erc1155interface.try_getURI()
  const try_owner = erc1155interface.try_owner()
  const try_maxSupply = erc1155interface.try_maxSupply()
  const baseUri = try_baseUri.reverted ? 'ipfs://' : try_baseUri.value
  const owner = try_owner.reverted ? contractAddress : try_owner.value
  const maxSupply = try_maxSupply.reverted ? BigInt.fromI32(1) : try_maxSupply.value
  // Create the indexing for the new contract address
  ERC1155Basic.create(contractAddress)
  // Create the entities
  let creatorAccount = fetchAccount(owner)
  let contractAccount = fetchAccount(contractAddress)
  let contract = new ERC1155Contract(contractAddress)
  contract.type = '1' // Basic default
  contract.name = ''
  contract.symbol = ''
  contract.baseUri = baseUri
  contract.maxSupply = maxSupply
  contract.royalties = constants.BIGINT_ZERO
  contract.mintPrice = constants.BIGDECIMAL_ZERO
  contract.mintPriceExact = constants.BIGINT_ZERO
  contract.volumePrice = constants.BIGDECIMAL_ZERO
  contract.volumePriceExact = constants.BIGINT_ZERO
  contract.volume = 0
  contract.paused = false
  contract.publicMintState = false
  contract.version = 'external'
  contract.timestamp = timestamp
  contract.owner = creatorAccount.id
  contract.save()
  // Save the contract account
  contractAccount.asERC1155 = contractAddress
  contractAccount.save()
  return contract
}
