import { useEffect, useState } from "react";
import { personelExcelIndir } from "../services/personelServisi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    personelleriGetir,
    personelEkle,
    personelGuncelle,
    personelSil
} from "../services/personelServisi";

function Personeller() {
    const navigate = useNavigate();
    const [personeller, setPersoneller] = useState([]);
    const [arama, setArama] = useState("");
    const [duzenlemeModu, setDuzenlemeModu] = useState(false);
    const [modalAcik, setModalAcik] = useState(false);

    const [yeniPersonel, setYeniPersonel] = useState({
        firstName: "",
        lastName: "",
        department: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        personelleriYukle();
    }, []);

    const personelleriYukle = async () => {
        try {
            const veriler = await personelleriGetir();
            setPersoneller(veriler || []);
        } catch (hata) {
            console.error(hata);
        }
    };

    const personelKaydet = async () => {
        try {
            if (duzenlemeModu) {
                await personelGuncelle(yeniPersonel.id, yeniPersonel);
                Swal.fire({
                    icon: "success",
                    title: "Güncellendi",
                    text: "Kayıt başarıyla güncellendi.",
                    confirmButtonColor: "#2563eb"
                });
            } else {
                await personelEkle(yeniPersonel);
                Swal.fire({
                    icon: "success",
                    title: "Başarılı",
                    text: "Kayıt başarıyla oluşturuldu.",
                    confirmButtonColor: "#2563eb"
                });
            }

            setYeniPersonel({
                firstName: "",
                lastName: "",
                department: "",
                phone: "",
                email: ""
            });

            setModalAcik(false);
            setDuzenlemeModu(false);
            personelleriYukle();
        } catch (hata) {
            console.error("Personel kaydedilemedi.", hata);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };

    const personeliSil = async (id) => {
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
            await personelSil(id);
            Swal.fire({
                icon: "success",
                title: "Silindi",
                text: "Kayıt başarıyla silindi.",
                confirmButtonColor: "#dc3545"
            });
            personelleriYukle();
        } catch (hata) {
            console.error("Personel silinemedi.", hata);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "İşlem gerçekleştirilemedi."
            });
        }
    };
    const filtreliPersoneller = personeller.filter(x =>
        x.firstName?.toLowerCase().includes(arama.toLowerCase()) ||
        x.lastName?.toLowerCase().includes(arama.toLowerCase()) ||
        x.department?.toLowerCase().includes(arama.toLowerCase())
    );

    return (
        <div className="container-fluid px-0">
            <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>👤Personel Yönetimi</h2>
                    {/* Buton Grubu */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success"
                            onClick={personelExcelIndir}
                        >
                            <i className="bi bi-file-earmark-excel me-2"></i>
                            Excel'e Aktar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setDuzenlemeModu(false);
                                setYeniPersonel({
                                    firstName: "",
                                    lastName: "",
                                    department: "",
                                    phone: "",
                                    email: ""
                                });
                                setModalAcik(true);
                            }}
                        >
                            + Yeni Personel
                        </button>
                    </div>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Personel adı, soyadı veya departman ara..."
                        value={arama}
                        onChange={(e) => setArama(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Ad</th>
                                <th>Soyad</th>
                                <th>Departman</th>
                                <th>Telefon</th>
                                <th>E-Posta</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtreliPersoneller.map((personel) => (
                                <tr key={personel.id}>
                                    <td>{personel.id}</td>
                                    <td>{personel.firstName}</td>
                                    <td>{personel.lastName}</td>
                                    <td>{personel.department}</td>
                                    <td>{personel.phone}</td>
                                    <td>{personel.email}</td>
                                    <td style={{ whiteSpace: "nowrap", width: "220px" }}>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                setDuzenlemeModu(true);
                                                setYeniPersonel(personel);
                                                setModalAcik(true);
                                            }}
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => navigate(`/personeller/${personel.id}`)}
                                        >
                                            Detay
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => personeliSil(personel.id)}
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtreliPersoneller.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-3">
                                        Aranan kriterlere uygun personel bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                                        {duzenlemeModu ? "Personel Düzenle" : "Yeni Personel"}
                                    </h5>
                                    <button
                                        className="btn-close"
                                        onClick={() => setModalAcik(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Ad"
                                        value={yeniPersonel.firstName}
                                        onChange={(e) =>
                                            setYeniPersonel({
                                                ...yeniPersonel,
                                                firstName: e.target.value
                                            })
                                        }
                                    />
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Soyad"
                                        value={yeniPersonel.lastName}
                                        onChange={(e) =>
                                            setYeniPersonel({
                                                ...yeniPersonel,
                                                lastName: e.target.value
                                            })
                                        }
                                    />
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Departman"
                                        value={yeniPersonel.department}
                                        onChange={(e) =>
                                            setYeniPersonel({
                                                ...yeniPersonel,
                                                department: e.target.value
                                            })
                                        }
                                    />
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Telefon"
                                        value={yeniPersonel.phone}
                                        onChange={(e) =>
                                            setYeniPersonel({
                                                ...yeniPersonel,
                                                phone: e.target.value
                                            })
                                        }
                                    />
                                    <input
                                        className="form-control"
                                        placeholder="E-Posta"
                                        value={yeniPersonel.email}
                                        onChange={(e) =>
                                            setYeniPersonel({
                                                ...yeniPersonel,
                                                email: e.target.value
                                            })
                                        }
                                    />
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
                                        onClick={personelKaydet}
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

export default Personeller;