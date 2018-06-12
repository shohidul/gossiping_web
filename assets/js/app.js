var currentUser;
var password = 'test';
function decrypt(message, password){
        var decrypted = CryptoJS.AES.decrypt(message, password);
        return decrypted.toString(CryptoJS.enc.Utf8);
}
/* -------------- get currentUser and his/her friendlist and so ------------------ */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        
        usersRef.doc(user.uid).get().then(function (doc) {

            if (doc.exists) {
                
                // ---- current user data
                currentUser = doc.data();
                var userFullName = currentUser.first_name + " " + currentUser.last_name;
                if(currentUser.is_active == "new"){
                   // $(".welcome-screen").addClass("hidden");
                    $(".edit-profile").removeClass("hidden");
                     $("#user_profile_name").text(userFullName);
                    usersRef.doc(currentUser.uid).update({
                        "is_active": "Online"
                    })
                    $("#currenUserStatus").text("Online");
                }else{
                     usersRef.doc(currentUser.uid).update({
                        "is_active": "Online"
                    })     
                   $("#currenUserStatus").text("Online");
                    //$(".welcome-screen").removeClass("hidden");
                }
                
                 $("#currenUsersFullName").text(userFullName);
                 $("#statusSignal").addClass("green-dot");

          
    dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 2)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                // current_user in from and in to
                
                if (change.type === "added") {

                     usersRef.doc(change.doc.data().from_uid).get().then(function (doc) {

                        if (doc.exists) {
                            var childData = doc.data();
                            var status;
                            if(childData.is_active == "Online"){ 
                                status =  '<span class="dot green-dot"></span>';
                            }else if(childData.is_active == "Offline"){
                                status = '<span class="dot grey-dot"></span>';
                            }
                            storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                                var friendlisthtml = '<li class="friend">' 
                                          + '<div class="friend-body">'
                                          +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                          +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                          +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                          +'<input type="hidden" class="friendship-id" value="'+change.doc.id+'"/>'
                                          +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                          + '<p class="user-thought">Whats up guys</p></div>'
                                          + '<div class="user-status"><span class="user-activity"></span>'+ status +'</div>'
                                          + '</div>'
                                          + '</li>';

                                $(".friend-list").append(friendlisthtml);
                                friendlisthtml = "";
                            });
                        }
                    })


                }

            });
        });
    
        dbRef.collection("friendship").where("from_uid", "==", currentUser.uid).where("status", "==", 2)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {

                if (change.type === "added") {
       
                    usersRef.doc(change.doc.data().to_uid).get().then(function (doc) {
                        
                        if (doc.exists) {
                            var childData = doc.data();
                            var status;
                            if(childData.is_active == "Online"){ 
                                status =  '<span class="dot green-dot"></span>';
                            }else if(childData.is_active == "Offline"){
                                status = '<span class="dot grey-dot"></span>';
                            }
                            storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                                var friendlisthtml = '<li class="friend">' 
                                          + '<div class="friend-body">'
                                          +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                          +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                          +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                          + '<input type="hidden" class="friendship-id" value="'+change.doc.id+'"/>'
                                          +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                          + '<p class="user-thought">Whats up guys</p></div>'
                                          + '<div class="user-status"><span class="user-activity"></span>'+ status + '</div>'
                                          + '</div>'
                                          + '</li>';

                                $(".friend-list").append(friendlisthtml);
                            });
                        }
                    })

                }

            });
        });
    

                $(".notification-list").html("");
                dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 1)
                    .onSnapshot(function (snapshot) {
                        if (snapshot.size != 0) {
                            $("#notificationCount").text(snapshot.size);
                            $("#notification_badge").text(snapshot.size);
                        } else {
                            $("#notificationCount").text("");
                            $("#notification_badge").text("");
                        }
                        snapshot.docChanges().forEach(function (change) {
                            if (change.type === "added") {
                                usersRef.doc(change.doc.data().from_uid).get().then(function (doc) {

                                    if (doc.exists) {
                                        var childData = doc.data();
                                        storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                                            var searchlisthtml = '<li class="friend">' 
                                                      + '<div class="friend-body">'
                                                      +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                                      +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                                      +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                                      +	'<input type="hidden" class="from-uid" value="'+change.doc.data().from_uid+'"/>'
                                                      +	'<input type="hidden" class="friendship-uid" value="'+change.doc.id+'"/>'
                                                      +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                                      + '<p class="user-thought">Whats up guys</p></div>'
                                                      + '<div class="request-status">'
                                                      + '<button type="submit" class="btn btn-success btn-raised btn-fab btn-round acceptBtn"><i class="material-icons">done</i></button>'
                                                      + '<button type="submit" class="btn btn-danger btn-raised btn-fab btn-round rejectBtn"><i class="material-icons">close</i></button>'
                                                      + '</div>'
                                                      + '</div>'
                                                      + '</li>';

                                            $(".notification-list").append(searchlisthtml);
                                            
                                            $.notify(childData.first_name + " has sent you a request", { title: "Friend Request!" }, { url: url});

                                        });
                                    }
                                })
                            }
                        });
                    });
                
                     dbRef.collection("channels").where("status", "==", 1).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) { 
            
                var childData = doc.data();
                 
                     
                    var channellisthtml =  '<li class="channel">' 
                                          + '<div class="channel-body">'
                                          +	'<img id="channel_image" class="user-image" src="assets/img/channel.jpg" alt="">'
                                          +	'<div class="user-info"><p id="channel_name" style="font-weight:bold;">'+childData.channel_name+'</p>'
                                          + '<input type="hidden" class="channel-name" value="'+childData.channel_name+'"/>'
                                          +	'<input type="hidden" class="channel-id" value="'+childData.channel_id+'"/>'
                                          + '<input type="hidden" class="created-by" value="'+childData.created_by+'"/>'
                                          + '<input type="hidden" class="created-by-name" value="'+childData.created_by_name+'"/>'
                                          +	'<input type="hidden" class="user-status" value=""/>'
                                          + '<p class="user-thought">'+childData.created_by_name+'</p></div>'
                                          + '</div>'
                                          + '</li>';

                                          $(".channel-list").append(channellisthtml);

          
        });
    });
 
                
                
                
              if(doc.data().photo_url != ""){
                 storageRef.child('images/' + doc.data().photo_url).getDownloadURL().then(function (url) {
                    $("#currentUserImg").attr("src", url);
                    $("#content_loading").addClass("hidden");
                    $(".main-container").removeClass("hidden");
                     
                     
                });
                }
            } else {
                console.log("No such document!");
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    } else {
        loadPage("pages/login.html");
    }
});



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
    $(".friend-list").html("");
     usersRef.doc(currentUser.uid).update({
            "is_active": "Offline"
     });
    auth.signOut().then(function () {
        
    }).catch(function (error) {
        // An error happened.
    });
    window.location.href = "index.html";
});
