import {
	Address,
	BigInt, ethereum,
} from '@graphprotocol/graph-ts';

import {
	Account,
	ERC1155Contract,
	ERC1155Token,
	ERC1155Balance,
	ERC1155Operator, ERC1155Transfer,
} from '../../generated/schema';

import {
	ERC1155, TransferBatch as TransferBatchEvent, TransferSingle as TransferSingleEvent,
} from '../../generated/templates/ERC1155/ERC1155';

import {
	constants, decimals, events, transactions
} from '@amxx/graphprotocol-utils';

import { fetchIpfsERC1155 } from './ipfs';
import { fetchAccount } from './account';

// ERC1155 Functions

export function fetchERC1155(address: Address): ERC1155Contract {
	let contract = ERC1155Contract.load(address);
	if (contract == null) {
		contract = new ERC1155Contract(address)
		contract.save()
	}
	return contract
}

export function fetchERC1155Operator(
	contract: ERC1155Contract,
	owner: Account,
	operator: Account
): ERC1155Operator {
	let id = contract.id.toHex()
		.concat('/')
		.concat(owner.id.toHex())
		.concat('/')
		.concat(operator.id.toHex())
	let op = ERC1155Operator.load(id)
	if (op == null) {
		op = new ERC1155Operator(id)
		op.contract = contract.id
		op.owner = owner.id
		op.operator = operator.id
	}
	return op as ERC1155Operator
}

export function fetchERC1155Token(
	contract: ERC1155Contract,
	tokenId: BigInt
): ERC1155Token {
	let id = contract.id.toHex().concat('/').concat(tokenId.toHex())
	let token = ERC1155Token.load(id)
	if (token == null) {
		let erc1155 = ERC1155.bind(Address.fromBytes(contract.id))
		let try_uri = erc1155.try_uri(tokenId)
		let try_name = erc1155.try_name()
		let try_symbol = erc1155.try_symbol()
		token = new ERC1155Token(id)
		token.contract = contract.id
		token.totalSupply = fetchERC1155Balance(token as ERC1155Token, null).id
		token.uri = try_uri.reverted ? '' : try_uri.value;
		token.name = try_name.reverted ? '' : try_name.value;
		token.symbol = try_symbol.reverted ? '' : try_symbol.value;
		if (token.uri) {
			fetchIpfsERC1155(token, contract.id, contract.baseUri);
		}
		token.save()
	}
	return token as ERC1155Token
}

export function fetchERC1155Balance(
	token: ERC1155Token,
	account: Account | null
): ERC1155Balance {
	let id = token.id.concat('/').concat(account ? account.id.toHex() : 'totalSupply')
	let balance = ERC1155Balance.load(id)

	if (balance == null) {
		balance            = new ERC1155Balance(id)
		balance.contract   = token.contract
		balance.token      = token.id
		balance.account    = account ? account.id : null
		balance.value      = constants.BIGDECIMAL_ZERO
		balance.valueExact = constants.BIGINT_ZERO
		balance.save()
	}

	return balance as ERC1155Balance
}

export function transferERC1155Single(event: TransferSingleEvent): void {
	let contract = fetchERC1155(event.address)
	let operator = fetchAccount(event.params.operator)
	let from = fetchAccount(event.params.from)
	let to = fetchAccount(event.params.to)
	register1155Transfer(
		event,
		'',
		contract,
		operator,
		from,
		to,
		event.params.id,
		event.params.value,
	)
}

export function transferERC1155Batch(event: TransferBatchEvent): void {
	let contract = fetchERC1155(event.address);
	let operator = fetchAccount(event.params.operator);
	let from = fetchAccount(event.params.from);
	let to = fetchAccount(event.params.to);

	let ids = event.params.ids;
	let values = event.params.values;

	// If this equality doesn't hold (some devs actually don't follox the ERC specifications) then we just can't make
	// sens of what is happening. Don't try to make something out of stupid code, and just throw the event. This
	// contract doesn't follow the standard anyway.
	if (ids.length == values.length) {
		for (let i = 0; i < ids.length; ++i) {
			register1155Transfer(
				event,
				'/'.concat(i.toString()),
				contract,
				operator,
				from,
				to,
				ids[i],
				values[i],
			);
		}
	}
}

export function register1155Transfer(
	event: ethereum.Event,
	suffix: string,
	contract: ERC1155Contract,
	operator: Account,
	from: Account,
	to: Account,
	id: BigInt,
	value: BigInt,
): void {
	let token = fetchERC1155Token(contract, id);
	let ev = new ERC1155Transfer(events.id(event).concat(suffix));
	ev.emitter = token.contract;
	ev.transaction = transactions.log(event).id;
	ev.timestamp = event.block.timestamp;
	ev.contract = contract.id;
	ev.token = token.id;
	ev.operator = operator.id;
	ev.value = decimals.toDecimals(value);
	ev.valueExact = value;

	if (from.id == constants.ADDRESS_ZERO) {
		let totalSupply = fetchERC1155Balance(token, null);
		totalSupply.valueExact = totalSupply.valueExact.plus(value);
		totalSupply.value = decimals.toDecimals(totalSupply.valueExact);
		totalSupply.save();
	} else {
		let balance = fetchERC1155Balance(token, from);
		balance.valueExact = balance.valueExact.minus(value);
		balance.value = decimals.toDecimals(balance.valueExact);
		balance.save();

		ev.from = from.id;
		ev.fromBalance = balance.id;
	}

	if (to.id == constants.ADDRESS_ZERO) {
		let totalSupply = fetchERC1155Balance(token, null);
		totalSupply.valueExact = totalSupply.valueExact.minus(value);
		totalSupply.value = decimals.toDecimals(totalSupply.valueExact);
		totalSupply.timestamp = event.block.timestamp;
		totalSupply.save();
	} else {
		let balance = fetchERC1155Balance(token, to);
		balance.valueExact = balance.valueExact.plus(value);
		balance.value = decimals.toDecimals(balance.valueExact);
		balance.timestamp = event.block.timestamp;
		balance.save();

		ev.to = to.id;
		ev.toBalance = balance.id;
	}

	token.timestamp = event.block.timestamp;
	token.save();
	ev.save();
}
