import {
  Address,
  BigInt,
  Bytes,
  ipfs,
  json,
  JSONValueKind,
} from '@graphprotocol/graph-ts';

import {
  Account,
  ERC721Contract,
  ERC721Token,
  ERC721Operator,
} from '../../generated/schema';

import { ERC721 } from '../../generated/ERC721/ERC721';

import { constants } from '@amxx/graphprotocol-utils';

import { fetchAccount } from './account';

import { supportsInterface } from './erc165';

export function fetchERC721(address: Address): ERC721Contract | null {
  let erc721 = ERC721.bind(address);

  // Try load entry
  let contract = ERC721Contract.load(address);
  if (contract != null) {
    return contract;
  }

  // Detect using ERC165
  let detectionId = address.concat(Bytes.fromHexString('80ac58cd')); // Address + ERC721
  let detectionAccount = Account.load(detectionId);

  // On missing cache
  if (detectionAccount == null) {
    detectionAccount = new Account(detectionId);
    let introspection_01ffc9a7 = supportsInterface(erc721, '01ffc9a7'); // ERC165
    let introspection_80ac58cd = supportsInterface(erc721, '80ac58cd'); // ERC721
    let introspection_00000000 = supportsInterface(erc721, '00000000', false);
    let isERC721 =
      introspection_01ffc9a7 &&
      introspection_80ac58cd &&
      introspection_00000000;
    detectionAccount.asERC721 = isERC721 ? address : null;
    detectionAccount.save();
  }

  // If an ERC721, build entry
  if (detectionAccount.asERC721) {
    contract = new ERC721Contract(address);
    let try_name = erc721.try_name();
    let try_symbol = erc721.try_symbol();
    contract.name = try_name.reverted ? '' : try_name.value;
    contract.symbol = try_symbol.reverted ? '' : try_symbol.value;
    contract.supportsMetadata = supportsInterface(erc721, '5b5e139f'); // ERC721Metadata
    contract.asAccount = address;
    contract.save();

    let account = fetchAccount(address);
    account.asERC721 = address;
    account.save();
  }

  return contract;
}

export function fetchERC721Token(
  contract: ERC721Contract,
  identifier: BigInt,
): ERC721Token {
  let id = contract.id
    .toHex()
    .concat('/')
    .concat(identifier.toHex());
  let token = ERC721Token.load(id);

  if (token == null) {
    token = new ERC721Token(id);
    token.contract = contract.id;
    token.identifier = identifier;
    token.approval = fetchAccount(constants.ADDRESS_ZERO).id;

    if (contract.supportsMetadata) {
      let erc721 = ERC721.bind(Address.fromBytes(contract.id));
      let try_tokenURI = erc721.try_tokenURI(identifier);
      token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;
      let hash = token.uri.replace('https://ipfs.io/ipfs/', '');
      let getIPFSData = ipfs.cat(hash);
      if (getIPFSData !== null) {
        let data = json.fromBytes(getIPFSData).toObject();
        token.name = data.get('name') ? data.get('name')!.toString() : '';
        token.image = data.get('image') ? data.get('image')!.toString() : '';
        token.description = data.get('description') ? data.get('description')!.toString() : '';
        token.type = data.get('type') ? data.get('type')!.toI64() as i32 : 1;
        token.externalUrl = (data.get('external_url') && data.mustGet('external_url').kind == JSONValueKind.STRING) ? data.get('external_url')!.toString() : '';
        token.unlockableUrl = (data.get('unlockable_url') && data.mustGet('unlockable_url').kind == JSONValueKind.STRING) ? data.get('unlockable_url')!.toString() : '';
        token.explicitContent = !!data.get('explicit_content');

        if (data.get('tags') && data.mustGet('tags').kind == JSONValueKind.ARRAY) {
          token.tags = data.get('tags')!.toArray().map<string>(t => t.toString().replace(',', '')).join(',').toString()
        } else {
          token.tags = '';
        }

        // @todo - store attributes array appropriately
        if (data.get('attributes') && data.mustGet('attributes').kind == JSONValueKind.ARRAY) {
          let attributes = data.get('attributes')!.toArray();
          for (let i=0; i < attributes.length; i++) {
            let item = attributes[i].toObject();
            // item.display_type, item.trait_type, item.value, item.max_value
          }
        } else {
          token.attributes = '';
        }

        // @todo - store attributes array appropriately
        if (data.get('files') && data.mustGet('files').kind == JSONValueKind.ARRAY) {
          let files = data.get('files')!.toArray();
          for (let i=0; i < files.length; i++) {
            let item = files[i].toObject();
            // item.display_type, item.trait_type, item.value
          }
        } else {
          token.files = '';
        }
      }
    }
  }

  return token as ERC721Token;
}

export function fetchERC721Operator(
  contract: ERC721Contract,
  owner: Account,
  operator: Account,
): ERC721Operator {
  let id = contract.id
    .toHex()
    .concat('/')
    .concat(owner.id.toHex())
    .concat('/')
    .concat(operator.id.toHex());
  let op = ERC721Operator.load(id);

  if (op == null) {
    op = new ERC721Operator(id);
    op.contract = contract.id;
    op.owner = owner.id;
    op.operator = operator.id;
  }

  return op as ERC721Operator;
}
