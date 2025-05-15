import { useEffect } from "react";
import { yukleVeri } from "./utils/yukleTestVerisi";

function App() {
  useEffect(() => {
    yukleVeri(); // sadece bir kez yüklesin
  }, []);

  return <div>İlk test verisi Firebase'e yükleniyor...</div>;
}

export default App;
