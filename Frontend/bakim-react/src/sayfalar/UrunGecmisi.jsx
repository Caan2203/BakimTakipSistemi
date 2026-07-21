import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { urunDetayiGetir, urunHareketleriniGetir } from "../services/urunServisi";

function UrunGecmisi() {
    const { id } = useParams();
    const [urun, setUrun] = useState(null);
    const [hareketler, setHareketler] = useState([]);

    useEffect(() => {
        yukle();
    }, []);

    const yukle = async () => {
        const data = await urunDetayiGetir(id);
        setUrun(data);
        const history = await urunHareketleriniGetir(id);
        setHareketler(history);
    };

    if (!urun)
        return (
            <div className="container mt-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                    <h4>Yükleniyor...</h4>
                </div>
            </div>
        );
    const aktifZimmet = urun.currentAssignment || urun.CurrentAssignment || urun.zimmetler?.find(x => x.aktifMi);

    const toplamBakim = urun.maintenances?.length || 0;
    const toplamZimmet = urun.zimmetler?.length || 0;
    const bakimPeriyodu = urun.maintenancePeriodDay || 0;

    const zimmetLoglari = (urun.zimmetler || []).map(z => ({
        tarih: new Date(z.verilisTarihi),
        icon: "🟢",
        text: `Zimmetlendi: ${z.employee?.firstName} ${z.employee?.lastName} kişisine teslim edildi.`
    }));

    const bakimLoglari = (urun.maintenances || []).map(m => ({
        tarih: new Date(m.maintenanceDate),
        icon: "🔧",
        text: `Bakım Yapıldı: ${m.employee ? `${m.employee.firstName} ${m.employee.lastName} tarafından.` : ""} ${m.description ? `(${m.description})` : ""}`
    }));

    const sortedLogs = [...zimmetLoglari, ...bakimLoglari].sort((a, b) => b.tarih - a.tarih);

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>📦 Ürün Hareket Geçmişi</h2>
            </div>
            <hr />

            <div className="row mb-4">
                <div className="col-lg-7 mb-4 mb-lg-0">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-primary text-white py-3">
                            <h4 className="mb-0">{urun.productName}</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">Ürün Kodu</span>
                                    <span className="fs-6 fw-semibold text-dark">{urun.productCode || "-"}</span>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">Konum</span>
                                    <span className="fs-6 fw-semibold text-dark">📍 {urun.location || "-"}</span>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">Marka / Model</span>
                                    <span className="fs-6 fw-semibold text-dark">{urun.brand} - {urun.model}</span>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">QR Kod</span>
                                    <span className="badge bg-light text-dark border">{urun.qrCode || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-success text-white py-3">
                            <h5 className="mb-0">🟢 Güncel Zimmet Durumu</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-center">
                            {aktifZimmet ? (
                                <div className="p-3 bg-light rounded border-start border-success border-4">
                                    <h5 className="text-success mb-1">
                                        👤 {aktifZimmet.employeeName || (aktifZimmet.employee ? `${aktifZimmet.employee.firstName} ${aktifZimmet.employee.lastName}` : aktifZimmet.Employee || "-")}
                                    </h5>
                                    {aktifZimmet.department && (
                                        <p className="mb-1 text-muted small">
                                            <b>Departman:</b> {aktifZimmet.department}
                                        </p>
                                    )}
                                    <p className="mb-0 text-muted">
                                        <b>Teslim Tarihi:</b>{" "}
                                        {aktifZimmet.verilisTarihi ? new Date(aktifZimmet.verilisTarihi).toLocaleDateString("tr-TR") : "-"}
                                    </p>
                                </div>
                            ) : (
                                <div className="alert alert-warning mb-0 text-center" role="alert">
                                     Ürün şu anda boşta (Herhangi bir personele zimmetli değil).
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                    <div className="card text-center shadow-sm border-0 border-start border-4">
                        <div className="card-body">
                            <span className="text-muted text-uppercase small fw-bold">Toplam Bakım</span>
                            <h2 className={`mt-2 mb-0 fw-bold ${toplamBakim === 0 ? "text-danger" : "text-success"}`}>
                                {toplamBakim}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                    <div className="card text-center shadow-sm border-0 border-start border-4">
                        <div className="card-body">
                            <span className="text-muted text-uppercase small fw-bold">Toplam Zimmet</span>
                            <h2 className={`mt-2 mb-0 fw-bold ${toplamZimmet === 0 ? "text-danger" : "text-success"}`}>
                                {toplamZimmet}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center shadow-sm border-0 border-start border-4">
                        <div className="card-body">
                            <span className="text-muted text-uppercase small fw-bold">Bakım Periyodu</span>
                            <h2 className={`mt-2 mb-0 fw-bold ${bakimPeriyodu === 0 ? "text-danger" : "text-success"}`}>
                                {bakimPeriyodu} Gün
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-warning text-dark py-3">
                    <h5 className="mb-0">🔧 Bakım Geçmişi</h5>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Tarih</th>
                                    <th>Teknisyen Personel</th>
                                    <th>Durum</th>
                                    <th>Açıklama</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!urun.maintenances || urun.maintenances.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-3">
                                            Bu ürüne ait bakım kaydı bulunamadı.
                                        </td>
                                    </tr>
                                ) : (
                                    urun.maintenances.map(m => (
                                        <tr key={m.id}>
                                            <td>
                                                {m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString("tr-TR") : "-"}
                                            </td>
                                            <td className="fw-semibold">
                                                {m.employee ? `${m.employee.firstName} ${m.employee.lastName}` : "-"}
                                            </td>
                                            <td>
                                                <span className={`badge ${m.status === 'Tamamlandı' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {m.status || "Belirtilmemiş"}
                                                </span>
                                            </td>
                                            <td className="text-muted">{m.description || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-secondary text-white py-3">
                    <h5 className="mb-0">📋 Zimmet Geçmişi</h5>
                </div>
                <div className="card-body">
                    {!urun.zimmetler || urun.zimmetler.length === 0 ? (
                        <div className="text-center text-muted py-3">
                            Bu ürüne ait zimmet geçmişi bulunmuyor.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Personel</th>
                                        <th>Veriliş Tarihi</th>
                                        <th>İade Tarihi</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {urun.zimmetler.map(z => (
                                        <tr key={z.id}>
                                            <td className="fw-semibold">
                                                {z.employee?.firstName} {z.employee?.lastName}
                                            </td>
                                            <td>
                                                {z.verilisTarihi ? new Date(z.verilisTarihi).toLocaleDateString("tr-TR") : "-"}
                                            </td>
                                            <td>
                                                {z.iadeTarihi ? (
                                                    <span className="text-success">{new Date(z.iadeTarihi).toLocaleDateString("tr-TR")}</span>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>
                                                {z.aktifMi ? (
                                                    <span className="badge bg-success">Aktif</span>
                                                ) : (
                                                    <span className="badge bg-secondary">İade Edildi</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white py-3">
                    <h5 className="mb-0">📜 Genel Hareket Geçmişi</h5>
                </div>
                <div className="card-body">
                    {sortedLogs.length === 0 ? (
                        <div className="text-center text-muted py-3">
                            Herhangi bir hareket geçmişi kaydı bulunamadı.
                        </div>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {sortedLogs.map((log, index) => (
                                <li key={index} className="list-group-item d-flex align-items-start gap-2 border-bottom py-3 px-1">
                                    <span className="fs-5">{log.icon}</span>
                                    <div>
                                        <span className="badge bg-light text-dark border me-2">
                                            {log.tarih.toLocaleDateString("tr-TR")}
                                        </span>
                                        <span className="text-dark">{log.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UrunGecmisi;
