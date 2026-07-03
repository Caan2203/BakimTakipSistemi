import { useEffect, useState } from "react";
import {
    bakimlariGetir,
    bakimEkle,
    bakimGuncelle,
    bakimSil
} from "../services/maintenanceServisi";

import { urunleriGetir } from "../services/urunServisi";
import { personelleriGetir } from "../services/personelServisi";

function Bakimlar() {
    const [bakimlar, setBakimlar] = useState([]);
    const [urunler, setUrunler] = useState([]);
    const [personeller, setPersoneller] = useState([]);

    const [modalAcik, setModalAcik] = useState(false);
    const [duzenlemeModu, setDuzenlemeModu] = useState(false);

    const [yeniBakim, setYeniBakim] = useState({
        productId: "",
        employeeId: "",
        maintenanceDate: "",
        description: "",
        status: "Bekliyor"
    });

    useEffect(() => {
        verileriYukle();
    }, []);

    // API'den güncel verileri çeken fonksiyon
    const verileriYukle = async () => {
        try {
            const bakimRes = await bakimlariGetir();
            const urunRes = await urunleriGetir();
            const personelRes = await personelleriGetir();

            // API yapınıza göre .data veya doğrudan dönen array'i setleyebilirsiniz
            setBakimlar(bakimRes?.data || bakimRes || []);
            setUrunler(urunRes?.data || urunRes || []);
            setPersoneller(personelRes?.data || personelRes || []);
        } catch (hata) {
            console.error("Veriler yüklenirken hata oluştu:", hata);
        }
    };

    const bakimKaydet = async () => {
        if (!yeniBakim.productId) {
            alert("Ürün seçiniz");
            return;
        }

        if (!yeniBakim.employeeId) {
            alert("Personel seçiniz");
            return;
        }

        if (!yeniBakim.maintenanceDate) {
            alert("Tarih seçiniz");
            return;
        }

        try {
            console.log("===== BAKIM KAYDET =====");
            console.log("productId:", yeniBakim.productId);
            console.log("employeeId:", yeniBakim.employeeId);
            console.log("maintenanceDate:", yeniBakim.maintenanceDate);
            console.log("description:", yeniBakim.description);
            console.log("status:", yeniBakim.status);
            console.log("productId tipi:", typeof yeniBakim.productId);
            console.log("employeeId tipi:", typeof yeniBakim.employeeId);
            console.log("Gönderilen obje:", yeniBakim);

            if (duzenlemeModu) {
                await bakimGuncelle(yeniBakim.id, yeniBakim);
            } else {
                await bakimEkle(yeniBakim);
            }

            console.log("Kayıt başarılı.");

            setYeniBakim({
                productId: "",
                employeeId: "",
                maintenanceDate: "",
                description: "",
                status: "Bekliyor"
            });

            setDuzenlemeModu(false);
            setModalAcik(false);

            verileriYukle();
        } catch (hata) {
            console.log("===== HATA =====");
            console.log("Status:", hata.response?.status);
            console.log("Response:", hata.response?.data);
            console.error(hata);
        }
    };

    // İstenilen bakimiSil fonksiyonu
    const bakimiSil = async (id) => {
        console.log(id);

        if (!window.confirm("Silinsin mi?")) return;

        try {
            await bakimSil(id);
            verileriYukle();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Bakım Yönetimi</h2>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setDuzenlemeModu(false);
                        setYeniBakim({
                            productId: "",
                            employeeId: "",
                            maintenanceDate: "",
                            description: "",
                            status: "Bekliyor"
                        });
                        setModalAcik(true);
                    }}
                >
                    + Yeni Bakım
                </button>
            </div>

            {/* ANA TABLO */}
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Sıra No</th>
                        <th>ID</th>
                        <th>Ürün</th>
                        <th>QR</th>
                        <th>Personel</th>
                        <th>Tarih</th>
                        <th>Açıklama</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {bakimlar.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center">
                                Henüz bakım kaydı bulunmuyor.
                            </td>
                        </tr>
                    ) : (
                        bakimlar.map((bakim, index) => (
                            <tr key={bakim.id}>
                                <td>{index + 1}</td>
                                <td>{bakim.id}</td>
                                <td>{bakim.product?.productName}</td>
                                <td>
                                    {bakim.product?.qrCode ? (
                                        <span className="badge bg-success">QR Tanımlı</span>
                                    ) : (
                                        <span className="badge bg-danger">QR Yok</span>
                                    )}
                                </td>
                                <td>{bakim.employee?.fullName || `${bakim.employee?.firstName} ${bakim.employee?.lastName}`}</td>
                                <td>{bakim.maintenanceDate?.substring(0, 10)}</td>
                                <td>{bakim.description}</td>
                                <td>
                                    <span
                                        className={
                                            bakim.status === "Tamamlandı"
                                                ? "badge bg-success"
                                                : bakim.status === "Devam Ediyor"
                                                ? "badge bg-warning text-dark"
                                                : "badge bg-danger"
                                        }
                                    >
                                        {bakim.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => {
                                            setDuzenlemeModu(true);
                                            setYeniBakim({
                                                ...bakim,
                                                maintenanceDate: bakim.maintenanceDate?.substring(0, 10) || ""
                                            });
                                            setModalAcik(true);
                                        }}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => bakimiSil(bakim.id)}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* MODAL (YENİ / DÜZENLEME FORMU) */}
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
                                        value={yeniBakim.productId}
                                        onChange={(e) =>
                                            setYeniBakim({
                                                ...yeniBakim,
                                                productId: Number(e.target.value)
                                            })
                                        }
                                    >
                                        <option value="">Ürün Seçin</option>
                                        {urunler.map((urun) => (
                                            <option key={urun.id} value={urun.id}>{urun.productName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Personel</label>
                                    <select
                                        className="form-select"
                                        value={yeniBakim.employeeId}
                                        onChange={(e) =>
                                            setYeniBakim({
                                                ...yeniBakim,
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
                                <div className="mb-3">
                                    <label className="form-label">Tarih</label>
                                    <input
                                        type="date"
                                        className="form-input form-control"
                                        value={yeniBakim.maintenanceDate}
                                        onChange={(e) => setYeniBakim({ ...yeniBakim, maintenanceDate: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        className="form-control"
                                        value={yeniBakim.description}
                                        onChange={(e) => setYeniBakim({ ...yeniBakim, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Durum</label>
                                    <select
                                        className="form-select"
                                        value={yeniBakim.status}
                                        onChange={(e) => setYeniBakim({ ...yeniBakim, status: e.target.value })}
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
        </div>
    );
}

export default Bakimlar;