// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-real-estate-app-b0221.firebaseapp.com",
  projectId: "my-real-estate-app-b0221",
  storageBucket: "my-real-estate-app-b0221.firebasestorage.app",
  messagingSenderId: "139200499731",
  appId: "1:139200499731:web:1948791f1d14e8365a6fe6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();