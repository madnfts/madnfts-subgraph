import { ipfs, json, JSONValueKind } from '@graphprotocol/graph-ts/index';
import { Attribute, ERC1155Token, ERC721Token, File, Tag } from '../../generated/schema';
import { Bytes } from '@graphprotocol/graph-ts';

export function fetchIpfsERC721(token: ERC721Token, contractId: Bytes, basUri: string | null = 'https://ipfs.io/ipfs/'): void {
	let hash = basUri ? token.uri.replace(basUri, '') : token.uri;
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
			let tagsData = data.mustGet('tags').toArray();
			let tagIds = new Array<string>();
			for (let i=0; i < tagsData.length; i++) {
				let item = tagsData[i].toString();
				if (item) {
					let tag = new Tag(item);
					tag.value = item;
					tag.save();
					tagIds.push(item);
				}
			}
			token.tags = tagIds;
		} else {
			token.tags = null;
		}

		if (data.get('attributes') && data.mustGet('attributes').kind == JSONValueKind.ARRAY) {
			let attributesData = data.mustGet('attributes').toArray();
			let attributeIds = new Array<string>();
			for (let i=0; i < attributesData.length; i++) {
				let item = attributesData[i].toObject();
				let displayType = item.get('display_type') && item.mustGet('display_type').kind == JSONValueKind.STRING ? item.get('display_type')!.toString() : ''
				let traitType = item.get('trait_type') && item.mustGet('trait_type').kind == JSONValueKind.STRING ? item.get('trait_type')!.toString() : ''
				let value = item.get('value') && item.mustGet('value').kind == JSONValueKind.STRING ? item.get('value')!.toString() : ''
				let maxValue = item.get('max_value') && item.mustGet('max_value').kind == JSONValueKind.STRING ? item.get('max_value')!.toString() : ''
				let stringId = (contractId.toHexString() + displayType + traitType + value + maxValue);

				if (traitType && value) {
					let attribute = new Attribute(stringId);
					attribute.displayType = displayType;
					attribute.traitType = traitType;
					attribute.value = value;
					attribute.maxValue = maxValue;
					attribute.save();
					attributeIds.push(stringId);
				}
			}
			token.attributes = attributeIds;
		} else {
			token.attributes = null;
		}

		if (data.get('files') && data.mustGet('files').kind == JSONValueKind.ARRAY) {
			let filesData = data.mustGet('files').toArray();
			let filesIds = new Array<string>();
			for (let i=0; i < filesData.length; i++) {
				let item = filesData[i].toObject();
				let displayType = item.get('display_type') && item.mustGet('display_type').kind == JSONValueKind.STRING ? item.get('display_type')!.toString() : ''
				let traitType = item.get('trait_type') && item.mustGet('trait_type').kind == JSONValueKind.STRING ? item.get('trait_type')!.toString() : ''
				let value = item.get('value') && item.mustGet('value').kind == JSONValueKind.STRING ? item.get('value')!.toString() : ''
				let stringId = (token.id + i.toString());

				if (traitType && value) {
					let file = new File(stringId);
					file.displayType = displayType;
					file.traitType = traitType;
					file.value = value;
					file.save();
					filesIds.push(stringId);
				}
			}
			token.files = filesIds;
		} else {
			token.files = null;
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
	}
}
