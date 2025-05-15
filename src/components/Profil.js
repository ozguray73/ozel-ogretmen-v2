import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Profil() {
  const [user, setUser] = useState(null);
  const [uyelik, setUyelik] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const ref = doc(db, "uyelikler", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUyelik(snap.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <p>Giriş yapılmadı.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🙋 Profil Bilgilerim</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Kullanıcı ID:</strong> {user.uid}</p>
{uyelik && (
  <>
    <p><strong>Üyelik Başlangıcı:</strong> {uyelik.baslangic?.toDate().toLocaleDateString()}</p>
    <p><strong>Üyelik Bitişi:</strong> {uyelik.bitis ? uyelik.bitis.toDate().toLocaleDateString() : "Sınırsız"}</p>
    <p><strong>Durum:</strong> {uyelik.aktif ? (uyelik.deneme ? "Deneme Üyelik" : "Premium") : "Pasif"}</p>
    <br />
    <Link to="/profil/guncelle">✏️ Profil Bilgilerini Güncelle</Link>
  </>
)}
    </div>
  );
}

export default Profil;
