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

import { ethereum } from '@graphprotocol/graph-ts';
import { createContract, createSplitter } from './create/factory';
import { createBlock } from './create/block';

// Block handler

export function handleBlock(block: ethereum.Block): void {
	createBlock(block)
}

// 721 Event handlers

export function handle721MinimalCreated(event: ERC721MinimalCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Minimal',
		event.block.timestamp,
		'721'
	)
}

export function handle721BasicCreated(event: ERC721BasicCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Basic',
		event.block.timestamp,
		'721'
	)
}

export function handle721WhitelistCreated(event: ERC721WhitelistCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Whitelist',
		event.block.timestamp,
		'721'
	)
}

export function handle721LazyCreated(event: ERC721LazyCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Lazy',
		event.block.timestamp,
		'721'
	)
}

export function handle721SplitterCreated(event: ERC721SplitterCreated): void {
	createSplitter(
		event.params.splitter,
		event.params.creator,
		event.params.payees,
		event.params.shares
	)
}

// 1155 Event handlers

export function handle1155MinimalCreated(event: ERC1155MinimalCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Minimal',
		event.block.timestamp,
		'1155'
	)
}

export function handle1155BasicCreated(event: ERC1155BasicCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Basic',
		event.block.timestamp,
		'1155'
	)
}

export function handle1155WhitelistCreated(event: ERC1155WhitelistCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Whitelist',
		event.block.timestamp,
		'1155'
	)
}

export function handle1155LazyCreated(event: ERC1155LazyCreated): void {
	createContract(
		event.params.newCollection,
		event.params.newSplitter,
		event.params.newCreator,
		'Lazy',
		event.block.timestamp,
		'1155'
	)
}

export function handle1155SplitterCreated(event: ERC1155SplitterCreated): void {
	createSplitter(
		event.params.splitter,
		event.params.creator,
		event.params.payees,
		event.params.shares
	)
}
