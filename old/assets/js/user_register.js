/*--------firebase register function-------------*/
$('#re_password').keypress(function(e){
   if(e.keyCode == 13) {
       doRegister();
   }
});
$('#user_register_btn').on('click', function () {
  doRegister()
});
function doRegister(){
    var userData = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            birth_date: "",
            gender: "",
            email: $('#email').val(),
            phone:"",
            address:"",
            recovery_email: "",
            username: "",
            photo_url:"",
            profile_background_url:"",
            created_at:"",
            created_date:"",
            created_day:"",
            created_month:"",
            user_uid:"",
            is_active:"Online"
          
    };
    var passwords = {
            password : $('#password').val(),
            cPassword : $('#re_password').val(),
    }
    
    if( userData.email !== '' && passwords.password !== ''  && passwords.cPassword !== '' ){
        if( passwords.password == passwords.cPassword ){
          
        firebase.auth().createUserWithEmailAndPassword(userData.email, passwords.password)
          .then(function(user){
            
            auth=user;
            
            console.log("Authenticated successfully with payload:", user);
            
            userData.user_uid = auth.user.uid;
            
            usersRef.child(auth.user.uid)
                    .set(userData)
                    .then(function(){
                        window.location.replace("user_profile.html");
              });
            
          }).catch(function(error){
                console.log("Error creating user:", error);
          });
      } else {
                console.log("password and confirm password didn't match :", error);
        }
    }
}
