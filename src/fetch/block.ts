import { Block } from '../../generated/schema';
import { Bytes } from '@graphprotocol/graph-ts';

export function fetchBlock(blockHash: Bytes): Block {
  return Block.load(blockHash.toHex()) as Block
}
