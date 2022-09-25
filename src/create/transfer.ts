import { Account, ERC1155Contract, ERC1155Transfer, ERC721Transfer } from '../../generated/schema';
import { Transfer as ERC721TransferEvent } from '../../generated/templates/ERC721Basic/ERC721Basic'
import { TransferBatch as ERC1155TransferBatchEvent } from '../../generated/templates/ERC1155Basic/ERC1155Basic'
import { TransferSingle as ERC1155TransferSingleEvent } from '../../generated/templates/ERC1155Basic/ERC1155Basic'
import { constants, decimals, events, transactions } from '@amxx/graphprotocol-utils/index';
import { BigInt, ethereum } from '@graphprotocol/graph-ts/index';
import { fetchERC1155, fetchERC721 } from '../fetch/factory';
import { fetchERC1155Token, fetchERC721Token } from '../fetch/token';
import { fetchAccount } from '../fetch/account';
import { fetchBlock } from '../fetch/block';
import { fetchERC1155Balance } from '../fetch/balance';

export function createERC721Transfer(event: ERC721TransferEvent): void {
  let contract = fetchERC721(event.address)
  if (contract != null) {
    let token = fetchERC721Token(contract, event.params.to, event.params.id, event.block.timestamp)
    let contractAccount = fetchAccount(event.address)
    let from = fetchAccount(event.params.from)
    let to = fetchAccount(event.params.to)
    // Update the tokens owner
    token.owner = to.id
    token.timestamp = event.block.timestamp
    token.save()
    // Create a new transfer entity
    let transfer = new ERC721Transfer(events.id(event))
    transfer.emitter = contractAccount.id
    transfer.from = from.id
    transfer.to = to.id
    transfer.contract = contract.id
    transfer.token = token.id
    transfer.block = fetchBlock(event.block).id
    transfer.timestamp = event.block.timestamp
    transfer.save()
  }
}

export function createERC1155SingleTransfer(event: ERC1155TransferSingleEvent): void {
  let contract = fetchERC1155(event.address)
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
    event.params.amount,
  )
}

export function createERC1155BatchTransfer(event: ERC1155TransferBatchEvent): void {
  let contract = fetchERC1155(event.address);
  let operator = fetchAccount(event.params.operator);
  let from = fetchAccount(event.params.from);
  let to = fetchAccount(event.params.to);
  let ids = event.params.ids;
  let values = event.params.amounts;

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
  // Create a new transfer entity
  let transfer = new ERC1155Transfer(events.id(event).concat(suffix))
  transfer.emitter = contract.id
  transfer.from = from.id
  transfer.to = to.id
  transfer.contract = contract.id
  transfer.token = token.id
  transfer.block = fetchBlock(event.block).id
  transfer.timestamp = event.block.timestamp
  transfer.operator = operator.id;
  transfer.value = decimals.toDecimals(value);
  transfer.valueExact = value;
  transfer.save()

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
    transfer.from = from.id;
    transfer.fromBalance = balance.id;
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
    transfer.to = to.id;
    transfer.toBalance = balance.id;
  }

  token.timestamp = event.block.timestamp;
  token.save();
  transfer.save();
}
