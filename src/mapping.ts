import { ethereum, BigInt } from '@graphprotocol/graph-ts';

import {
  Account,
  ERC721Transfer,
  ERC1155Contract,
  ERC1155Transfer,
  ERC721Token,
} from '../generated/schema';

import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent,
} from '../generated/templates/ERC721/ERC721';

import {
  ApprovalForAll as ApprovalForAllERC1155Event,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from '../generated/templates/ERC1155/ERC1155';

import {
  constants,
  decimals,
  events,
  transactions,
} from '@amxx/graphprotocol-utils';

import { fetchAccount } from './fetch/account';

import {
  fetchERC721,
  fetchERC721Token,
  fetchERC721Operator,
} from './fetch/erc721';

import {
  fetchERC1155,
  fetchERC1155Token,
  fetchERC1155Balance,
  fetchERC1155Operator,
  replaceURI,
} from './fetch/erc1155';




export function handleURI(event: URIEvent): void {
  let contract = fetchERC1155(event.address);
  let token = fetchERC1155Token(contract, event.params.id);
  token.timestamp = event.block.timestamp;
  token.uri = replaceURI(event.params.value, event.params.id);
  token.save();
}
