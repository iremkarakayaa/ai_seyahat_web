// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHuhWn0wV507ljBbsYZ8DaYua8sfXRk3o",
  authDomain: "ai-seyahat-planlayici.firebaseapp.com",
  projectId: "ai-seyahat-planlayici",
  storageBucket: "ai-seyahat-planlayici.appspot.com", // .firebasestorage.app yerine .appspot.com olmalı
  messagingSenderId: "657605778368",
  appId: "1:657605778368:web:c9dbbeba188d19f8adc625",
  measurementId: "G-V3EK2LPRYX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app); // Sadece db olarak export et
// export const firestore = getFirestore(app); // Bu satırı kaldırın veya yorum satırına alın
