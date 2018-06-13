/*--------firebase configuration-------------*/

firebase.initializeApp({
    apiKey: "AIzaSyBgM3KN6dBZi13eYK4cJA8MRoSX5kvsK4o",
    authDomain: "gossiping-b018c.firebaseapp.com",
    projectId: "gossiping-b018c",
    storageBucket: "gossiping-b018c.appspot.com"
});



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




