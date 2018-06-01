pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'contracts/Pool.sol';

contract Pools is Ownable {

  mapping (address => address[]) public owners;

  event poolCreated(address indexed pool, address indexed owner);

	function Pools() public Ownable() {

	}

	function deployPool(string _name, string _author) public returns (address) {
		address newPool = new Pool(_name, _author);
		owners[msg.sender].push(newPool);
		emit poolCreated(newPool, msg.sender);
		return newPool;
	}

	function getPools(address addr) public view returns(address[]) {
		return owners[addr];
	}
}