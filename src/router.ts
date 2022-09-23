import {
  BaseURI as ERC721BaseURISetEvent,
} from '../generated/templates/MADRouter721/MADRouter721';

import { fetchERC1155, fetchERC721 } from './fetch/factory';

// 721 Token events

export function handle721BaseURISet(event: ERC721BaseURISetEvent): void {
  let contract = fetchERC721(event.address, event.block.timestamp)
}
