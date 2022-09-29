import { Address } from '@graphprotocol/graph-ts/index';
import { Account } from '../../generated/schema';

export function createAccount(address: Address): Account {
  let account = new Account(address)
  account.save()
  return account
}
