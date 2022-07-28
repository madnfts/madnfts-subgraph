import {
	ERC721Contract,
	ERC1155Contract,
} from '../generated/schema'

import {
	Create721MadNftProxy
} from '../generated/ERC721Factory/ERC721Factory'

import {
	Create1155MadNftProxy
} from '../generated/ERC1155Factory/ERC1155Factory'

import {
	ERC721 as ERC721ContractTemplate,
	ERC1155 as ERC1155ContractTemplate
} from '../generated/templates'

import { fetchAccount } from './fetch/account';

export function handle721Created(event: Create721MadNftProxy): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
	let address = event.params.proxy
	let contract = ERC721Contract.load(address)
	if(!contract) {
		contract = new ERC721Contract(address)
		contract.name = event.params.name.toString()
		contract.symbol = event.params.symbol.toString()
		contract.timestamp = event.block.timestamp
	}
	contract.asAccount = address
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC721ContractTemplate.create(address)
  // Entities can be written to the store with `.save()`
  contract.save()

	let account = fetchAccount(address);
	account.asERC721 = address;
	account.save();
}

export function handle1155Created(event: Create1155MadNftProxy): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
	let address = event.params.proxy
	let contract = ERC1155Contract.load(address)
	if(!contract) {
		contract = new ERC1155Contract(address)
		contract.name = event.params.name.toString()
		contract.symbol = event.params.symbol.toString()
		contract.timestamp = event.block.timestamp
	}
	contract.asAccount = address
	let from = fetchAccount(event.transaction.from);
	contract.owner = from.id

  ERC1155ContractTemplate.create(event.params.proxy)
  // Entities can be written to the store with `.save()`
  contract.save()

	let account        = fetchAccount(address)
	account.asERC1155  = address
	account.save()
}