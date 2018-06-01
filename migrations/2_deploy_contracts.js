/* eslint-disable */
const Pools = artifacts.require('./Pools.sol');
const Pool = artifacts.require('./Pool.sol');
/* eslint-enable */

module.exports = (deployer) => {
  deployer.deploy(Pools);
  deployer.link(Pools, Pool);
  deployer.deploy(Pool, 'test', 'FJ');
};
