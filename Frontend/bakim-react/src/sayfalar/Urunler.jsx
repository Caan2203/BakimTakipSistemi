import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    urunleriGetir,
    urunEkle,
    urunGuncelle,
    urunSil
} from "../services/urunServisi";

function Urunler() {
    const [urunler, setUrunler] = useState([]);
    const [kategoriFiltre, setKategoriFiltre] = useState("");
    const [duzenlemeModu, setDuzenlemeModu] = useState(false);
    const [modalAcik, setModalAcik] = useState(false);
    const [aramaMetni, setAramaMetni] = useState("");
    const navigate = useNavigate();

    const [yeniUrun, setYeniUrun] = useState({
        productCode: "",
        productName: "",
        brand: "",
        model: "",
        location: "",
        maintenancePeriodDay: 30
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
        // Form alanlarının doluluk kontrolü
        if (!yeniUrun.productName) {
            alert("Ürün seçiniz"); // Veya "Ürün adı giriniz"
            return;
        }

        try {
            if (duzenlemeModu) {
                await urunGuncelle(yeniUrun.id, yeniUrun);
            } else {
                await urunEkle(yeniUrun);
            }

            setYeniUrun({
                productCode: "",
                productName: "",
                brand: "",
                model: "",
                location: "",
                maintenancePeriodDay: 30
            });

            setModalAcik(false);
            setDuzenlemeModu(false);
            await urunleriYukle(); 
        } catch (hata) {
            console.error("Hata detayı:", hata.response?.data);
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

    // Filtreleme mantığı: Arama metni ve Kategori filtresi birlikte değerlendirilir
    const filtrelenmisUrunler = urunler.filter((urun) => {
        const arama = aramaMetni.toLowerCase();
        
        // İsim, kod, marka veya model eşleşme kontrolü
        const isimEslesti = urun.productName?.toLowerCase().includes(arama);
        const kodEslesti = urun.productCode?.toLowerCase().includes(arama);
        const markaEslesti = urun.brand?.toLowerCase().includes(arama);
        const modelEslesti = urun.model?.toLowerCase().includes(arama);

        // Kategori eşleşme kontrolü
        const kategoriEslesti = 
            kategoriFiltre === "" || 
            urun.category === kategoriFiltre;

        return (isimEslesti || kodEslesti || markaEslesti || modelEslesti) && kategoriEslesti;
    });

    // Tablo hücreleri için padding kuralı
    const hucreStili = { padding: "18px" };

    return (
        <div
            className="container-fluid py-4"
            style={{
                maxWidth: "1700px",
                margin: "0 auto"
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">
                        📦 Ürünler
                    </h2>
                    <p className="text-muted mb-0">
                        Tüm ürünleri görüntüleyebilir, düzenleyebilir ve bakım işlemlerini yönetebilirsiniz.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setDuzenlemeModu(false);
                        setYeniUrun({
                            productCode: "",
                            productName: "",
                            brand: "",
                            model: "",
                            location: "",
                            maintenancePeriodDay: 30
                        });
                        setModalAcik(true);
                    }}
                >
                    ➕ Yeni Ürün Kaydı
                </button>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        {/* Arama Kutusu */}
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Ürün adı, kodu, marka veya modele göre ara..."
                                value={aramaMetni}
                                onChange={(e) => setAramaMetni(e.target.value)}
                            />
                        </div>
                        {/* Kategori Seçici Filtresi */}
                        <div className="col-md-3">
                            <select
                                className="form-select form-select-lg"
                                value={kategoriFiltre}
                                onChange={(e) => setKategoriFiltre(e.target.value)}
                            >
                                <option value="">Tüm Kategoriler</option>
                                <option>Bilgisayar</option>
                                <option>Monitör</option>
                                <option>Yazıcı</option>
                                <option>Telefon</option>
                                <option>Sunucu</option>
                            </select>
                        </div>
                        {/* Toplam Ürün Bilgisi */}
                        <div className="col-md-3 text-end">
                            <span className="badge bg-primary p-3 fs-6">
                                Toplam Ürün : {urunler.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={hucreStili}>Zimmet</th>
                                    <th style={hucreStili}>Kod</th>
                                    <th style={hucreStili}>Ürün</th>
                                    <th style={hucreStili}>Marka</th>
                                    <th style={hucreStili}>Son Bakım</th>
                                    <th style={hucreStili}>Sonraki Bakım</th>
                                    <th style={hucreStili}>Durum</th>
                                    <th style={hucreStili}>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {filtrelenmisUrunler.map((urun) => {
                                    const bugun = new Date();
                                    const sonrakiBakim = urun.nextMaintenanceDate
                                        ? new Date(urun.nextMaintenanceDate)
                                        : null;

                                    let durum = (
                                        <span className="badge bg-secondary">Belirsiz</span>
                                    );

                                    if (sonrakiBakim) {
                                        const fark = Math.ceil((sonrakiBakim - bugun) / (1000 * 60 * 60 * 24));

                                        if (fark < 0)
                                            durum = <span className="badge bg-danger">Gecikti</span>;
                                        else if (fark <= 30)
                                            durum = <span className="badge bg-warning text-dark">Yaklaşıyor</span>;
                                        else
                                            durum = <span className="badge bg-success">Güncel</span>;
                                    }

                                    return (
                                        <tr key={urun.id}>
                                            <td style={hucreStili}>
                                                {urun.isAssigned ? (
                                                    <span className="badge bg-danger">Zimmetli</span>
                                                ) : (
                                                    <span className="badge bg-success">Boşta</span>
                                                )}
                                            </td>
                                            <td style={hucreStili}>{urun.productCode}</td>
                                            <td style={hucreStili}>{urun.productName}</td>
                                            <td style={hucreStili}>{urun.brand}</td>
                                            <td style={hucreStili}>
                                                {urun.lastMaintenanceDate
                                                    ? new Date(urun.lastMaintenanceDate).toLocaleDateString("tr-TR")
                                                    : "-"}
                                            </td>
                                            <td style={hucreStili}>
                                                {urun.nextMaintenanceDate
                                                    ? new Date(urun.nextMaintenanceDate).toLocaleDateString("tr-TR")
                                                    : "-"}
                                            </td>
                                            <td style={hucreStili}>{durum}</td>
                                            <td style={{ width: "290px", ...hucreStili }}>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <button 
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => {
                                                            setDuzenlemeModu(true);
                                                            setModalAcik(true);
                                                            setYeniUrun(urun);
                                                        }}
                                                    >
                                                        Düzenle
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-sm"
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
                                                        Detay
                                                    </button>
                                                    <button 
                                                        className="btn btn-info btn-sm"
                                                        disabled={urun.isAssigned}
                                                        onClick={() =>
                                                            navigate("/zimmetler", {
                                                                state: {
                                                                    productId: urun.id,
                                                                    productName: urun.productName
                                                                }
                                                            })
                                                        }
                                                    >
                                                        Zimmetle
                                                    </button>
                                                    <button 
                                                        className="btn btn-success btn-sm"
                                                        onClick={() =>
                                                            navigate("/bakimlar", {
                                                                state: {
                                                                    productId: urun.id,
                                                                    productName: urun.productName
                                                                }
                                                            })
                                                        }
                                                    >
                                                        Bakım Yap
                                                    </button>
                                                    <button
                                                        className="btn btn-dark btn-sm"
                                                        onClick={() => navigate(`/urun-gecmisi/${urun.id}`)}
                                                    >
                                                        <i className="bi bi-clock-history"></i> Geçmiş
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtrelenmisUrunler.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted" style={hucreStili}>
                                            Ürün bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modalAcik && (
                <div
                    className="modal d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-box-seam me-2"></i>
                                    {duzenlemeModu ? "Ürün Düzenle" : "Yeni Ürün Kaydı"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalAcik(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <h6 className="fw-bold">Otomatik Oluşturulacaklar</h6>
                                    <ul className="mb-0">
                                        <li>Ürün Kodu</li>
                                        <li>QR Kod</li>
                                        <li>Kayıt Tarihi</li>
                                        <li>İlk Bakım Planı</li>
                                    </ul>
                                </div>

                                <div className="mb-3">
                                    <label className="fw-bold">Ürün Kodu</label>
                                    <input
                                        className="form-control"
                                        value={
                                            duzenlemeModu
                                                ? yeniUrun.productCode
                                                : "Otomatik oluşturulacaktır"
                                        }
                                        disabled
                                    />
                                    <small className="text-muted">
                                        Sistem kayıt sırasında otomatik ürün kodu oluşturacaktır.
                                    </small>
                                </div>

                                <div className="mb-2">
                                    <input
                                        className="form-control"
                                        placeholder="Ürün Adı"
                                        value={yeniUrun.productName || ""}
                                        onChange={(e) =>
                                            setYeniUrun({
                                                ...yeniUrun,
                                                productName: e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        className="form-control"
                                        placeholder="Marka"
                                        value={yeniUrun.brand || ""}
                                        onChange={(e) =>
                                            setYeniUrun({
                                                ...yeniUrun,
                                                brand: e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        className="form-control"
                                        placeholder="Model"
                                        value={yeniUrun.model || ""}
                                        onChange={(e) =>
                                            setYeniUrun({
                                                ...yeniUrun,
                                                model: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="fw-bold">Bakım Periyodu</label>
                                    <small className="text-muted d-block mb-2">
                                        Ürünün kaç günde bir bakıma gireceğini belirleyiniz.
                                    </small>
                                    <select
                                        className="form-select"
                                        value={yeniUrun.maintenancePeriodDay || 30}
                                        onChange={(e) =>
                                            setYeniUrun({
                                                ...yeniUrun,
                                                maintenancePeriodDay: Number(e.target.value)
                                            })
                                        }
                                    >
                                        <option value={15}>15 Gün</option>
                                        <option value={30}>30 Gün</option>
                                        <option value={45}>45 Gün</option>
                                        <option value={60}>60 Gün</option>
                                        <option value={90}>90 Gün</option>
                                        <option value={180}>180 Gün</option>
                                        <option value={365}>365 Gün</option>
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <input
                                        className="form-control"
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
                                    {duzenlemeModu ? "Güncelle" : "Ürünü Kaydet"}
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