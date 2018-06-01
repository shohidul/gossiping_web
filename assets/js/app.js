var currentUser;

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
             })
            

                      // ---- all users data
            usersRef.get().then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

              var childData = childSnapshot.data();

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




/* -------------- Friend onclick ------------------ */

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
     var msg =  messagesRef.where("from_uid", "==", currentUser.uid).where("to_uid", "==", friendUID);
     
     	msg.get().then(function(snapshot) {
        
		 if(snapshot != null){
			 snapshot.forEach(function(item) {

                 console.log(item.data());
                 
			   if(item.data().from_uid == friendUID ){
				htmlContent = '<div class="friend-chat">'
								+'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
								+'<div class="selected-user-info">'
								+ '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
								+'<time class="chat-time">'+item.data().time+'</time></p>'
								+'<p class="selected-user-chat">'+item.data().text+'</p></div>'
								+'</div>';
			   }else{
				htmlContent = '<div class="my-chat">'
							
							+'<div class="selected-user-info">'
							+ '<p class="text-right">'
							+ '<time class="chat-time">'+item.data().time+' </time> &nbsp;&nbsp;'
							+'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
							+ '</p>'
							+'<p class="selected-user-chat text-right pull-right">'+item.data().text+'</p></div>'
							+'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
							+'</div>';
			   }
			  $(".chat-screen .body").append(htmlContent);
			});
		 }
    });
     
	
     
     
     
     
/*    msg.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(item) {
            if (item.type === "added") {
                if(item.doc.data().from_uid == friendUID ){
				htmlContent = '<div class="friend-chat">'
								+'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
								+'<div class="selected-user-info">'
								+ '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
								+'<time class="chat-time">'+item.doc.data().time+'</time></p>'
								+'<p class="selected-user-chat">'+item.doc.data().text+'</p></div>'
								+'</div>';
			   }else{
				htmlContent = '<div class="my-chat">'
							
							+'<div class="selected-user-info">'
							+ '<p class="text-right">'
							+ '<time class="chat-time">'+item.doc.data().time+' </time> &nbsp;&nbsp;'
							+'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
							+ '</p>'
							+'<p class="selected-user-chat text-right pull-right">'+item.doc.data().text+'</p></div>'
							+'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
							+'</div>';
			   }
			  $(".chat-screen .body").append(htmlContent);
                
                
            }
            
        });
    });
     
     */
     
     
     
     
     
    })





/* ------------------- Message Send --------------------*/

function sendMessage(){
	    var friend_uid = $("#friend_uid").val();
        var my_uid = currentUser.uid;
        var message = $('#chat-box').val();
		
		var date = moment().format('LL');
		var day = moment().format('dddd');  ;
		var time = moment().format('LT');
		var fileurl = "";

		
        var friendMessageData = {
            from_uid : my_uid,
            text : message,
            to_uid : friend_uid,
			date : date,
			day : day,
			time : time,
			fileurl : fileurl
            }


       messagesRef.doc()
                .set(friendMessageData)
                .then(function(){
                 console.log("Done");
        });


	$('#chat-box').val("");
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

