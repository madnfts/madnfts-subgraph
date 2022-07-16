import { ipfs, json, JSONValueKind } from '@graphprotocol/graph-ts/index';
import { ERC1155Token, ERC721Token } from '../../generated/schema';

export function fetchIpfsERC721(token: ERC721Token, basUri: string = 'https://ipfs.io/ipfs/'): void {
	let hash = token.uri.replace(basUri, '');
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

export function fetchIpfsERC1155(token: ERC1155Token, basUri: string = 'https://ipfs.io/ipfs/'): void {
	let hash = token.uri.replace(basUri, '');
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
