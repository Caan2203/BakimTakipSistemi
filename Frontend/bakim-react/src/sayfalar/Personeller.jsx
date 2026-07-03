import { useEffect, useState } from "react";
import {
    personelleriGetir,
    personelEkle,
    personelGuncelle,
    personelSil
} from "../services/personelServisi";

function Personeller() {

    const [personeller, setPersoneller] = useState([]);

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
            setPersoneller(veriler);
        } catch (hata) {
            console.error(hata);
        }
    };

    const personelKaydet = async () => {

        try {

            if (duzenlemeModu) {

                await personelGuncelle(yeniPersonel.id, yeniPersonel);

            } else {

                await personelEkle(yeniPersonel);

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

        }

    };

    const personeliSil = async (id) => {

        const onay = window.confirm("Bu personeli silmek istediğinize emin misiniz?");

        if (!onay) return;

        try {

            await personelSil(id);

            personelleriYukle();

        } catch (hata) {

            console.error("Personel silinemedi.", hata);

        }

    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Personel Yönetimi</h2>

                <button
                    className="btn btn-success"
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

            <table className="table table-bordered table-hover">

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

                    {personeller.map((personel) => (

                        <tr key={personel.id}>

                            <td>{personel.id}</td>
                            <td>{personel.firstName}</td>
                            <td>{personel.lastName}</td>
                            <td>{personel.department}</td>
                            <td>{personel.phone}</td>
                            <td>{personel.email}</td>

                            <td>

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
                                    className="btn btn-danger btn-sm"
                                    onClick={() => personeliSil(personel.id)}
                                >
                                    Sil
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
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

        </div>
    );
}

export default Personeller;