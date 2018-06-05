var currentUser;

/* -------------- get currentUser and his/her friendlist and so ------------------ */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      
    usersRef.doc(user.uid).get().then(function(doc) {
        
        if (doc.exists) {
            
            // ---- current user data
            currentUser = doc.data();
            $("#currenUsersFullName").text(currentUser.first_name+" "+currentUser.last_name);
            $("#currenUserStatus").text(currentUser.is_active);
            
            storageRef.child('images/'+currentUser.photo_url).getDownloadURL().then(function(url) {
                    $("#currentUserImg").attr("src", url);
            });

          $(".friend-list").html("");  
           dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 2)
                .onSnapshot(function(snapshot) { 
                    snapshot.docChanges().forEach(function(change) { 
                        // current_user in from and in to
                        console.log(change.doc.data());
                        if (change.type === "added") {
                        
                                
                             usersRef.doc(change.doc.data().from_uid).get().then(function(doc) { 

                                if (doc.exists) {
                                    var childData = doc.data();            
                                    storageRef.child('images/'+childData.photo_url).getDownloadURL().then(function(url) {
                                        var friendlisthtml = '<li class="friend">' 
                                          + '<div class="friend-body">'
                                          +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                          +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                          +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                          +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                          + '<p class="user-thought">Whats up guys</p></div>'
                                          + '<div class="user-status"><span class="user-activity"></span><span class="green-dot"></span></div>'
                                          + '</div>'
                                          + '</li>';

                                        $(".friend-list").append(friendlisthtml);

                                    });
                                }
                             })
                                
                  
                        }

                    });
                });
            
        dbRef.collection("friendship").where("from_uid", "==", currentUser.uid).where("status", "==", 2)
                .onSnapshot(function(snapshot) { 
                    snapshot.docChanges().forEach(function(change) { 
                        // current_user in from and in to
                        console.log(change.doc.data());
                        if (change.type === "added") {
                        
                                
                             usersRef.doc(change.doc.data().to_uid).get().then(function(doc) { 

                                if (doc.exists) {
                                    var childData = doc.data();            
                                    storageRef.child('images/'+childData.photo_url).getDownloadURL().then(function(url) {
                                        var friendlisthtml = '<li class="friend">' 
                                          + '<div class="friend-body">'
                                          +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                          +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                          +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                          +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                          + '<p class="user-thought">Whats up guys</p></div>'
                                          + '<div class="user-status"><span class="user-activity"></span><span class="green-dot"></span></div>'
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
        .onSnapshot(function(snapshot) { 
             if(snapshot.size != 0){
              $("#notificationCount").text(snapshot.size);
          }else{
               $("#notificationCount").text("");
          }
            snapshot.docChanges().forEach(function(change) { 
                if (change.type === "added") {
                    //console.log(change.doc.data());
                    
                     usersRef.doc(change.doc.data().from_uid).get().then(function(doc) { 
                        
                        if (doc.exists) {
                            var childData = doc.data();            
                            storageRef.child('images/'+childData.photo_url).getDownloadURL().then(function(url) {
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
            +'<button type="submit" class="btn btn-success btn-raised btn-fab btn-round acceptBtn"><i class="material-icons">done</i></button>'
            +'<button type="submit" class="btn btn-danger btn-raised btn-fab btn-round rejectBtn"><i class="material-icons">close</i></button>'
                              + '</div>'
                              + '</div>'
                              + '</li>';

                            $(".notification-list").append(searchlisthtml);

                            });
                        }
                     })
                    
                    
                    
                }

            });
        });
            
            } else {
                console.log("No such document!");
            }
        
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      
      
      
      
      
      }else{
          loadPage("pages/login.html");
      }
    
    
    
});

/* -------------- Friend onclick get chating data with this friend------------------ */

 $(".friend-list").on("click", '.friend', function(e){
    if($('.chat-screen').hasClass("hidden")){ 
        $('.welcome-screen').addClass("hidden");
        $('.chat-screen').removeClass("hidden");
    }
    $(".chat-screen .body").animate({ scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);	

    var friendUID =$(this).find(".user-uid").val(); 
    var friendName =$(this).find(".user-full-name").text();
    var friendStatus =$(this).find(".user-status").val();
    var friendPhotoUrl =$(this).find(".user-image").attr('src');
	
    $("#friend_name").text(friendName);
    $("#friend_status").text(friendStatus);
    $("#friend_uid").val(friendUID);
    $("#friend_image").attr("src", friendPhotoUrl);

	
     
    var html; 
     dbRef.collection('messages').where("friendship_id", "==", 20).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
           // console.log(doc.id, " => ", doc.data());
            var htmlContent = "";
            
                if(doc.data().from_uid == currentUser.uid ){ console.log( "if...."+doc.data().from_uid + " " + currentUser.uid);
				htmlContent = '<div class="friend-chat">'
                            +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                            +'<div class="selected-user-info">'
                            + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                            +'<time class="chat-time">'+doc.data().time+'</time></p>'
                            +'<p class="selected-user-chat">'+doc.data().text+'</p></div>'
                            +'</div>';
                html+= htmlContent;
			     }else{console.log("else...."+doc.data().from_uid + " " + currentUser.uid);
				    htmlContent = '<div class="my-chat">'
							+'<div class="selected-user-info">'
							+ '<p class="text-right">'
							+ '<time class="chat-time">'+doc.data().time+' </time> &nbsp;&nbsp;'
							+'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
							+ '</p>'
							+'<p class="selected-user-chat text-right pull-right">'+doc.data().text+'</p></div>'
							+'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
							+'</div>';
                 html+= htmlContent;       
			   }
          
        });
         
         $(".chat-screen .body").html(html); 
    });
     
    
});

/*var query = firebase.firestore().collection("book")
query = query.where(...)
query = query.where(...)
query = query.where(...)
query = query.orderBy(...)
query.get().then(...)*/


/*-----start---------------get realtime messages data-----------------------------*/ 
    dbRef.collection('messages').onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                
                if(change.doc.data().friendship_id == 20){
                    
                    var htmlContent;

                                if(doc.data().from_uid != currentUser.uid ){
                                htmlContent = '<div class="friend-chat">'
                                            +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                                            +'<div class="selected-user-info">'
                                            + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                                            +'<time class="chat-time">'+doc.data().time+'</time></p>'
                                            +'<p class="selected-user-chat">'+doc.data().text+'</p></div>'
                                            +'</div>';
                                 }else{
                                    htmlContent = '<div class="my-chat">'
                                            +'<div class="selected-user-info">'
                                            + '<p class="text-right">'
                                            + '<time class="chat-time">'+doc.data().time+' </time> &nbsp;&nbsp;'
                                            +'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                                            + '</p>'
                                            +'<p class="selected-user-chat text-right pull-right">'+doc.data().text+'</p></div>'
                                            +'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                                            +'</div>';
                               }
                           $(".chat-screen .body").html(htmlContent);
               
                }
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
    /*-----end---------------get realtime messages data-----------------------------*/
 

/* ------------------- Message Send --------------------*/
function sendMessage(){
    
	    var friend_uid = $("#friend_uid").val();
        var message    = $('#chat-box').val();
    
		var date       = moment().format('LL');
		var day        = moment().format('dddd');
		var time       = moment().format('LT');
		var fileurl    = "";
		
        var messageData = {
            from_uid : currentUser.uid,
            text : message,
            to_uid : friend_uid,
			date : date,
			day : day,
			time : time,
			fileurl : fileurl,
            friendship_id: 20
            }
    
        dbRef.collection('messages').doc()
                .set(messageData)
                .then(function(){
                 console.log("Done");
        });
        dbRef.collection('messages').doc()
                .set(messageData)
                .then(function(){
                 console.log("Done");
        });


	$('#chat-box').val("");
    
    
  /*--start-------------print my send messages---------------------------------------*/  
 var  htmlContent = '<div class="my-chat">'
                +'<div class="selected-user-info">'
                + '<p class="text-right">'
                + '<time class="chat-time">'+time+' </time> &nbsp;&nbsp;'
                +'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                + '</p>'
                +'<p class="selected-user-chat text-right pull-right">'+message+'</p></div>'
                +'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                +'</div>';

  $(".chat-screen .body").append(htmlContent);
    /*-end----------------print my send messages---------------------------------------*/  
    
}
                             
$("#send_btn").on("click", function(){
	 sendMessage();
    $(".chat-screen .body").animate({ scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);
})

$('#chat_box').keypress(function(e){
      if(e.which == 13 && !e.shiftKey) {        
        sendMessage();
        e.preventDefault();
        return false;
    }
});


/*--------firebase logout function-------------*/
$("#logout_btn").on("click", function(){
    
    firebase.auth().signOut().then(function() {
        
        usersRef.doc(auth.user.uid).update({
                "is_active": "Offline"
            }).then(function() {
                
                loadPage("pages/login.html");
                console.log("Document successfully Logout!");
            });
        }).catch(function(error) {
        // An error happened.
    });
});

$("#search_box").on("input", function(){
    
         dbRef.collection('users').where("email", "==", $(this).val()).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                    
                if(doc != null){ console.log(doc.data());
                   $("#searchBtn").addClass("hidden");
                   $(".nav-pill-tabs").addClass("hidden");
                   
                   $("#searchCloseBtn").removeClass("hidden");
                   $(".search-list").removeClass("hidden");
                   var childData = doc.data();            
                   storageRef.child('images/'+childData.photo_url).getDownloadURL().then(function(url) {
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

$("#searchCloseBtn").on("click", function(){
       $("#searchBtn").removeClass("hidden");
       $(".nav-pill-tabs").removeClass("hidden");

       $("#searchCloseBtn").addClass("hidden");
       $(".search-list").addClass("hidden");
    
       $(".search-list").html("");
       $("#search_box").val("");
    
       $("#add_friend").parent().addClass("hidden");
    
});


 $(".search-list").on("click", '.friend', function(e){
    if($('.chat-screen').hasClass("hidden")){ 
        $('.welcome-screen').addClass("hidden");
        $('.chat-screen').removeClass("hidden");
    }
    $(".chat-screen .body").animate({ scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);	

    var friendUID =$(this).find(".user-uid").val(); 
    var friendName =$(this).find(".user-full-name").text();
    var friendStatus =$(this).find(".user-status").val();
    var friendPhotoUrl =$(this).find(".user-image").attr('src');
	
    $("#friend_name").text(friendName);
    $("#friend_status").text(friendStatus);
    $("#friend_uid").val(friendUID);
    $("#friend_image").attr("src", friendPhotoUrl);

	
       $(".chat-screen .body").html(""); 
     
    $("#add_friend").parent().removeClass("hidden");
    
});

$("#add_friend").on("click", function(){
        var reqUID =$("#friend_uid").val();

        var date       = moment().format('LL');
		var day        = moment().format('dddd');
		var time       = moment().format('LT');
		var timestamp  = new Date();
    
        var friendship = {
            from_uid : currentUser.uid,
            to_uid : reqUID,
			date : date,
			day : day,
			time : time,
			timestamp : timestamp,
            status: 1
        }
    
        dbRef.collection('friendship').doc()
                .set(friendship)
                .then(function(){
                 console.log("request sent");
        });
    
});

$(".notification-list").on("click", ".acceptBtn",function(){
    var current_li = $(this).closest("li");
    var request_from = current_li.find(".friendship-uid").val();
    
       dbRef.collection('friendship').doc(request_from).update({
             status: 2
            }).then(function() {
                console.log("Request accepted!");
                 current_li.remove();
            });
    
    
})
$(".notification-list").on("click", ".rejectBtn",function(){
    var current_li = $(this).closest("li");
    var request_from = current_li.find(".friendship-uid").val();
    dbRef.collection('friendship').doc(request_from).update({
             status: 0
            }).then(function() {
                console.log("Request rejected!");
                current_li.remove();
            });
})





