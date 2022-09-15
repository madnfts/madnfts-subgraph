import {
  Approval as ERC721Approval,
  ApprovalForAll as ERC721ApprovalForAll,
  BaseUriChanged as ERC721BaseUriChanged,
  CreateERC721MadNft as ERC721CreateERC721MadNft,
  Creators as ERC721Creators,
  DefaultApproval as ERC721DefaultApproval,
  OwnershipTransferred as ERC721OwnershipTransferred,
  SecondarySaleFees as ERC721SecondarySaleFees,
  Transfer as ERC721Transfer,
} from '../generated/templates/ERC721/ERC721';
import {
  ApprovalForAll as ERC1155ApprovalForAll,
  BaseUriChanged as ERC1155BaseUriChanged,
  BurnLazy as ERC1155BurnLazy,
  BurnLazyBatch as ERC1155BurnLazyBatch,
  CreateERC1155MadNft as ERC1155CreateERC1155MadNft,
  CreateERC1155MadNftUser as ERC1155CreateERC1155MadNftUser,
  Creators as ERC1155Creators,
  DefaultApproval as ERC1155DefaultApproval,
  OwnershipTransferred as ERC1155OwnershipTransferred,
  SecondarySaleFees as ERC1155SecondarySaleFees,
  Supply as ERC1155Supply,
  TransferBatch as ERC1155TransferBatch,
  TransferSingle as ERC1155TransferSingle,
} from '../generated/templates/ERC1155/ERC1155';

// 721 Token events

export function handle721Approval(event: ERC721Approval): void {}
export function handle721ApprovalForAll(event: ERC721ApprovalForAll): void {}
export function handle721BaseUriChanged(event: ERC721BaseUriChanged): void {}
export function handle721CreateERC721MadNft(event: ERC721CreateERC721MadNft): void {}
export function handle721Creators(event: ERC721Creators): void {}
export function handle721DefaultApproval(event: ERC721DefaultApproval): void {}
export function handle721OwnershipTransferred(event: ERC721OwnershipTransferred): void {}
export function handle721SecondarySaleFees(event: ERC721SecondarySaleFees): void {}
export function handle721Transfer(event: ERC721Transfer): void {}

// 1155 Token events

export function handle1155ApprovalForAll(event: ERC1155ApprovalForAll): void {}
export function handle1155BaseUriChanged(event: ERC1155BaseUriChanged): void {}
export function handle1155BurnLazy(event: ERC1155BurnLazy): void {}
export function handle1155BurnLazyBatch(event: ERC1155BurnLazyBatch): void {}
export function handle1155CreateERC1155MadNft(event: ERC1155CreateERC1155MadNft): void {}
export function handle1155CreateERC1155MadNftUser(event: ERC1155CreateERC1155MadNftUser): void {}
export function handle1155Creators(event: ERC1155Creators): void {}
export function handle1155DefaultApproval(event: ERC1155DefaultApproval): void {}
export function handle1155OwnershipTransferred(event: ERC1155OwnershipTransferred): void {}
export function handle1155SecondarySaleFees(event: ERC1155SecondarySaleFees): void {}
export function handle1155Supply(event: ERC1155Supply): void {}
export function handle1155TransferBatch(event: ERC1155TransferBatch): void {}
export function handle1155TransferSingle(event: ERC1155TransferSingle): void {}
