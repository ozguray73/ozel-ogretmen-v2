import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function AISoruUretici() {
  const [konu, setKonu] = useState("");
  const [zorluk, setZorluk] = useState("kolay");
  const [sayi, setSayi] = useState(5);
  const [uretilenSorular, setUretilenSorular] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const gptIleSoruUret = async () => {
    setYukleniyor(true);
    try {
      const prompt = `Lütfen ${konu} konusunda ${zorluk} seviyede ${sayi} tane çoktan seçmeli soru üret. Her biri 4 seçenekli olsun ve doğru cevabı belirt.`;

      const yanit = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_API_KEY` // ← Ana bilgisayarda bu kısmı doldurun
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const veri = await yanit.json();
      const metin = veri.choices[0].message.content;
      const sorular = metin.split(/\d+\./).filter((x) => x.trim()).map((x) => x.trim());
      setUretilenSorular(sorular);
    } catch (e) {
      alert("Soru üretimi başarısız: " + e.message);
    }
    setYukleniyor(false);
  };

  const kaydet = async () => {
    for (const s of uretilenSorular) {
      await addDoc(collection(db, "aiSorulari"), {
        konu,
        zorluk,
        soru: s,
        tarih: new Date().toISOString()
      });
    }
    alert("Sorular kaydedildi.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 AI Soru Üretici</h2>
      <input placeholder="Konu" value={konu} onChange={(e) => setKonu(e.target.value)} />
      <select value={zorluk} onChange={(e) => setZorluk(e.target.value)}>
        <option value="kolay">Kolay</option>
        <option value="orta">Orta</option>
        <option value="zor">Zor</option>
      </select>
      <input type="number" value={sayi} onChange={(e) => setSayi(Number(e.target.value))} />
      <button onClick={gptIleSoruUret} disabled={yukleniyor}>Üret</button>

      {uretilenSorular.length > 0 && (
        <div>
          <h4>Üretilen Sorular</h4>
          <ul>
            {uretilenSorular.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <button onClick={kaydet}>Firebase'e Kaydet</button>
        </div>
      )}
    </div>
  );
}

export default AISoruUretici;
