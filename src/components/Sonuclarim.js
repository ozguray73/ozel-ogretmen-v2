import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Sonuclarim() {
  const [user, setUser] = useState(null);
  const [sonuclar, setSonuclar] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const getir = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "sonuclar"),
          where("uid", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const liste = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSonuclar(liste);
        setLoading(false);
      } catch (err) {
        console.error("Sonuçlar getirilemedi:", err);
        setLoading(false);
      }
    };

    getir();
  }, [user]);

  if (loading) return <p>Sonuçlar yükleniyor...</p>;

  if (!user) return <p>Oturum açılmamış.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Detaylı Test Sonuçlarım</h2>
      {sonuclar.length === 0 ? (
        <p>Henüz test çözülmemiş.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {sonuclar.map((s) => (
            <li key={s.id} style={{ marginBottom: 30, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <h3>{s.konu} ({s.seviye})</h3>
              <p>🟢 Doğru: {s.dogruSayisi} / {s.toplamSoru}</p>
              <p>⏱ Süre: {Math.floor(s.sure / 60)} dk {s.sure % 60} sn</p>
              <p>📅 Tarih: {s.timestamp.toDate().toLocaleString("tr-TR")}</p>
              <p>🧪 Mod: {s.mod === "zaman-kisitli" ? "Zaman Kısıtlı" : "Serbest"}</p>
              <details>
                <summary>📋 Cevap Detayları</summary>
                <ol>
                  {s.cevaplar?.map((cevap, i) => (
                    <li key={i}>
                      Soru {i + 1}: {s.dogruluklar?.[i] ? "✅ Doğru" : "❌ Yanlış"} – Verilen: {cevap}
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")}>Anasayfaya Dön</button>
    </div>
  );
}

export default Sonuclarim;
