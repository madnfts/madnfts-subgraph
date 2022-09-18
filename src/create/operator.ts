import {
  Account,
  ERC1155Contract,
  ERC1155Operator,
  ERC721Contract,
  ERC721Operator,
} from '../../generated/schema';

export function createERC721Operator(
  contract: ERC721Contract,
  owner: Account,
  operator: Account,
): ERC721Operator {
  let id = contract.id.toHex()
    .concat('/')
    .concat(owner.id.toHex())
    .concat('/')
    .concat(operator.id.toHex())
  let op = new ERC721Operator(id)
  op.contract = contract.id
  op.owner = owner.id
  op.operator = operator.id
  return op as ERC721Operator
}

export function createERC1155Operator(
  contract: ERC1155Contract,
  owner: Account,
  operator: Account
): ERC1155Operator {
  let id = contract.id.toHex()
    .concat('/')
    .concat(owner.id.toHex())
    .concat('/')
    .concat(operator.id.toHex())
  let op = new ERC1155Operator(id)
  op.contract = contract.id
  op.owner = owner.id
  op.operator = operator.id
  return op as ERC1155Operator
}
