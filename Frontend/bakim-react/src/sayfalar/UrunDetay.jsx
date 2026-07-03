import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function UrunDetay() {

    const { qrCode } = useParams();

    const [urun, setUrun] = useState(null);

    useEffect(() => {

        urunuGetir();

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

    if (!urun)
        return <h3 className="text-center mt-5">Ürün bulunamadı.</h3>;

    return (

        <div className="container mt-5">

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

                </div>

            </div>

        </div>

    );

}

export default UrunDetay;