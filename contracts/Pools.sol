pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'contracts/Pool.sol';

contract Pools is Ownable {

  mapping (address => address[]) public owners;

  event poolCreated(address indexed pool, address indexed owner);

	function Pools() public Ownable() {

	}

	// function deployPool() {
	function deployPool(uint256 _closeSeconds, uint256 _minPerUser, uint256 _maxPerUser, uint256 _maxPool, bool _autoClaim, address _dest, uint8 _ownerFeesPct) public returns (address) {
		require(_ownerFeesPct <= 1000);
		require(_closeSeconds > 0);
  	require(_maxPool > 0);
		// address newPool = new Pool( 3600, 1, 10, 100, true, address(0), 5);

		address newPool = new Pool( _closeSeconds, _minPerUser, _maxPerUser, _maxPool, _autoClaim, _dest, _ownerFeesPct);
		owners[msg.sender].push(newPool);
		emit poolCreated(newPool, msg.sender);
		return newPool;
	}

	function getPools(address addr) public view returns(address[]) {
		return owners[addr];
	}

	// Need to do a withdraw function. 
	// Later on better to have a smart contract just for fees
}