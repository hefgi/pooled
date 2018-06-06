pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol'; 
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';


contract Pool is Ownable {
	using SafeMath for uint256;

  enum State {
	  Open, //users can send ETH to pool
	  Close, //users can't send ETH to pool, waiting owner to send funds
	  Transferred, //funds has been send, waiting to receive tokens
	  Claiming // claiming started
  }

  // This is the current state.
  State public state = State.Open;

	address internal poolsContract;

  uint256 public deployedAt;
  uint256 public closeAt; 

  address public dest;

  uint256 public minPerUser;
  uint256 public maxPerUser;
  uint256 public maxPool;
  mapping (address => uint256) public balance;
  uint256 public totalEth = 0;

  //autoclaim
  bool public autoClaim;
  // ERC20[] public tokens;
  mapping (address => bool) public tokens;

  //fees
  uint16 public ownerFeesPct; //will be divided by 1000. Exemple for 0.5%, ownerFees = 5

  // mapping (address => mapping (ERC20 => uint256)) public userTotalTokenClaimed;
  mapping (address => mapping (address => uint256)) public userTotalTokenClaimed;

  //from standard tokens
  mapping (address => mapping (address => uint256)) internal allowed;

  // Question : Is this correct ?
  // we can have this by looping in userTotalTokenClaimed, but it's better like this to save gas
  // mapping (ERC20 => uint256) public poolTotalTokenClaimed; 
  mapping (address => uint256) public poolTotalTokenClaimed; 

  event logDeposit(address sender, uint256 amount);
  event logWithdrawal(address receiver, uint256 amount);
  event logClosePool();
  event logReOpenPool();
  event logTransfer(address to, uint256 amount);
  event logAuthorize(ERC20 token);
  event logUnAuthorize(ERC20 token);
  event logClaim(address from, ERC20 token, uint256 amount);

  event logUpdatePool(uint256 _closeSeconds, uint256 _minPerUser, uint256 _maxPerUser, uint256 _maxPool, bool _autoClaim);

	function Pool(uint256 _closeSeconds, uint256 _minPerUser, uint256 _maxPerUser, uint256 _maxPool, bool _autoClaim, address _dest, uint8 _ownerFeesPct) public {
		require(_ownerFeesPct <= 1000);
		require(_closeSeconds > 0);
  	require(_maxPool > totalEth);

		deployedAt = now;

		//https://dappsforbeginners.wordpress.com/tutorials/interactions-between-contracts/
		owner = tx.origin;
		poolsContract = msg.sender;

		dest = _dest;
		ownerFeesPct = _ownerFeesPct;

		minPerUser = _minPerUser;
		maxPerUser = _maxPerUser;
		maxPool = _maxPool;
		//need to use safemath here
		closeAt = now + _closeSeconds * 1 seconds;
		autoClaim = _autoClaim;
	}

	modifier atState(State _state) {
    require(state == _state);
    _;
  }

	modifier notAtState(State _state) {
    require(state != _state);
    _;
  }

	modifier onlyPoolClose() {
		require(closeAt < now);
		_;
	}

	modifier onlyPoolOpen() {
		require(closeAt > now);
		_;
	}

	function updatePool(uint256 _closeSeconds, uint256 _minPerUser, uint256 _maxPerUser, uint256 _maxPool, bool _autoClaim) public onlyPoolOpen atState(State.Open) {
		require(_closeSeconds > 0);
  	require(_maxPool > totalEth);

		minPerUser = _minPerUser;
		maxPerUser = _maxPerUser;
		maxPool = _maxPool;
		//need to use safemath here
		closeAt = now + _closeSeconds * 1 seconds;
		autoClaim = _autoClaim;

		emit logUpdatePool(_closeSeconds, _minPerUser, _maxPerUser, _maxPool, _autoClaim);
  }

	function () external payable onlyPoolOpen atState(State.Open) {
    deposit(msg.sender, msg.value);
  }

  function deposit(address user, uint256 value) public payable onlyPoolOpen {
    // use math contract here to add etc... (because overflow protection)
    
    // TODO: value need to be converted from GWEI to ETH
    uint256 futureUserTotalValue = balance[user] + value;
    uint256 futurePoolTotalValue = totalEth + value;
    require(maxPerUser<=futureUserTotalValue);
    require(value>=minPerUser);
    require(futurePoolTotalValue<=maxPool);

    //TODO: Need to check minPerUser maxPerUser maxPool
    balance[user] = futureUserTotalValue;
    totalEth = futurePoolTotalValue;
    emit logDeposit(user, value);
  }

  function closePool() public onlyOwner onlyPoolOpen atState(State.Open) { 
    closeAt = now;
    state = State.Close;
    emit logClosePool();
  }

  function withdraw(uint256 value) public notAtState(State.Claiming) returns (bool) {
  	require(balance[msg.sender] > 0);
  	require(address(this).balance >= value);
		balance[msg.sender] -= value;
    msg.sender.transfer(value);
    emit logWithdrawal(msg.sender, value);
  }

  function transferFunds(address to) public onlyOwner onlyPoolClose returns (bool) {
  	require(address(this).balance > 0);

  	if (dest != address(0)) {
  		require(dest == to);
  	}

  	if (state != State.Transferred) {
  		// pooled fees
  		uint256 div = uint256(5).div(uint256(1000));
  		uint256 pooledFees = totalEth.mul(div);
  		//uint256 pooledFees = totalEth * (5/1000);
  		// TODO: pooledFees need to be converted from GWEI to ETH
  		poolsContract.transfer(pooledFees);

	  	// owner fee
	  	if (ownerFeesPct > 0) {
	  		uint256 ownerFees = totalEth * (ownerFeesPct/1000);
	  		// TODO: owner need to be converted from GWEI to ETH
	  		owner.transfer(ownerFees);
	  	}
  	}

  	state = State.Transferred;
  	to.transfer(address(this).balance);
  	emit logTransfer(to, address(this).balance);
  }

  // After TGE (token generation event), tokens has been sent to pool. 

	modifier isNotAutoClaim() {
		require(autoClaim == false);
		_;
	}

	modifier poolHasToken(ERC20 token) {
		require(token.balanceOf(address(this)) > 0);
		_;
	}

  // only need to call this function if autoClaim is false
  function authorizeTokenClaim(ERC20 token) public onlyOwner poolHasToken(token) isNotAutoClaim onlyPoolClose returns (bool) {
  	state = State.Claiming;
  	tokens[token] = true;
  	emit logAuthorize(token);

  	return true;
  }

  function unAuthorizeTokenClaim(ERC20 token) public onlyOwner isNotAutoClaim onlyPoolClose returns (bool) {
  	require(autoClaim == false);

  	tokens[token] = false;
  	emit logUnAuthorize(token);

  	return true;
  }

  // NEED TO USE SAFEMATH FOR CALCULATIONS
  function claim(ERC20 token) public onlyPoolClose poolHasToken(token) returns (bool) {
  	//Question : What's the point of doing multiples require again ?
  	require(balance[msg.sender] > 0);

  	if (autoClaim == false) {
  		require(tokens[token]);
  	}

  	uint256 totalPoolTokens = token.balanceOf(address(this)) + poolTotalTokenClaimed[token];
  	
  	uint256 totalUserClaimToken = totalPoolTokens * (balance[msg.sender] / totalEth);
  	// total_tokens*(balance/total_eth)
  	uint256 restUserClaimToken = totalUserClaimToken - userTotalTokenClaimed[msg.sender][token];
  	
  	require(restUserClaimToken > 0);

  	// Question :Is it better to do that first or after transfer ?
  	// then we update our balance
  	poolTotalTokenClaimed[token] += restUserClaimToken;
  	userTotalTokenClaimed[msg.sender][token] += restUserClaimToken;

  	state = State.Claiming;

  	//Question : how do I transfer ERC20 token to user ? I'm confuse here
  	token.transferFrom(address(this), msg.sender, restUserClaimToken);

  	emit logClaim(msg.sender, token, restUserClaimToken);

  	//Question : I saw ERC20 returning bool true, is it a good practices ?
  	return true;
  }

}