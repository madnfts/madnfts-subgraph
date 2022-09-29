import { Account, ERC1155Contract, ERC1155Operator, ERC721Contract, ERC721Operator } from '../../generated/schema';
import { createERC1155Operator, createERC721Operator } from '../create/operator';

export function fetchERC721Operator(
  contract: ERC721Contract,
  owner: Account,
  operator: Account,
): ERC721Operator {
  let op = ERC721Operator.load(contract.id.toHex()
    .concat('/').concat(owner.id.toHex())
    .concat('/').concat(operator.id.toHex())
  )
  if (op == null) op = createERC721Operator(contract, owner, operator)
  return op as ERC721Operator
}

export function fetchERC1155Operator(
  contract: ERC1155Contract,
  owner: Account,
  operator: Account
): ERC1155Operator {
  let op = ERC1155Operator.load(contract.id.toHex()
    .concat('/').concat(owner.id.toHex())
    .concat('/').concat(operator.id.toHex())
  )
  if (op == null) op = createERC1155Operator(contract, owner, operator)
  return op as ERC1155Operator
}
