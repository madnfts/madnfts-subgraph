import { Address } from '@graphprotocol/graph-ts/index';
import { Account } from '../../generated/schema';
import { constants } from '@amxx/graphprotocol-utils/index';

export function createAccount(address: Address): Account {
  let account = new Account(address)
  account.volume = 0
  account.volumePrice = constants.BIGDECIMAL_ZERO
  account.volumePriceExact = constants.BIGINT_ZERO
  account.save()
  return account
}
