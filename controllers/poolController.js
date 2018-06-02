const fs = require('fs');
const javascriptStringify = require('javascript-stringify');

// Web3
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Truffle
const contract = require('truffle-contract'); // problem here

// Pools contract
const poolsFileContents = fs.readFileSync('build/contracts/Pools.json', 'utf8');
const poolsArtifact = JSON.parse(poolsFileContents);
const Pools = contract(poolsArtifact);

// Fix From dblockunity https://github.com/trufflesuite/truffle-contract/issues/57
Pools.setProvider(web3.currentProvider);
if (typeof Pools.currentProvider.sendAsync !== 'function') {
  Pools.currentProvider.sendAsync = function provider(...args) {
    return Pools.currentProvider.send(...args);
  };
}

// Pool contract
const poolFileContents = fs.readFileSync('build/contracts/Pool.json', 'utf8');
const poolArtifact = JSON.parse(poolFileContents);
const Pool = contract(poolArtifact);

// Fix From dblockunity https://github.com/trufflesuite/truffle-contract/issues/57
Pool.setProvider(web3.currentProvider);
if (typeof Pool.currentProvider.sendAsync !== 'function') {
  Pool.currentProvider.sendAsync = function provider(...args) {
    return Pool.currentProvider.send(...args);
  };
}

module.exports = {
  poolCreate: (req, res) => {
    res.render('pools/new');
  },
  poolCreateTx: (req, res, next) => {
    const { name, author } = req.query;

    let poolsInstance;

    Pools.deployed().then((instance) => {
      poolsInstance = instance;

      const txParams = poolsInstance.deployPool.request(name, author).params;

      const tx = {
        receiver: txParams[0].to,
        gas: 0, // I have no idea ?!
        value: 0,
        data: txParams[0].data,
      };

      res.render('pools/new-tx', { tx, txString: javascriptStringify(tx) });
    }).catch((err) => {
      console.log(`error ${err.message}`);
      next();
    });
  },
  poolList: (req, res) => {
    const { addr } = req.query;

    let poolsInstance;

    Pools.deployed().then((instance) => {
      poolsInstance = instance;

      return poolsInstance.getPools(addr);
    }).then((result) => {
      const promises = [];

      for (let i = 0; i < result.length; i += 1) {
        promises.push(Pool.at(result[i]));
      }

      return Promise.all(promises);
    }).then((result) => {
      const promises = result.map((poolInstance) => {
        const nestedPromises = [];
        nestedPromises.push(poolInstance.deployed_time());
        nestedPromises.push(poolInstance.name());
        nestedPromises.push(poolInstance.author());
        nestedPromises.push(poolInstance.address);
        return Promise.all(nestedPromises);
      });
      return Promise.all(promises);
    })
      .then((result) => {
        const pools = [];

        result.forEach((ob) => {
          pools.push({
            date: new Date(ob[0].toNumber() * 1000),
            name: ob[1],
            author: ob[2],
            address: ob[3],
          });
        });

        console.log('pools');
        console.log(pools);
        res.render('pools/index', { pools });
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  poolDetail: (req, res) => {
    // TODO: Need to fetch and show detail of a pool
    res.render('pools/show');
  },
};
