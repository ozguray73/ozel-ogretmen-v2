import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDftA3hr2bDMCCeJYywnu5eSbt6CspH-ls",
  authDomain: "ozel-ogretmen-41efd.firebaseapp.com",
  projectId: "ozel-ogretmen-41efd",
  storageBucket: "ozel-ogretmen-41efd.appspot.com", // 🔁 DÜZELTİLDİ
  messagingSenderId: "369210234616",
  appId: "1:369210234616:web:180b87f921fe92bfa88d0d"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
