var config = {
    apiKey: "AIzaSyCu8fp2Kzy3GWGFSiOV_OSGDwHV6-otmrQ",
    authDomain: "gossipapp-8e2a7.firebaseapp.com",
    databaseURL: "https://gossipapp-8e2a7.firebaseio.com",
    projectId: "gossipapp-8e2a7",
    storageBucket: "gossipapp-8e2a7.appspot.com",
    messagingSenderId: "798365592402"
  };

firebase.initializeApp(config);

  //create firebase references
  var Auth = firebase.auth(); 
  var dbRef = firebase.database();
  /*var contactsRef = dbRef.ref('contacts')*/
  var usersRef = dbRef.ref('users');
  var auth = null;

  //Register
  $('#user_register').on('click', function () {
      //alert("start");
    //e.preventDefault();
      
    var data = {
      name: $('#name').val(), //get the email from Form
      email: $('#email').val(), //get the email from Form
    };
    var passwords = {
      password : $('#password').val(), //get the pass from Form
      cPassword : $('#re_password').val(), //get the confirmPass from Form
    }
    
    console.log(passwords.password + "  " +passwords.cPassword);
    
    if( data.email != '' && passwords.password != ''  && passwords.cPassword != '' ){
      if( passwords.password == passwords.cPassword ){
        //create the user
        
          console.log("if if -------true");
          
        firebase.auth()
          .createUserWithEmailAndPassword(data.email, passwords.password)
          .then(function(user){
            //now user is needed to be logged in to save data
            console.log("Authenticated successfully with payload:", user);
            auth = user;
            
            //now saving the profile data
            usersRef
              .child(auth.user.uid)
              .set(data)
              .then(function(){
                console.log("User Information Saved:", auth.user.uid);
              })
           
            console.log("Successfully created user account with uid:", auth.user.uid);
            
          }).catch(function(error){
            console.log("Error creating user:", error);
          });
      } else {
          console.log("password and confirm password didn't match :", error);
        //password and confirm password didn't match
      }
    }  
  });  


$('#do_login').on('click', function () {
      
    if( $('#email').val() != '' && $('#password').val() != '' ){
      //login the user
      var data = {
        email: $('#email').val(),
        password: $('#password').val()
      };
      console.log(data.email+" --------------"+data.password);  
          
      Auth.signInWithEmailAndPassword(data.email, data.password)
          .then(function(authData) {
         
         console.log("Authenticated successfully with payload:", authData.user.uid);
          
          redirectData(authData);
          
        }).catch(function(error) {
          console.log("Login Failed!", error);
          
        });
    }
  });
    
    
function redirectData(authData){
//passing the variable into the window.location URL
    window.location.replace("file:///C:/Users/USER/Documents/GitHub/gossiping_web/index.html");
}