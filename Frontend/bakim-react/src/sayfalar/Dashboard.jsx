import { useEffect, useState } from "react";
import api from "../api";
import CountUp from "react-countup";
import UserMenu from "../bilesenler/UserMenu";
import { FaBell } from "react-icons/fa";

function Dashboard() {
    const [urunSayisi, setUrunSayisi] = useState(0);
    const [bakimdakiUrun, setBakimdakiUrun] = useState(0);
    const [personelSayisi, setPersonelSayisi] = useState(0);
    const [bakimSayisi, setBakimSayisi] = useState(0);
    const [yaklasanBakim, setYaklasanBakim] = useState(0);  

    useEffect(() => {
        verileriGetir();
    }, []);

    const verileriGetir = async () => {
        try {
            const urunler = await api.get("/Products");
            const personeller = await api.get("/Employee");
            const bakimlar = await api.get("/Maintenance");

            setUrunSayisi(urunler.data.length);

            setBakimdakiUrun(
                urunler.data.filter(x => x.isInMaintenance).length
            );

            setPersonelSayisi(personeller.data.length);

            setBakimSayisi(bakimlar.data.length);

            const bugun = new Date();
            const yaklasan = urunler.data.filter(u => {
                if (!u.nextMaintenanceDate)
                    return false;

                const fark =
                    (new Date(u.nextMaintenanceDate) - bugun) /
                    (1000 * 60 * 60 * 24);

                return fark <= 30 && fark >= 0;
            });

            setYaklasanBakim(yaklasan.length);

        } catch (error) {
            console.error("Veriler çekilirken hata oluştu:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="top-header">
                <div></div>
                <div className="header-actions">
                    <button className="notification-btn">
                        <FaBell />
                        <span className="notification-badge">1</span>
                    </button>
                    <UserMenu />
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 position-relative">
                <div>
                    <h2 className="mb-0">Bakım Takip Sistemi</h2>
                    <small className="text-muted">Gösterge Paneli</small>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card text-center shadow border-0">
                        <div className="card-body">
                            <h5>Toplam Ürün</h5>
                            <h2>
                                <CountUp
                                    end={urunSayisi}
                                    duration={1}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card text-center shadow border-0">
                        <div className="card-body">
                            <h5>Bakımdaki Ürün</h5>
                            <h2>
                                <CountUp
                                    end={bakimdakiUrun}
                                    duration={1}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card text-center shadow border-0">
                        <div className="card-body">
                            <h5>Personel</h5>
                            <h2>
                                <CountUp
                                    end={personelSayisi}
                                    duration={1}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card text-center shadow border-0">
                        <div className="card-body">
                            <h5>Toplam Bakım</h5>
                            <h2>
                                <CountUp
                                    end={bakimSayisi}
                                    duration={1}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow border-warning">
                        <div className="card-body text-center">
                            <h5>Yaklaşan Bakım</h5>
                            <h2 className="text-warning">
                                <CountUp
                                    end={yaklasanBakim}
                                    duration={1}
                                />
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;