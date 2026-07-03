import { useEffect, useState } from "react";
import {
    urunleriGetir,
    urunEkle,
    urunGuncelle,
    urunSil
} from "../services/urunServisi";

function Urunler() {
    const [urunler, setUrunler] = useState([]);
    const [duzenlemeModu, setDuzenlemeModu] = useState(false);
    const [modalAcik, setModalAcik] = useState(false);
    const [aramaMetni, setAramaMetni] = useState(""); // Arama filtresi için state eklendi

    const [yeniUrun, setYeniUrun] = useState({
        productCode: "",
        productName: "",
        brand: "",
        model: "",
        category: "",
        location: ""
    });

    useEffect(() => {
        urunleriYukle();
    }, []);

    const urunleriYukle = async () => {
        try {
            const veriler = await urunleriGetir();
            setUrunler(veriler || []);
        } catch (hata) {
            console.error("Ürünler yüklenemedi.", hata);
        }
    };

    const urunKaydet = async () => {
        console.log("Kaydet çalıştı");
        console.log(yeniUrun);
        try {
            if (duzenlemeModu) {
                await urunGuncelle(yeniUrun.id, yeniUrun);
            } else {
                await urunEkle(yeniUrun);
            }

            // State'i sıfırla
            setYeniUrun({
                productCode: "",
                productName: "",
                brand: "",
                model: "",
                category: "",
                location: ""
            });

            setModalAcik(false);
            setDuzenlemeModu(false);
            urunleriYukle(); // Listeyi yenile
        } catch (hata) {
            console.log("Status:", hata.response?.status);
            console.log("Data:", hata.response?.data);
        }
    };

    const urunuSil = async (id) => {
        const onay = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");
        if (!onay) return;

        try {
            await urunSil(id);
            urunleriYukle();
        } catch (hata) {
            console.error("Ürün silinemedi.", hata);
        }
    };

    // Arama filtresine göre ürünleri filtreleme mantığı
    const filtrelenmisUrunler = urunler.filter((urun) => {
        const arama = aramaMetni.toLowerCase();
        return (
            urun.productName?.toLowerCase().includes(arama) ||
            urun.productCode?.toLowerCase().includes(arama) ||
            urun.brand?.toLowerCase().includes(arama) ||
            urun.model?.toLowerCase().includes(arama)
        );
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Ürün Yönetimi</h2>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setDuzenlemeModu(false);
                        setYeniUrun({
                            productCode: "",
                            productName: "",
                            brand: "",
                            model: "",
                            category: "",
                            location: ""
                        });
                        setModalAcik(true);
                    }}
                >
                    + Yeni Ürün
                </button>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ürün adı, kodu veya markaya göre ara..."
                    value={aramaMetni}
                    onChange={(e) => setAramaMetni(e.target.value)}
                />
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Marka</th>
                        <th>Model</th>
                        <th>Kategori</th>
                        <th>Konum</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrelenmisUrunler.map((urun) => (
                        <tr key={urun.id}>
                            <td>{urun.id}</td>
                            <td>{urun.productCode}</td>
                            <td>{urun.productName}</td>
                            <td>{urun.brand}</td>
                            <td>{urun.model}</td>
                            <td>{urun.category}</td>
                            <td>{urun.location}</td>
                            <td>
                                {urun.isInMaintenance ? (
                                    <span className="badge bg-danger">Bakımda</span>
                                ) : (
                                    <span className="badge bg-success">Aktif</span>
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {
                                        setDuzenlemeModu(true);
                                        setModalAcik(true);
                                        setYeniUrun(urun); // Düzenlenecek ürünü forma doldurur
                                    }}
                                >
                                    Düzenle
                                </button>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => urunuSil(urun.id)}
                                >
                                    Sil
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        window.open(
                                            `https://localhost:7020/api/products/qr-image/${urun.id}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    QR Göster
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filtrelenmisUrunler.length === 0 && (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">
                                Ürün bulunamadı.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {modalAcik && (
                <div
                    className="modal d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {duzenlemeModu ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalAcik(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    className="form-control mb-2"
                                    placeholder="Ürün Kodu"
                                    value={yeniUrun.productCode || ""}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            productCode: e.target.value
                                        })
                                    }
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Ürün Adı"
                                    value={yeniUrun.productName || ""}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            productName: e.target.value
                                        })
                                    }
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Marka"
                                    value={yeniUrun.brand || ""}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            brand: e.target.value
                                        })
                                    }
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Model"
                                    value={yeniUrun.model || ""}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            model: e.target.value
                                        })
                                    }
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Kategori"
                                    value={yeniUrun.category || ""}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            category: e.target.value
                                        })
                                    }
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Konum"
                                    value={yeniUrun.location || ""}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            location: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalAcik(false)}
                                >
                                    İptal
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={urunKaydet}
                                >
                                    {duzenlemeModu ? "Güncelle" : "Kaydet"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Urunler;