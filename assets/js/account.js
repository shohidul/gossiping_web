$("#account_settings").on("click", function(){
    
   $(".edit-account").removeClass("hidden"); 
        usersRef.doc(auth.currentUser.uid).get().then(function (doc) {
            if (doc.exists) {
                $("#user_first_name").val(doc.data().first_name);
                $("#user_last_name").val(doc.data().last_name);
            }
        });
});

$("#update_account").on("click", function(){
   
    var pw = $("#user_new_password").val();
    var npw = $("#user_re_new_password").val();
    
    if (pw !='' && pw === npw) {

        var user = firebase.auth().currentUser;
        user.updatePassword(pw).then(function() {

            usersRef.doc(user.uid).update({
                "first_name": $("#user_first_name").val(),
                "last_name": $("#user_last_name").val()
            });
         
        }).catch(function(error) {
          console.log("Password not updated");
        });
    }
    
    $(".edit-account").addClass("hidden"); 
});

