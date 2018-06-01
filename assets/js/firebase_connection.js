/*--------firebase configuration-------------*/

firebase.initializeApp({
    apiKey: "AIzaSyACWy8qmNPbKReG5i7BxjEpuNpcFFaXaLM",
    authDomain: "gossiping-ba908.firebaseapp.com",
    databaseURL: "https://gossiping-ba908.firebaseio.com",
    projectId: "gossiping-ba908",
    storageBucket: "gossiping-ba908.appspot.com",
    messagingSenderId: "783753751112"
});





/*------------create firebase references-------------*/
/*var auth        = firebase.auth(); 

var storageRef = firebase.storage().ref();*/

var dbRef       = firebase.firestore();
var usersRef    = dbRef.collection('users');
var messagesRef  = dbRef.collection('messages');
var friendsRef  = dbRef.collection('friends');

