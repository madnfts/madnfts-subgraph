import {
	Splitter,
	ERC721Contract,
	ERC1155Contract,
	Account,
} from '../generated/schema';
import {
	SplitterCreated as ERC721SplitterCreated,
	ERC721MinimalCreated,
	ERC721BasicCreated,
	ERC721WhitelistCreated,
	ERC721LazyCreated,
} from '../generated/ERC721Factory/ERC721Factory'
import {
	SplitterCreated as ERC1155SplitterCreated,
	ERC1155MinimalCreated,
	ERC1155BasicCreated,
	ERC1155WhitelistCreated,
	ERC1155LazyCreated,
} from '../generated/ERC1155Factory/ERC1155Factory'
import { fetchAccount } from './fetch/account';
import { ERC721 } from '../generated/templates/ERC721/ERC721';
import { ERC1155 } from '../generated/templates/ERC1155/ERC1155';
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';

export function handle721MinimalCreated(event: ERC721MinimalCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create721Contract(
		event.params.newCollection,
		'Minimal',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle721BasicCreated(event: ERC721BasicCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create721Contract(
		event.params.newCollection,
		'Basic',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle721WhitelistCreated(event: ERC721WhitelistCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create721Contract(
		event.params.newCollection,
		'Whitelist',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle721LazyCreated(event: ERC721LazyCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create721Contract(
		event.params.newCollection,
		'Lazy',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle721SplitterCreated(event: ERC721SplitterCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.splitter)
	createSplitter(
		event.params.splitter,
		creatorAccount,
		contractAccount,
		event.params.payees,
		event.params.shares
	)
}

export function handle1155MinimalCreated(event: ERC1155MinimalCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create1155Contract(
		event.params.newCollection,
		'Minimal',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle1155BasicCreated(event: ERC1155BasicCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create1155Contract(
		event.params.newCollection,
		'Basic',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle1155WhitelistCreated(event: ERC1155WhitelistCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create1155Contract(
		event.params.newCollection,
		'Whitelist',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle1155LazyCreated(event: ERC1155LazyCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.newCollection)
	create1155Contract(
		event.params.newCollection,
		'Lazy',
		event.block.timestamp,
		creatorAccount,
		contractAccount
	)
}
export function handle1155SplitterCreated(event: ERC1155SplitterCreated): void {
	let creatorAccount = fetchAccount(event.transaction.from)
	let contractAccount = fetchAccount(event.params.splitter)
	createSplitter(
		event.params.splitter,
		creatorAccount,
		contractAccount,
		event.params.payees,
		event.params.shares
	)
}

export function createSplitter(
	contractAddress: Address,
	creatorAccount: Account,
	contractAccount: Account,
	payees: Address[],
	percents: BigInt[]
): Splitter {
	let splitter = new Splitter(contractAddress.toString())
	// @todo resolve payees type conflict
	//splitter.payees = payees
	splitter.percents = percents
	return splitter
}

export function create721Contract(
	contractAddress: Address,
	contractType: string,
	timestamp: BigInt,
	creatorAccount: Account,
	contractAccount: Account
): ERC721Contract {
	let contract = new ERC721Contract(contractAddress)
	let erc721 = ERC721.bind(contractAddress)
	let try_name = erc721.try_name()
	let try_symbol = erc721.try_symbol()
	let try_baseURI = erc721.try_baseURI()
	contract.type = contractType
	contract.owner = creatorAccount.id
	contract.baseUri = try_baseURI.reverted ? '' : try_baseURI.value
	contract.name = try_name.reverted ? '' : try_name.value
	contract.symbol = try_symbol.reverted ? '' : try_symbol.value
	contract.save()
	contractAccount.asERC721 = contractAddress
	contractAccount.save()
	return contract
}

export function create1155Contract(
	contractAddress: Address,
	contractType: string,
	timestamp: BigInt,
	creatorAccount: Account,
	contractAccount: Account
): ERC1155Contract {
	let contract = new ERC1155Contract(contractAddress)
	let erc1155 = ERC1155.bind(contractAddress)
	let try_name = erc1155.try_name()
	let try_symbol = erc1155.try_symbol()
	let try_baseURI = erc1155.try_baseURI()
	contract.type = contractType
	contract.owner = creatorAccount.id
	contract.baseUri = try_baseURI.reverted ? '' : try_baseURI.value
	contract.name = try_name.reverted ? '' : try_name.value
	contract.symbol = try_symbol.reverted ? '' : try_symbol.value
	contract.save()
	contractAccount.asERC1155 = contractAddress
	contractAccount.save()
	return contract
}
