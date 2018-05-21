pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Pools is Ownable {

  	mapping (address => address[]) internal allowed;

	function Pools() public Ownable() {

	}
}