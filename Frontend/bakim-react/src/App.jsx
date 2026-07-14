import { Routes, Route, Navigate } from "react-router-dom";

import AnaDuzen from "./duzenler/AnaDuzen";

import Giris from "./sayfalar/Giris";
import YetkiliSayfa from "./bilesenler/YetkiliSayfa";
import GostergePaneli from "./sayfalar/GostergePaneli";
import Urunler from "./sayfalar/Urunler";
import Personeller from "./sayfalar/Personeller";
import Bakimlar from "./sayfalar/Bakimlar";
import QRCodeSayfasi from "./sayfalar/QRCodeSayfasi";
import ProductDetail from "./sayfalar/ProductDetail";
import BakimEkle from "./sayfalar/BakimEkle";
import BakimDuzenle from "./sayfalar/BakimDuzenle";
import Zimmetler from "./sayfalar/Zimmetler";
import UrunGecmisi from "./sayfalar/UrunGecmisi";
import PersonelDetay from "./sayfalar/PersonelDetay";

function App() {
    return (
        <Routes>
            {/* Giriş Sayfası (Layout dışı ve herkese açık) */}
            <Route
                path="/giris"
                element={<Giris />}
            />

            {/* Yetkili ve Layout (AnaDuzen) Kullanan Tüm Sayfalar */}
            <Route
                element={
                    <YetkiliSayfa>
                        <AnaDuzen />
                    </YetkiliSayfa>
                }
            >
                {/* Ana sayfa yönlendirmesi */}
                <Route
                    path="/"
                    element={<Navigate to="/gosterge-paneli" />}
                />

                <Route
                    path="/gosterge-paneli"
                    element={<GostergePaneli />}
                />

                <Route
                    path="/urunler"
                    element={<Urunler />}
                />

                <Route
                    path="/personeller"
                    element={<Personeller />}
                />

                {/* Import edilmiş olan Personel Detay rotası eklendi */}
                <Route
                    path="/personeller/:id"
                    element={<PersonelDetay />}
                />

                <Route
                    path="/bakimlar"
                    element={<Bakimlar />}
                />

                <Route
                    path="/qr-kod"
                    element={<QRCodeSayfasi />}
                />

                <Route
                    path="/qr-kod/:qrCode"
                    element={<ProductDetail />}
                />

                <Route
                    path="/product/:qrCode"
                    element={<ProductDetail />}
                />

                <Route
                    path="/bakim-ekle/:qrCode"
                    element={<BakimEkle />}
                />

                <Route
                    path="/bakim-duzenle/:id"
                    element={<BakimDuzenle />}
                />

                {/* Tasarım bütünlüğü ve yetki kontrolü için içeriye taşınan rotalar */}
                <Route 
                    path="/zimmetler" 
                    element={<Zimmetler />} 
                />
                
                <Route 
                    path="/urun-gecmisi/:id" 
                    element={<UrunGecmisi />} 
                />
   
            </Route>
        </Routes>
    );
}

export default App;