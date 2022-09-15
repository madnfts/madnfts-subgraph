import {
  Address,
  BigInt,
  Bytes,
} from '@graphprotocol/graph-ts';

import {
  Account,
  ERC721Contract,
  ERC721Token,
  ERC721Operator,
} from '../../generated/schema';

import { ERC721 } from '../../generated/templates/ERC721/ERC721';

import { constants } from '@amxx/graphprotocol-utils';

import { fetchAccount } from './account';

import { supportsInterface } from './erc165';
import { fetchIpfsERC721 } from './ipfs';

export function fetchERC721(address: Address): ERC721Contract | null {
  return ERC721Contract.load(address);
}

export function fetchERC721Token(
  contract: ERC721Contract,
  identifier: BigInt,
): ERC721Token {
  let id = contract.id
    .toHex()
    .concat('/')
    .concat(identifier.toHex());
  let token = ERC721Token.load(id);

  if (token == null) {
    token = new ERC721Token(id);
    token.contract = contract.id;
    //token.identifier = identifier;
    //token.approval = fetchAccount(constants.ADDRESS_ZERO).id;

    // @todo - this fails with check contract.supportsMetadata
    if (contract) {
      let erc721 = ERC721.bind(Address.fromBytes(contract.id));
      let try_tokenURI = erc721.try_tokenURI(identifier);
      token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;
      if (token.uri) {
        fetchIpfsERC721(token, contract.id, contract.baseUri);
      }
    }
  }

  return token as ERC721Token;
}

export function fetchERC721Operator(
  contract: ERC721Contract,
  owner: Account,
  operator: Account,
): ERC721Operator {
  let id = contract.id
    .toHex()
    .concat('/')
    .concat(owner.id.toHex())
    .concat('/')
    .concat(operator.id.toHex());
  let op = ERC721Operator.load(id);

  if (op == null) {
    op = new ERC721Operator(id);
    op.contract = contract.id;
    op.owner = owner.id;
    op.operator = operator.id;
  }

  return op as ERC721Operator;
}
