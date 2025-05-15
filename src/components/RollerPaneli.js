import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

function RollerPaneli() {
  const [roller, setRoller] = useState([]);

  useEffect(() => {
    const getirRoller = async () => {
      const snap = await getDocs(collection(db, "roller"));
      const liste = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      setRoller(liste);
    };
    getirRoller();
  }, []);

  const degistir = async (uid, yeniRol) => {
    await setDoc(doc(db, "roller", uid), { rol: yeniRol });
    alert("Rol güncellendi");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎛️ Rol Yönetim Paneli</h2>
      {roller.length === 0 ? (
        <p>Hiç rol bulunamadı.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Kullanıcı UID</th>
              <th>Mevcut Rol</th>
              <th>Yeni Rol Ata</th>
            </tr>
          </thead>
          <tbody>
            {roller.map((k, i) => (
              <tr key={i}>
                <td>{k.uid}</td>
                <td>{k.rol}</td>
                <td>
                  <select
                    defaultValue={k.rol}
                    onChange={(e) => degistir(k.uid, e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="user">user</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RollerPaneli;
