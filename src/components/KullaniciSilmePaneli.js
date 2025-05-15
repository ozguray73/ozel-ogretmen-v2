import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function KullaniciSilmePaneli() {
  const [uyeler, setUyeler] = useState([]);

  useEffect(() => {
    const getirUyeler = async () => {
      const snap = await getDocs(collection(db, "uyelikler"));
      const liste = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUyeler(liste);
    };
    getirUyeler();
  }, []);

  const sil = async (uid) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      await deleteDoc(doc(db, "uyelikler", uid));
      await deleteDoc(doc(db, "roller", uid));
      await deleteDoc(doc(db, "kullanicilar", uid));
      alert("Kullanıcı Firestore'dan silindi. Firebase Authentication üzerinden ayrıca silinmelidir.");
      setUyeler((prev) => prev.filter((u) => u.id !== uid));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🗑️ Kullanıcı Silme Paneli</h2>
      <p style={{ color: "red" }}>
        Bu işlem sadece Firestore verilerini siler. Firebase Authentication’dan manuel silinmelidir.
      </p>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>UID</th>
            <th>Email</th>
            <th>Başlangıç</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {uyeler.map((u, i) => (
            <tr key={i}>
              <td>{u.id}</td>
              <td>{u.email || "-"}</td>
              <td>{u.baslangic?.toDate().toLocaleDateString() || "-"}</td>
              <td>
                <button onClick={() => sil(u.id)}>❌ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KullaniciSilmePaneli;
