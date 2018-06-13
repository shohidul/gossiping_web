var currentUser = auth.currentUser;

var password = 'test';

/* -------------- get currentUser and his/her friendlist and so ------------------ */
/*
auth.onAuthStateChanged(function (userdata) {
    if (userdata) {
        console.log(userdata +"...")
        var user = userdata;
        console.log(user +"|||")
         //loadPage("pages/app.html");


    } else {
        loadPage("pages/login.html");
    }
});

*/


$("#searchBtn").on("click", function(e){
    e.preventDefault();
})

$("#send_btn").on("click", function(){
    if($("#chat_flag").val() == "p2p"){
        sendMessage();
    }else if($("#chat_flag").val() == "chnl"){
          sendChannelMsg();   
    }
    
})

$('#chat-box').keypress(function (e) {
    if (e.which == 13 && !e.shiftKey) {
            if($("#chat_flag").val() == "p2p"){
                sendMessage();
            }else if($("#chat_flag").val() == "chnl"){
                  sendChannelMsg();   
            }

        e.preventDefault();
        $(".chat-screen .body").animate({scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);
    }
    /*if (e.shiftKey) {
        this.value = this.value+"\n";
    }*/
});



$("#search_box").on("input", function () {
    
    $(".search-list").html("");
    dbRef.collection('users').where("email", "==", $(this).val()).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc != null && doc.data().uid != currentUser.uid) {
                $("#searchBtn").addClass("hidden");
                $(".nav-pill-tabs").addClass("hidden");

                $("#searchCloseBtn").removeClass("hidden");
                $(".search-list").removeClass("hidden");
                var childData = doc.data();
                storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                    var searchlisthtml = '<li class="friend">' 
                                      + '<div class="friend-body">'
                                      +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                      +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                      +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                      +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                      + '<p class="user-thought">Whats up guys</p></div>'
                                      + '<div class="user-status"><span class="user-activity"></span><span class="green-dot"></span></div>'
                                      + '</div>'
                                      + '</li>';

                    $(".search-list").append(searchlisthtml);

                });
            }

        });

        //$(".chat-screen .body").html(html); 
    });
});

$("#searchCloseBtn").on("click", function (e) {
    e.preventDefault();
    $("#searchBtn").removeClass("hidden");
    $(".nav-pill-tabs").removeClass("hidden");

    $("#searchCloseBtn").addClass("hidden");
    $(".search-list").addClass("hidden");

    $(".search-list").html("");
    $("#search_box").val("");

    $("#add_friend").parent().addClass("hidden");
});


 $(".search-list").on("click", '.friend', function (e) {
     if ($('.chat-screen').hasClass("hidden")) {
         $('.welcome-screen').addClass("hidden");
         $('.first-screen .body').addClass("hidden");
         $('.chat-screen').removeClass("hidden");
     }

     var friendUID = $(this).find(".user-uid").val();
     var friendName = $(this).find(".user-full-name").text();
     var friendStatus = $(this).find(".user-status").val();
     var friendPhotoUrl = $(this).find(".user-image").attr('src');

     $("#friend_name").text(friendName);
     $("#friend_status").text(friendStatus);
     $("#friend_uid").val(friendUID);
     $("#friend_image").attr("src", friendPhotoUrl);

     /*dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 1)
       .onSnapshot(function(snapshot) { 
            if(snapshot.size != 0){
             $("#notificationCount").text(snapshot.size);
         }else{
              $("#notificationCount").text("");
         }
       });*/

     $(".chat-screen .body").html("");
     $("#add_friend").parent().removeClass("hidden");

 });



$("#edit-profile-img").on("click", function(){
    $("#browsedImage").trigger("click");
})




var file = "";
var loadFile = function(event) {
   file = event.target.files[0];
   $("#edit-profile-img").attr("src", URL.createObjectURL(event.target.files[0]));
};



$("#btn_image_send").on("click", function(event){
    $("#sentImage").trigger("click");
})



function imageUpload(file){
   var uploadTask = storageRef.child('images/' + currentUser.uid+".jpg").put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
        }, function(error) {
                console.log(error);
        }, function() {
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                $(".edit-profile").addClass("hidden");
                 $("#currentUserImg").attr("src", downloadURL);
              });
        });
}



/*--------firebase logout function-------------*/
$(".logout-btn").on("click", function () {
     usersRef.doc(currentUser.uid).update({
            "is_active": "Offline"
     });
    auth.signOut().then(function () {
        
    }).catch(function (error) {
        // An error happened.
    });
    window.location.href = "index.html";
});

