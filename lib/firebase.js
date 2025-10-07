import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBzq7_dcpD_nFFYgsaiBi29WhH3jXwl7BA",
    authDomain: "uxlab-d9fc2.firebaseapp.com",
    projectId: "uxlab-d9fc2",
    storageBucket: "uxlab-d9fc2.firebasestorage.app",
    messagingSenderId: "1053111628107",
    appId: "1:1053111628107:web:ec521731253306060c78ce",
    measurementId: "G-WJRP8BB4HC"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
