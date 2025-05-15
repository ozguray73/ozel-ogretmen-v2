import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import TestCoz from "./components/TestCoz";
import TestGecmisi from "./components/TestGecmisi";
import UyelikKontrolu from "./components/UyelikKontrolu";
import Giris from "./components/Giris";
import Kayit from "./components/Kayit";
import AdminPanel from "./components/AdminPanel";
import OdemeEkrani from "./components/OdemeEkrani";
import Profil from "./components/Profil";
import ProfilGuncelle from "./components/ProfilGuncelle";
import RollerPaneli from "./components/RollerPaneli";
import RolKontrolu from "./components/RolKontrolu";
import KullaniciSilmePaneli from "./components/KullaniciSilmePaneli";
import AdminIstatistik from "./components/AdminIstatistik";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/giris" element={<Giris />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route path="/test/:testId" element={<TestCoz />} />
        <Route path="/gecmis" element={<TestGecmisi />} />
        <Route path="/uyelik" element={<UyelikKontrolu />} />
        <Route path="/odeme" element={<OdemeEkrani />} />
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
        <Route
          path="/istatistik"
          element={
            <RolKontrolu izinliRoller={["admin"]}>
              <AdminIstatistik />
            </RolKontrolu>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
