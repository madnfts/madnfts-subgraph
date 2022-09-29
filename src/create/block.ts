import { ethereum } from '@graphprotocol/graph-ts/index';
import { Block } from '../../generated/schema';

export function createBlock(block: ethereum.Block): Block {
  const entity = new Block(block.hash.toHex())
  entity.timestamp = block.timestamp
  entity.number = block.number
  entity.save()
  return entity as Block
}
