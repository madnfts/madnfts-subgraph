import { Account, ERC1155Balance, ERC1155Token } from '../../generated/schema';
import { createERC1155Balance } from '../create/balance';

export function fetchERC1155Balance(
  token: ERC1155Token,
  account: Account | null
): ERC1155Balance {
  let balance = ERC1155Balance.load(token.id.concat('/').concat(account ? account.id.toHex() : 'totalSupply'))
  if (balance == null) balance = createERC1155Balance(token, account)
  return balance as ERC1155Balance
}
