import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { qrUrunGetir } from "../services/urunQrServisi";

function QRUrunDetay() {

    const { qrCode } = useParams();

    const [urun, setUrun] = useState(null);

    useEffect(() => {

        veriGetir();

    }, []);

    async function veriGetir() {

        try {

            const data = await qrUrunGetir(qrCode);

            setUrun(data);

        } catch {

            alert("Ürün bulunamadı.");

        }

    }

    if (!urun)
        return <h3>Yükleniyor...</h3>;

    return (

        <div className="container mt-5">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h3>{urun.productName}</h3>

                </div>

                <div className="card-body">

                    <p><b>Ürün Kodu :</b> {urun.productCode}</p>

                    <p><b>Marka :</b> {urun.brand}</p>

                    <p><b>Model :</b> {urun.model}</p>

                    <p><b>Konum :</b> {urun.location}</p>

                    <p><b>Son Bakım :</b> {urun.lastMaintenanceDate}</p>

                    <p><b>Sonraki Bakım :</b> {urun.nextMaintenanceDate}</p>

                    <p>

                        <b>Bakım Durumu :</b>

                        {

                            urun.isInMaintenance

                                ? " Bakımda"

                                : " Aktif"

                        }

                    </p>

                </div>
                <div className="card mt-4 shadow">

    <div className="card-header">

        <h5>Ürün Hareket Geçmişi</h5>

    </div>

    <div className="card-body">

        <table className="table table-hover">

            <thead>

                <tr>

                    <th>Tarih</th>
                    <th>İşlem</th>
                    <th>Açıklama</th>

                </tr>

            </thead>

            <tbody>

                {hareketler.map(item => (

                    <tr key={item.id}>

                        <td>{new Date(item.date).toLocaleString()}</td>

                        <td>{item.action}</td>

                        <td>{item.description}</td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>

            </div>

        </div>

    );

}

export default QRUrunDetay;