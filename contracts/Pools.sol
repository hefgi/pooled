pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'contracts/Pool.sol';

contract Pools is Ownable {

  	mapping (address => address[]) public owners;

	function Pools() public Ownable() {

	}

	function deployPool(string _name, string _author) {
		address newPool = new Pool(_name, _author);
		owners[msg.sender].push(newPool);
	}

	function getPools(address addr) public view returns(address[]) {
		return owners[addr];
	}
}