import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import TestCoz from "./components/TestCoz";
import TestGecmisi from "./components/TestGecmisi";
import TestGecmisiPDFOlustur from "./components/TestGecmisiPDFOlustur";
import TestOneriPaneli from "./components/TestOneriPaneli";
import AISoruUretici from "./components/AISoruUretici";
import UyelikKontrolu from "./components/UyelikKontrolu";
import UyelikPlaniYonetimi from "./components/UyelikPlaniYonetimi";
import OdemeEkrani from "./components/OdemeEkrani";
import OdemeBaslat from "./components/OdemeBaslat";
import Giris from "./components/Giris";
import Kayit from "./components/Kayit";
import Profil from "./components/Profil";
import ProfilGuncelle from "./components/ProfilGuncelle";
import AdminPanel from "./components/AdminPanel";
import AdminKullanimRaporu from "./components/AdminKullanimRaporu";
import RollerPaneli from "./components/RollerPaneli";
import RolKontrolu from "./components/RolKontrolu";
import KullaniciSilmePaneli from "./components/KullaniciSilmePaneli";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/giris" element={<Giris />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route
          path="/test/:testId"
          element={
            <UyelikKontrolu>
              <TestCoz />
            </UyelikKontrolu>
          }
        />
        <Route path="/gecmis" element={<TestGecmisi />} />
        <Route path="/gecmis-pdf" element={<TestGecmisiPDFOlustur />} />
        <Route path="/oneriler" element={<TestOneriPaneli />} />
        <Route path="/ai-soru-uret" element={<AISoruUretici />} />
        <Route path="/uyelik-durumu" element={<UyelikPlaniYonetimi />} />
        <Route path="/odeme" element={<OdemeEkrani />} />
        <Route path="/odeme-baslat" element={<OdemeBaslat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/guncelle" element={<ProfilGuncelle />} />
        <Route
          path="/admin"
          element={
            <RolKontrolu izinliRoller={["admin"]}>
              <AdminPanel />
            </RolKontrolu>
          }
        />
        <Route
          path="/admin/kullanim-raporu"
          element={
            <RolKontrolu izinliRoller={["admin"]}>
              <AdminKullanimRaporu />
            </RolKontrolu>
          }
        />
        <Route
          path="/roller"
          element={
            <RolKontrolu izinliRoller={["admin"]}>
              <RollerPaneli />
            </RolKontrolu>
          }
        />
        <Route
          path="/kullanicilar"
          element={
            <RolKontrolu izinliRoller={["admin"]}>
              <KullaniciSilmePaneli />
            </RolKontrolu>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
