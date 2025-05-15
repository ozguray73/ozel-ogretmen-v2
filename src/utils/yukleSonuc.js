import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const yukleSonuc = async ({ userId, testId, dogruSayisi, soruSayisi, sure }) => {
  try {
    await addDoc(collection(db, "sonuclar"), {
      userId,
      testId,
      dogruSayisi,
      soruSayisi,
      sure,
      tarih: serverTimestamp(),
    });
    console.log("Sonuç başarıyla kaydedildi.");
  } catch (e) {
    console.error("Sonuç kaydedilirken hata:", e);
  }
};
