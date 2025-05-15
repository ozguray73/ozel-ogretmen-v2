import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

function UyelikKontrolu({ children }) {
  const { kullanici } = useAuth();
  const [izinli, setIzinli] = useState(null);

  useEffect(() => {
    const kontrolEt = async () => {
      if (!kullanici?.uid) return setIzinli(false);
      const ref = doc(db, "uyelikler", kullanici.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return setIzinli(false);
      const veri = snap.data();
      const kalanGun = Math.max(
        veri.gun - Math.floor((new Date() - new Date(veri.baslangic)) / (1000 * 60 * 60 * 24)),
        0
      );
      setIzinli(kalanGun > 0);
    };
    kontrolEt();
  }, [kullanici]);

  if (izinli === null) return <p style={{ padding: 20 }}>Kontrol ediliyor...</p>;
  if (!izinli) return <Navigate to="/odeme" />;

  return children;
}

export default UyelikKontrolu;
