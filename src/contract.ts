import {
  Approval as ERC721ApprovalEvent,
  ApprovalForAll as ERC721ApprovalForAllEvent,
  BaseURISet as ERC721BaseURISetEvent,
  Transfer as ERC721TransferEvent,
} from '../generated/templates/ERC721/ERC721Basic';

import {
  ApprovalForAll as ERC1155ApprovalForAllEvent,
  BaseURISet as ERC1155BaseURISetEvent,
  TransferBatch as ERC1155TransferBatchEvent,
  TransferSingle as ERC1155TransferSingleEvent,
} from '../generated/templates/ERC1155/ERC1155Basic';

import { fetchAccount } from './fetch/account';
import { fetchERC1155, fetchERC721 } from './fetch/factory';
import { fetchERC721Token } from './fetch/token';
import { fetchERC721Operator } from './fetch/operator';
import { createERC1155Operator } from './create/operator';
import { createERC1155BatchTransfer, createERC1155SingleTransfer, createERC721Transfer } from './create/transfer';

// 721 Token events

export function handle721Approval(event: ERC721ApprovalEvent): void {
  let token = fetchERC721Token(fetchERC721(event.address, event.block.timestamp), event.params.id, event.block.timestamp)
  let owner = fetchAccount(event.params.owner)
  let approved = fetchAccount(event.params.spender)
  token.approved = approved.id
  token.owner = owner.id
  token.save()
}

export function handle721ApprovalForAll(event: ERC721ApprovalForAllEvent): void {
  let contract = fetchERC721(event.address, event.block.timestamp)
  let owner = fetchAccount(event.params.owner)
  let operator = fetchAccount(event.params.operator)
  let delegation = fetchERC721Operator(contract, owner, operator)
  delegation.approved = event.params.approved
  delegation.save()
}

export function handle721BaseURISet(event: ERC721BaseURISetEvent): void {
  let contract = fetchERC721(event.address, event.block.timestamp)
  contract.baseUri = event.params.newBaseURI.toString()
  contract.save()
}

export function handle721Transfer(event: ERC721TransferEvent): void {
  createERC721Transfer(event)
}

// 1155 Token events

export function handle1155ApprovalForAll(event: ERC1155ApprovalForAllEvent): void {
  let contract = fetchERC1155(event.address, event.block.timestamp)
  let owner = fetchAccount(event.params.owner)
  let operator = fetchAccount(event.params.operator)
  let delegation = createERC1155Operator(contract, owner, operator)
  delegation.approved = event.params.approved
  delegation.save()
}

export function handle1155BaseURISet(event: ERC1155BaseURISetEvent): void {
  let contract = fetchERC1155(event.address, event.block.timestamp)
  contract.baseUri = event.params.newBaseURI.toString()
  contract.save()
}

export function handle1155TransferBatch(event: ERC1155TransferBatchEvent): void {
  createERC1155BatchTransfer(event)
}

export function handle1155TransferSingle(event: ERC1155TransferSingleEvent): void {
  createERC1155SingleTransfer(event)
}
