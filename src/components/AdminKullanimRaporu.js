import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import jsPDF from "jspdf";
import "jspdf-autotable";

function AdminKullanimRaporu() {
  const [sonuclar, setSonuclar] = useState([]);

  useEffect(() => {
    const getir = async () => {
      const snap = await getDocs(collection(db, "testSonuclari"));
      const veri = snap.docs.map((d) => d.data());
      setSonuclar(veri);
    };
    getir();
  }, []);

  const kullaniciBazli = () => {
    const gruplu = {};
    sonuclar.forEach((s) => {
      if (!gruplu[s.kullaniciId]) {
        gruplu[s.kullaniciId] = { sayi: 0, dogru: 0, yanlis: 0 };
      }
      gruplu[s.kullaniciId].sayi++;
      gruplu[s.kullaniciId].dogru += s.dogruSayisi;
      gruplu[s.kullaniciId].yanlis += s.yanlisSayisi;
    });
    return Object.entries(gruplu);
  };

  const pdfRaporu = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Kullanım Raporu", 14, 20);
    doc.setFontSize(10);
    doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 27);

    const rows = kullaniciBazli().map(([uid, veriler], i) => [
      i + 1,
      uid,
      veriler.sayi,
      veriler.dogru,
      veriler.yanlis
    ]);

    doc.autoTable({
      head: [["#", "Kullanıcı ID", "Toplam Test", "Toplam Doğru", "Toplam Yanlış"]],
      body: rows,
      startY: 35,
    });

    doc.save("kullanim-raporu.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Admin Kullanım Raporu</h2>
      <button onClick={pdfRaporu}>📄 PDF Raporu İndir</button>
      <ul>
        {kullaniciBazli().map(([uid, v], i) => (
          <li key={uid}>
            <strong>{i + 1}.</strong> Kullanıcı: {uid} — {v.sayi} test, ✅ {v.dogru}, ❌ {v.yanlis}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminKullanimRaporu;
