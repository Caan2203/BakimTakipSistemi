import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { zimmetleriGetir, zimmetEkle, zimmetIadeEt } from "../services/zimmetServisi";
import { personelleriGetir } from "../services/personelServisi";
import { urunleriGetir, uygunUrunleriGetir } from "../services/urunServisi";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
        try {
            const data = await zimmetleriGetir();
            setZimmetler(data || []);
        } catch (hata) {
            console.error("Zimmetler yüklenirken hata oluştu:", hata);
        }
    };
    
    const urunleriYukle = async () => {
        try {
            const data = await uygunUrunleriGetir();
            setUrunler(data || []);
        } catch (hata) {
            console.error("Ürünler yüklenirken hata oluştu:", hata);
        }
    };

    const personelleriYukle = async () => {
        try {
            const data = await personelleriGetir();
            setPersoneller(data || []);
        } catch (hata) {
            console.error("Personeller yüklenirken hata oluştu:", hata);
        }
    };

    // Excel oluşturma fonksiyonu (Gelişmiş Formatlama İle)
    const excelAktar = () => {
        const excelData = zimmetler.map((z, index) => ({
            "Sıra No": index + 1,
            "Ürün Adı": z.product?.productName || "-",
            "Personel": z.employee
                ? `${z.employee.firstName} ${z.employee.lastName}`
                : "-",
            "Teslim Tarihi": z.verilisTarihi
                ? new Date(z.verilisTarihi).toLocaleDateString("tr-TR")
                : "-",
            "Durum": z.aktifMi ? "Aktif" : "İade"
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        worksheet["!cols"] = [
            { wch: 10 },
            { wch: 35 },
            { wch: 30 },
            { wch: 20 },
            { wch: 15 }
        ];

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Zimmet Listesi"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        saveAs(
            new Blob([excelBuffer]),
            `Zimmet_Listesi_${new Date().toLocaleDateString("tr-TR")}.xlsx`
        );
    };

    const kaydet = async () => {
        if (!yeniZimmet.productId) {
            Swal.fire({
                icon: "warning",
                title: "Uyarı",
                text: "Lütfen bir ürün seçiniz.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }
        if (!yeniZimmet.employeeId) {
            Swal.fire({
                icon: "warning",
                title: "Uyarı",
                text: "Lütfen bir personel seçiniz.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }

        try {
            await zimmetEkle(yeniZimmet);
            Swal.fire({
                icon: "success",
                title: "Başarılı",
                text: "Kayıt başarıyla oluşturuldu.",
                confirmButtonColor: "#2563eb"
            });
            setModalAcik(false);
            setYeniZimmet({
                productId: "",
                employeeId: "",
                aciklama: ""
            });
            yukle();
            urunleriYukle();
        } catch (hata) {
            console.error("Zimmet kaydedilirken hata oluştu:", hata);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };

    const iadeEtmeIslemi = async (id) => {
        const sonuc = await Swal.fire({
            title: "Emin misiniz?",
            text: "Bu zimmet kaydı iade edilecektir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet",
            cancelButtonText: "İptal",
            confirmButtonColor: "#dc3545"
        });

        if (!sonuc.isConfirmed) return;

        try {
            await zimmetIadeEt(id);
            Swal.fire({
                icon: "success",
                title: "Silindi",
                text: "Kayıt başarıyla silindi.",
                confirmButtonColor: "#dc3545"
            });
            yukle();
            urunleriYukle();
        } catch (err) {
            console.error("İade edilirken hata oluştu:", err);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📝 Zimmet Yönetimi</h2>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-success"
                        onClick={excelAktar}>
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Excel'e Aktar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setModalAcik(true)}
                    >
                        ➕ Yeni Zimmet
                    </button>
                </div>
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
                                        onClick={() => iadeEtmeIslemi(z.id)}
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
                                <label className="fw-bold mb-1">Ürün</label>
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

                                <label className="fw-bold mb-1">Personel</label>
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

                                <label className="fw-bold mb-1">Açıklama</label>
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
            <div className="text-center mt-4 mb-5">
                <small className="text-muted">
                    ACAR Bakım Takip Sistemi © 2026
                </small>
            </div>
        </div>
    );
}

export default Zimmetler;