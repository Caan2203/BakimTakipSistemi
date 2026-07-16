import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { urunGecmisiniGetir } from "../servisler/urunServisi";

function UrunHareketleri() {

    const { id } = useParams();

    const [hareketler, setHareketler] = useState([]);

    useEffect(() => {

        yukle();

    }, []);

    const yukle = async () => {

        const data = await urunGecmisiniGetir(id);

        setHareketler(data);

    };

    return (

        <div className="container mt-4">

            <h3>Ürün Hareket Geçmişi</h3>

            <table className="table table-striped">

                <thead>

                    <tr>

                        <th>Tarih</th>

                        <th>İşlem</th>

                        <th>Açıklama</th>

                    </tr>

                </thead>

                <tbody>

                    {hareketler.map(x => (

                        <tr key={x.id}>

                            <td>{new Date(x.date).toLocaleString()}</td>

                            <td>{x.action}</td>

                            <td>{x.description}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default UrunHareketleri;