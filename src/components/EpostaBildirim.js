// Bu dosya e-posta bildirim tetikleyicisini simüle eder
import { useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function EpostaBildirim() {
  useEffect(() => {
    const kontrolEt = async (user) => {
      const ref = doc(db, "uyelikler", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const veri = snap.data();
      if (!veri.bitis) return; // sınırsız ise gönderme

      const bitis = veri.bitis.toDate();
      const bugun = new Date();
      const kalanGun = Math.ceil((bitis - bugun) / (1000 * 60 * 60 * 24));

      if (kalanGun === 7 || kalanGun === 3 || kalanGun === 1) {
        const mesaj = `📩 ${user.email} kullanıcısının üyeliği ${kalanGun} gün sonra bitiyor.`;
        console.log("MAIL GİDECEK:", mesaj);

        // Geliştirme aşamasında sadece yöneticinin mailine bilgi gönderiyoruz
        fetch("https://formspree.io/f/moqgjqdd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "ozguraydincak@gmail.com",
            message: mesaj,
          }),
        });
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) kontrolEt(user);
    });

    return () => unsubscribe();
  }, []);

  return null; // Arka planda sessiz çalışır
}

export default EpostaBildirim;
