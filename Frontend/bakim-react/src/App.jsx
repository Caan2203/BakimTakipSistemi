import { Routes, Route, Navigate } from "react-router-dom";

import AnaDuzen from "./duzenler/AnaDuzen";

import GostergePaneli from "./sayfalar/GostergePaneli";
import Urunler from "./sayfalar/Urunler";
import Personeller from "./sayfalar/Personeller";
import Bakimlar from "./sayfalar/Bakimlar";
import QRCodeSayfasi from "./sayfalar/QRCodeSayfasi";
import UrunDetay from "./sayfalar/UrunDetay";
import ProductDetail from "./sayfalar/ProductDetail";
import BakimEkle from "./sayfalar/BakimEkle";
import BakimDuzenle from "./sayfalar/BakimDuzenle";

function App() {
    return (
        <AnaDuzen>
           <Routes>

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

    <Route
        path="/bakimlar"
        element={<Bakimlar />}
    />

    <Route
        path="/qr-kod"
        element={<QRCodeSayfasi />}
    />

    <Route
        path="/product/:qrCode"
        element={<ProductDetail />}
    />
    <Route
    path="/qr-kod/:qrCode"
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

</Routes>
        </AnaDuzen>
    );
}

export default App;