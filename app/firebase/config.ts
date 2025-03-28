import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // firebase config
  apiKey: "AIzaSyAqrYSvtA8WkAEJhRT2dvwb1lnIGvos52Q",
  authDomain: "dizzoni-site.firebaseapp.com",
  projectId: "dizzoni-site",
  storageBucket: "dizzoni-site.appspot.com",
  messagingSenderId: "962756154918",
  appId: "1:962756154918:web:4c5715e5b7e927542f78e7",
  measurementId: "G-G7D18N5RCJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 