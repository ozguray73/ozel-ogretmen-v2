import { useNavigate, useParams } from "react-router-dom";

function TestModSec() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sec = (mod) => {
    navigate(`/test/${id}/coz`, { state: { mod } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🕐 Test Modu Seçimi</h2>
      <p>Bu testi nasıl çözmek istersiniz?</p>
      <button onClick={() => sec("zaman-kisitli")}>⏱ Zaman Kısıtlı Mod</button>
      <br /><br />
      <button onClick={() => sec("serbest")}>🧘 Serbest Süreli Mod</button>
    </div>
  );
}

export default TestModSec;
