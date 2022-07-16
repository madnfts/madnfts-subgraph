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
} from '../generated/ERC721/ERC721';

import {
  ApprovalForAll as ApprovalForAllERC1155Event,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from '../generated/ERC1155/ERC1155';

import { Transfer as TransferExecutorEvent } from '../generated/TransferExecutor/TransferExecutor';

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

export function handleTransfer(event: TransferEvent): void {
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

export function handleApproval(event: ApprovalEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchERC721Token(contract, event.params.tokenId);
    let owner = fetchAccount(event.params.owner);
    let approved = fetchAccount(event.params.approved);

    token.owner = owner.id;
    token.approval = approved.id;

    token.save();
    owner.save();
    approved.save();

    // let ev = new Approval(events.id(event))
    // ev.emitter     = contract.id
    // ev.transaction = transactions.log(event).id
    // ev.timestamp   = event.block.timestamp
    // ev.token       = token.id
    // ev.owner       = owner.id
    // ev.approved    = approved.id
    // ev.save()
  }
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let owner = fetchAccount(event.params.owner);
    let operator = fetchAccount(event.params.operator);
    let delegation = fetchERC721Operator(contract, owner, operator);

    delegation.approved = event.params.approved;

    delegation.save();

    // 	let ev = new ApprovalForAll(events.id(event))
    // 	ev.emitter     = contract.id
    // 	ev.transaction = transactions.log(event).id
    // 	ev.timestamp   = event.block.timestamp
    // 	ev.delegation  = delegation.id
    // 	ev.owner       = owner.id
    // 	ev.operator    = operator.id
    // 	ev.approved    = event.params.approved
    // 	ev.save()
  }
}

function registerTransfer(
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
    totalSupply.save();
  } else {
    let balance = fetchERC1155Balance(token, to);
    balance.valueExact = balance.valueExact.plus(value);
    balance.value = decimals.toDecimals(balance.valueExact);
    balance.save();

    ev.to = to.id;
    ev.toBalance = balance.id;
  }

  token.timestamp = event.block.timestamp;
  token.save();
  ev.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let contract = fetchERC1155(event.address);
  let operator = fetchAccount(event.params.operator);
  let from = fetchAccount(event.params.from);
  let to = fetchAccount(event.params.to);

  registerTransfer(
    event,
    '',
    contract,
    operator,
    from,
    to,
    event.params.id,
    event.params.value,
  );
}

export function handleTransferBatch(event: TransferBatchEvent): void {
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
      registerTransfer(
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

export function handleApprovalForAllERC1155(
  event: ApprovalForAllERC1155Event,
): void {
  let contract = fetchERC1155(event.address);
  let owner = fetchAccount(event.params.account);
  let operator = fetchAccount(event.params.operator);
  let delegation = fetchERC1155Operator(contract, owner, operator);
  delegation.approved = event.params.approved;
  delegation.save();
}

export function handleURI(event: URIEvent): void {
  let contract = fetchERC1155(event.address);
  let token = fetchERC1155Token(contract, event.params.id);
  token.timestamp = event.block.timestamp;
  token.uri = replaceURI(event.params.value, event.params.id);
  token.save();
}

export function handleTransferExecutor(event: TransferExecutorEvent): void {
  let decode = ethereum.decode('(address,uint256)', event.params.asset.assetType.data)!.toTuple();
  let contract = fetchERC721(decode[0].toAddress())!;
  let id = contract.id
    .toHex()
    .concat('/')
    .concat(decode[1].toBigInt().toHex());
  let token = ERC721Token.load(id)!;

  token.timestamp = event.block.timestamp;
  token.price = event.params.asset.value;
  token.save();
}
