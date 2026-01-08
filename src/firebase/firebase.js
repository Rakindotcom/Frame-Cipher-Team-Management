// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAC0_3SczeKA6_sNanfBOweJpsjaMqBkw",
    authDomain: "team-ckh.firebaseapp.com",
    projectId: "team-ckh",
    storageBucket: "team-ckh.firebasestorage.app",
    messagingSenderId: "122314034504",
    appId: "1:122314034504:web:351ba78039b25e4f42b77d"
};

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
