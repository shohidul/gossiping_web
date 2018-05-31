/*--------firebase get all current user function-------------*/    
var currentUser;

auth.onAuthStateChanged(function(user) {
  if (user) {
/*          var a = dbRef.ref('messages/'+get_my_id+'/'+get_friend_uid);
     a.orderByChild(get_my_id).limitToLast(1).once('child_added', function(snapshot) {
        $(".chat-body").append("<p>"+snapshot.val().text+"</p>");
       
    
});*/
     
        dbRef.ref('/users/' + user.uid).once('value').then(function(snapshot) {
            currentUser = snapshot.val();
            var username = (snapshot.val() && snapshot.val().first_name) || 'Anonymous';
            $("#current_user").text(username);
            $("#current_user_name").text(currentUser.first_name+" "+currentUser.last_name);
            $("#user_status").text(currentUser.is_active);
            
             storageRef.child('images/'+currentUser.photo_url).getDownloadURL().then(function(url) {
                    $("#current_user_profile_photo").attr("src", url);
             })
            
        });
      
      
        dbRef.ref('friends/'+user.uid).once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

              var childData = childSnapshot.val();

                if(childData !== null ){
                    if(childData.status == 0 ){
                    var friendlisthtml='<li class="list-group-item h-25 w-100 p-3 ">'; 
                        friendlisthtml+='<span class="request_user_email">Email : '+childData.to_uid+'</span><br>';
                        friendlisthtml+='<span class="request_user_uid d-none">'+childData.to_uid+'</span>';
                        friendlisthtml+='<button type="button" class="btn btn-success btn-sm btn-accept" onclick="acceptRequest(this)">Accept</button>';
                        friendlisthtml+='<button type="button" class="btn btn-danger btn-sm btn-reject" onclick="rejectRequest(this)">Reject</button>';
                        friendlisthtml+='</li>';
                    $("#request_user").append(friendlisthtml);
                }
             }
          });
        });
      
            dbRef.ref('friends/'+user.uid).once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

              var childData = childSnapshot.val();

                if(childData !== null ){
                    if(childData.status == 1 ){
                        
   dbRef.ref('/users/' + childData.to_uid).once('value').then(function(snapshot) {
    friendUser = snapshot.val();
       var img_url = "";
  
        var friendlisthtml= '<li class="list-group-item h-25 w-100 p-3 friend-user-list" onClick="selectFriendToChat(this);">'; 
            friendlisthtml+= '<div class="row ">';
            friendlisthtml+= '<div class="col-1 align-self-center text-center">';
   /*     
             storageRef.child('images/'+friendUser.photo_url).getDownloadURL().then(function(url) {

                 
             });*/
       
            friendlisthtml+= '<img id="current_user_img" class="rounded-circle" src="" alt="Profile" width="42"                           height="42">';  
            friendlisthtml+= '</div>';
            friendlisthtml+= '<div class="col-11" id="friend-user">';
            friendlisthtml+= '<span id="f_name" class="friend-user-name text-info font-weight-bold">'+friendUser.first_name+'</span><br>';
            friendlisthtml+= '<input type="hidden" value="'+friendUser.user_uid+'" class="friend-user-uid"/>';
            friendlisthtml+= '<span id="f_email" class="friend-user-email">'+friendUser.email+'</span><br>';
            friendlisthtml+= '<span id="f_status" class="friend-user-status text-success">'+friendUser.is_active+'</span><br>';
            friendlisthtml+= '</div></div></li>';
       
         
           
       $("#friend_user").append(friendlisthtml);

 });
             
                    
            }
                    
                    
             }
          });
        });
      
      

       
      
  } else {
        window.location.replace("user_login.html");
  }
});

/*--------firebase logout function-------------*/
$("#logout").on("click", function(){
    auth.signOut().then(function() {
        
        dbRef.ref('/users/' + currentUser.user_uid).update({is_active: "Offline"});
        
        window.location.replace("user_login.html");
    }, function(error) {
        console.log("An error happened.");
    });
});

/*---------------don't change up--------------------------*/


/*--------firebase get all user function-------------*/

