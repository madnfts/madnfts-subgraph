import { Block } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';
import { createBlock } from '../create/block';

export function fetchBlock(block: ethereum.Block): Block {
  let getBlock = Block.load(block.hash.toHex())
  if (getBlock == null) {
    getBlock = createBlock(block)
  }
  return getBlock;
}
