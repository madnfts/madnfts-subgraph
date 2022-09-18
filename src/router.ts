import {
  BaseURI as ERC721BaseURI,
  FreeClaimState as ERC721FreeClaimState,
  OwnerUpdated as ERC721OwnerUpdated,
  Paused as ERC721Paused,
  PublicMintState as ERC721PublicMintState,
  TokenFundsWithdrawn as ERC721TokenFundsWithdrawn,
  Unpaused as ERC721Unpaused,
} from '../generated/ERC721Router/ERC721Router';

import {
  BaseURI as ERC1155BaseURI,
  FreeClaimState as ERC1155FreeClaimState,
  OwnerUpdated as ERC1155OwnerUpdated,
  Paused as ERC1155Paused,
  PublicMintState as ERC1155PublicMintState,
  TokenFundsWithdrawn as ERC1155TokenFundsWithdrawn,
  Unpaused as ERC1155Unpaused,
} from '../generated/ERC1155Router/ERC1155Router';

import { ERC1155Contract, ERC721Contract } from '../generated/schema';
import { fetchERC1155, fetchERC721 } from './fetch/factory';

// 721 Event handlers

export function handle721BaseUri(event: ERC721BaseURI): void {
  let contract = fetchERC721(event.address, event.block.timestamp)
  contract.baseUri = event.params._baseURI.toString()
  contract.save()
}

export function handle721OwnerUpdated(event: ERC721OwnerUpdated): void {
  let contract = fetchERC721(event.address, event.block.timestamp)
  contract.owner = event.params.newOwner
  contract.save()
}

export function handle721Paused(event: ERC721Paused): void {
  toggle721Paused(fetchERC721(event.address, event.block.timestamp), true)
}

export function handle721Unpaused(event: ERC721Unpaused): void {
  toggle721Paused(fetchERC721(event.address, event.block.timestamp), false)
}

export function handle721FreeClaimState(event: ERC721FreeClaimState): void {}
export function handle721PublicMintState(event: ERC721PublicMintState): void {}
export function handle721TokenFundsWithdrawn(event: ERC721TokenFundsWithdrawn): void {}

// 1155 Event handlers

export function handle1155BaseUri(event: ERC1155BaseURI): void {
  let contract = fetchERC1155(event.address, event.block.timestamp)
  contract.baseUri = event.params._baseURI.toString()
  contract.save()
}

export function handle1155OwnerUpdated(event: ERC1155OwnerUpdated): void {
  let contract = fetchERC1155(event.address, event.block.timestamp)
  contract.owner = event.params.newOwner
  contract.save()
}

export function handle1155Paused(event: ERC1155Paused): void {
  toggle1155Paused(fetchERC1155(event.address, event.block.timestamp), true)
}

export function handle1155Unpaused(event: ERC1155Unpaused): void {
  toggle1155Paused(fetchERC1155(event.address, event.block.timestamp), false)
}

export function handle1155FreeClaimState(event: ERC1155FreeClaimState): void {}
export function handle1155PublicMintState(event: ERC1155PublicMintState): void {}
export function handle1155TokenFundsWithdrawn(event: ERC1155TokenFundsWithdrawn): void {}

// Functions

function toggle721Paused(
  contract: ERC721Contract,
  paused: boolean
): void {
  contract.paused = paused
  contract.save()
}

function toggle1155Paused(
  contract: ERC1155Contract,
  paused: boolean
): void {
  contract.paused = paused
  contract.save()
}
