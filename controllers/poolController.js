const fs = require('fs');
const javascriptStringify = require('javascript-stringify');

// // Web3
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// const web3 = require('../app.js')[1];


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

function stringForState(state) {
  switch (state) {
    case 0:
      return "open";
    case 1:
      return "close";
    case 2:
      return "transferred";
    case 3: 
      return "claiming";
  }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function poolObject(ob) {
  return {
    createdAt: new Date(ob[4].toNumber() * 1000).toISOString().slice(0,10),
    closeAt: new Date(ob[0][0].toNumber() * 1000).toISOString().slice(0,10),
    minPerUser: ob[0][1].toNumber(),
    maxPerUser: ob[0][2].toNumber(),
    maxPool: ob[0][3].toNumber(),
    totalEth: ob[2].toNumber(),
    autoClaim: ob[0][4],
    dest: ob[0][5],
    ownerFeesPct: ob[0][6].toNumber(),
    state: capitalizeFirstLetter(stringForState(ob[1].toNumber())),
    address: ob[3],
    shortAddress: ob[3].slice(0,8),
    ownerAddress: ob[5]
  };
}

function poolDetailPromises(poolInstance) {
  const promises = [];
  promises.push(poolInstance.getPool());
  promises.push(poolInstance.state());
  promises.push(poolInstance.totalEth());
  promises.push(poolInstance.address);
  promises.push(poolInstance.deployedAt());
  promises.push(poolInstance.owner());
  return promises
}

module.exports = {
  poolCreate: (req, res) => {
    res.render('pools/new');
  },
  poolCreateTx: (req, res, next) => {
    console.log('please');
    console.log(req.query);

    const { minPerUser, maxPerUser, maxPool, dest, closeAt, ownerFeesPct } = req.query;
    
    // TODO: Get autoclaim from HTML
    const autoClaim = 'true';

    // TODO: need to convert '0 %' to '0'
    const realOwnerFeesPct = '0';

    // TODO: Convert date to seconds from now
    const closeSeconds = 3600 * 24 * 10
    let poolsInstance;

    Pools.deployed().then((instance) => {
      poolsInstance = instance;


      const txParams = poolsInstance.deployPool.request(closeSeconds, minPerUser, maxPerUser, maxPool, autoClaim, dest, realOwnerFeesPct).params;

      const tx = {
        receiver: txParams[0].to,
        gas: 0, // I have no idea ?!
        value: 0,
        data: txParams[0].data,
      };

      console.log('test');

      console.log(tx);

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
        const nestedPromises = poolDetailPromises(poolInstance);
        return Promise.all(nestedPromises);
      });
      return Promise.all(promises);
    })
      .then((result) => {
        // result looks like : []

        const pools = [];

        result.forEach((ob) => {
          pools.push(poolObject(ob));
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

      const promises = poolDetailPromises(poolInstance);
      return Promise.all(promises);
    }).then((result) => {
      console.log(result);
      const pool = poolObject(result);

      res.render('pools/show', { pool });
    }).catch((err) => {
      console.log(err.message);
    });
  },
};
