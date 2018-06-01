// Question: How do I import/require web3 and/or tx object
// from outside to avoid disable/enable eslint ?

function addAccountsToNavBar(accounts) {
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
  }

  bindEvents() {
    $(document).on('click', '#sendTx', () => {
      this.createTx();
    });

    return this;
  }

  getAccounts() {
    // this.bindEvents();

    console.log('Getting Accounts...');

    this.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      const [account] = accounts;
      this.account = account;
      addAccountsToNavBar(accounts);

      return this;
    });
    // Question: where should I put my `return this;` ?
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

    const txHash = this.web3.eth.sendTransaction({
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

      // TODO: Redirect to list pools

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

// $('#test').ready(() => {

//   alert(tx);

// });

//   console.log('hello');
//   debugger;
//   // $.ajax({
//  // url: "/pools/txdata",
//   //   method: "GET"
//   // }, function(response){
//   //   console.log('hello2');
//   //   console.log(response.responseJSON) //data is here from server
//   // });

//   $.ajax({
//    url: "/pools/txdata",
//     method: "GET"
//   }).done(function(data) {
//    alert(data);

// I got my data here

// now I can bind events from button with this data

// and do the transaction

//  this._web3.eth.sendTransaction({
//                     from: n.from,
//                     to: n.to,
//                     gas: n.gasLimit,
//                     value: this._web3.toWei(n.value),
//                     data: n.data
//                 }, function(n) {
//                     n && l._logger.error("Failed to send transaction with web3: ", n)
//                 })

//   }).fail(function(data){
//    alert("Try again champ!");
//   });
// });

// I kind fire it if some div are on the page
