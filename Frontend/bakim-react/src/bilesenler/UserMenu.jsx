import { useState, useRef, useEffect } from "react";
import "./UserMenu.css";
import ProfilModal from "./ProfilModal";
import SifreDegistirModal from "./SifreDegistirModal";

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [timeAgo, setTimeAgo] = useState("");
    
    const ref = useRef(null);
    const lastLogin = localStorage.getItem("lastLogin");
    useEffect(() => {
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);
    useEffect(() => {
        const updateTime = () => {
            if (!lastLogin) {
                setTimeAgo("-");
                return;
            }

            const loginDate = new Date(lastLogin);
            const now = new Date();
            const diff = Math.floor((now - loginDate) / 1000);

            if (diff < 60) {
                setTimeAgo("🟢 Az önce");
            }
            else if (diff < 3600) {
                setTimeAgo(`🟢 ${Math.floor(diff / 60)} dakika önce`);
            }
            else if (diff < 86400) {
                setTimeAgo(`🟡 ${Math.floor(diff / 3600)} saat önce`);
            }
            else if (diff < 172800) {
                setTimeAgo(
                    `🔵 Dün ${loginDate.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}`
                );
            }
            else {
                setTimeAgo(
                    loginDate.toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    })
                );
            }
        };

        updateTime();
        const timer = setInterval(updateTime, 60000);

        return () => clearInterval(timer);
    }, [lastLogin]);
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="user-menu" ref={ref}>
            <div
                className="user-trigger"
                onClick={() => setOpen(!open)}
            >
                <div className="avatar">
                    OA
                </div>

                <div className="profile-text">
                    <div className="user-name">
                        Osman Can ACAR
                    </div>
                    <div className="user-role">
                        Yönetici
                    </div>
                </div>

                <i className={`bi bi-chevron-${open ? "up" : "down"}`}></i>
            </div>
            {open && (
                <div className="user-dropdown">
                    <div className="dropdown-header">
                        <div className="avatar large mb-2">
                            OA
                        </div>

                        <div className="d-flex flex-column">
                            <div className="fw-bold fs-4">
                                Osman Can ACAR
                            </div>

                            <div className="d-flex align-items-center gap-2 mt-1">
                                <span className="badge bg-primary">
                                    Yönetici
                                </span>

                                <span className="text-success">
                                    ● Çevrimiçi
                                </span>
                            </div>

                            <div className="text-muted mt-2 small">
                                <i className="bi bi-envelope me-2"></i>
                                osmancan@bakim.com
                            </div>
                        </div>
                    </div>

                    <hr />

                    <button 
                        className="dropdown-item"
                        onClick={() => {
                            setOpen(false);
                            setShowProfile(true);
                        }}
                    >
                        <i className="bi bi-person me-2"></i>
                        Profil Bilgileri
                    </button>

                    <button 
                        className="dropdown-item"
                        onClick={() => {
                            setOpen(false);
                            setShowPassword(true);
                            setShowPasswordModal(true);
                        }}
                    >
                        <i className="bi bi-key me-2"></i>
                        Şifre Değiştir
                    </button>

                    <hr />

                    <small className="menu-title">
                        SİSTEM ÖZETİ
                    </small>

                    <div className="summary-item">
                        <i className="bi bi-clock-history me-2 text-primary"></i>
                        <span>Son Giriş</span>
                        <b>{timeAgo}</b>
                    </div>

                    <div className="summary-item">
                        <i className="bi bi-box-seam me-2"></i>
                        <span>Yönetilen Ürün</span>
                        <b>10</b>
                    </div>

                    <div className="summary-item">
                        <i className="bi bi-tools me-2"></i>
                        <span>Tamamlanan Bakım</span>
                        <b>14</b>
                    </div>

                    <div className="summary-item">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <span>Bekleyen İşlem</span>
                        <b className="danger text-danger">1</b>
                    </div>

                    <hr />

                    <button 
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Çıkış Yap
                    </button>
                </div>
            )}
            {showProfile && (
                <ProfilModal 
                    show={showProfile} 
                    onClose={() => setShowProfile(false)} 
                />
            )}

            <SifreDegistirModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
        </div>
    );
}