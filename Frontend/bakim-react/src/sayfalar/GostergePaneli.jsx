import { useEffect, useState } from "react";
import api from "../api";

function GostergePaneli() {
    // State Tanımlamaları
    const [urunSayisi, setUrunSayisi] = useState(0);
    const [personelSayisi, setPersonelSayisi] = useState(0);
    const [bakimSayisi, setBakimSayisi] = useState(0);
    const [bakimdakiUrun, setBakimdakiUrun] = useState(0);
    const [sonBakimlar, setSonBakimlar] = useState([]);

    // Sayfa Yüklendiğinde Verileri Getir
    useEffect(() => {
        verileriGetir();
    }, []);

    // API İstekleri ve State Güncellemeleri
    const verileriGetir = async () => {
        try {
            const urunler = await api.get("/Products");
            const personeller = await api.get("/Employees");
            const bakimlar = await api.get("/Maintenance");

            // Kartlar için sayısal verilerin set edilmesi
            setUrunSayisi(urunler.data.length);
            setBakimdakiUrun(
                urunler.data.filter(x => x.isInMaintenance).length
            );
            setPersonelSayisi(personeller.data.length);
            setBakimSayisi(bakimlar.data.length);

            // Son yapılan 5 bakımın tarihe göre sıralanıp set edilmesi
            setSonBakimlar(
                bakimlar.data
                    .sort(
                        (a, b) =>
                            new Date(b.maintenanceDate) -
                            new Date(a.maintenanceDate)
                    )
                    .slice(0, 5)
            );

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gösterge Paneli</h2>

            {/* İstatistik Kartları */}
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Toplam Ürün</h5>
                            <h2>{urunSayisi}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Personel</h5>
                            <h2>{personelSayisi}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Bakımlar</h5>
                            <h2>{bakimSayisi}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Bakımdaki Ürün</h5>
                            <h2>{bakimdakiUrun}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Son Yapılan Bakımlar Tablosu (mt-4 Eklendi) */}
            <div className="card shadow mt-4">
                <div className="card-header">
                    <h5>Son Yapılan Bakımlar</h5>
                </div>

                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Ürün</th>
                                <th>Personel</th>
                                <th>Tarih</th>
                                <th>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sonBakimlar.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        Henüz bakım kaydı yok.
                                    </td>
                                </tr>
                            ) : (
                                sonBakimlar.map((bakim) => (
                                    <tr key={bakim.id}>
                                        <td>{bakim.product?.productName}</td>
                                        <td>
                                            {bakim.employee?.firstName} {bakim.employee?.lastName}
                                        </td>
                                        <td>
                                            {new Date(bakim.maintenanceDate).toLocaleDateString("tr-TR")}
                                        </td>
                                        <td>
                                            <span className="badge bg-success">
                                                {bakim.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GostergePaneli;