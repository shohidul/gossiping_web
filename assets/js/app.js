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

                      // ---- all users data
            usersRef.get().then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {

                var childData = childSnapshot.data();
                    
                    
                $(".friend-list").html("");
            if(childData !== null ){
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

	$(".chat-screen .body").html(""); 
     
     var htmlContent;
     dbRef.collection('messages/'+currentUser.uid+'/'+friendUID).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            console.log(doc.id, " => ", doc.data());
            if(doc.data().from_uid !== currentUser.uid ){
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
			  $(".chat-screen .body").append(htmlContent);
            
        });
    });
     
    /*-----start---------------get realtime messages data-----------------------------*/ 
     dbRef.collection('messages/'+currentUser.uid+'/'+friendUID).onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                
                if(change.doc.data().from_uid===friendUID && change.doc.data().to_uid===currentUser.uid){
                    
                    console.log("f uid: "+change.doc.data().from_uid+"data: "+change.doc.data(), "");
                    
                    var htmlContent = '<div class="friend-chat">'
                                    +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                                    +'<div class="selected-user-info">'
                                    + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                                    +'<time class="chat-time">'+change.doc.data().time+'</time></p>'
                                    +'<p class="selected-user-chat">'+change.doc.data().text+'</p></div>'
                                    +'</div>';
                    
                    
                    $(".chat-screen .body").append(htmlContent);
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
});

/* ------------------- Message Send --------------------*/
function sendMessage(){
    
	    var friend_uid = $("#friend_uid").val();
        var message    = $('#chat-box').val();
    
		var date       = moment().format('LL');
		var day        = moment().format('dddd');  ;
		var time       = moment().format('LT');
		var fileurl    = "";
		
        var messageData = {
            from_uid : currentUser.uid,
            text : message,
            to_uid : friend_uid,
			date : date,
			day : day,
			time : time,
			fileurl : fileurl
            }
    
        dbRef.collection('messages/'+currentUser.uid+'/'+friend_uid).doc()
                .set(messageData)
                .then(function(){
                 console.log("Done");
        });
        dbRef.collection('messages/'+friend_uid+'/'+currentUser.uid).doc()
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



