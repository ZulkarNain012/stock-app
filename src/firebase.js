// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics'; // Optional, if you want to use Analytics
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVni9grX1Grt_Tks_JfmB-Lp_V1j3TVE0",
  authDomain: "stock-app-a6af0.firebaseapp.com",
  projectId: "stock-app-a6af0",
  storageBucket: "stock-app-a6af0.appspot.com", // Corrected to use .appspot.com
  messagingSenderId: "34758514758",
  appId: "1:34758514758:web:d2d5e352b9ff3f5923d247",
  measurementId: "G-J5GWWED6RN" // Optional, if you want to use Analytics
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app); // Optional, if you want to use Analytics
export { auth, storage, analytics }; // Export the auth and storage objects
