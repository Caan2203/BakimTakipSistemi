import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { personelDetayiGetir } from "../services/personelServisi";

function PersonelDetay() {
    const { id } = useParams();
    const [personel, setPersonel] = useState(null);

    useEffect(() => {
        yukle();
    }, []);

    const yukle = async () => {
        const data = await personelDetayiGetir(id);
        setPersonel(data);
    };

    if (!personel)
        return (
            <div className="container mt-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                    <h4>Yükleniyor...</h4>
                </div>
            </div>
        );
    const aktifZimmetler = personel.zimmetler?.filter(z => z.aktifMi) || [];
    const gecmisZimmetler = personel.zimmetler?.filter(z => !z.aktifMi) || [];

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>👤 Personel Detay Profili</h2>
            </div>
            <hr />
            <div className="row mb-4">
                <div className="col-lg-5 mb-4 mb-lg-0">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-primary text-white py-3">
                            <h4 className="mb-0">{personel.firstName} {personel.lastName}</h4>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <div className="mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">Departman</span>
                                    <span className="fs-5"> {personel.department || "-"}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">Telefon</span>
                                    <span className="fs-5">📞 {personel.phone || "-"}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-muted d-block small text-uppercase fw-bold">E-Posta</span>
                                    <span className="fs-5 text-break">✉️ {personel.email || "-"}</span>
                                </div>
                            </div>
                            <div className="border-top pt-3 mt-3">
                                <div className="row text-center">
                                    <div className="col-6 border-end">
                                        <h6 className="text-muted mb-1 small">Aktif Ürün</h6>
                                        <span className="badge bg-success fs-6">{aktifZimmetler.length} Adet</span>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="text-muted mb-1 small">Geçmiş Zimmet</h6>
                                        <span className="badge bg-secondary fs-6">{gecmisZimmetler.length} Adet</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-success text-white py-3">
                            <h5 className="mb-0">🟢 Aktif Zimmetli Ürünler</h5>
                        </div>
                        <div className="card-body">
                            {aktifZimmetler.length === 0 ? (
                                <div className="alert alert-info mb-0 d-flex align-items-center" role="alert">
                                    <span>Personelin üzerinde şu anda aktif zimmetli ürün bulunmamaktadır.</span>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush" style={{ maxHeight: "290px", overflowY: "auto" }}>
                                    {aktifZimmetler.map(z => (
                                        <div key={z.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                                            <div>
                                                <h6 className="mb-1 text-primary">📦 {z.product?.productName}</h6>
                                                {z.product?.productCode && (
                                                    <small className="text-muted">Kod: {z.product.productCode}</small>
                                                )}
                                            </div>
                                            <span className="badge rounded-pill bg-light text-dark border">
                                                Teslim: {z.verilisTarihi ? new Date(z.verilisTarihi).toLocaleDateString("tr-TR") : "-"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-secondary text-white py-3">
                    <h5 className="mb-0">📋 Zimmet Geçmişi</h5>
                </div>
                <div className="card-body">
                    {gecmisZimmetler.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            Geçmişe ait iade edilmiş bir zimmet kaydı bulunamadı.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Ürün Adı</th>
                                        <th>Veriliş Tarihi</th>
                                        <th>İade Tarihi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gecmisZimmetler.map(z => (
                                        <tr key={z.id}>
                                            <td className="fw-semibold text-dark">
                                                {z.product?.productName}
                                            </td>
                                            <td>
                                                {z.verilisTarihi 
                                                    ? new Date(z.verilisTarihi).toLocaleDateString("tr-TR") 
                                                    : "-"
                                                }
                                            </td>
                                            <td>
                                                {z.iadeTarihi 
                                                    ? <span className="text-success fw-bold">{new Date(z.iadeTarihi).toLocaleDateString("tr-TR")}</span>
                                                    : "-"
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default PersonelDetay;