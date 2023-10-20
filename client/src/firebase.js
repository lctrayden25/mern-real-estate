// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-ba0c1.firebaseapp.com",
  projectId: "mern-real-estate-ba0c1",
  storageBucket: "mern-real-estate-ba0c1.appspot.com",
  messagingSenderId: "1096630847551",
  appId: "1:1096630847551:web:b1977ff2efce70ddcb908a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);