import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_mfo8vT2qPNeTYt5VrgL6AptgBBafQoY",
  authDomain: "ozel-ogretmen.firebaseapp.com",
  projectId: "ozel-ogretmen",
  storageBucket: "ozel-ogretmen.firebasestorage.app",
  messagingSenderId: "45998076976",
  appId: "1:45998076976:web:43ed940b980c424c8e69f5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
