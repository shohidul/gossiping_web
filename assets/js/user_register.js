/*--------firebase register function-------------*/
$('#reg_re_password').keypress(function(e){
   if(e.keyCode == 13) {
       doRegister();
   }
});
$('#register_btn').on('click', function () {
    doRegister();
});
function doRegister(){
    
 $("#register_btn").addClass("hidden");
 $("#register_loading").removeClass("hidden");
    
    var userData = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            birth_date: "",
            gender: "",
            email: $('#reg_email').val(),
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
            uid:"",
            is_active:"FirstLogin"
          
    };
    var passwords = {
            password : $('#reg_password').val(),
            cPassword : $('#reg_re_password').val(),
    }
    
    if( userData.email !== '' && passwords.password !== ''  && passwords.cPassword !== '' ){
        if( passwords.password == passwords.cPassword ){
          
        firebase.auth().createUserWithEmailAndPassword(userData.email, passwords.password)
          .then(function(authUser){
                userData.uid = authUser.user.uid;
                usersRef.doc(authUser.user.uid).set(userData)
                .then(function() {
                    $("#registerDiv").fadeOut();
                    $("#registerDiv").addClass("hidden");
                    $("#registerSuccessDiv").removeClass("hidden");
                    $("#registerSuccessDiv").fadeIn();
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
                
            
          }).catch(function(error){
                $("#register_btn").removeClass("hidden");
                $("#register_loading").addClass("hidden");
          });
      } else {
                console.log("password and confirm password didn't match :", error);
        }
    }
}
