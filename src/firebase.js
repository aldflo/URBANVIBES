import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChdCQr0fRpZeatQlVnS_b2Co7qXx0aHrM",
  authDomain: "urbanvibes-4e59c.firebaseapp.com",
  projectId: "urbanvibes-4e59c",
  storageBucket: "urbanvibes-4e59c.firebasestorage.app",
  messagingSenderId: "913602009792",
  appId: "1:913602009792:web:b760d250fd1973d1442b25",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;