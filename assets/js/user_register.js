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
        var date = moment().format('LL');
        var day = moment().format('dddd');
        var time = moment().format('LT');
        var createtime = Date.now();

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
            created_at:createtime,
            created_date:date,
            created_day:day,
            created_time:time,
            created_via : "web",
            uid:"",
            is_active:"new",
            access_token : ""
          
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
                    userData = {};
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


