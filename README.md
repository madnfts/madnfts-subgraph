# MADNFTs Subgraph

Indexing 721 and 1155 factory contracts and NFTs whether they are EIP721/EIP1155 compliant or not

---

### Development

```
yarn install
yarn codegen
yarn build
graph auth
# you will be asked to input your key
yarn deploy
```

---

### Local environment

**1.** We configure a ganache environment
```
ganache --host 0.0.0.0 --port 7545 -i 1337 -m "copper borrow project spy rabbit month tuna card patient blind display picture"
```

**2.** Deploy smart contracts to ganache using truffle
Once running we need to deploy the contracts onto the local chain
```
# madnfts-marketplace-contracts repo

truffle migrate
```

**3.** Running local Graph node
Install docker and use the below script to fire up the graph node and IPFS and postgres
```
# madnfts-subgraph repo

cd docker
docker-compose down -v;

if [ -d "data" ]
then
  # we need to sudo this
  sudo rm -rf data/;
fi

docker-compose up;
```


