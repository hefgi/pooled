// Question: How do I import/require web3 and/or tx object
// from outside to avoid disable/enable eslint ?

function addAccountsToNavBarDropDown(accounts) {
  const $navBarText = $('#navbarText');
  // TODO: Need to delete some object but not empty the entire div
  // $navBarText.empty();

  const spanDOM = '<span class="navbar-text" id="navBarAddress"></span>';
  if (accounts.length < 2) {
    $navBarText.append(spanDOM);
    const $span = $('#navBarAddress');
    if (accounts.length === 0) {
      $span.text('Address not detected');
    } else {
      $span.text(accounts[0]);
    }
  } else {
    $navBarText.append('<ul class="navbar-nav active"><li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" id="navBarAddress" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Address not detected</a><div class="dropdown-menu" id="dropdown-menu" aria-labelledby="navbarDropdownMenuLink"></div></li></ul>');
    for (let i = 0; i < accounts.length; i += 1) {
      const curraccount = accounts[i];
      if (i === 0) {
        const $navBarAddress = $('#navBarAddress');
        $navBarAddress.text(curraccount);
      } else {
        const $dropDownMenu = $('#dropdown-menu');
        $dropDownMenu.append(`<a class="dropdown-item" href="#">${curraccount}</a>`);
      }
    }
  }
}

function addAccountToNavBarItems(account) {
  const $poolsLink = $('#poolsLink');

  if (typeof account !== 'undefined') {
    $poolsLink.attr('href', `/pools?addr=${account}`);
    $poolsLink.removeClass('inactive');
  } else {
    $poolsLink.attr('href', '/pools');
    $poolsLink.attr('class', 'nav-link inactive');
  }
}

function updateNavBarWithRoute(route) {
  const $poolsLink = $('#poolsLink');
  const $createPoolLink = $('#createPoolLink');
  const $homeLink = $('#homeLink');

  if (route.includes('/pools/new')) {
    $createPoolLink.addClass('active');
    $poolsLink.removeClass('active');
    $homeLink.removeClass('active');
  } else if (route.includes('/pools')) {
    $poolsLink.addClass('active');
    $createPoolLink.removeClass('active');
    $homeLink.removeClass('active');
  } else {
    $homeLink.addClass('active');
    $createPoolLink.removeClass('active');
    $poolsLink.removeClass('active');
  }
}

class App {
  constructor() {
    // Initialize web3 and set the provider to the testRPC.
    /* eslint-disable */
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      this.web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      this.web3 = new Web3(this.web3Provider);
    }
    /* eslint-enable */

    this.account = null;
    this.bindEvents();
    this.getRoute();
  }

  bindEvents() {
    $(document).on('click', '#createPoolTx', () => {
      this.createTx();
    });

    return this;
  }

  getRoute() {
    const route = window.location.pathname;
    updateNavBarWithRoute(route);

    return this;
  }

  getAccounts() {
    this.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      const [account] = accounts;
      this.account = account;
      addAccountsToNavBarDropDown(accounts);
      addAccountToNavBarItems(accounts[0]);
      return this;
    });

    return this;
  }

  createTx() {
    /* eslint-disable */
    let txObj;
    if (typeof tx !== 'undefined') {
      txObj = tx;
    } else {
      console.log('tx object missing');
      return this;
    }
    /* eslint-enable */
    console.log('text');
    console.log(tx);
    
    this.web3.eth.sendTransaction({
      from: this.account,
      to: txObj.receiver,
      // gas: txObj.gas, // maybe we should not put gas here ?
      value: this.web3.toWei(txObj.value),
      data: txObj.data,
    }, (err, res) => {
      if (err) {
        console.log(`err : ${err}`);
      }
      console.log(`res : ${res}`);
    });
    return this;
  }
}

$(() => {
  const app = new App();

  $(window).on('load', () => {
    app.getAccounts();
  });
});
