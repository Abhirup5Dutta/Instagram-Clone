import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBOrNKxjb8YQ79YEDAY0vswY3gTVC5F9Xo",
    authDomain: "instagram-clone-d30be.firebaseapp.com",
    projectId: "instagram-clone-d30be",
    storageBucket: "instagram-clone-d30be.appspot.com",
    messagingSenderId: "612486934873",
    appId: "1:612486934873:web:78b6811d21f6d893d9dc48",
    measurementId: "G-JKKBQWMKWZ"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebase.storage();

export { db, auth, storage };