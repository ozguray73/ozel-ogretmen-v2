import { useEffect } from "react";

function OdemeBaslat() {
  useEffect(() => {
    window.location.href = "https://www.iyzico.com/odeme-formu"; // ← Gerçek URL ile değiştirilecek
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>💳 Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz...</h2>
      <p>Lütfen bekleyin.</p>
    </div>
  );
}

export default OdemeBaslat;
