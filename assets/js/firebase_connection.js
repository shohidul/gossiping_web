/*--------firebase configuration-------------*/

firebase.initializeApp({
   apiKey: "AIzaSyBgM3KN6dBZi13eYK4cJA8MRoSX5kvsK4o",
    authDomain: "gossiping-b018c.firebaseapp.com",
   projectId: "gossiping-b018c",
    storageBucket: "gossiping-b018c.appspot.com"
});




/*
  var firebaseConfig = {
    apiKey: "AIzaSyCu8fp2Kzy3GWGFSiOV_OSGDwHV6-otmrQ",
    authDomain: "gossipapp-8e2a7.firebaseapp.com",
    databaseURL: "https://gossipapp-8e2a7.firebaseio.com",
    projectId: "gossipapp-8e2a7",
    storageBucket: "gossipapp-8e2a7.appspot.com",
    messagingSenderId: "798365592402",
    appId: "1:798365592402:web:8a5b0a8737e1dfc266688b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
*/


/*------------create firebase references-------------*/
const auth        = firebase.auth(); 

const storageRef = firebase.storage().ref();

const dbRef       = firebase.firestore();
const settings = {timestampsInSnapshots: true}; 

      dbRef.settings(settings);

const usersRef    = dbRef.collection('users');
const messagesRef = dbRef.collection('messages');
const friendsRef  = dbRef.collection('friends');
const recentChatRef  = dbRef.collection('recentchat');




