import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {
    // ADIM 3: Kullanıcı bilgilerini bileşen içinde localStorage'dan alıyoruz
    const ad = localStorage.getItem("ad");
    const soyad = localStorage.getItem("soyad");
    const rol = localStorage.getItem("rol");

    // ADIM 4: Çıkış yap fonksiyonu
    const cikisYap = () => {
        localStorage.clear();
        window.location.href = "/giris";
    };

    const menuClass = ({ isActive }) =>
        isActive ? "menu-link active" : "menu-link";

    return (
        <aside className="sidebar">
            <div className="logo">
                <h3>🛠 Bakım Takip</h3>
                <p>Yönetim Paneli</p>
            </div>

            <nav>
                <NavLink to="/gosterge-paneli" className={menuClass}>
                    <span>Gösterge Paneli</span>
                </NavLink>

                <NavLink to="/urunler" className={menuClass}>
                    <span>Ürünler</span>
                </NavLink>

                <NavLink to="/personeller" className={menuClass}>
                    <span>Personeller</span>
                </NavLink>

                <NavLink to="/bakimlar" className={menuClass}>
                    <span>Bakımlar</span>
                </NavLink>

                <NavLink to="/qr-kod" className={menuClass}>
                    <span>QR Kod</span>
                </NavLink>

                <hr />

                {/* ADIM 3: Menünün altındaki kullanıcı profil alanı */}
                <div className="text-center mt-3">
                    <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "45px" }}
                    ></i>
                    <h6 className="mt-2">
                        {ad} {soyad}
                    </h6>
                    <small className="text-secondary">
                        {rol}
                    </small>
                </div>

                {/* ADIM 4: Çıkış yap butonu */}
                <button
                    onClick={cikisYap}
                    className="btn btn-danger w-100 mt-4"
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Çıkış Yap
                </button>
            </nav>
        </aside>
    );
}

export default Menu;