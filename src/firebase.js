// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqSI-i89ecC0-Xng5sI3aZ7a4UsbsqMw8",
  authDomain: "usdt-investment-platform.firebaseapp.com",
  projectId: "usdt-investment-platform",
  storageBucket: "usdt-investment-platform.firebasestorage.app",
  messagingSenderId: "826084357958",
  appId: "1:826084357958:web:99a87107aac17418a61747",
  measurementId: "G-B2WWTN7YH5"
}; // <-- this closing curly brace was missing

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };