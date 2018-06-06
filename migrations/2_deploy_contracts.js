/* eslint-disable */
const Pools = artifacts.require('./Pools.sol');
const Pool = artifacts.require('./Pool.sol');
/* eslint-enable */

module.exports = (deployer) => {
  deployer.deploy(Pools);
  deployer.link(Pools, Pool);
  deployer.deploy(Pool, 3600, 1, 10, 100, 'true', '0x30565A380A89A74000517b827a8dAcdB8d948E65', 5);
};
