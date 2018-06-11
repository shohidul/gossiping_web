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
    $("#login_btn").addClass("hidden");
    $("#login_loading").removeClass("hidden");
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
      console.log(photo);
    var firstName = name.split(' ').slice(0, -1).join(' ');
    var lastName = name.split(' ').slice(-1).join(' ');
        var date = moment().format('LL');
        var day = moment().format('dddd');
        var time = moment().format('LT');
        var createtime = Date.now();

        var blob = null;
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", photo); 
        xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
        xhr.onload = function() 
        {
            blob = xhr.response;//xhr.response is now a blob object
            var filename = uid + ".jpg";
            var file = new File([blob], filename, type: "images/jpeg");
             var uploadTask = storageRef.child('images/' + file.name ).put(file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                }, function(error) {
                        console.log(error);
                }, function() {
                      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
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
                                        photo_url:downloadURL,
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


                      });
                });

        }
        xhr.send();



   }).catch(function(error) {

  });
})