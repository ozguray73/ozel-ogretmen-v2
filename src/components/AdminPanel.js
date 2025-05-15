import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function AdminPanel() {
  const [uyeler, setUyeler] = useState([]);

  useEffect(() => {
    const getirUyeler = async () => {
      const snapshot = await getDocs(collection(db, "uyelikler"));
      const liste = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUyeler(liste);
    };
    getirUyeler();
  }, []);

  const premiumYap = async (uid) => {
    const ref = doc(db, "uyelikler", uid);
    await updateDoc(ref, {
      aktif: true,
      deneme: false,
      bitis: null, // sınırsız
    });
    alert("Kullanıcı premium yapıldı.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛠 Admin Panel</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Kullanıcı ID</th>
            <th>Başlangıç</th>
            <th>Bitiş</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {uyeler.map((u, i) => (
            <tr key={i}>
              <td>{u.id}</td>
              <td>{u.baslangic?.toDate().toLocaleDateString() || "-"}</td>
              <td>{u.bitis ? u.bitis.toDate().toLocaleDateString() : "Sınırsız"}</td>
              <td>{u.aktif ? (u.deneme ? "Deneme" : "Premium") : "Pasif"}</td>
              <td>
                <button onClick={() => premiumYap(u.id)}>Premium Yap</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
