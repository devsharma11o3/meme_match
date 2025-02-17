// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import authentication
import { getFirestore } from "firebase/firestore";  // Import Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVtcZTeNH8fHnNuQO9TD3YR7mE2E-as28",
  authDomain: "meme-dating-app.firebaseapp.com",
  projectId: "meme-dating-app",
  storageBucket: "meme-dating-app.firebasestorage.app",
  messagingSenderId: "1045806780972",
  appId: "1:1045806780972:web:1bfc2b438a3eee613af789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize Auth
const db = getFirestore(app);  // Initialize Firestore

export { auth, db };  // ✅ Export both auth & db
export default app;