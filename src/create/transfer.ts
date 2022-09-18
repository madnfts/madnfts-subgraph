import { Account, ERC1155Contract, ERC1155Transfer, ERC721Transfer } from '../../generated/schema';
import { constants, decimals, events, transactions } from '@amxx/graphprotocol-utils/index';
import { TransferBatch, TransferSingle } from '../../generated/templates/ERC1155/ERC1155';
import { BigInt, ethereum } from '@graphprotocol/graph-ts/index';
import { Transfer as TransferEvent } from '../../generated/templates/ERC721/ERC721';
import { fetchERC1155, fetchERC721 } from '../fetch/factory';
import { fetchERC1155Token, fetchERC721Token } from '../fetch/token';
import { fetchAccount } from '../fetch/account';
import { fetchBlock } from '../fetch/block';
import { fetchERC1155Balance } from '../fetch/balance';

export function createERC721Transfer(event: TransferEvent): void {
  let contract = fetchERC721(event.address, event.block.timestamp)
  if (contract != null) {
    let token = fetchERC721Token(contract, event.params.tokenId, event.block.timestamp)
    let from = fetchAccount(event.params.from)
    let to = fetchAccount(event.params.to)
    token.owner = to.id
    token.save()
    let ev = new ERC721Transfer(events.id(event))
    ev.emitter = contract.id
    ev.transaction = transactions.log(event).id
    ev.timestamp = event.block.timestamp
    ev.contract = contract.id
    ev.token = token.id
    ev.from = from.id
    ev.to = to.id
    ev.block = fetchBlock(event.block.hash).id
    ev.save()
  }
}

export function createERC1155SingleTransfer(event: TransferSingle): void {
  let contract = fetchERC1155(event.address, null)
  let operator = fetchAccount(event.params.operator)
  let from = fetchAccount(event.params.from)
  let to = fetchAccount(event.params.to)
  insert1155Transfer(
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

export function createERC1155BatchTransfer(event: TransferBatch): void {
  let contract = fetchERC1155(event.address, null);
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
      insert1155Transfer(
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

// Local functions

function insert1155Transfer(
  event: ethereum.Event,
  suffix: string,
  contract: ERC1155Contract,
  operator: Account,
  from: Account,
  to: Account,
  id: BigInt,
  value: BigInt,
): void {
  let token = fetchERC1155Token(contract, id, event.block.timestamp);
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
