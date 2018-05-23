// const contract = require('truffle-contract');
// const poolsArtifact = require('../build/contracts/Pools.json');

// const Pools = contract(poolsArtifact);
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Display list of all Polls.
module.exports = {
  getAccounts: (req, res) => {
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.log('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        console.log('Couldnt get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      res.send(accs);
    });
  },
  poolList: (req, res) => {
    // we should use web3 on the front-end
    res.render('pools/index');

    // const { account } = req.body.account;

    // Pools.setProvider(web3.currentProvider);
    // let poolsInstance;
    // Pools.deployed().then((instance) => {
    //   poolsInstance = instance;
    //   return poolsInstance.getPools.call(account, { from: this.account });
    // }).then((result) => {
    //   // check what result return here
    //   res.render('pools/index', {
    //     pools: result,
    //   });
    // }).catch((err) => {
    //   console.log(err);
    //   next();
    // });
  },
  poolDetail: (req, res) => {
    // TODO: Need to fetch and show detail of a pool
    res.render('pools/show');
  },
  poolCreateGet: (req, res) => {
    res.render('pools/new');
  },
  poolCreatePost: () => {
    // TODO: Need to deploy a contract here

  },
};
