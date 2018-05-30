/*--------firebase login function-------------*/
$('#password, #email').keypress(function(e){
   if(e.keyCode == 13) {
       doLogin();
   }
});
$('#do_login_btn').on('click', function () {
   doLogin();
});

var authUser;
function doLogin(){
     if( $('#email').val() !== '' && $('#password').val() !== '' ){
      var loginInfo = {
        email: $('#email').val(),
        password: $('#password').val()
      };
      auth.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
          .then(function(authData) {
          
            dbRef.ref('/users/' + authData.user.uid).update({is_active: "Online"});
          
            loadPage("pages/home.html");
          console.log("Login success!");
        }).catch(function(error) {
          console.log("Login Failed!", error);
        });
    }
}

