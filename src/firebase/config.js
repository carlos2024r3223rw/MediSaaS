import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAweEkcsY_fVSFtHawvD3k3ZlXuPMvFAq8",
  authDomain: "medisaas-5f881.firebaseapp.com",
  projectId: "medisaas-5f881",
  storageBucket: "medisaas-5f881.firebasestorage.app",
  messagingSenderId: "401812780270",
  appId: "1:401812780270:web:c26a025d649059cf76efff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
