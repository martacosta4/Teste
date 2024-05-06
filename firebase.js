// Import the functions you need from the SDKs you need
import * as firebase from "firebase/compat";
import {GoogleAuthProvider} from "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVtZwvthlqP5InCR2bNoff5lPKcHo86_8",
  authDomain: "ezycard-e098d.firebaseapp.com",
  projectId: "ezycard-e098d",
  storageBucket: "ezycard-e098d.appspot.com",
  messagingSenderId: "175550403157",
  appId: "1:175550403157:web:3b637125fd5dfa80de3adc"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const provider = new GoogleAuthProvider();
const auth = firebase.auth()

const db = firebase.firestore();

export { auth,provider,db};