import {
	ERC721Contract,
	ERC1155Contract,
} from '../generated/schema'

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

import {
	ERC721 as ERC721ContractTemplate,
	ERC1155 as ERC1155ContractTemplate
} from '../generated/templates'

import { fetchAccount } from './fetch/account';

export function handle721SplitterCreated(event: ERC721SplitterCreated): void {
	// Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
}

export function handle721MinimalCreated(event: ERC721MinimalCreated): void {
	let address = event.params.newCollection
	let contract = ERC721Contract.load(address)
	if(!contract) {
		contract = new ERC721Contract(address)
		contract.type = 'Minimal'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC721ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC721 = address;
	account.save();
}

export function handle721BasicCreated(event: ERC721BasicCreated): void {
	let address = event.params.newCollection
	let contract = ERC721Contract.load(address)
	if(!contract) {
		contract = new ERC721Contract(address)
		contract.type = 'Basic'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC721ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC721 = address;
	account.save();
}

export function handle721WhitelistCreated(event: ERC721WhitelistCreated): void {
	let address = event.params.newCollection
	let contract = ERC721Contract.load(address)
	if(!contract) {
		contract = new ERC721Contract(address)
		contract.type = 'Whitelist'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC721ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC721 = address;
	account.save();
}

export function handle721LazyCreated(event: ERC721LazyCreated): void {
	let address = event.params.newCollection
	let contract = ERC721Contract.load(address)
	if(!contract) {
		contract = new ERC721Contract(address)
		contract.type = 'Lazy'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC721ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC721 = address;
	account.save();
}

export function handle1155SplitterCreated(event: ERC1155SplitterCreated): void {
	// Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
}

export function handle1155MinimalCreated(event: ERC1155MinimalCreated): void {
	let address = event.params.newCollection
	let contract = ERC1155Contract.load(address)
	if(!contract) {
		contract = new ERC1155Contract(address)
		contract.type = 'Minimal'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC1155ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC1155 = address;
	account.save();
}

export function handle1155BasicCreated(event: ERC1155BasicCreated): void {
	let address = event.params.newCollection
	let contract = ERC1155Contract.load(address)
	if(!contract) {
		contract = new ERC1155Contract(address)
		contract.type = 'Basic'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC1155ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC1155 = address;
	account.save();
}

export function handle1155WhitelistCreated(event: ERC1155WhitelistCreated): void {
	let address = event.params.newCollection
	let contract = ERC1155Contract.load(address)
	if(!contract) {
		contract = new ERC1155Contract(address)
		contract.type = 'Whitelist'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC1155ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC1155 = address;
	account.save();
}

export function handle1155LazyCreated(event: ERC1155LazyCreated): void {
	let address = event.params.newCollection
	let contract = ERC1155Contract.load(address)
	if(!contract) {
		contract = new ERC1155Contract(address)
		contract.type = 'Lazy'
		contract.timestamp = event.block.timestamp
		contract.baseUri = 'ipfs://'
	}
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC1155ContractTemplate.create(address)
  contract.save()

	let account = fetchAccount(address);
	account.asERC1155 = address;
	account.save();
}
