/*--------firebase configuration-------------*/
var config = {
    apiKey: "AIzaSyBPlftKyBDOkhYs4f49ChUCszFGJV3wGSA",
    authDomain: "gossipweb-e1ec6.firebaseapp.com",
    databaseURL: "https://gossipweb-e1ec6.firebaseio.com",
    projectId: "gossipweb-e1ec6",
    storageBucket: "gossipweb-e1ec6.appspot.com",
    messagingSenderId: "280843844970"
  };

firebase.initializeApp(config);

/*------------create firebase references-------------*/
var auth        = firebase.auth(); 
var dbRef       = firebase.database();
var usersRef    = dbRef.ref('users');
var messageRef  = dbRef.ref('messages');
var messageRef  = dbRef.ref('friends');


