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

Pools.setProvider(web3.currentProvider);
if (typeof Pools.currentProvider.sendAsync !== "function") {
    Pools.currentProvider.sendAsync = function() {
        return Pools.currentProvider.send.apply(
            Pools.currentProvider, arguments
        );
    };
}

// const poolsArtifact = require('../build/contracts/Pools.json');

// const poolsContract = truffleContract(poolsArtifact);
// poolsContract.setProvider(web3.currentProvider);

// Pool contract
const poolArtifact = require('../build/contracts/Pool.json');

const poolContract = contract(poolArtifact);
poolContract.setProvider(web3.currentProvider);


// const Pools = contract(poolsArtifact);

// Display list of all Polls.
module.exports = {
  poolCreate: (req, res) => {
    res.render('pools/new');
  },
  poolCreateTx: (req, res) => {
    // TODO: grab parameters from req
    console.log(req.query);

    const { name, author } = req.query;

    console.log(`Name ${name} Author ${author}`);

    console.log(`web3 ${web3}`);

    console.log(`truffleContract ${contract}`);


    console.log(`poolsArtifact ${poolsArtifact}`);

    console.log(`poolsContract ${Pools}`);

    // pools = Pools.deployed().then(function(instance) {

    //   console.log('success');
    //     // instance.getBalance.call(account, {from: account}).then(function(value) {
    //     //     console.log("Printing value: value of....");
    //     //     console.log(value.valueOf());
    //     // });
    // }).catch(function(e) {
    //     console.error(`error ${e}`);
    // });

    let poolsInstance;

    Pools.deployed().then((instance) => {
      poolsInstance = instance;

      // need to do the magic and return a tx object
      const txParams = poolsInstance.deployPool.request(name, author).params;

      console.log(`params :`);
      console.log(txParams);

      const tx = {
        receiver: txParams[0].to,
        gas: 0, // I have no idea ?!
        value: 0,
        data: txParams[0].data,
      };
      console.log(`tx :`);
      console.log(javascriptStringify(tx));

      res.render('pools/new-tx', { tx, txString: javascriptStringify(tx) });
    }).catch((err) => {
      console.log(`error ${err.message}`);
    });
  },
  poolList: (req, res) => {
    // we should use web3 on the front-end
    res.render('pools/index');

    // LOGIC TO GRAB LIST OF POOLS FOR A USER

    // const { account } = req.body.account;

    // Pools.setProvider(web3.currentProvider);
    // let poolsInstance;
    // Pools.deployed().then((instance) => {
    //   poolsInstance = instance;
    //   return poolsInstance.getPools.call(account, { from: this.account });
    // }).then((result) => {
    //   // check what result return here
    // res.render('pools/index', {
    //   pools: result,
    // });
    // }).catch((err) => {
    //   console.log(err);
    //   next();
    // });
  },
  poolDetail: (req, res) => {
    // TODO: Need to fetch and show detail of a pool
    res.render('pools/show');
  },
};
