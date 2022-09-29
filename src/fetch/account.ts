import { Address } from '@graphprotocol/graph-ts'
import { Account } from '../../generated/schema'
import { createAccount } from '../create/account';

export function fetchAccount(address: Address): Account {
	let account = Account.load(address)
	if (account == null) account = createAccount(address)
	return account
}
