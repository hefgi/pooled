$(document).ready(() => {
  let curraccount;
  $.get('/pools/getAccounts', (response) => {
    for (let i = 0; i < response.length; i += 1) {
      curraccount = response[i];
      $('#options').append(`<option value='${curraccount}'>"${curraccount}"</option>"`);
    }
  });
});

$('#test').ready(() => {

	alert(tx);

});

	// console.log('hello');
	// debugger;
 //  // $.ajax({
	// 	// url: "/pools/txdata",
 //  //   method: "GET"
 //  // }, function(response){
 //  // 	console.log('hello2');
 //  //   console.log(response.responseJSON) //data is here from server
 //  // });

 //  $.ajax({
	// 	url: "/pools/txdata",
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


