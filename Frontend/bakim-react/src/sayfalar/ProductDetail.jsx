import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function ProductDetail() {
    const { qrCode } = useParams();
    const navigate = useNavigate();
    const [urun, setUrun] = useState(null);

    useEffect(() => {
        urunuGetir();
    }, [qrCode]);

    const urunuGetir = async () => {
        try {
            const response = await api.get(`/Products/qr/${qrCode}`);
            console.log(response.data);

            setUrun(response.data);
        }
        catch (err) {
            console.log("API Hatası:", err);
        }
    };

    if (!urun)
        return <h3 className="text-center mt-5">Yükleniyor...</h3>;

    const bugun = new Date();

    const sonrakiBakim = urun?.nextMaintenanceDate
        ? new Date(urun.nextMaintenanceDate)
        : null;

    const bakimGecikti =
        sonrakiBakim && sonrakiBakim < bugun;

    return (
        <div className="container mt-4">
            <div className="card shadow">

                <div className="card-header bg-primary text-white">
                    <h3>{urun.productName}</h3>
                </div>

                <div className="card-body">

                    <p><b>Ürün Kodu:</b> {urun.productCode}</p>
                    <p><b>Marka:</b> {urun.brand}</p>
                    <p><b>Model:</b> {urun.model}</p>
                    <p><b>Kategori:</b> {urun.category}</p>
                    <p><b>Konum:</b> {urun.location}</p>
                    <p>
                        <b>Son Bakım Tarihi:</b>{" "}
                        {urun.lastMaintenanceDate
                            ? new Date(urun.lastMaintenanceDate).toLocaleDateString("tr-TR")
                            : "-"}
                    </p>

                    <p>
                        <b>Sonraki Bakım:</b>{" "}
                        {urun.nextMaintenanceDate
                            ? new Date(urun.nextMaintenanceDate).toLocaleDateString("tr-TR")
                            : "-"}
                    </p>

                    <p>
                        <b>Durum:</b>{" "}
                        {urun.isInMaintenance ? (
                            <span className="badge bg-danger">
                                Bakımda
                            </span>
                        ) : (
                            <span className="badge bg-success">
                                Aktif
                            </span>
                        )}
                    </p>

                    <hr />

                    {bakimGecikti ? (
                        <div className="alert alert-danger">
                            ⚠️ Bu ürünün bakım zamanı gelmiş.
                        </div>
                    ) : (
                        <div className="alert alert-success">
                            ✅ Bakımı güncel.
                        </div>
                    )}

                    <h4>Bakım Geçmişi</h4>

                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Tarih</th>
                                <th>Personel</th>
                                <th>Durum</th>
                                <th>Açıklama</th>
                            </tr>
                        </thead>

                        <tbody>
                            {urun.maintenances?.length > 0 ? (
                                urun.maintenances.map((bakim) => (
                                    <tr key={bakim.id}>
                                        <td>
                                            {new Date(
                                                bakim.maintenanceDate
                                            ).toLocaleDateString("tr-TR")}
                                        </td>

                                        <td>
                                            {bakim.employee?.firstName}{" "}
                                            {bakim.employee?.lastName}
                                        </td>

                                        <td>{bakim.status}</td>

                                        <td>{bakim.description}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >
                                        Bu ürüne ait bakım kaydı bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="d-grid mt-4">
                        <button
                            className="btn btn-warning btn-lg"
                            onClick={() => navigate(`/bakim-ekle/${urun.qrCode}`)}
                        >
                            🔧 Bu Ürüne Bakım Yap
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProductDetail;