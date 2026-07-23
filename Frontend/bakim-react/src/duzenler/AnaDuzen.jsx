import { Outlet, useNavigate } from "react-router-dom";
import Menu from "../bilesenler/Menu";
import { useState, useEffect } from "react";
import { bildirimleriGetir } from "../services/notificationServisi";
import UserMenu from "../bilesenler/UserMenu";

function AnaDuzen() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const loadNotifications = async () => {
        try {
            const response = await bildirimleriGetir();
            setNotifications(response.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadNotifications();

        const timer = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const notificationClick = (item) => {
        setShowNotifications(false);

        if (item.qrCode) {
            navigate(`/product/${item.qrCode}`);
        }
    };

    const unreadCount = notifications.length;
    const NotificationBell = () => (
        <div className="position-relative">
            <button
                className="btn btn-light position-relative shadow-sm rounded-circle"
                style={{ width: "48px", height: "48px" }}
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                    </span>
                )}
            </button>
            {showNotifications && (
                <div
                    className="card shadow-sm border-0"
                    style={{
                        position: "absolute",
                        top: "55px",
                        right: "0px",
                        width: "320px",
                        zIndex: 1000
                    }}
                >
                    <div className="card-header bg-white fw-bold">
                        Bildirimler ({unreadCount})
                    </div>
                    <div className="list-group list-group-flush" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {notifications.length === 0 ? (
                            <div className="dropdown-item text-muted text-center py-2">
                                Bildirim bulunmuyor.
                            </div>
                        ) : (
                            notifications.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="list-group-item list-group-item-action py-2 border-bottom"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => notificationClick(item)}
                                >
                                    <div>
                                        {item.icon} <strong>{item.title || "Bildirim"}</strong>
                                    </div>
                                    <small className="text-muted d-block">{item.message}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div 
            className="d-flex bg-light" 
            style={{ 
                height: "100vh", 
                overflow: "hidden" 
            }}
        >
            <div className="d-flex flex-column bg-white border-end" style={{ width: "280px", height: "100vh", overflowY: "auto" }}>
                <Menu />
            </div>
            <div
                className="flex-grow-1 position-relative"
                style={{
                    minWidth: 0,
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "auto" 
                }}
            >
                <div className="container-fluid p-4">
                    <div className="d-flex justify-content-end align-items-center gap-3 mb-4">
                        <button
                            className="btn btn-light shadow-sm rounded-circle"
                            style={{ width: "48px", height: "48px" }}
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? "Açık Tema" : "Karanlık Tema"}
                        >
                            <i
                                className={
                                    darkMode
                                        ? "bi bi-sun-fill text-warning"
                                        : "bi bi-moon-fill"
                                }
                            ></i>
                        </button>

                        <NotificationBell />

                        <UserMenu />
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AnaDuzen;