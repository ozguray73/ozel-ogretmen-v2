import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function UyelikUyarisi() {
  const [uyari, setUyari] = useState(null);

  useEffect(() => {
    const kontrolEt = async (user) => {
      const ref = doc(db, "uyelikler", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const veri = snap.data();
      if (!veri.bitis) return; // sınırsız ise uyarı verme

      const bitis = veri.bitis.toDate();
      const bugun = new Date();
      const kalanGun = Math.ceil((bitis - bugun) / (1000 * 60 * 60 * 24));

      if (kalanGun <= 7 && kalanGun >= 0) {
        setUyari(`⚠️ Üyeliğinizin bitmesine ${kalanGun} gün kaldı. Lütfen yenilemeyi unutmayın.`);
      } else if (kalanGun < 0) {
        setUyari("❌ Üyelik süreniz sona erdi. Yenilemeniz gerekmektedir.");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) kontrolEt(user);
    });

    return () => unsubscribe();
  }, []);

  if (!uyari) return null;

  return (
    <div style={{ backgroundColor: "#fff3cd", padding: 10, border: "1px solid #ffeeba", color: "#856404", marginBottom: 20 }}>
      {uyari}
    </div>
  );
}

export default UyelikUyarisi;
