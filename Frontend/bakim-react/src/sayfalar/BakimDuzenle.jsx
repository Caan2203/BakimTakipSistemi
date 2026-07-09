import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function BakimDuzenle() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [personeller, setPersoneller] = useState([]);

    const [formData, setFormData] = useState({
        id: 0,
        productId: 0,
        employeeId: "",
        maintenanceDate: "",
        status: "",
        description: ""
    });

    useEffect(() => {
        verileriGetir();
    }, []);

    const verileriGetir = async () => {

        try {

            const bakimResponse = await api.get(`/Maintenance/${id}`);
            const personelResponse = await api.get("/Employees");

            setPersoneller(personelResponse.data);

            setFormData({
                id: bakimResponse.data.id,
                productId: bakimResponse.data.productId,
                employeeId: bakimResponse.data.employeeId,
                maintenanceDate: bakimResponse.data.maintenanceDate,
                status: bakimResponse.data.status,
                description: bakimResponse.data.description
            });

        }
        catch (err) {
            console.log(err);
            alert("Bakım bilgileri getirilemedi.");
        }
        finally {
            setLoading(false);
        }

    };

    const inputDegisti = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const kaydet = async (e) => {

        e.preventDefault();

        try {

            await api.put(`/Maintenance/${id}`, formData);

            alert("Bakım kaydı başarıyla güncellendi.");

            navigate("/bakimlar");

        }
        catch (err) {

            console.log(err);

            alert("Güncelleme sırasında hata oluştu.");

        }

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-warning">

                    <h3>Bakım Kaydını Düzenle</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={kaydet}>

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
                            type="submit"
                            className="btn btn-warning w-100"
                        >

                            Güncelle

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default BakimDuzenle;