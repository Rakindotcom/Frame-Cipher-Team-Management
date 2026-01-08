import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Create new user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signUp = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
    return firebaseSignOut(auth);
};

/**
 * Subscribe to auth state changes
 * @param {function} callback 
 * @returns {function} unsubscribe function
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};
