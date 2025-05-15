import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";

function TestOneriPaneli() {
  const { kullanici } = useAuth();
  const [oneriler, setOneriler] = useState([]);

  useEffect(() => {
    const getir = async () => {
      if (!kullanici?.uid) return;
      const q = query(collection(db, "testSonuclari"), where("kullaniciId", "==", kullanici.uid));
      const snap = await getDocs(q);
      const veri = snap.docs.map((d) => d.data());

      const konular = {};
      veri.forEach((v) => {
        const konu = v.testAdi.split(" ")[0];
        if (!konular[konu]) konular[konu] = { toplam: 0, yanlis: 0 };
        konular[konu].toplam++;
        konular[konu].yanlis += v.yanlisSayisi;
      });

      const sira = Object.entries(konular)
        .map(([konu, deger]) => ({ konu, oran: deger.yanlis / deger.toplam }))
        .sort((a, b) => b.oran - a.oran)
        .slice(0, 3)
        .map((x) => `${x.konu} Testleri`);

      setOneriler(sira);
    };
    getir();
  }, [kullanici]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 Kişisel Test Önerileri</h2>
      {oneriler.length > 0 ? (
        <ul>
          {oneriler.map((t, i) => (
            <li key={i}>✅ {t}</li>
          ))}
        </ul>
      ) : (
        <p>Yeterli veri bulunamadı.</p>
      )}
    </div>
  );
}

export default TestOneriPaneli;
