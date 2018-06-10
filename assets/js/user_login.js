/*--------firebase login function-------------*/
$('#login_password').keypress(function (e) {
    if (e.keyCode == 13) {
        doLogin();
    }
});
$('#login_btn').on('click', function () {
    doLogin();
});


function doLogin() {
    $("#login_loading").removeClass("hidden");
    $("#login_btn").addClass("hidden");
    var loginInfo = {
        email: $('#login_email').val(),
        password: $('#login_password').val()
    };

    if (loginInfo.email !== '' && loginInfo.password !== '') {

        auth.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
            .then(function (authData) {
                loadPage("pages/app.html");
            }).catch(function (error) {
                  $("#login_btn").removeClass("hidden");
                  $("#login_loading").addClass("hidden");
                console.log("Login Failed!", error);
            });
    }
}


var provider = new firebase.auth.FacebookAuthProvider();
$("#login_by_fb").on("click", function(){

  firebase.auth().signInWithPopup(provider)
   .then(function(result) {
    $("#login_form").addClass("hidden");
    $("#login_btn").addClass("hidden");
    $("#go_register_btn").addClass("hidden");
    $("#fb_login_loading").removeClass("hidden");
    $("#loading_text").removeClass("hidden");
    
   
    
    var token = result.credential.accessToken;
    var fbuser = result.user;
    var uid = fbuser.uid;
    
    var email = fbuser.email;
    var name = fbuser.displayName;
    var photo = fbuser.photoURL;
    var firstName = name.split(' ').slice(0, -1).join(' ');
    var lastName = name.split(' ').slice(-1).join(' ');
    var date = moment().format('LL');
    var day = moment().format('dddd');
    var time = moment().format('LT');
    var createtime = Date.now();

        usersRef.doc(uid).get().then(function (doc) {

            if (doc.exists) {
                 loadPage("pages/app.html");
            } else {
                
                var userData = {
                        first_name: firstName,
                        last_name: lastName,
                        birth_date: "",
                        gender: "",
                        email: email,
                        phone:"",
                        address:"",
                        recovery_email: "",
                        username: "",
                        photo_url: "",
                        profile_background_url:"",
                        created_at:createtime,
                        created_date:date,
                        created_day:day,
                        created_time:time,
                        created_via : "facebook",
                        uid: uid,
                        is_active:"FirstLogin",
                        access_token : token

                    };

                  usersRef.doc(uid).set(userData)
                            .then(function() {
                                 loadPage("pages/app.html");
                 })
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });


   }).catch(function(error) {
    $("#login_form").removeClass("hidden");
    $("#login_btn").removeClass("hidden");
    $("#go_register_btn").removeClass("hidden");
    $("#fb_login_loading").addClass("hidden");
    $("#loading_text").addClass("hidden");
    
   

  });
})