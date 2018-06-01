/*--------firebase login function-------------*/
$('#login_password').keypress(function(e){
   if(e.keyCode == 13) {
       doLogin();
   }
});
$('#login_btn').on('click', function () {
   doLogin();
});


function doLogin(){
    
    var loginInfo = {
        email: $('#login_email').val(),
        password: $('#login_password').val()
    };
    
    if( loginInfo.email !== '' && loginInfo.password !== '' ){

        auth.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
          .then(function(authData) {
            
            usersRef.doc(authData.user.uid).update({
                "is_active": "Online"
            }).then(function() {
                console.log("Document successfully updated!");
            });

            loadPage("pages/app.html");
            
            console.log("Login success!");
            
        }).catch(function(error) {
            
            console.log("Login Failed!", error);
        });
    }
}
