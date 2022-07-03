# MADNFTs Subgraph for indexing NFTs from ERC721 and ERC1155 on Rinkeby Testnet

Subgraph to index all NFTs whether they are EIP721/EIP1155 compliant or not

This project uses the
[ERC721MadNfts contract](https://rinkeby.etherscan.io/address/0x53358dB1825EFEed349915e31298aB464637b0E4),
[ERC1155MadNfts contract](https://rinkeby.etherscan.io/address/0x62d8a6D5Ab9Ef0352c86a8777f3b3aae10bFbc3e)

See playground:
https://thegraph.com/hosted-service/subgraph/madnfts/madnfts-subgraph

Feel free to extend the [`schema.graphql`](./schema.graphql) and the
[`mapping.ts`](./src/mapping.ts)

```
yarn install
yarn codegen
yarn build
graph auth
yarn deploy
```
