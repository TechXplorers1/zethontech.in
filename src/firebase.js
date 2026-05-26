// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaI7ZEKPfl_SAlRNMgqWx3YeBhQ05V1lI",
  authDomain: "zethontechpvt-4b9da.firebaseapp.com",
  databaseURL: "https://zethontechpvt-4b9da-default-rtdb.firebaseio.com",
  projectId: "zethontechpvt-4b9da",
  storageBucket: "zethontechpvt-4b9da.firebasestorage.app",
  messagingSenderId: "955264402374",
  appId: "1:955264402374:web:ad35b775ae54ca0587e8c7",
  measurementId: "G-SK0Y7S831W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);