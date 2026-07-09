import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function BakimEkle() {

    const { qrCode } = useParams();
    const navigate = useNavigate();

    const [urun, setUrun] = useState(null);
    const [personeller, setPersoneller] = useState([]);

    const [formData, setFormData] = useState({
        employeeId: "",
        status: "Tamamlandı",
        description: ""
    });

    useEffect(() => {
        urunuGetir();
        personelleriGetir();
    }, []);

    const urunuGetir = async () => {
        try {
            const response = await api.get(`/Products/qr/${qrCode}`);
            setUrun(response.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const personelleriGetir = async () => {
        try {
            const response = await api.get("/Employees");
            setPersoneller(response.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const inputDegisti = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const bakimiKaydet = async () => {

        if (formData.employeeId === "") {

            alert("Lütfen personel seçiniz.");

            return;

        }

        try {

            const yeniBakim = {

                productId: urun.id,

                employeeId: Number(formData.employeeId),

                status: formData.status,

                description: formData.description

            };

            await api.post("/Maintenance", yeniBakim);

            alert("Bakım başarıyla kaydedildi.");

            navigate(`/product/${urun.qrCode}`);

        }
        catch (err) {

            console.log(err);

            alert("Bakım kaydedilemedi.");

        }

    };

    if (!urun)
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-warning">

                    <h3>Yeni Bakım Kaydı</h3>

                </div>

                <div className="card-body">

                    <div className="mb-3">

                        <label className="form-label">
                            Ürün
                        </label>

                        <input
                            className="form-control"
                            value={urun.productName}
                            disabled
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Marka
                        </label>

                        <input
                            className="form-control"
                            value={urun.brand}
                            disabled
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Model
                        </label>

                        <input
                            className="form-control"
                            value={urun.model}
                            disabled
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Personel
                        </label>

                        <select
                            className="form-select"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={inputDegisti}
                        >

                            <option value="">
                                Personel Seçiniz
                            </option>

                            {personeller.map(personel => (

                                <option
                                    key={personel.id}
                                    value={personel.id}
                                >

                                    {personel.firstName} {personel.lastName}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Durum
                        </label>

                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={inputDegisti}
                        >

                            <option value="Tamamlandı">
                                Tamamlandı
                            </option>

                            <option value="Devam Ediyor">
                                Devam Ediyor
                            </option>

                            <option value="Beklemede">
                                Beklemede
                            </option>

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Açıklama
                        </label>

                        <textarea
                            className="form-control"
                            rows="5"
                            name="description"
                            value={formData.description}
                            onChange={inputDegisti}
                        />

                    </div>

                    <button
                        className="btn btn-warning w-100"
                        onClick={bakimiKaydet}
                    >
                        🔧 Bakımı Kaydet
                    </button>

                </div>

            </div>

        </div>

    );

}

export default BakimEkle;