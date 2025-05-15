import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { collection, getDoc, doc, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import TestBittiEkrani from "./TestBittiEkrani";

function TestCoz() {
  const { testId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [test, setTest] = useState(null);
  const [soruIndex, setSoruIndex] = useState(0);
  const [secimler, setSecimler] = useState([]);
  const [dogruluklar, setDogruluklar] = useState([]);
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [sure, setSure] = useState(0);
  const [testBitti, setTestBitti] = useState(false);
  const [mod, setMod] = useState(state?.mod || "ogrenme");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const getir = async () => {
      const ref = doc(db, "testler", testId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setTest(snap.data());
      }
    };
    getir();
  }, [testId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!testBitti) {
        setSure((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [testBitti]);

  const oku = (metin) => {
    const msg = new SpeechSynthesisUtterance(metin);
    msg.lang = "tr-TR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    if (test && test.sorular[soruIndex]) {
      const s = test.sorular[soruIndex];
      oku(`Soru ${soruIndex + 1}: ${s.soru}. Şıklar: ${s.secenekler.join(", ")}`);
    }
  }, [soruIndex, test]);

  const secenekSec = (cevap) => {
    const yeni = [...secimler];
    yeni[soruIndex] = cevap;
    setSecimler(yeni);
  };

  const ilerle = () => {
    const aktifSoru = test.sorular[soruIndex];
    const secilen = secimler[soruIndex];
    const dogruMu = secilen === aktifSoru.cevap;

    const dogruListe = [...dogruluklar];
    dogruListe[soruIndex] = dogruMu;
    setDogruluklar(dogruListe);

    if (mod === "ogrenme") {
      if (dogruMu) {
        setDogruSayisi((s) => s + 1);
        oku("Tebrikler, doğru cevap verdiniz.");
      } else {
        oku("Maalesef doğru değil, tekrar deneyiniz.");
      }
    } else {
      if (dogruMu) setDogruSayisi((s) => s + 1);
    }

    if (soruIndex + 1 < test.sorular.length) {
      setSoruIndex((prev) => prev + 1);
    } else {
      testiBitir(dogruListe);
    }
  };

  const testiBitir = async (dogrulukListesi) => {
    setTestBitti(true);

    if (user) {
      try {
        await addDoc(collection(db, "sonuclar"), {
          uid: user.uid,
          testId,
          konu: test.konu,
          seviye: test.seviye,
          dogruSayisi,
          toplamSoru: test.sorular.length,
          sure,
          mod,
          cevaplar: secimler,
          dogruluklar: dogrulukListesi,
          timestamp: Timestamp.now(),
        });
      } catch (e) {
        console.error("Sonuç kaydedilemedi:", e);
      }
    }
  };

  const sesleBaslat = () => {
    if (!recognition) {
      alert("Tarayıcınız sesli cevap özelliğini desteklemiyor.");
      return;
    }

    recognition.lang = "tr-TR";
    recognition.start();

    recognition.onresult = (event) => {
      const sonuc = event.results[0][0].transcript.toLowerCase().trim();
      const harf = sonuc.charAt(0);
      const aktif = test?.sorular[soruIndex];
      const index = ["a", "b", "c", "d", "e"].indexOf(harf);
      const secenek = aktif?.secenekler[index];

      if (secenek) {
        secenekSec(secenek);
        oku(`${harf.toUpperCase()} seçildi`);
      } else {
        oku("Anlaşılamadı, lütfen A, B, C veya D deyin.");
      }
    };
  };

  if (!test) return <p>Yükleniyor...</p>;

  if (testBitti) {
    return (
      <TestBittiEkrani
        test={test}
        dogruSayisi={dogruSayisi}
        secimler={secimler}
        dogruluklar={dogruluklar}
        sure={sure}
        navigate={navigate}
      />
    );
  }

  const aktifSoru = test.sorular[soruIndex];

  return (
    <div style={{ padding: 20 }}>
      <h2>Soru {soruIndex + 1}</h2>
      <p>{aktifSoru.soru}</p>
      {aktifSoru.secenekler.map((s, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              name="secenek"
              value={s}
              checked={secimler[soruIndex] === s}
              onChange={() => secenekSec(s)}
            />
            {s}
          </label>
        </div>
      ))}
      <br />
      <button disabled={secimler[soruIndex] == null} onClick={ilerle}>
        {soruIndex + 1 === test.sorular.length ? "Bitir" : "Sonraki"}
      </button>
      <br /><br />
      <button onClick={sesleBaslat}>🎙️ Sesle Cevapla</button>
      <button onClick={() => {
        const s = test.sorular[soruIndex];
        oku(`Soru ${soruIndex + 1}: ${s.soru}. Şıklar: ${s.secenekler.join(", ")}`);
      }}>
        🔁 Tekrar Dinle
      </button>
    </div>
  );
}

export default TestCoz;
