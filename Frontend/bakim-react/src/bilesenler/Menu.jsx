import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {
    const ad = localStorage.getItem("ad") || "Kullanıcı";
    const soyad = localStorage.getItem("soyad") || "";
    const rol = localStorage.getItem("rol") || "Personel";
    const cikisYap = () => {
        localStorage.clear();
        window.location.href = "/giris";
    };
    const menuClass = ({ isActive }) =>
        isActive ? "menu-link active" : "menu-link";
    const getRolBadgeClass = (userRol) => {
        const r = userRol.toLowerCase();
        if (r.includes("yönetici") || r.includes("admin")) return "bg-danger-subtle text-danger";
        if (r.includes("mühendis") || r.includes("teknisyen")) return "bg-primary-subtle text-primary";
        return "bg-secondary-subtle text-secondary";
    };

    return (
        <aside className="sidebar">
            <div>
                <div className="logo">
                    <h4 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
                        <span>🛠️</span> Bakım Takip
                    </h4>
                    <small className="text-muted fw-semibold tracking-wider">
                        YÖNETİM PANELİ
                    </small>
                </div>
                <nav>
                    <NavLink to="/gosterge-paneli" className={menuClass}>
                        <i className="bi bi-speedometer2"></i>
                        <span>Gösterge Paneli</span>
                    </NavLink>

                    <NavLink to="/urunler" className={menuClass}>
                        <i className="bi bi-box-seam"></i>
                        <span>Ürünler</span>
                    </NavLink>

                    <NavLink to="/personeller" className={menuClass}>
                        <i className="bi bi-people"></i>
                        <span>Personeller</span>
                    </NavLink>

                    <NavLink to="/bakimlar" className={menuClass}>
                        <i className="bi bi-tools"></i>
                        <span>Bakımlar</span>
                    </NavLink>

                    <NavLink to="/qr-kod" className={menuClass}>
                        <i className="bi bi-qr-code-scan"></i>
                        <span>QR Kod</span>
                    </NavLink>

                    <NavLink to="/zimmetler" className={menuClass}>
                        <i className="bi bi-person-badge"></i>
                        <span>Zimmetler</span>
                    </NavLink>
                </nav>
            </div>
            <div>
                <hr className="text-muted my-3" />
                <div className="user-profile-card d-flex align-items-center gap-2 p-2 rounded-3 mb-3">
                    <div className="profile-icon rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                        <i className="bi bi-person-circle text-primary fs-4"></i>
                    </div>
                    <div className="overflow-hidden">
                        <h6 className="mb-0 fw-bold text-truncate" style={{ maxWidth: "140px" }}>
                            {ad} {soyad}
                        </h6>
                        <span className={`badge ${getRolBadgeClass(rol)} px-2 py-0.5 rounded-pill mt-1`} style={{ fontSize: "10px" }}>
                            {rol}
                        </span>
                    </div>
                </div>
                <button
                    onClick={cikisYap}
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-2"
                >
                    <i className="bi bi-box-arrow-right fs-5"></i>
                    <span className="fw-semibold">Çıkış Yap</span>
                </button>
            </div>

        </aside>
    );
}
export default Menu;