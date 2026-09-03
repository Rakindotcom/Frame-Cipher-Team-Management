// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUSRcGupsZJnKF33ppwowCD2eTwtIGPeI",
    authDomain: "team-framecipher.firebaseapp.com",
    projectId: "team-framecipher",
    storageBucket: "team-framecipher.firebasestorage.app",
    messagingSenderId: "377150315089",
    appId: "1:377150315089:web:09b6ac26dfc47cdefff670"
};

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
