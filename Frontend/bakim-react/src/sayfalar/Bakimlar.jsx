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

    // React Warning Çözümü için Başlangıç State'i (Asla undefined olmamalı)
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

    // API'den güncel verileri çeken fonksiyon
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
            alert("Ürün seçiniz");
            return;
        }

        if (!yeniUrun.employeeId) {
            alert("Personel seçiniz");
            return;
        }

        if (!yeniUrun.maintenanceDate) {
            alert("Tarih seçiniz");
            return;
        }

        try {
            // Sorun 1 Çözümü: API'deki 400 hatasını engellemek için id eklendi
          const yeniBakim = {
    id: yeniUrun.id,
    productId: Number(yeniUrun.productId),
    employeeId: Number(yeniUrun.employeeId),
    maintenanceDate: yeniUrun.maintenanceDate,
    description: yeniUrun.description,
    status: yeniUrun.status
    
};
console.log("Gönderilen bakım =", yeniBakim);
console.log(yeniBakim);
            if (duzenlemeModu) {
                await bakimGuncelle(yeniUrun.id, yeniBakim);
            } else {
                await bakimEkle(yeniBakim);
            }

            // Kaydettikten sonra tam temizlik
            setYeniUrun(temizFormState);
            setDuzenlemeModu(false);
            setModalAcik(false);
            verileriYukle();
        } catch (hata) {
    console.log(hata);

    console.log(hata.response);

    console.log(hata.response?.data);

    alert(JSON.stringify(hata.response?.data));
}
    };

    const bakimiSil = async (id) => {
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
                        setYeniUrun(temizFormState);
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
<th>Ürün Kodu</th>
<th>Ürün Adı</th>
<th>Personel</th>
<th>Bakım Tarihi</th>
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
                        bakimlar.map((bakim, index) => {
                            const urun = urunler.find(u => u.id === bakim.productId) || {};
                            const personel =
    personeller.find(p => p.id === bakim.employeeId) || {};
                            return (
                                <tr key={bakim.id}>
                                    <td>{index + 1}</td>
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
                                        <span
                                            className={
                                                bakim.status === "Tamamlandı"
                                                    ? "badge bg-success"
                                                    : bakim.status === "Devam Ediyor"
                                                    ? "badge bg-warning text-dark"
                                                    : "badge bg-danger"
                                            }
                                        >
                                            {bakim.status || "Bekliyor"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                        
                                            className="btn btn-warning btn-sm me-2"
                                            
                                            onClick={() => {
                                                console.log("Bakım =", bakim);
                                                setDuzenlemeModu(true);
                                                setModalAcik(true);
                                                
                                                // Sorun 2 Çözümü: Tarih formatı substring(0,10) ile input'a uygun hale getirildi
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
                                {/* Ürün Seçimi İlişkisi */}
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

                                {/* Personel Seçimi */}
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

                                {/* Sorun 3 Çözümü: Uncontrolled uyarısını engellemek için || "" fallbacks eklendi */}
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
        </div>
    );
}

export default Bakimlar;