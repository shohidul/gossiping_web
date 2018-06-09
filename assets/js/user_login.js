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
