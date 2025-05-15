import UyelikUyarisi from "./components/UyelikUyarisi";
import EpostaBildirim from "./components/EpostaBildirim";
import { Link } from "react-router-dom";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <EpostaBildirim />
      <UyelikUyarisi />
      <h1>📘 Özel Öğretmen’e Hoş Geldiniz</h1>
      <p>Kişiye özel testlerle öğrenmenizi takip ediyoruz.</p>

      <nav style={{ marginTop: 30 }}>
        <Link to="/test/1">🧪 Test Çöz</Link>
        <br />
        <Link to="/gecmis">📊 Geçmiş Testler</Link>
        <br />
        <Link to="/uyelik">🪪 Üyelik Bilgisi</Link>
        <br />
        <Link to="/odeme">💳 Ödeme</Link>
        <br />
        <Link to="/profil">🙋 Profilim</Link>
      </nav>
    </div>
  );
}

export default App;
