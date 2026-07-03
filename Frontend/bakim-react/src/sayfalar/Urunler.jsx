import { useEffect, useState } from "react";
import {
    urunleriGetir,
    urunEkle,
    urunGuncelle,
    urunSil
} from "../services/urunServisi";


function Urunler() {

    const [urunler, setUrunler] = useState([]);

    const [duzenlemeModu, setDuzenlemeModu] = useState(false);

    const [modalAcik, setModalAcik] = useState(false);

    const [yeniUrun, setYeniUrun] = useState({
        productCode: "",
        productName: "",
        serialNumber: "",
        location: "",
        maintenancePeriod: 30
    });

    useEffect(() => {
        urunleriYukle();
    }, []);

    const urunleriYukle = async () => {
        try {
            const veriler = await urunleriGetir();
            setUrunler(veriler);
        } catch (hata) {
            console.error("Ürünler yüklenemedi.", hata);
        }
    };

   const urunKaydet = async () => {
console.log("Kaydet çalıştı");
console.log(yeniUrun);
    try {

        if (duzenlemeModu) {

            await urunGuncelle(yeniUrun.id, yeniUrun);

        } else {

            await urunEkle(yeniUrun);

        }

        setYeniUrun({
            productCode: "",
            productName: "",
            serialNumber: "",
            location: "",
            maintenancePeriod: 30
        });

        setModalAcik(false);

        setDuzenlemeModu(false);

        urunleriYukle();

    } catch (hata) {
    console.log("HATA:");
    console.log(hata);
    console.log(hata.response);
    console.log(hata.response?.data);
}

};
const urunuSil = async (id) => {

    const onay = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");

    if (!onay) return;

    try {

        await urunSil(id);

        urunleriYukle();

    } catch (hata) {

        console.error("Ürün silinemedi.", hata);

    }

};

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Ürün Yönetimi</h2>
<button
    className="btn btn-success"
    onClick={() => {

        setDuzenlemeModu(false);

        setYeniUrun({
            productCode: "",
            productName: "",
            serialNumber: "",
            location: "",
            maintenancePeriod: 30
        });

        setModalAcik(true);

    }}
>
    + Yeni Ürün
</button>

            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ürün ara..."
                />
            </div>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Seri No</th>
                        <th>Konum</th>
                        <th>Bakım Periyodu</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>

                <tbody>

                    {urunler.map((urun) => (

                        <tr key={urun.id}>

                            <td>{urun.id}</td>
                            <td>{urun.productCode}</td>
                            <td>{urun.productName}</td>
                            <td>{urun.serialNumber}</td>
                            <td>{urun.location}</td>
                            <td>{urun.maintenancePeriod} Gün</td>

                            <td>
                                <button
                                 className="btn btn-warning btn-sm me-2"
                                 onClick={() => {
                                 setDuzenlemeModu(true);
                                 setModalAcik(true);
                                 setYeniUrun(urun);
                                  }}
                                 >
                                  Düzenle
                                </button>

                               <button
    className="btn btn-danger btn-sm"
    onClick={() => urunuSil(urun.id)}
>
    Sil
</button><button
    className="btn btn-primary btn-sm ms-2"
    onClick={() => window.open(`/qr-kod/${urun.qrCode}`, "_blank")}
>
    QR Göster
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
    {duzenlemeModu ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
</h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setModalAcik(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

                                <input
                                    className="form-control mb-2"
                                    placeholder="Ürün Kodu"
                                    value={yeniUrun.productCode}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            productCode: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Ürün Adı"
                                    value={yeniUrun.productName}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            productName: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Seri No"
                                    value={yeniUrun.serialNumber}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            serialNumber: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Konum"
                                    value={yeniUrun.location}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            location: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Bakım Periyodu"
                                    value={yeniUrun.maintenancePeriod}
                                    onChange={(e) =>
                                        setYeniUrun({
                                            ...yeniUrun,
                                            maintenancePeriod: Number(e.target.value)
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
    onClick={urunKaydet}
    
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

export default Urunler;