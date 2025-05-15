import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

function UyelikPlaniYonetimi() {
  const { kullanici } = useAuth();
  const [uyelik, setUyelik] = useState(null);

  useEffect(() => {
    const getir = async () => {
      if (!kullanici?.uid) return;
      const ref = doc(db, "uyelikler", kullanici.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUyelik(snap.data());
      } else {
        setUyelik({ baslangic: new Date().toISOString(), gun: 3 });
        await updateDoc(ref, { baslangic: new Date().toISOString(), gun: 3 });
      }
    };
    getir();
  }, [kullanici]);

  const kalanGun = () => {
    if (!uyelik) return 0;
    const basTarih = new Date(uyelik.baslangic);
    const simdi = new Date();
    const fark = Math.floor((simdi - basTarih) / (1000 * 60 * 60 * 24));
    return Math.max(uyelik.gun - fark, 0);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>🕓 Üyelik Durumu</h3>
      {uyelik ? (
        <p>
          Başlangıç: {new Date(uyelik.baslangic).toLocaleDateString("tr-TR")}<br />
          Günlük Plan: {uyelik.gun} gün<br />
          Kalan Gün: {kalanGun()} gün
        </p>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

export default UyelikPlaniYonetimi;