dbRef.ref("/users").once("value").then(function(snapshot) {
    
    snapshot.forEach(function(childSnapshot) {
        
      var childData = childSnapshot.val();
        
        if(childData !== null ){
            var friendlisthtml='<li class="list-group-item h-25 w-100 p-3 ">'; 
                friendlisthtml+='<span class="user_name text-info font-weight-bold">Name : '+childData.first_name+' '+childData.last_name+'</span><br>';
                friendlisthtml+='<span class="user_email">Email : '+childData.email+'</span><br>';
            if(childData.is_active==="Online"){
                friendlisthtml+='<span class="user_status text-success">Status : '+childData.is_active+'</span><br>';
            } else {
                friendlisthtml+='<span class="user_status text-danger">Status : '+childData.is_active+'</span><br>';
            } 
                friendlisthtml+='<span class="user_uid d-none">'+childData.user_uid+'</span>';
                friendlisthtml+='<button type="button" class="btn btn-success btn-sm btn-friend-request">Send Request</button>';
                friendlisthtml+='</li>';
            
            $("#add_user").append(friendlisthtml)
        }
  });
});

  
$(".list-group").on("click", ".list-group-item .btn-friend-request", function(){
    var reqUID =$(this).closest('li').find(".user_uid").text();
    var myRequestData = {
        from_uid :  currentUser.user_uid,
        status : "0",
        to_uid : reqUID
    }
    var toRequestData = {
        from_uid :  reqUID,
        status : "0",
        to_uid : currentUser.user_uid
    }
    
      dbRef.ref('friends/'+currentUser.user_uid+'/' + reqUID)
                    .set(myRequestData)
                    .then(function(){
                        console.log("first insert");
      });
    
     dbRef.ref('friends/'+reqUID+'/' + currentUser.user_uid)
                .set(toRequestData)
                .then(function(){
                    console.log("second insert");
     });
    
});


function acceptRequest(el){
    var reqUID =$(el).closest('li').find(".request_user_uid").text();
       dbRef.ref('friends/'+currentUser.user_uid+'/' + reqUID)
                    .update({status : "1"})
                    .then(function(){
                        console.log("first updated");
      });
    
     dbRef.ref('friends/'+reqUID+'/' + currentUser.user_uid)
                .update({status : "1"})
                .then(function(){
                    console.log("second updated");
     });
    
}

function rejectRequest(el){
    var reqUID =$(el).closest('li').find(".request_user_uid").text();
    dbRef.ref('friends/'+currentUser.user_uid+'/' + reqUID)
                    .update({status : "3"})
                    .then(function(){
                        console.log("first updated");
    });
    
     dbRef.ref('friends/'+reqUID+'/' + currentUser.user_uid)
                .update({status : "3"})
                .then(function(){
                    console.log("second updated");
     });
}


var cMessageRef;

//$(".list-group").on("click", ".friend-user-list", function(e){
function selectFriendToChat(e){
    //e.preventDefault();
    var friendUID =$(e).closest('li').find(".friend-user-uid").val();
    var friendName =$(e).closest('li').find(".friend-user-name").text();
    var friendEmail =$(e).closest('li').find(".friend-user-email").text();
    var friendStatus =$(e).closest('li').find(".friend-user-status").text();
   
    $("#chat_f_name").text(friendName);
     $("#chat_f_email").text(friendEmail);
     $("#chat_f_status").text(friendStatus);
    $("#chat_f_uid").text(friendUID);
    

$(".chat-body").html("");  
  cMessageRef = 'messages/'+currentUser.user_uid+'/'+friendUID;
    
    var html ='<div id = "'+friendUID+'">';

    dbRef.ref('messages/'+friendUID+'/' + currentUser.user_uid).limitToLast(20)
            .once('value').then(function(snapshot) {
                 if(snapshot != null){
                     snapshot.forEach(function(item) {
                       $( "#"+friendUID+"").append('<p>'+item.val().text+'</p>');
                         
                    });
                 }
    });

    html+='</div>';
     $(".chat-body").append(html);
    
    var f =   dbRef.ref('messages/'+currentUser.user_uid+'/'+friendUID);
    f.off();
    f.on('child_added', function(snapshot) {
        $( ".chat-body #"+friendUID+"").append("<p>"+snapshot.val().text+"</p>");
    });
    

}


$('#messageInput').keypress(function(e){
   if(e.keyCode == 13) {
       
        var friend_uid = $('#chat_f_uid').text();
        var my_uid = currentUser.user_uid;
        var text = $('#messageInput').val();

        var friendMessageData = {
            from_uid : my_uid,
            text : text,
            to_uid : friend_uid
            }

        var myMessageData = {
            from_uid : my_uid,
            text : text,
            to_uid : friend_uid
            }

        dbRef.ref('messages/'+my_uid).child(friend_uid)
                .push(myMessageData)
                .then(function(){
                 
        });

        dbRef.ref('messages/'+friend_uid).child(my_uid)
                .push(friendMessageData)
                .then(function(){
                
        });
       
      
       
      // printSMS(my_uid ,friend_uid);

        /*dbRef.ref('messages/'+my_uid+'/'+friend_uid).limitToLast(1).once('child_added').then(function(snapshot) {
        
            snapshot.forEach(function(item) {
                        $(".chat-body").append("<p>"+item.val().text+"</p>");
                    });
        });*/
      
   }

});
                             

