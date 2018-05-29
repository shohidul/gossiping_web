/*--------firebase configuration-------------*/
  var config = {
    apiKey: "AIzaSyCu8fp2Kzy3GWGFSiOV_OSGDwHV6-otmrQ",
    authDomain: "gossipapp-8e2a7.firebaseapp.com",
    databaseURL: "https://gossipapp-8e2a7.firebaseio.com",
    projectId: "gossipapp-8e2a7",
    storageBucket: "gossipapp-8e2a7.appspot.com",
    messagingSenderId: "798365592402"
  };
  firebase.initializeApp(config);

/*------------create firebase references-------------*/
var auth        = firebase.auth(); 
var dbRef       = firebase.database();
var usersRef    = dbRef.ref('users');
var messagesRef  = dbRef.ref('messages');
var friendsRef  = dbRef.ref('friends');

