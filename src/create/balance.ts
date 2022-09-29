import { Account, ERC1155Balance, ERC1155Token } from '../../generated/schema';
import { constants } from '@amxx/graphprotocol-utils/index';

export function createERC1155Balance(
  token: ERC1155Token,
  account: Account | null
): ERC1155Balance {
  let id = token.id.concat('/').concat(account ? account.id.toHex() : 'totalSupply')
  let balance = new ERC1155Balance(id)
  balance.contract = token.contract
  balance.token = token.id
  balance.account = account ? account.id : null
  balance.value = constants.BIGDECIMAL_ZERO
  balance.valueExact = constants.BIGINT_ZERO
  balance.save()
  return balance as ERC1155Balance
}
