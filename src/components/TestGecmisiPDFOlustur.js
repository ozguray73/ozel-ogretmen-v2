import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getStorage, ref, uploadBytes } from "firebase/storage";

function TestGecmisiPDFOlustur() {
  const { kullanici } = useAuth();
  const [veri, setVeri] = useState([]);

  useEffect(() => {
    const getir = async () => {
      if (!kullanici?.uid) return;
      const q = query(collection(db, "testSonuclari"), where("kullaniciId", "==", kullanici.uid));
      const snap = await getDocs(q);
      const liste = snap.docs.map((d) => d.data());
      setVeri(liste);
    };
    getir();
  }, [kullanici]);

  const pdfOlustur = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Test Çözüm Geçmişi", 14, 20);
    doc.setFontSize(10);
    doc.text(`Kullanıcı: ${kullanici?.email || "Bilinmiyor"}`, 14, 27);
    doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 33);

    const rows = veri.map((item, index) => [
      index + 1,
      item.testAdi,
      item.dogruSayisi,
      item.yanlisSayisi,
      item.suresi,
      new Date(item.tarih).toLocaleString("tr-TR")
    ]);

    doc.autoTable({
      head: [["#", "Test Adı", "Doğru", "Yanlış", "Süre", "Tarih"]],
      body: rows,
      startY: 40,
    });

    const blob = doc.output("blob");
    const storage = getStorage();
    const fileRef = ref(storage, `gecmisPDFler/${kullanici?.uid}/gecmis-${Date.now()}.pdf`);
    await uploadBytes(fileRef, blob);
    alert("PDF başarıyla oluşturuldu ve Firebase'e yüklendi.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>🧾 Test Geçmişi PDF Oluşturucu</h3>
      <button onClick={pdfOlustur}>📄 PDF Olarak Oluştur ve Yükle</button>
    </div>
  );
}

export default TestGecmisiPDFOlustur;
