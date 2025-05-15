import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Cikis() {
  const navigate = useNavigate();

  const cikisYap = async () => {
    try {
      await signOut(auth);
      alert("Çıkış yapıldı.");
      navigate("/giris");
    } catch (e) {
      alert("Çıkış hatası: " + e.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Çıkış</h2>
      <button onClick={cikisYap}>Çıkış Yap</button>
    </div>
  );
}

export default Cikis;
