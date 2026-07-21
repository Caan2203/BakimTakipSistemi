import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
    bakimlariGetir,
    bakimEkle,
    bakimGuncelle,
    bakimSil,
    bakimExcelIndir
} from "../services/maintenanceServisi";

import { urunleriGetir } from "../services/urunServisi";
import { personelleriGetir } from "../services/personelServisi";

function Bakimlar() {
    const [bakimlar, setBakimlar] = useState([]);
    const [urunler, setUrunler] = useState([]);
    const [personeller, setPersoneller] = useState([]);
    const [modalAcik, setModalAcik] = useState(false);
    const [duzenlemeModu, setDuzenlemeModu] = useState(false);
    const [aramaMetni, setAramaMetni] = useState("");
    const [durumFiltresi, setDurumFiltresi] = useState("Hepsi");
    const [tarihSiralamasi, setTarihSiralamasi] = useState("yeni");
    const [gecerliSayfa, setGecerliSayfa] = useState(1);
    
    const [arama, setArama] = useState("");
    
    const sayfaBasinaKayit = 5;
    const temizFormState = {
        id: "",
        productId: "",
        employeeId: "",
        maintenanceDate: "",
        description: "",
        status: "Bekliyor",
        productCode: "",
        productName: "",
        brand: "",
        model: "",
        category: "",
        location: ""
    };

    const [yeniUrun, setYeniUrun] = useState(temizFormState);

    useEffect(() => {
        verileriYukle();
    }, []);

    const verileriYukle = async () => {
        try {
            const bakimRes = await bakimlariGetir();
            const urunRes = await urunleriGetir();
            const personelRes = await personelleriGetir();
            setBakimlar(bakimRes?.data || bakimRes || []);
            setUrunler(urunRes?.data || urunRes || []);
            setPersoneller(personelRes?.data || personelRes || []);
        } catch (hata) {
            console.error("Veriler yüklenirken hata oluştu:", hata);
        }
    };

    const bakimKaydet = async () => {
        if (!yeniUrun.productId) {
            Swal.fire({
                icon: "warning",
                title: "Uyarı",
                text: "Lütfen bir ürün seçiniz.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }
        if (!yeniUrun.employeeId) {
            Swal.fire({
                icon: "warning",
                title: "Uyarı",
                text: "Lütfen bir personel seçiniz.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }
        if (!yeniUrun.maintenanceDate) {
            Swal.fire({
                icon: "warning",
                title: "Uyarı",
                text: "Lütfen bir tarih seçiniz.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }
        try {
            let yeniBakim;
            if (duzenlemeModu) {
                yeniBakim = {
                    id: Number(yeniUrun.id),
                    productId: Number(yeniUrun.productId),
                    employeeId: Number(yeniUrun.employeeId),
                    maintenanceDate: yeniUrun.maintenanceDate,
                    description: yeniUrun.description,
                    status: yeniUrun.status
                };
            } else {
                yeniBakim = {
                    productId: Number(yeniUrun.productId),
                    employeeId: Number(yeniUrun.employeeId),
                    maintenanceDate: yeniUrun.maintenanceDate,
                    description: yeniUrun.description,
                    status: yeniUrun.status
                };
            }
            console.log("Gönderilen bakım =", yeniBakim);
            
            if (duzenlemeModu) {
                await bakimGuncelle(yeniUrun.id, yeniBakim);
                Swal.fire({
                    icon: "success",
                    title: "Güncellendi",
                    text: "Kayıt başarıyla güncellendi.",
                    confirmButtonColor: "#2563eb"
                });
            } else {
                await bakimEkle(yeniBakim);
                Swal.fire({
                    icon: "success",
                    title: "Başarılı",
                    text: "Kayıt başarıyla oluşturuldu.",
                    confirmButtonColor: "#2563eb"
                });
            }

            setYeniUrun(temizFormState);
            setDuzenlemeModu(false);
            setModalAcik(false);
            verileriYukle();
        } catch (hata) {
            console.log(hata);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: hata.response?.data ? JSON.stringify(hata.response.data) : "İşlem gerçekleştirilemedi."
            });
        }
    };

    const bakimiSil = async (id) => {
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
            await bakimSil(id);
            Swal.fire({
                icon: "success",
                title: "Silindi",
                text: "Kayıt başarıyla silindi.",
                confirmButtonColor: "#dc3545"
            });
            verileriYukle();
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };

    const toplamBakim = bakimlar.length;
    const tamamlananBakim = bakimlar.filter(b => b.status === "Tamamlandı").length;
    const devamEdenBakim = bakimlar.filter(b => b.status === "Devam Ediyor").length;
    const bekleyenBakim = bakimlar.filter(b => b.status === "Bekliyor" || !b.status).length;

    const filtrelenmisBakimlar = bakimlar.filter((bakim) => {
        const urun = urunler.find(u => u.id === bakim.productId);
        const personel = personeller.find(p => p.id === bakim.employeeId);

        const metin = arama.toLowerCase();
        const aramaMetniKucuk = aramaMetni.toLowerCase();

        const eslesmeYeniArama = 
            (urun?.productName || "").toLowerCase().includes(metin) ||
            (urun?.productCode || "").toLowerCase().includes(metin) ||
            (`${personel?.firstName || ""} ${personel?.lastName || ""}`).toLowerCase().includes(metin);

        const eslesmeEskiArama = 
            (urun?.productName || "").toLowerCase().includes(aramaMetniKucuk) ||
            (urun?.productCode || "").toLowerCase().includes(aramaMetniKucuk) ||
            (personel?.firstName || "").toLowerCase().includes(aramaMetniKucuk) ||
            (personel?.lastName || "").toLowerCase().includes(aramaMetniKucuk);

        const mevcutDurum = bakim.status || "Bekliyor";
        const eslesmeDurum = durumFiltresi === "Hepsi" || mevcutDurum === durumFiltresi;

        return eslesmeYeniArama && eslesmeEskiArama && eslesmeDurum;
    }).sort((a, b) => {
        const tarihA = new Date(a.maintenanceDate || 0);
        const tarihB = new Date(b.maintenanceDate || 0);
        return tarihSiralamasi === "yeni" ? tarihB - tarihA : tarihA - tarihB;
    });

    const sonKayitIndeksi = gecerliSayfa * sayfaBasinaKayit;
    const ilkKayitIndeksi = sonKayitIndeksi - sayfaBasinaKayit;
    const gecerliBakimlar = filtrelenmisBakimlar.slice(ilkKayitIndeksi, sonKayitIndeksi);
    const toplamSayfaSayisi = Math.ceil(filtrelenmisBakimlar.length / sayfaBasinaKayit);
            
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🛠️Bakım Yönetimi</h2>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ürün veya personel ara..."
                        style={{ width: "280px" }}
                        value={arama}
                        onChange={(e) => { setArama(e.target.value); setGecerliSayfa(1); }}
                    />
                    <button
                        className="btn btn-success"
                        onClick={bakimExcelIndir}
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Excel'e Aktar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setDuzenlemeModu(false);
                            setYeniUrun(temizFormState);
                            setModalAcik(true);
                        }}
                    >
                        + Yeni Bakım
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h6>Toplam Bakım</h6>
                            <h3>{toplamBakim}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h6>Tamamlandı</h6>
                            <h3>{tamamlananBakim}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h6>Devam Ediyor</h6>
                            <h3>{devamEdenBakim}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h6>Bekliyor</h6>
                            <h3>{bekleyenBakim}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4 bg-light p-3 rounded shadow-sm">
                <div className="col-md-4">
                    <label className="form-label font-weight-bold">Durum Filtresi</label>
                    <select
                        className="form-select"
                        value={durumFiltresi}
                        onChange={(e) => { setDurumFiltresi(e.target.value); setGecerliSayfa(1); }}
                    >
                        <option value="Hepsi">Tüm Durumlar</option>
                        <option value="Bekliyor">Bekliyor</option>
                        <option value="Devam Ediyor">Devam Ediyor</option>
                        <option value="Tamamlandı">Tamamlandı</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label font-weight-bold">Tarih Sıralaması</label>
                    <select
                        className="form-select"
                        value={tarihSiralamasi}
                        onChange={(e) => setTarihSiralamasi(e.target.value)}
                    >
                        <option value="yeni">En Yeni</option>
                        <option value="eski">En Eski</option>
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Sıra No</th>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Personel</th>
                        <th>Bakım Tarihi</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {gecerliBakimlar.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Eşleşen veya henüz eklenmiş bir bakım kaydı bulunmuyor.
                            </td>
                        </tr>
                    ) : (
                        gecerliBakimlar.map((bakim, index) => {
                            const urun = urunler.find(u => u.id === bakim.productId) || {};
                            const personel = personeller.find(p => p.id === bakim.employeeId) || {};
                            return (
                                <tr key={bakim.id}>
                                    <td>{ilkKayitIndeksi + index + 1}</td>
                                    <td>{urun.productCode || "-"}</td>
                                    <td>{urun.productName || "-"}</td>
                                    <td>
                                        {personel.firstName
                                            ? `${personel.firstName} ${personel.lastName}`
                                            : "-"}
                                    </td>
                                    <td>
                                        {bakim.maintenanceDate
                                            ? new Date(bakim.maintenanceDate).toLocaleDateString("tr-TR")
                                            : "-"}
                                    </td>
                                    <td>
                                        {bakim.status === "Tamamlandı" && (
                                            <span className="badge bg-success">Tamamlandı</span>
                                        )}
                                        {bakim.status === "Devam Ediyor" && (
                                            <span className="badge bg-warning text-dark">Devam Ediyor</span>
                                        )}
                                        {(bakim.status === "Bekliyor" || !bakim.status) && (
                                            <span className="badge bg-danger">Bekliyor</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                console.log("Bakım =", bakim);
                                                setDuzenlemeModu(true);
                                                setModalAcik(true);
                                                setYeniUrun({
                                                    ...bakim,
                                                    maintenanceDate: bakim.maintenanceDate
                                                        ? bakim.maintenanceDate.substring(0, 10)
                                                        : "",
                                                    productCode: urun.productCode || "",
                                                    productName: urun.productName || "",
                                                    brand: bakim.brand || urun.brand || "",
                                                    model: bakim.model || urun.model || "",
                                                    category: bakim.category || urun.category || "",
                                                    location: bakim.location || urun.location || ""
                                                });
                                            }}
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm me-2"
                                            onClick={() => bakimiSil(bakim.id)}
                                        >
                                            Sil
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => window.open(`/qr-kod/${urun.qrCode}`, "_blank")}
                                            disabled={!urun.qrCode}
                                        >
                                            QR
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {toplamSayfaSayisi > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                    <ul className="pagination">
                        <li className={`page-item ${gecerliSayfa === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setGecerliSayfa(gecerliSayfa - 1)}>Önceki</button>
                        </li>
                        {[...Array(toplamSayfaSayisi).keys()].map((sayfaNo) => (
                            <li key={sayfaNo + 1} className={`page-item ${gecerliSayfa === sayfaNo + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setGecerliSayfa(sayfaNo + 1)}>
                                    {sayfaNo + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${gecerliSayfa === toplamSayfaSayisi ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setGecerliSayfa(toplamSayfaSayisi ? gecerliSayfa + 1 : gecerliSayfa)}>Sonraki</button>
                        </li>
                    </ul>
                </nav>
            )}

            {modalAcik && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {duzenlemeModu ? "Bakım Düzenle" : "Yeni Bakım"}
                                </h5>
                                <button className="btn-close" onClick={() => setModalAcik(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Ürün</label>
                                    <select
                                        className="form-select"
                                        value={yeniUrun.productId || ""}
                                        onChange={(e) => {
                                            const secilenUrunId = Number(e.target.value);
                                            const u = urunler.find(item => item.id === secilenUrunId) || {};
                                            setYeniUrun({
                                                ...yeniUrun,
                                                productId: secilenUrunId,
                                                productCode: u.productCode || "",
                                                productName: u.productName || "",
                                                brand: u.brand || "",
                                                model: u.model || "",
                                                category: u.category || "",
                                                location: u.location || ""
                                            });
                                        }}
                                    >
                                        <option value="">Ürün Seçin</option>
                                        {urunler.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.productCode} - {u.productName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Personel</label>
                                    <select
                                        className="form-select"
                                        value={yeniUrun.employeeId || ""}
                                        onChange={(e) =>
                                            setYeniUrun({
                                                ...yeniUrun,
                                                employeeId: Number(e.target.value)
                                            })
                                        }
                                    >
                                        <option value="">Personel Seçin</option>
                                        {personeller.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.firstName} {p.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Marka</label>
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Marka"
                                        value={yeniUrun.brand || ""}
                                        onChange={(e)=> setYeniUrun({ ...yeniUrun, brand: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Model</label>
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Model"
                                        value={yeniUrun.model || ""}
                                        onChange={(e)=> setYeniUrun({ ...yeniUrun, model: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Kategori</label>
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Kategori"
                                        value={yeniUrun.category || ""}
                                        onChange={(e)=> setYeniUrun({ ...yeniUrun, category: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Konum</label>
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Konum"
                                        value={yeniUrun.location || ""}
                                        onChange={(e)=> setYeniUrun({ ...yeniUrun, location: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tarih</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={yeniUrun.maintenanceDate || ""}
                                        onChange={(e) => setYeniUrun({ ...yeniUrun, maintenanceDate: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        className="form-control"
                                        value={yeniUrun.description || ""}
                                        onChange={(e) => setYeniUrun({ ...yeniUrun, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Durum</label>
                                    <select
                                        className="form-select"
                                        value={yeniUrun.status || "Bekliyor"}
                                        onChange={(e) => setYeniUrun({ ...yeniUrun, status: e.target.value })}
                                    >
                                        <option value="Bekliyor">Bekliyor</option>
                                        <option value="Devam Ediyor">Devam Ediyor</option>
                                        <option value="Tamamlandı">Tamamlandı</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setModalAcik(false)}>Kapat</button>
                                <button className="btn btn-primary" onClick={bakimKaydet}>Kaydet</button>
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
    );
}

export default Bakimlar;