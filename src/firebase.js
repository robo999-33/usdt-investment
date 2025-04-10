// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqSI-i89ecC0-Xng5sI3aZ7a4UsbsqMw8",
  authDomain: "usdt-investment-platform.firebaseapp.com",
  projectId: "usdt-investment-platform",
  storageBucket: "usdt-investment-platform.appspot.com",
  messagingSenderId: "826084357958",
  appId: "1:826084357958:web:99a87107aac17418a61747",
  measurementId: "G-B2WWTN7YH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export initialized instances
export { app, db, auth };
