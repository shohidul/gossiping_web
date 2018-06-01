/*--------firebase configuration-------------*/

firebase.initializeApp({
    apiKey: "AIzaSyBgM3KN6dBZi13eYK4cJA8MRoSX5kvsK4o",
    authDomain: "gossiping-b018c.firebaseapp.com",
    projectId: "gossiping-b018c"
});



/*------------create firebase references-------------*/
var auth        = firebase.auth(); 

//var storageRef = firebase.storage().ref();

var dbRef       = firebase.firestore();
var usersRef    = dbRef.collection('users');
var messagesRef = dbRef.collection('messages');
var friendsRef  = dbRef.collection('friends');



