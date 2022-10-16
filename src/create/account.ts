import { Address } from '@graphprotocol/graph-ts/index';
import { Account } from '../../generated/schema';
import { decimal } from '@protofire/subgraph-toolkit/index';

export function createAccount(address: Address): Account {
  let account = new Account(address)
  account.volume = 0
  account.volumePrice = decimal.ZERO
  account.save()
  return account
}
