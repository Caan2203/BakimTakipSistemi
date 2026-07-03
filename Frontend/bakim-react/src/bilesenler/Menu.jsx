import { NavLink } from "react-router-dom";

function Menu() {
    const menuClass = ({ isActive }) =>
        isActive
            ? "nav-link bg-primary text-white rounded"
            : "nav-link text-white";

    return (
        <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
            <h3 className="text-center mb-4">Bakım Takip</h3>

            <ul className="nav flex-column">

                <li className="nav-item mb-2">
                    <NavLink
                        to="/gosterge-paneli"
                        className={menuClass}
                    >
                        🏠 Gösterge Paneli
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink
                        to="/urunler"
                        className={menuClass}
                    >
                        📦 Ürünler
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink
                        to="/personeller"
                        className={menuClass}
                    >
                        👷 Personeller
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink
                        to="/bakimlar"
                        className={menuClass}
                    >
                        🔧 Bakımlar
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/qr-kod"
                        className={menuClass}
                    >
                        📷 QR Kod
                    </NavLink>
                </li>

            </ul>
        </div>
    );
}

export default Menu;