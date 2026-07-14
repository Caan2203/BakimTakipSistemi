import { useEffect, useState } from "react";
import { zimmetleriGetir, zimmetEkle, zimmetIadeEt } from "../services/zimmetServisi";
import { personelleriGetir } from "../services/personelServisi";
import { urunleriGetir, uygunUrunleriGetir } from "../services/urunServisi";
import { useLocation } from "react-router-dom";

function Zimmetler() {
    const [zimmetler, setZimmetler] = useState([]);
    const [urunler, setUrunler] = useState([]);
    const [personeller, setPersoneller] = useState([]);
    const [modalAcik, setModalAcik] = useState(false);
    const location = useLocation();
    const [yeniZimmet, setYeniZimmet] = useState({
        productId: "",
        employeeId: "",
        aciklama: ""
    });

    useEffect(() => {
        yukle();
        urunleriYukle();
        personelleriYukle();

        if (location.state) {
            setYeniZimmet(prev => ({
                ...prev,
                productId: location.state.productId
            }));

            setModalAcik(true);
        }
    }, []);

    const yukle = async () => {
        const data = await zimmetleriGetir();
        setZimmetler(data || []);
    };

    // Sadece uygun/müsait olan ürünleri yükler
    const urunleriYukle = async () => {
        const data = await uygunUrunleriGetir();
        setUrunler(data || []);
    };

    const personelleriYukle = async () => {
        const data = await personelleriGetir();
        setPersoneller(data || []);
    };

    const kaydet = async () => {
        try {
            await zimmetEkle(yeniZimmet);
            setModalAcik(false);
            setYeniZimmet({
                productId: "",
                employeeId: "",
                aciklama: ""
            });
            yukle();
        } catch (hata) {
            console.error("Zimmet kaydedilirken hata oluştu:", hata);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📝 Zimmet Yönetimi</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setModalAcik(true)}
                >
                    ➕ Yeni Zimmet
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Ürün</th>
                        <th>Personel</th>
                        <th>Teslim Tarihi</th>
                        <th>Durum</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {zimmetler.map(z => (
                        <tr key={z.id}>
                            <td>{z.product?.productName}</td>
                            <td>
                                {z.employee?.firstName} {z.employee?.lastName}
                            </td>
                            <td>
                                {z.verilisTarihi ? new Date(z.verilisTarihi).toLocaleDateString("tr-TR") : "-"}
                            </td>
                            <td>
                                {z.aktifMi ? (
                                    <span className="badge bg-success">Aktif</span>
                                ) : (
                                    <span className="badge bg-secondary">İade</span>
                                )}
                            </td>
                            <td>
                                {z.aktifMi && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={async () => {
                                            if (!window.confirm("Ürün iade edilsin mi?"))
                                                return;

                                            await zimmetIadeEt(z.id);
                                            yukle();
                                            urunleriYukle();
                                        }}
                                    >
                                        İade Et
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {zimmetler.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                Kayıtlı zimmet bulunamadı.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {modalAcik && (
                <div
                    className="modal d-block"
                    style={{ background: "rgba(0,0,0,.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Yeni Zimmet</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalAcik(false)}
                                />
                            </div>

                            <div className="modal-body">
                                <label className="fw-bold">Ürün</label>
                                <select
                                    className="form-select mb-3"
                                    value={yeniZimmet.productId}
                                    onChange={(e) =>
                                        setYeniZimmet({
                                            ...yeniZimmet,
                                            productId: Number(e.target.value)
                                        })
                                    }
                                >
                                    <option value="">Ürün Seçiniz</option>
                                    {urunler.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.productName}
                                        </option>
                                    ))}
                                </select>

                                <label className="fw-bold">Personel</label>
                                <select
                                    className="form-select mb-3"
                                    value={yeniZimmet.employeeId}
                                    onChange={(e) =>
                                        setYeniZimmet({
                                            ...yeniZimmet,
                                            employeeId: Number(e.target.value)
                                        })
                                    }
                                >
                                    <option value="">Personel Seçiniz</option>
                                    {personeller.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.firstName} {p.lastName}
                                        </option>
                                    ))}
                                </select>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Açıklama"
                                    value={yeniZimmet.aciklama}
                                    onChange={(e) =>
                                        setYeniZimmet({
                                            ...yeniZimmet,
                                            aciklama: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalAcik(false)}
                                >
                                    Vazgeç
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={kaydet}
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Zimmetler;