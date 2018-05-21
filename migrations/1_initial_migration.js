/* eslint-disable */
var Migrations = artifacts.require('./Migrations.sol'); 
/* eslint-enable */

module.exports = (deployer) => {
  deployer.deploy(Migrations);
};
