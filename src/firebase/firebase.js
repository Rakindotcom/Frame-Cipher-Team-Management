import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || atob("QUl6YVN5QVVTUmNHdXBzWkpuS0YzM3Bwd293Q0QyZVR3dElHUGVJ"),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "team-framecipher.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "team-framecipher",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "team-framecipher.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "377150315089",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:377150315089:web:09b6ac26dfc47cdefff670"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
