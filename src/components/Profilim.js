import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Profilim() {
  const [kullanici, setKullanici] = useState(null);
  const [veri, setVeri] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setKullanici(u);
      if (u) {
        const ref = doc(db, "uyeler", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setVeri(snap.data());
      }
    });
    return () => unsub();
  }, []);

  if (!veri) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 Profilim</h2>
      <p>Ad Soyad: {veri.ad} {veri.soyad}</p>
      <p>Email: {veri.email}</p>
      <p>Rol: {veri.rol}</p>
      <p>Üyelik Başlangıç: {veri.uyelikBaslangic?.toDate().toLocaleDateString("tr-TR")}</p>
      <p>Üyelik Bitiş: {veri.uyelikBitis?.toDate().toLocaleDateString("tr-TR")}</p>
      <p>Deneme Süresi: {veri.deneme ? "🕒 Aktif" : "⛔ Bitti"}</p>
    </div>
  );
}

export default Profilim;
