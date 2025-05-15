import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function OdemeEkrani() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <p>Giriş yapmalısınız.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>💳 Ödeme Sayfası</h2>
      <p>Kullanıcı: {user.email}</p>

      <div style={{ marginTop: 30 }}>
        <h3>Ödeme Planı</h3>
        <ul>
          <li>📅 Aylık üyelik: 99 TL</li>
          <li>💼 Tüm testlere erişim</li>
          <li>📊 Gelişim takibi</li>
        </ul>

        <button style={{ padding: 10, marginTop: 20 }} onClick={() => alert("Ödeme altyapısı eklenecek.")}>🔐 Güvenli Ödeme Yap</button>
      </div>

      <p style={{ marginTop: 40, fontSize: 12, color: "gray" }}>
        Bu sayfa test amaçlıdır. Gerçek ödeme altyapısı eklendiğinde KVKK, Mesafeli Satış Sözleşmesi ve Ticaret Kanunu'na uygun olacak şekilde güncellenecektir.
      </p>
    </div>
  );
}

export default OdemeEkrani;
