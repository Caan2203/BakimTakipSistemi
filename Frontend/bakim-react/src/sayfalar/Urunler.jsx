import { useEffect, useState } from "react";
import { excelIndir } from "../services/urunServisi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
    const gecerliTarihMi = (tarihStr) => {
        if (!tarihStr) return false;
        if (tarihStr.startsWith("0001")) return false;
        const d = new Date(tarihStr);
        return !isNaN(d.getTime());
    };
    const tarihFormatlaTR = (tarihStr) => {
        if (!gecerliTarihMi(tarihStr)) return "-";
        return new Date(tarihStr).toLocaleDateString("tr-TR");
    };
    const tarihFormatla = (tarihStr) => {
        if (!gecerliTarihMi(tarihStr)) return "";
        return tarihStr.split("T")[0];
    };

    const [yeniUrun, setYeniUrun] = useState({
        productCode: "",
        productName: "",
        brand: "",
        model: "",
        location: "",
        maintenancePeriodDay: 30,

        purchaseDate: "",
        warrantyStartDate: "",
        warrantyEndDate: ""
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
        if (!yeniUrun.productName) {
            Swal.fire({
                icon: "warning",
                title: "Uyarı",
                text: "Lütfen ürün adı giriniz.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }

        try {
            if (duzenlemeModu) {
                await urunGuncelle(yeniUrun.id, yeniUrun);
                Swal.fire({
                    icon: "success",
                    title: "Güncellendi",
                    text: "Kayıt başarıyla güncellendi.",
                    confirmButtonColor: "#2563eb"
                });
            } else {
                await urunEkle(yeniUrun);
                Swal.fire({
                    icon: "success",
                    title: "Başarılı",
                    text: "Kayıt başarıyla oluşturuldu.",
                    confirmButtonColor: "#2563eb"
                });
            }

            setYeniUrun({
                productCode: "",
                productName: "",
                brand: "",
                model: "",
                location: "",
                maintenancePeriodDay: 30,

                purchaseDate: "",
                warrantyStartDate: "",
                warrantyEndDate: ""
            });

            setModalAcik(false);
            setDuzenlemeModu(false);
            await urunleriYukle();
        } catch (hata) {
            console.error("Hata detayı:", hata.response?.data);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };

    const urunuSil = async (id) => {
        const sonuc = await Swal.fire({
            title: "Emin misiniz?",
            text: "Bu kayıt silinecektir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet",
            cancelButtonText: "İptal",
            confirmButtonColor: "#dc3545"
        });

        if (!sonuc.isConfirmed) return;

        try {
            await urunSil(id);
            Swal.fire({
                icon: "success",
                title: "Silindi",
                text: "Kayıt başarıyla silindi.",
                confirmButtonColor: "#dc3545"
            });
            urunleriYukle();
        } catch (hata) {
            console.error("Ürün silinemedi.", hata);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };

    const filtrelenmisUrunler = urunler.filter((urun) => {
        const arama = aramaMetni.toLowerCase();

        const isimEslesti = urun.productName?.toLowerCase().includes(arama);
        const kodEslesti = urun.productCode?.toLowerCase().includes(arama);
        const markaEslesti = urun.brand?.toLowerCase().includes(arama);
        const modelEslesti = urun.model?.toLowerCase().includes(arama);
        const kategoriEslesti =
            kategoriFiltre === "" ||
            urun.category === kategoriFiltre;

        return (isimEslesti || kodEslesti || markaEslesti || modelEslesti) && kategoriEslesti;
    });

    const hucreStili = { padding: "18px" };

    return (
        <div className="container-fluid px-0">
            <div
                className="py-4"
                style={{
                    maxWidth: "1700px",
                    margin: "0 auto"
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-2">
                            📦 Ürünler
                        </h2>
                        <p className="text-muted mb-0">
                            Tüm ürünleri görüntüleyebilir, düzenleyebilir ve bakım işlemlerini yönetebilirsiniz.
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success d-flex align-items-center"
                            onClick={excelIndir}
                        >
                            <i className="bi bi-file-earmark-excel me-2"></i>
                            Excel'e Aktar
                        </button>
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
                                    maintenancePeriodDay: 30,

                                    purchaseDate: "",
                                    warrantyStartDate: "",
                                    warrantyEndDate: ""
                                });
                                setModalAcik(true);
                            }}
                        >
                            ➕ Yeni Ürün Kaydı
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Ürün adı, kodu, marka veya modele göre ara..."
                                    value={aramaMetni}
                                    onChange={(e) => setAramaMetni(e.target.value)}
                                />
                            </div>
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
                                        <th style={hucreStili}>Garanti Bitiş</th>
                                        <th style={hucreStili}>Garanti Durumu</th>
                                        <th style={hucreStili}>Durum</th>
                                        <th style={hucreStili}>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="align-middle">
                                    {filtrelenmisUrunler.map((urun) => {
                                        const bugun = new Date();

                                        let garantiBadge = (
                                            <span className="badge bg-secondary">
                                                Bilinmiyor
                                            </span>
                                        );
                                        if (gecerliTarihMi(urun.warrantyEndDate)) {
                                            const garantiBitis = new Date(urun.warrantyEndDate);
                                            const kalanGun = Math.ceil(
                                                (garantiBitis - bugun) /
                                                (1000 * 60 * 60 * 24)
                                            );

                                            if (kalanGun < 0) {
                                                garantiBadge = (
                                                    <span className="badge bg-danger">
                                                        Garanti Bitti
                                                    </span>
                                                );
                                            } else if (kalanGun <= 30) {
                                                garantiBadge = (
                                                    <span className="badge bg-warning text-dark">
                                                        {kalanGun} Gün Kaldı
                                                    </span>
                                                );
                                            } else {
                                                garantiBadge = (
                                                    <span className="badge bg-success">
                                                        Devam Ediyor
                                                    </span>
                                                );
                                            }
                                        }

                                        const sonrakiBakim = gecerliTarihMi(urun.nextMaintenanceDate)
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
                                                    {tarihFormatlaTR(urun.lastMaintenanceDate)}
                                                </td>
                                                <td style={hucreStili}>
                                                    {tarihFormatlaTR(urun.nextMaintenanceDate)}
                                                </td>
                                                {/* Garanti Bitiş Tarihi Tablo Sütunu (GG.AA.YYYY) */}
                                                <td style={hucreStili}>
                                                    {tarihFormatlaTR(urun.warrantyEndDate)}
                                                </td>
                                                <td style={hucreStili}>
                                                    {garantiBadge}
                                                </td>
                                                <td style={hucreStili}>{durum}</td>
                                                <td style={{ whiteSpace: "nowrap", width: "220px", ...hucreStili }}>
                                                    <button 
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => {
                                                            setDuzenlemeModu(true);
                                                            setModalAcik(true);
                                                            setYeniUrun({
                                                                ...urun,
                                                                purchaseDate: tarihFormatla(urun.purchaseDate),
                                                                warrantyStartDate: tarihFormatla(urun.warrantyStartDate),
                                                                warrantyEndDate: tarihFormatla(urun.warrantyEndDate)
                                                            });
                                                        }}
                                                    >
                                                        Düzenle
                                                    </button>
                                                    <button 
                                                        className="btn btn-info btn-sm me-2"
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
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => urunuSil(urun.id)}
                                                    >
                                                        Sil
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filtrelenmisUrunler.length === 0 && (
                                        <tr>
                                            <td colSpan="10" className="text-center text-muted" style={hucreStili}>
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
                                    <hr />
                                    <h6 className="fw-bold mb-3">
                                        🛡️ Garanti Bilgileri
                                    </h6>
                                    <div className="mb-3">
                                        <label className="form-label">Satın Alma Tarihi</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={yeniUrun.purchaseDate || ""}
                                            onChange={(e) =>
                                                setYeniUrun({
                                                    ...yeniUrun,
                                                    purchaseDate: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Garanti Başlangıcı</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={yeniUrun.warrantyStartDate || ""}
                                            onChange={(e) =>
                                                setYeniUrun({
                                                    ...yeniUrun,
                                                    warrantyStartDate: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Garanti Bitişi</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={yeniUrun.warrantyEndDate || ""}
                                            onChange={(e) =>
                                                setYeniUrun({
                                                    ...yeniUrun,
                                                    warrantyEndDate: e.target.value
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
                                        {duzenlemeModu ? "Güncelle" : "Kaydet"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="text-center mt-4 mb-5">
                    <small className="text-muted">
                        ACAR Bakım Takip Sistemi © 2026
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Urunler;