import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function TestHavuzuPaneli() {
  const { kullanici } = useAuth();
  const [testler, setTestler] = useState([]);
  const [yeniTest, setYeniTest] = useState({ ad: "", zorluk: "kolay" });
  const [duzenlemeId, setDuzenlemeId] = useState(null);
  const [duzenlemeVeri, setDuzenlemeVeri] = useState({ ad: "", zorluk: "kolay" });
  const [soruEkleId, setSoruEkleId] = useState(null);
  const [yeniSoru, setYeniSoru] = useState("");
  const [yeniCozum, setYeniCozum] = useState("");
  const [gorunenSorular, setGorunenSorular] = useState({});
  const [duzenlenenSoru, setDuzenlenenSoru] = useState({});
  const [cozumleriDahilEt, setCozumleriDahilEt] = useState(true);
  const pdfRef = useRef();

  useEffect(() => {
    const getirTestler = async () => {
      const snap = await getDocs(collection(db, "testler"));
      const liste = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const gruplu = liste.sort((a, b) => a.zorluk.localeCompare(b.zorluk) || a.ad.localeCompare(b.ad));
      setTestler(gruplu);
    };
    getirTestler();
  }, []);

  const rolYetkiliMi = kullanici?.rol === "admin" || kullanici?.rol === "editor";

  if (!rolYetkiliMi) {
    return <div style={{ padding: 20 }}><h2>🚫 Bu sayfaya erişim yetkiniz yok.</h2></div>;
  }

  const pdfOlustur = async () => {
    const logo = new Image();
    logo.src = "/logo.png";
    const tarih = new Date().toLocaleDateString("tr-TR");
    const input = pdfRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.setFontSize(16);
    pdf.addImage(logo, "PNG", 150, 5, 40, 12);
    pdf.text("📚 Test Havuzu PDF Çıktısı", 10, 15);
    pdf.setFontSize(10);
    pdf.text(`Tarih: ${tarih}`, 10, 22);
    pdf.text(`Toplam Test Sayısı: ${testler.length}`, 10, 28);
    pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
    pdf.save(cozumleriDahilEt ? "test-havuzu-tam.pdf" : "test-havuzu-sorular.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Test Havuzu Yönetimi</h2>
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={cozumleriDahilEt}
            onChange={() => setCozumleriDahilEt(!cozumleriDahilEt)}
            style={{ marginRight: 5 }}
          />
          Çözümleri PDF'e dahil et
        </label>
      </div>
      <button onClick={pdfOlustur} style={{ marginBottom: 10 }}>📄 PDF Çıktı Al</button>
      <div ref={pdfRef} style={{ backgroundColor: "white", padding: 10 }}>
        {["kolay", "orta", "zor"].map((seviye) => (
          <div key={seviye} style={{ marginBottom: 20 }}>
            <h3>{seviye.toUpperCase()} Testler</h3>
            {testler
              .filter((t) => t.zorluk === seviye)
              .map((t) => (
                <div key={t.id} style={{ marginBottom: 10 }}>
                  <strong>{t.ad}</strong> ({t.zorluk})
                  {gorunenSorular[t.id] && (
                    <ul>
                      {gorunenSorular[t.id].map((s) => (
                        <li key={s.id}>
                          {s.soru}
                          {cozumleriDahilEt && s.cozum && (
                            <em style={{ color: "gray" }}> — {s.cozum}</em>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestHavuzuPaneli;
