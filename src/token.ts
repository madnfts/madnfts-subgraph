import {
  Approval as ERC721ApprovalEvent,
  ApprovalForAll as ERC721ApprovalForAllEvent,
  BaseUriChanged as ERC721BaseUriChangedEvent,
  CreateERC721MadNft as ERC721CreateERC721MadNftEvent,
  Creators as ERC721CreatorsEvent,
  DefaultApproval as ERC721DefaultApprovalEvent,
  OwnershipTransferred as ERC721OwnershipTransferredEvent,
  SecondarySaleFees as ERC721SecondarySaleFeesEvent,
  Transfer as ERC721TransferEvent,
} from '../generated/templates/ERC721/ERC721';

import {
  ApprovalForAll as ERC1155ApprovalForAllEvent,
  BaseUriChanged as ERC1155BaseUriChangedEvent,
  BurnLazy as ERC1155BurnLazyEvent,
  BurnLazyBatch as ERC1155BurnLazyBatchEvent,
  CreateERC1155MadNft as ERC1155CreateERC1155MadNftEvent,
  CreateERC1155MadNftUser as ERC1155CreateERC1155MadNftUserEvent,
  Creators as ERC1155CreatorsEvent,
  DefaultApproval as ERC1155DefaultApprovalEvent,
  OwnershipTransferred as ERC1155OwnershipTransferredEvent,
  SecondarySaleFees as ERC1155SecondarySaleFeesEvent,
  Supply as ERC1155SupplyEvent,
  TransferBatch as ERC1155TransferBatchEvent,
  TransferSingle as ERC1155TransferSingleEvent,
} from '../generated/templates/ERC1155/ERC1155';

import { fetchERC721, fetchERC721Operator, fetchERC721Token, transferERC721Single } from './fetch/erc721';
import { fetchAccount } from './fetch/account';
import { fetchERC1155, fetchERC1155Operator, transferERC1155Batch, transferERC1155Single } from './fetch/erc1155';

// 721 Token events

export function handle721Approval(event: ERC721ApprovalEvent): void {
  let token = fetchERC721Token(fetchERC721(event.address), event.params.tokenId)
  let owner = fetchAccount(event.params.owner)
  let approved = fetchAccount(event.params.approved)
  token.timestamp = event.block.timestamp
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

export function handle721BaseUriChanged(event: ERC721BaseUriChangedEvent): void {
  let contract = fetchERC721(event.address)
  // @todo we need to retrieve the tokens ID
  // let token = fetchERC721Token(contract, event.params.tokenId)
  // fetchIpfsERC721(token, contract.id, contract.baseUri)
  // token.timestamp = event.block.timestamp
  // token.owner = event.params.owner
  // token.uri = event.params.newBaseURI
  // token.save()
}

export function handle721CreateERC721MadNft(event: ERC721CreateERC721MadNftEvent): void {
  let contract = fetchERC721(event.address);
  // @todo we need to retrieve the tokens ID
  // let token = fetchERC721Token(contract, event.params.tokenId)
  // token.owner = event.params.owner
  // token.timestamp = event.block.timestamp
  // token.save()
}

export function handle721Creators(event: ERC721CreatorsEvent): void {}
export function handle721DefaultApproval(event: ERC721DefaultApprovalEvent): void {}
export function handle721OwnershipTransferred(event: ERC721OwnershipTransferredEvent): void {}
export function handle721SecondarySaleFees(event: ERC721SecondarySaleFeesEvent): void {}

export function handle721Transfer(event: ERC721TransferEvent): void {
  transferERC721Single(event)
}

// 1155 Token events

export function handle1155ApprovalForAll(event: ERC1155ApprovalForAllEvent): void {
  let contract = fetchERC1155(event.address)
  let owner = fetchAccount(event.params.account)
  let operator = fetchAccount(event.params.operator)
  let delegation = fetchERC1155Operator(contract, owner, operator)
  delegation.approved = event.params.approved
  delegation.save()
}

export function handle1155BaseUriChanged(event: ERC1155BaseUriChangedEvent): void {
  let contract = fetchERC1155(event.address)
  // @todo we need to retrieve the tokens ID
  // let token = fetchERC1155Token(contract, event.params.tokenId)
  // fetchIpfsERC1155(token, contract.id, contract.baseUri)
  // token.timestamp = event.block.timestamp
  // token.owner = event.params.owner
  // token.uri = event.params.newBaseURI
  // token.save()
}

export function handle1155BurnLazy(event: ERC1155BurnLazyEvent): void {}
export function handle1155BurnLazyBatch(event: ERC1155BurnLazyBatchEvent): void {}

export function handle1155CreateERC1155MadNft(event: ERC1155CreateERC1155MadNftEvent): void {
  let contract = fetchERC1155(event.address);
  // @todo we need to retrieve the tokens ID
  // let token = fetchERC1155Token(contract, event.params.tokenId)
  // token.owner = event.params.owner
  // token.timestamp = event.block.timestamp
  // token.save()
}

export function handle1155CreateERC1155MadNftUser(event: ERC1155CreateERC1155MadNftUserEvent): void {}
export function handle1155Creators(event: ERC1155CreatorsEvent): void {}
export function handle1155DefaultApproval(event: ERC1155DefaultApprovalEvent): void {}
export function handle1155OwnershipTransferred(event: ERC1155OwnershipTransferredEvent): void {}
export function handle1155SecondarySaleFees(event: ERC1155SecondarySaleFeesEvent): void {}
export function handle1155Supply(event: ERC1155SupplyEvent): void {}

export function handle1155TransferBatch(event: ERC1155TransferBatchEvent): void {
  transferERC1155Batch(event)
}

export function handle1155TransferSingle(event: ERC1155TransferSingleEvent): void {
  transferERC1155Single(event)
}
