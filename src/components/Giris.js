import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Giris() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const navigate = useNavigate();

  const girisYap = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, sifre);
      navigate("/");
    } catch (e) {
      alert("Giriş hatalı: " + e.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Giriş Yap</h2>
      <input
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Şifre"
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
      />
      <br /><br />
      <button onClick={girisYap}>Giriş</button>

      {/* 👇 Burayı ekliyoruz */}
      <p>
        Hesabınız yok mu? <a href="/kayit">Kayıt Ol</a>
      </p>
    </div>
  );
}

export default Giris;
