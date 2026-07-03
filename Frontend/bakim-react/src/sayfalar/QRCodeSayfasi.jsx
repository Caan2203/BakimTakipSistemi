import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { urunleriGetir } from "../services/urunServisi";

function QRCodeSayfasi() {

    const [urunler, setUrunler] = useState([]);

    useEffect(() => {
        verileriYukle();
    }, []);

    const verileriYukle = async () => {
        try {
            const data = await urunleriGetir();
            setUrunler(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Ürün QR Kodları</h2>

            <div className="row">

                {urunler.map((urun) => (

                    <div className="col-md-4 mb-4" key={urun.id}>

                        <div className="card shadow text-center p-3">

                            <h5 className="fw-bold">{urun.productName}</h5>

                            <p className="mb-1">
                             <strong>Seri No:</strong> {urun.serialNumber}
                               </p>

                              <p className="text-muted">
                               <strong>Konum:</strong> {urun.location}
                               </p>

                            <div className="d-flex justify-content-center my-3">

                                <QRCode
                                    value={`https://localhost:5173/urun/${urun.qrCode}`}
                                    size={180}
                                />

                            </div>
                            <p className="text-success fw-bold">
  
                              QR Hazır
                               </p>

                        </div>
                        <button
    className="btn btn-primary mt-3"
    onClick={() => window.print()}
>
    QR Yazdır
</button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default QRCodeSayfasi;