import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {

    const menuClass = ({ isActive }) =>
        isActive
            ? "menu-link active"
            : "menu-link";

    return (

        <aside className="sidebar">

            <div className="logo">

                <h3>🛠 Bakım Takip</h3>

                <p>Yönetim Paneli</p>

            </div>

            <nav>

                <NavLink
                    to="/gosterge-paneli"
                    className={menuClass}
                >
                    
                    <span>Gösterge Paneli</span>
                </NavLink>

                <NavLink
                    to="/urunler"
                    className={menuClass}
                >
                    
                    <span>Ürünler</span>
                </NavLink>

                <NavLink
                    to="/personeller"
                    className={menuClass}
                >
                    
                    <span>Personeller</span>
                </NavLink>

                <NavLink
                    to="/bakimlar"
                    className={menuClass}
                >
                    
                    <span>Bakımlar</span>
                </NavLink>

                <NavLink
                    to="/qr-kod"
                    className={menuClass}
                >
                    
                    <span>QR Kod</span>
                </NavLink>

            </nav>

        </aside>

    );

}

export default Menu;