import {
	SplitterCreated as ERC721SplitterCreated,
	ERC721MinimalCreated,
	ERC721BasicCreated,
	ERC721WhitelistCreated,
	ERC721LazyCreated,
} from '../generated/ERC721Factory/ERC721Factory'

import {
	SplitterCreated as ERC1155SplitterCreated,
	ERC1155MinimalCreated,
	ERC1155BasicCreated,
	ERC1155WhitelistCreated,
	ERC1155LazyCreated,
} from '../generated/ERC1155Factory/ERC1155Factory'

import { createContract, createSplitter } from './create/factory';

// 0.9 Event handlers

export function handle721MinimalCreated(event: ERC721MinimalCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'0',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle721BasicCreated(event: ERC721BasicCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'1',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle721WhitelistCreated(event: ERC721WhitelistCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'2',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle721LazyCreated(event: ERC721LazyCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'3',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155MinimalCreated(event: ERC1155MinimalCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'0',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155BasicCreated(event: ERC1155BasicCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'1',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155WhitelistCreated(event: ERC1155WhitelistCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'2',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155LazyCreated(event: ERC1155LazyCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'3',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}

// 1.0 Event handlers

export function handle721MinimalCreated1(event: ERC721MinimalCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'0',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle721BasicCreated1(event: ERC721BasicCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'1',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle721WhitelistCreated1(event: ERC721WhitelistCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'2',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle721LazyCreated1(event: ERC721LazyCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'3',
		'721',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155MinimalCreated1(event: ERC1155MinimalCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'0',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155BasicCreated1(event: ERC1155BasicCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'1',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155WhitelistCreated1(event: ERC1155WhitelistCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'2',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}
export function handle1155LazyCreated1(event: ERC1155LazyCreated): void {
	createContract(
		'0.9',
		event.params.newCollection,
		event.params.newSplitter,
		event.transaction.from,
		event.block.timestamp,
		'3',
		'1155',
		event.params.name,
		event.params.symbol,
		event.params.maxSupply,
		event.params.mintPrice,
		event.params.royalties
	)
}

// 0.9 + 1.0 Event handlers

export function handle721SplitterCreated(event: ERC721SplitterCreated): void {
	createSplitter(
		event.params.splitter,
		event.params.creator,
		event.params.payees,
		event.params.shares,
		event.params.flag
	)
}
export function handle1155SplitterCreated(event: ERC1155SplitterCreated): void {
	createSplitter(
		event.params.splitter,
		event.params.creator,
		event.params.payees,
		event.params.shares,
		event.params.flag
	)
}
