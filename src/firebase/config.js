import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, onSnapshot, updateDoc, writeBatch } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1WQltLrs_kSysC0Du5bCYAp16lK5icS4",
  authDomain: "kerala-lottery-e5455.firebaseapp.com",
  projectId: "kerala-lottery-e5455",
  storageBucket: "kerala-lottery-e5455.firebasestorage.app",
  messagingSenderId: "871075461450",
  appId: "1:871075461450:web:5208c683df5595a7fa29b3",
  measurementId: "G-CDZ468D3NW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
