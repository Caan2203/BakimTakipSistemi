import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { urunGecmisiGetir } from "../servisler/urunServisi";

function UrunDetay() {
    const { qrCode } = useParams();

    const [urun, setUrun] = useState(null);
    const [gecmis, setGecmis] = useState([]);
    const [zimmetGecmisi, setZimmetGecmisi] = useState([]);

    useEffect(() => {
        urunuGetir();
    }, []);

    const urunuGetir = async () => {
        try {
            const response = await api.get(`/Products/qr/${qrCode}`);
            setUrun(response.data);

            if (response.data && response.data.id) {

                const gecmisData = await urunGecmisiGetir(response.data.id);
                setGecmis(gecmisData);

                const zimmetResponse = await api.get(`/Zimmet/product/${response.data.id}`);
                setZimmetGecmisi(zimmetResponse.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!urun)
        return <h3 className="text-center mt-5">Ürün bulunamadı.</h3>;

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow">
                <div className="card-header bg-dark text-white">
                    <h3>{urun.productName}</h3>
                </div>

                <div className="card-body">
                    <p><b>Ürün Kodu :</b> {urun.productCode}</p>
                    <p><b>Seri No :</b> {urun.serialNumber}</p>
                    <p><b>Konum :</b> {urun.location}</p>
                    <p>
                        <b>Bakım Durumu :</b>
                        {urun.isInMaintenance ? (
                            <span className="badge bg-danger ms-2">
                                Bakımda
                            </span>
                        ) : (
                            <span className="badge bg-success ms-2">
                                Kullanımda
                            </span>
                        )}
                    </p>

                    {urun.currentAssignment && (
                        <div className="card mt-4">
                            <div className="card-header bg-primary text-white">
                                Güncel Zimmet
                            </div>
                            <div className="card-body">
                                <h5>{urun.currentAssignment.employee}</h5>
                                <p>
                                    Departman :
                                    {" "}
                                    {urun.currentAssignment.department}
                                </p>
                                <p>
                                    Veriliş Tarihi :
                                    {" "}
                                    {new Date(
                                        urun.currentAssignment.verilisTarihi
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* QR Kod Bölümü */}
                    <div className="text-center mt-4 border-top pt-3">
                        <h5>QR Kod</h5>
                        <img
                            src={`https://localhost:7020/api/Products/qr-image/${urun.id}`}
                            alt="QR"
                            className="img-fluid"
                            style={{ maxWidth: 220 }}
                        />
                    </div>
                </div>
            </div>

            {/* Bakım Geçmişi Tablosu */}
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">Bakım Geçmişi</h5>
                </div>
                <div className="card-body">
                    {!urun.maintenances || urun.maintenances.length === 0 ? (
                        <p>Henüz bakım kaydı bulunmuyor.</p>
                    ) : (
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Tarih</th>
                                    <th>Personel</th>
                                    <th>Açıklama</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
    {urun.maintenances.map((bakim) => (
        <tr key={bakim.id}>
            <td>
                {bakim.maintenanceDate
                    ? new Date(bakim.maintenanceDate).toLocaleDateString("tr-TR")
                    : "-"}
            </td>

            <td>
                {bakim.employee
                    ? `${bakim.employee.firstName} ${bakim.employee.lastName}`
                    : "-"}
            </td>

            <td>{bakim.description}</td>

            <td>
                <span
                    className={
                        bakim.status === "Tamamlandı"
                            ? "badge bg-success"
                            : "badge bg-warning text-dark"
                    }
                >
                    {bakim.status}
                </span>
            </td>
        </tr>
    ))}
</tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Zimmet Geçmişi Tablosu */}
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-info text-white">
                    <h5 className="mb-0">Zimmet Geçmişi</h5>
                </div>
                <div className="card-body">
                    {zimmetGecmisi.length === 0 ? (
                        <p>Henüz zimmet kaydı bulunmuyor.</p>
                    ) : (
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Personel</th>
                                    <th>Veriliş Tarihi</th>
                                    <th>İade Tarihi</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zimmetGecmisi.map((zimmet) => (
                                    <tr key={zimmet.id}>
                                        <td>
                                            {zimmet.employee
                                                ? `${zimmet.employee.firstName} ${zimmet.employee.lastName}`
                                                : "Bilinmeyen Personel"}
                                        </td>
                                        <td>{new Date(zimmet.verilisTarihi).toLocaleDateString("tr-TR")}</td>
                                        <td>
                                            {zimmet.iadeTarihi
                                                ? new Date(zimmet.iadeTarihi).toLocaleDateString("tr-TR")
                                                : "-"}
                                        </td>
                                        <td>
                                            {zimmet.aktifMi ? (
                                                <span className="badge bg-primary">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">
                                                    İade Edildi
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* İşlem Geçmişi Kartı */}
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">
                        İşlem Geçmişi
                    </h5>
                </div>
                <div className="card-body">
                    {gecmis.length === 0 ? (
                        <p>Henüz işlem bulunmuyor.</p>
                    ) : (
                        gecmis.map(item => (
                            <div
                                key={item.id}
                                className="border-bottom pb-3 mb-3"
                            >
                                <h6 className="mt-2">
                                    <span className={
                                        item.action.includes("Bakım")
                                            ? "badge bg-success"
                                            : item.action.includes("Zimmet")
                                                ? "badge bg-primary"
                                                : item.action.includes("İade")
                                                    ? "badge bg-warning text-dark"
                                                    : "badge bg-secondary"
                                    }>
                                        {item.action}
                                    </span>
                                </h6>
                                <div className="mt-2">
                                    {item.description}
                                </div>
                                <small className="text-muted d-block mt-1">
                                    <b>İşlemi Yapan:</b> {item.employeeName || "Sistem"}
                                </small>
                                <small className="text-secondary">
                                    {new Date(item.date).toLocaleString("tr-TR")}
                                </small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UrunDetay;