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
            setUrunler(data || []);
        } catch (error) {
            console.error("Veriler yüklenirken hata oluştu:", error);
        }
    };

    const qrYazdir = (urun) => {
        const pencere = window.open("", "_blank", "width=500,height=700");
        const qrSvgElement = document.getElementById(`qr-svg-${urun.id}`);
        const qrSvgHtml = qrSvgElement ? qrSvgElement.outerHTML : "";

        pencere.document.write(`
            <html>
            <head>
                <title>QR Yazdır - ${urun.productName || "Ürün"}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                        background: white;
                    }
                    .kart {
                        width: 320px;
                        border: 2px solid #ddd;
                        border-radius: 15px;
                        padding: 20px;
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    h2 {
                        margin-bottom: 15px;
                        font-size: 22px;
                        color: #333;
                    }
                    p {
                        margin: 8px 0;
                        font-size: 15px;
                        color: #555;
                    }
                    .qr-container {
                        margin-top: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .qr-container svg {
                        width: 200px !important;
                        height: 200px !important;
                    }
                </style>
            </head>
            <body>
                <div class="kart">
                    <h2>${urun.productName || "-"}</h2>
                    <p><strong>Model:</strong> ${urun.model || "-"}</p>
                    <p><strong>Konum:</strong> ${urun.location || "-"}</p>
                    <p><strong>Kod:</strong> ${urun.qrCode || "-"}</p>
                    <div class="qr-container">
                        ${qrSvgHtml}
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    }
                </script>
            </body>
            </html>
        `);

        pencere.document.close();
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">🔳Ürün QR Kodları</h2>

            <div className="row">
                {urunler.map((urun) => (
                    <div className="col-md-4 mb-4" key={urun.id}>
                        <div className="card shadow text-center p-3 h-100">
                            <h5 className="fw-bold">{urun.productName}</h5>

                            <p className="mb-1">
                                <strong>Model:</strong> {urun.model}
                            </p>
                            
                            <p className="text-muted">
                                <strong>Konum:</strong> {urun.location}
                            </p>

                            <div className="d-flex justify-content-center my-3" id={`qr-svg-${urun.id}`}>
                                <QRCode
                                    value={`http://localhost:5173/product/${urun.qrCode}`}
                                    size={180}
                                />
                            </div>
                            
                            <p className="text-success fw-bold mb-auto">
                                QR Hazır
                            </p>

                            <button
                                className="btn btn-primary mt-3 w-100"
                                onClick={() => qrYazdir(urun)}
                            >
                                QR Yazdır
                            </button>
                        </div>
                    </div>
                ))}

                {urunler.length === 0 && (
                    <div className="col-12 text-center text-muted my-5">
                        Gösterilecek ürün veya QR kod bulunamadı.
                    </div>
                )}
            </div>

            <div className="text-center mt-4 mb-5">
                <small className="text-muted">
                    ACAR Bakım Takip Sistemi © 2026
                </small>
            </div>
        </div>
    );
}

export default QRCodeSayfasi;