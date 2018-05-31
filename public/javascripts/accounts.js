$(document).ready(() => {
  let curraccount;
  $.get('/pools/getAccounts', (response) => {
    const span = '<span class="navbar-text" id="navBarAddress"></span>';
    if (response.length === 0) {
      $('#navbarText').append(span);
      $('#navbarText').text('Address not detected');
    } else if (response.length === 1) {
      $('#navbarText').append(span);
      $('#navbarText').text(response[0]);
    } else {
      $('#navbarText').append('<ul class="navbar-nav active"><li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" id="navBarAddress" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Address not detected</a><div class="dropdown-menu" id="dropdown-menu" aria-labelledby="navbarDropdownMenuLink"></div></li></ul>');
      for (let i = 0; i < response.length; i += 1) {
        curraccount = response[i];
        if (i === 0) {
          $('#navBarAddress').text(curraccount);
        } else {
          $('#dropdown-menu').append(`<a class="dropdown-item" href="#">${curraccount}</a>`);
        }
      }
    }
  });
});

$('#test').ready(() => {

  alert(tx);

});

  // console.log('hello');
  // debugger;
 //  // $.ajax({
  //  // url: "/pools/txdata",
 //  //   method: "GET"
 //  // }, function(response){
 //  //   console.log('hello2');
 //  //   console.log(response.responseJSON) //data is here from server
 //  // });

 //  $.ajax({
  //  url: "/pools/txdata",
 //    method: "GET"
 //  }).done(function(data) {
  //  alert(data);

// I got my data here

// now I can bind events from button with this data

// and do the transaction

 // this._web3.eth.sendTransaction({
 //                    from: n.from,
 //                    to: n.to,
 //                    gas: n.gasLimit,
 //                    value: this._web3.toWei(n.value),
 //                    data: n.data
 //                }, function(n) {
 //                    n && l._logger.error("Failed to send transaction with web3: ", n)
 //                })

  // }).fail(function(data){
  //  alert("Try again champ!");
  // });
// });

// I kind fire it if some div are on the page


