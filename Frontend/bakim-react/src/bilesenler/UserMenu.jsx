import { useState, useRef, useEffect } from "react";
import "./UserMenu.css";
import ProfilModal from "./ProfilModal";


export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [showProfile, setShowProfile] = useState(false);

    // Menü dışına tıklandığında menüyü kapatma mantığı
    useEffect(() => {
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    // Çıkış yap fonksiyonu
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="user-menu" ref={ref}>
            {/* Kapalıyken ve açıkken sürekli görünen tetikleyici buton */}
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

            {/* Sadece open true olduğunda ekrana gelen dropdown menü */}
            {open && (
                <div className="user-dropdown">
                    <div className="dropdown-header">
                        <div className="avatar large">
                            OA
                        </div>

                        <div>
                            <div className="user-name">
                                Osman Can ACAR
                            </div>
                            <div className="user-role">
                                Yönetici
                            </div>
                            <span className="online">
                                ● Çevrimiçi
                            </span>
                        </div>
                    </div>

                    <hr />

                    <button 
                        className="dropdown-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi-person me-2"></i>
                        Profil Bilgileri
                    </button>

                    <button 
                        className="dropdown-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi-key me-2"></i>
                        Şifre Değiştir
                    </button>

                    <hr />

                    <small className="menu-title">
                        SİSTEM ÖZETİ
                    </small>

                    <div className="summary-item">
                        <i className="bi bi-clock-history me-2"></i>
                        <span>Sistemi Kullanma Süresi</span>
                        <b>14 Gün</b>
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
        </div>
    );
}