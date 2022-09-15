import {
  Address,
  BigInt,
} from '@graphprotocol/graph-ts';

import {
  Account,
  ERC721Contract,
  ERC721Token,
  ERC721Operator, ERC721Transfer,
} from '../../generated/schema';

import { ERC721, Transfer as TransferEvent } from '../../generated/templates/ERC721/ERC721';
import { fetchIpfsERC721 } from './ipfs';
import { fetchAccount } from './account';
import { events, transactions } from '@amxx/graphprotocol-utils/index';

// ERC721 Functions

export function fetchERC721(address: Address): ERC721Contract {
  let contract = ERC721Contract.load(address);
  if (contract == null) {
    contract = new ERC721Contract(address)
    contract.save()
  }
  return contract as ERC721Contract
}

export function fetchERC721Operator(
  contract: ERC721Contract,
  owner: Account,
  operator: Account,
): ERC721Operator {
  let id = contract.id.toHex()
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

export function fetchERC721Token(
  contract: ERC721Contract,
  tokenId: BigInt,
): ERC721Token {
  let id = contract.id
    .toHex()
    .concat('/')
    .concat(tokenId.toHex())
  let token = ERC721Token.load(id)
  if (token == null) {
    let erc721 = ERC721.bind(Address.fromBytes(contract.id))
    let try_tokenURI = erc721.try_tokenURI(tokenId)
    let try_name = erc721.try_name()
    let try_symbol = erc721.try_symbol()
    token = new ERC721Token(id)
    token.contract = contract.id
    token.tokenId = tokenId
    token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value
    token.name = try_name.reverted ? '' : try_name.value
    token.symbol = try_symbol.reverted ? '' : try_symbol.value
    if (token.uri) {
      fetchIpfsERC721(token, contract.id, contract.baseUri)
    }
    token.save()
  }
  return token as ERC721Token;
}

export function transferERC721Single(event: TransferEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchERC721Token(contract, event.params.tokenId);
    let from = fetchAccount(event.params.from);
    let to = fetchAccount(event.params.to);
    token.owner = to.id;
    token.timestamp = event.block.timestamp;
    contract.save();
    token.save();

    let ev = new ERC721Transfer(events.id(event));
    ev.emitter = contract.id;
    ev.transaction = transactions.log(event).id;
    ev.timestamp = event.block.timestamp;
    ev.contract = contract.id;
    ev.token = token.id;
    ev.from = from.id;
    ev.to = to.id;
    ev.save();
  }
}
