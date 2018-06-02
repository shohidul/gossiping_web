var file;
var loadFile = function(event) {
   file = event.target.files[0];
   $("#current_user_photo").attr("src", URL.createObjectURL(event.target.files[0]));
};


$("#go_next").on('click', function(){

var profileData = {
    first_name : $("#first_name").val(),
    last_name : $("#last_name").val(),
    photo_url : file.name,
    username : $("#username").val(),
    recovery_email : $("#recovery_email").val(),
    phone : $("#phone ").val(),
    gender : "",
    birth_date : ""
    
}
    
auth.onAuthStateChanged(function(user) {
  if (user) {
    usersRef.doc(user.uid)
        .update(profileData)
        .then(function() {
               
                console.log("Profile updated successfully successfully!");
            });

      
      
      imageUpload(file);
       loadPage("pages/app.html");
  } else {
        window.location.replace("user_login.html");
  }
});
    
})


$("#go_skip").on('click', function(){
     loadPage("pages/app.html");
})

  
function imageUpload(file){
    console.log("start ........ " + file.name);
   var uploadTask = storageRef.child('images/' + file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        }, function(error) {
                console.log(error);
        }, function() {
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                window.location.replace("index.html");
              });
        });
}


