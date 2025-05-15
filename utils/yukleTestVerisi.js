import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import testData from "../data/tamSayilarTest.json";

export const yukleVeri = async () => {
  try {
    const docRef = await addDoc(collection(db, "testler"), testData);
    console.log("Veri yüklendi. Belge ID:", docRef.id);
  } catch (e) {
    console.error("Hata oluştu:", e);
  }
};
