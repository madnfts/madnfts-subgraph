# MADNFTs Subgraph

Indexing 721 and 1155 factory contracts and NFTs whether they are EIP721/EIP1155 compliant or not

**Commands**

```
yarn install
yarn codegen
yarn build
graph auth
# you will be asked to input your key
yarn deploy
```

---

## Local environment

These steps assume you have configured env files appropriate for each repo. Consult readme and example contained in each repo to create these first.

---

**1.** Configure a local blockchain using ganache
```
ganache --host 0.0.0.0 --port 7545 -i 1337 -m "copper borrow project spy rabbit month tuna card patient blind display picture"
```

---

**2.** Deploy smart contracts to local blockchain using truffle
Once running we need to deploy the contracts onto the local chain
```
# madnfts-marketplace-contracts repo

truffle migrate
```

---

**3.** Deploy local Graph node using docker
Install docker and use the below script to fire up the graph node and IPFS and postgres. We use this [docker container](https://github.com/graphprotocol/graph-node/tree/master/docker) for the graph-node setup
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

---

**4.** Deploy local subgraph using graph deploy

```
# madnfts-subgraph repo

yarn create-local
yarn install
yarn codegen
yarn build
yarn deploy-local
```

You can remove a local subgraph via
```
# madnfts-subgraph repo

yarn remove-local
```

---

**5.** Deploy local API using composer and docker

In order to process imports you must run the process queues manually as described in the API repo README.md.
```
# madnfts-api repo

composer install
sail up -d
sail artisan migrate
sail artisan import:academy
sail artisan import:contracts
sail artisan import:tokens
```

---

**6.** Deploy local React UI in dev mode for testing
```
# madnfts-react-ui repo

npm install
npm run dev
```

