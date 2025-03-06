// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7cy0thdK0X_C4gda7SxcZF6tQi-QgIVk",
  authDomain: "paymentfe.firebaseapp.com",
  projectId: "paymentfe",
  storageBucket: "paymentfe.firebasestorage.app",
  messagingSenderId: "131468306241",
  appId: "1:131468306241:web:f4abfd3e0671f238e3e3c0",
  measurementId: "G-PSQ109M1ML",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export { db };
