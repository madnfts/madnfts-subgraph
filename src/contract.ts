import {
  Approval as ERC721ApprovalEvent,
  ApprovalForAll as ERC721ApprovalForAllEvent,
  BaseURISet as ERC721BaseURISetEvent,
  Transfer as ERC721TransferEvent,
  OwnerUpdated as ERC721OwnerUpdatedEvent,
  PublicMintStateSet as ERC721PublicMintStateSetEvent,
  RoyaltyFeeSet as ERC721RoyaltyFeeSetEvent,
  RoyaltyRecipientSet as ERC721RoyaltyRecipientSetEvent,
  ERC721Basic as ERC721BasicTemplate,
} from '../generated/templates/ERC721Basic/ERC721Basic';

import {
  ApprovalForAll as ERC1155ApprovalForAllEvent,
  BaseURISet as ERC1155BaseURISetEvent,
  TransferBatch as ERC1155TransferBatchEvent,
  TransferSingle as ERC1155TransferSingleEvent,
  OwnerUpdated as ERC1155OwnerUpdatedEvent,
  PublicMintStateSet as ERC1155PublicMintStateSetEvent,
  RoyaltyFeeSet as ERC1155RoyaltyFeeSetEvent,
  RoyaltyRecipientSet as ERC1155RoyaltyRecipientSetEvent,
  ERC1155Basic as ERC1155BasicTemplate,
} from '../generated/templates/ERC1155Basic/ERC1155Basic';

import { fetchAccount } from './fetch/account';
import { fetchERC1155, fetchERC721 } from './fetch/factory';
import { fetchERC721Token } from './fetch/token';
import { fetchERC721Operator } from './fetch/operator';
import { createERC1155Operator } from './create/operator';
import { createERC1155BatchTransfer, createERC1155SingleTransfer, createERC721Transfer } from './create/transfer';
import { Address } from '@graphprotocol/graph-ts/index';

// 721 Token events

export function handle721Approval(event: ERC721ApprovalEvent): void {
  let token = fetchERC721Token(fetchERC721(event.address), event.params.owner, event.params.id, event.block.timestamp, event.params.owner)
  let owner = fetchAccount(event.params.owner)
  let approved = fetchAccount(event.params.spender)
  token.approved = approved.id
  token.owner = owner.id
  token.save()
}

export function handle721ApprovalForAll(event: ERC721ApprovalForAllEvent): void {
  let contract = fetchERC721(event.address)
  let owner = fetchAccount(event.params.owner)
  let operator = fetchAccount(event.params.operator)
  let delegation = fetchERC721Operator(contract, owner, operator)
  delegation.approved = event.params.approved
  delegation.save()
}

export function handle721BaseURISet(event: ERC721BaseURISetEvent): void {
  let contract = fetchERC721(event.address)
  let erc721interface = ERC721BasicTemplate.bind(Address.fromBytes(event.address))
  let try_baseUri = erc721interface.try_getBaseURI()
  contract.baseUri = try_baseUri.value
  contract.save()
}

export function handle721Transfer(event: ERC721TransferEvent): void {
  createERC721Transfer(event)
}

export function handle721OwnerUpdated(event: ERC721OwnerUpdatedEvent): void {
  let contract = fetchERC721(event.address)
  let owner = fetchAccount(event.transaction.from)
  contract.owner = owner.id
  contract.save()
}

export function handle721PublicMintStateSet(event: ERC721PublicMintStateSetEvent): void {
  let contract = fetchERC721(event.address)
  contract.publicMintState = event.params.newPublicState
  contract.save()
}

// @todo implement these event mappings to update contract entities
export function handle721RoyaltyFeeSet(event: ERC721RoyaltyFeeSetEvent): void {}
export function handle721RoyaltyRecipientSet(event: ERC721RoyaltyRecipientSetEvent): void {}

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
  let erc1155interface = ERC1155BasicTemplate.bind(Address.fromBytes(event.address))
  let try_baseUri = erc1155interface.try_getURI()
  contract.baseUri = try_baseUri.value
  contract.save()
}

export function handle1155TransferBatch(event: ERC1155TransferBatchEvent): void {
  createERC1155BatchTransfer(event)
}

export function handle1155TransferSingle(event: ERC1155TransferSingleEvent): void {
  createERC1155SingleTransfer(event)
}

export function handle1155OwnerUpdated(event: ERC1155OwnerUpdatedEvent): void {
  let contract = fetchERC1155(event.address, event.block.timestamp)
  let owner = fetchAccount(event.transaction.from)
  contract.owner = owner.id
  contract.save()
}

export function handle1155PublicMintStateSet(event: ERC1155PublicMintStateSetEvent): void {
  let contract = fetchERC1155(event.address, event.block.timestamp)
  contract.publicMintState = event.params.newPublicState
  contract.save()
}

// @todo implement these event mappings to update contract entities
export function handle1155RoyaltyFeeSet(event: ERC1155RoyaltyFeeSetEvent): void {}
export function handle1155RoyaltyRecipientSet(event: ERC1155RoyaltyRecipientSetEvent): void {}
