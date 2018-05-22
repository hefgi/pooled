$(document).ready(() => {
  let curraccount;
  $.get('/pools/getAccounts', (response) => {
    for (let i = 0; i < response.length; i += 1) {
      curraccount = response[i];
      $('#options').append(`<option value='${curraccount}'>"${curraccount}"</option>"`);
    }
  });
});
