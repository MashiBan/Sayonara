// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADaY37mAXeX2LDRIpxQ6BuK938stEyneU",
  authDomain: "sayonara-seniors.firebaseapp.com",
  projectId: "sayonara-seniors",
  storageBucket: "sayonara-seniors.firebasestorage.app",
  messagingSenderId: "729228609482",
  appId: "1:729228609482:web:20424cf874a5636cf17133"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);    
auth.useDeviceLanguage();

export {auth , firestore ,  collection, app, signOut}