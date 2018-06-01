var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      
    usersRef.doc(user.uid).get().then(function(doc) {
        
        if (doc.exists) {
            currentUser = doc.data();
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

