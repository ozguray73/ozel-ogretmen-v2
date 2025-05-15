import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#00C49F", "#FF8042"];

function TestBittiEkrani({ test, dogruSayisi, secimler, dogruluklar, sure, navigate }) {
  const toplamSoru = test.sorular.length;
  const yanlisSayisi = toplamSoru - dogruSayisi;
  const yuzde = Math.round((dogruSayisi / toplamSoru) * 100);
  const dakika = Math.floor(sure / 60);
  const saniye = sure % 60;

  let mesaj = "";
  if (yuzde === 100) mesaj = "🔝 Mükemmel! Tüm soruları doğru yaptınız.";
  else if (yuzde >= 80) mesaj = "🎉 Harika! Birkaç küçük hata dışında çok başarılısınız.";
  else if (yuzde >= 50) mesaj = "🙂 Fena değil! Biraz daha çalışarak çok daha iyi olabilirsiniz.";
  else mesaj = "💡 Gözden geçirmeniz gereken konular var. Tekrar çözmenizi öneririz.";

  const barData = [
    { name: "Doğru", value: dogruSayisi },
    { name: "Yanlış", value: yanlisSayisi }
  ];

  const pieData = [
    { name: "Doğru", value: dogruSayisi },
    { name: "Yanlış", value: yanlisSayisi }
  ];

  // ZAMAN SINIRLI MOD BİLGİLENDİRME (isteğe bağlı ekran)
  const zamanUyari = test?.zamanSiniri ? (
    <p style={{ color: "#b22222", fontWeight: "bold" }}>
      ⏱ Bu testte her soru için {test.zamanSiniri} saniye süre sınırı vardı.
    </p>
  ) : null;

  return (
    <div style={{ padding: 20 }}>
      <h2>✅ Test Tamamlandı</h2>
      {zamanUyari}
      <p><strong>Toplam Soru:</strong> {toplamSoru}</p>
      <p><strong>Doğru:</strong> ✅ {dogruSayisi}</p>
      <p><strong>Yanlış:</strong> ❌ {yanlisSayisi}</p>
      <p><strong>Süre:</strong> ⏱ {dakika} dk {saniye} sn</p>
      <p><strong>Başarı Oranı:</strong> 🎯 %{yuzde}</p>
      <p style={{ marginTop: 10, fontWeight: "bold", color: "#333" }}>{mesaj}</p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", marginTop: 40 }}>
        <div style={{ width: "100%", maxWidth: 400, height: 300 }}>
          <h4>📊 Doğru / Yanlış Dağılımı (Çubuk Grafik)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: "100%", maxWidth: 400, height: 300 }}>
          <h4>🥧 Başarı Oranı (Pasta Grafik)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <hr style={{ margin: "40px 0" }} />
      <h3>📋 Cevaplarınız:</h3>
      <ol>
        {test.sorular.map((soru, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <strong>{soru.soru}</strong>
            <br />
            Sizin cevabınız: <strong>{secimler[i] || "Seçilmedi"}</strong>
            <br />
            Doğru cevap: <strong>{soru.cevap}</strong>
            <br />
            Sonuç: {dogruluklar[i] ? "✅ Doğru" : "❌ Yanlış"}
          </li>
        ))}
      </ol>

      <button onClick={() => navigate("/")} style={{ marginTop: 30 }}>
        🏠 Anasayfaya Dön
      </button>
    </div>
  );
}

export default TestBittiEkrani;
