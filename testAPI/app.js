var pr = $.ajax({
  url : "https://api.fitbit.com/oauth2/token?client_id=2289QD&grant_type=authorization_code&redirect_uri=http%3A%2F%2Fexample.com%2Ffitbit_auth&code=d887f099c670801f21794bba9a5d7a08",
  type: "POST",
  dataType: "json",
  headers: {
    "Authorization": "Basic d887f099c670801f21794bba9a5d7a08=",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  success :
    function(res){
      console.log(res);
    }
});
