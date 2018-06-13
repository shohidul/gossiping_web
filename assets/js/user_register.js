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
    var firstName = $('#first_name').val();
    var lastName = $('#last_name').val();
        var date = moment().format('LL');
        var day = moment().format('dddd');
        var time = moment().format('LT');
        var createtime = Date.now();

    var userData = {
            first_name: firstName,
            last_name: lastName,
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
            access_token : "",
            mood : ""
          
    };
    var passwords = {
            password : $('#reg_password').val(),
            cPassword : $('#reg_re_password').val(),
    }
    
    if( userData.email !== '' && passwords.password !== ''  && passwords.cPassword !== '' ){
        if( passwords.password == passwords.cPassword ){
          
        auth.createUserWithEmailAndPassword(userData.email, passwords.password)
          .then(function(authUser){

            var user = auth.currentUser;
            var actionCodeSettings = {
              url: 'https://mmh3210.gitub.io/gossiping_web/index.html/?email=' + firebase.auth().currentUser.email,
              iOS: {
                bundleId: 'com.example.ios'
              },
              android: {
                packageName: 'com.example.android',
                installApp: true,
                minimumVersion: '12'
              },
              handleCodeInApp: true
            };
            user.updateProfile({
              displayName: firstName + " " + lastName,
              photoURL: ""
            }).then(function() {
                 console.log(" // Update successful.");
                   user.sendEmailVerification().then(function() {
                      console.log("// Email sent.");
                userData.uid = user.uid;
                usersRef.doc(user.uid).set(userData)
                .then(function() {
                        auth.signOut().then(function () {
                                   $("#registerDiv").fadeOut();
                                    $("#registerDiv").addClass("hidden");
                                    $("#registerSuccessDiv").removeClass("hidden");
                                    $("#registerSuccessDiv").fadeIn();
                                    userData = {};
                        }).catch(function (error) {
                            // An error happened.
                        });
             
                    
                    
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
                    }).catch(function(error) {
                        console.log("  // An error happened.");

                    });
             
            }).catch(function(error) {
              // An error happened.
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


