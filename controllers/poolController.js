const fs = require('fs');
const javascriptStringify = require('javascript-stringify');

// // Web3
// const Web3 = require('web3');

// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

const web3 = require('../app.js')[1];


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
      // got pools instance, who have a mapping of pool

      return poolsInstance.getPools(addr);
    }).then((result) => {
      const promises = [];
      // I got an array of pools addr --> result = [0x1, 0x2, 0x3]
      // now I need to get each Pool instances.
      for (let i = 0; i < result.length; i += 1) {
        promises.push(Pool.at(result[i]));
      }

      return Promise.all(promises);
    }).then((result) => {
      // I got an array of instances --> result = [instance1, instance2, instance3...]

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

        // result looks like : []

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
    const { addr } = req.params;

    let poolInstance;
    console.log(`Show Pool ${addr}`);

    Pool.at(addr).then((instance) => {
      console.log(instance);

      poolInstance = instance;

      const promises = [];
      promises.push(poolInstance.deployed_time(), poolInstance.name(), poolInstance.author());
      return Promise.all(promises);
    }).then((result) => {
      console.log(result);
      const pool = {
        date: new Date(result[0].toNumber() * 1000),
        name: result[1],
        author: result[2],
        address: addr,
      };

      res.render('pools/show', { pool });
    }).catch((err) => {
      console.log(err.message);
    });
  },
};
