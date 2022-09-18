import { ethereum } from '@graphprotocol/graph-ts/index';
import { Block } from '../../generated/schema';

export function createBlock(block: ethereum.Block): Block {
  let id = block.hash.toHex()
  let entity = new Block(id)
  entity.timestamp = block.timestamp
  entity.number = block.number
  entity.save()
  return entity as Block
}
