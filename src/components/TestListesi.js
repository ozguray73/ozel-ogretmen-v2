import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TestListesi() {
  const [testler, setTestler] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const testleriGetir = async () => {
      const querySnapshot = await getDocs(collection(db, "testler"));
      const veri = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestler(veri);
    };

    testleriGetir();
  }, []);

  if (!user) return <p>Lütfen <a href="/giris">giriş yapın</a>.</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Üst başlık ve bağlantılar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📚 Test Listesi</h2>
        <>
          <a href="/sonuclarim" style={{ fontSize: 14, marginRight: 10 }}>
            📊 Sonuçlarım
          </a>
          <a href="/cikis" style={{ fontSize: 14 }}>
            🔓 Çıkış Yap
          </a>
        </>
      </div>

      {/* Testlerin listesi */}
      {testler.map((test) => (
        <div key={test.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}>
          <h3>{test.konu} ({test.seviye})</h3>
          <button onClick={() => navigate(`/test/${test.id}`)}>Teste Başla</button>
        </div>
      ))}
    </div>
  );
}

export default TestListesi;
