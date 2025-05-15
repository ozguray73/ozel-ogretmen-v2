import { Timestamp } from "firebase/firestore";

// ... firebase kayıt işleminin hemen ardından:
const uid = response.user.uid;
await setDoc(doc(db, "uyeler", uid), {
  ad: ad,         // kullanıcıdan alınan ad
  soyad: soyad,   // kullanıcıdan alınan soyad
  email: email,
  rol: "ogrenci",
  deneme: true,
  uyelikBaslangic: Timestamp.now(),
  uyelikBitis: Timestamp.fromDate(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // +3 gün
  ),
});
