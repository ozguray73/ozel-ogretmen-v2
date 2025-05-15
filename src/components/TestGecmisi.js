import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function TestGecmisi() {
  const [user, setUser] = useState(null);
  const [sonuclar, setSonuclar] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getirSonuclar = async () => {
      if (!user) return;
      const q = query(collection(db, "sonuclar"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const gecmis = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSonuclar(gecmis);
    };
    getirSonuclar();
  }, [user]);

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📘 Test Geçmişiniz</h2>
      {sonuclar.length === 0 ? (
        <p>Henüz çözülmüş test bulunmuyor.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Konu</th>
              <th>Seviye</th>
              <th>Doğru / Toplam</th>
              <th>Süre (sn)</th>
              <th>Mod</th>
            </tr>
          </thead>
          <tbody>
            {sonuclar.map((s, i) => (
              <tr key={i}>
                <td>{s.timestamp?.toDate().toLocaleString()}</td>
                <td>{s.konu}</td>
                <td>{s.seviye}</td>
                <td>{s.dogruSayisi} / {s.toplamSoru}</td>
                <td>{s.sure}</td>
                <td>{s.mod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TestGecmisi;
