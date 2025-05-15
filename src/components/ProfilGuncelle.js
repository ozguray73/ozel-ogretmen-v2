import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function ProfilGuncelle() {
  const [user, setUser] = useState(null);
  const [isim, setIsim] = useState("");
  const [telefon, setTelefon] = useState("");
  const [kayitli, setKayitli] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const ref = doc(db, "kullanicilar", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const veri = snap.data();
          setIsim(veri.isim || "");
          setTelefon(veri.telefon || "");
          setKayitli(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const kaydet = async () => {
    if (!user) return;
    const ref = doc(db, "kullanicilar", user.uid);
    await setDoc(ref, {
      isim,
      telefon,
      email: user.email,
      uid: user.uid
    });

    await updateProfile(user, {
      displayName: isim
    });

    alert("Profiliniz güncellendi.");
  };

  if (!user) return <p>Giriş yapmalısınız.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🙋 Profil Bilgilerini Güncelle</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <div>
        <label>İsim Soyisim:</label>
        <br />
        <input value={isim} onChange={(e) => setIsim(e.target.value)} />
      </div>
      <div>
        <label>Telefon:</label>
        <br />
        <input value={telefon} onChange={(e) => setTelefon(e.target.value)} />
      </div>
      <br />
      <button onClick={kaydet}>💾 Kaydet</button>
      {kayitli && <p style={{ color: "green" }}>Bilgiler yüklendi.</p>}
    </div>
  );
}

export default ProfilGuncelle;
