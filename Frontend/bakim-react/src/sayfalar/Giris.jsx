import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Giris() {
    const [kullaniciAdi, setKullaniciAdi] = useState("");
    const [sifre, setSifre] = useState("");
    const navigate = useNavigate();
    const [sifreGoster, setSifreGoster] = useState(false);
    const [yukleniyor, setYukleniyor] = useState(false);

    const girisYap = async () => {
        setYukleniyor(true);
        try {
            const cevap = await axios.post(
                "https://localhost:7020/api/Kullanici/giris",
                { kullaniciAdi, sifre }
            );

            localStorage.setItem("token", cevap.data.token);
            localStorage.setItem("kullanici", cevap.data.kullanici);
            localStorage.setItem("rol", cevap.data.rol);
            localStorage.setItem("ad", cevap.data.ad);
            localStorage.setItem("soyad", cevap.data.soyad);

            navigate("/gosterge-paneli");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "Kullanıcı adı veya şifre yanlış."
            });
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center position-relative overflow-hidden"
            style={{
                minHeight: "100vh",
                background: "#063eb8fc",
                fontFamily: "'Inter', sans-serif"
            }}
        >
            <div
                className="position-absolute rounded-circle"
                style={{
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgb(0, 53, 245) 0%, rgba(0,0,0,0) 70%)",
                    top: "-10%",
                    left: "-10%",
                    filter: "blur(60px)",
                    pointerEvents: "none"
                }}
            ></div>
            <div
                className="position-absolute rounded-circle"
                style={{
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, rgb(0, 53, 245) 0%, rgba(0,0,0,0) 70%)",
                    bottom: "-15%",
                    right: "-10%",
                    filter: "blur(80px)",
                    pointerEvents: "none"
                }}
            ></div>
            <div
                className="card shadow-2xl border-0 position-relative"
                style={{
                    width: "440px",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
            >
                <style>{`
                    .custom-input {
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: #ffffff !important;
                        border-radius: 12px !important;
                        padding: 12px 16px;
                        transition: all 0.3s ease;
                    }
                    .custom-input::placeholder {
                        color: rgba(255, 255, 255, 0.4);
                    }
                    .custom-input:focus {
                        border-color: #2563eb !important;
                        box-shadow: 0 0 0 4px rgba(118, 168, 247, 0.25) !important;
                    }
                    .input-group-text-btn {
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        border-left: none !important;
                        color: rgba(255, 255, 255, 0.6) !important;
                        border-radius: 0 12px 12px 0 !important;
                        transition: all 0.3s ease;
                    }
                    .input-group-text-btn:hover {
                        color: #ffffff !important;
                        background: rgba(255, 255, 255, 0.1) !important;
                    }
                    .custom-btn {
                        background: linear-gradient(135deg, #185ff8, #3b82f6);
                        border: none;
                        border-radius: 12px;
                        padding: 12px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    }
                    .custom-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgb(0, 53, 245);
                        background: linear-gradient(135deg, #225fec, #225fec);
                    }
                `}</style>

                <form
                    className="card-body p-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!yukleniyor) girisYap();
                    }}
                >
                    <div className="text-center mb-4">
                        <div 
                            className="d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "20px",
                                background: "linear-gradient(135deg, rgb(0, 53, 245), rgba(59, 130, 246, 0.2))",
                                border: "1px solid rgb(255, 255, 255)"
                            }}
                        >
                            <i className="bi bi-tools" style={{ fontSize: "36px", color: "#ffffff" }}></i>
                        </div>
                        <h3 className="fw-bold text-white mb-1" style={{ letterSpacing: "-0.5px" }}>
                            Bakım Takip Sistemi
                        </h3>
                        <p className="small text-white-50">
                            Yönetim Paneline Hoş Geldiniz
                        </p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white-50 small fw-semibold mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            className="form-control custom-input"
                            placeholder="Kullanıcı adınızı girin"
                            value={kullaniciAdi}
                            required
                            onChange={(e) => setKullaniciAdi(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-white-50 small fw-semibold mb-2">
                            Şifre
                        </label>
                        <div className="input-group">
                            <input
                                type={sifreGoster ? "text" : "password"}
                                className="form-control custom-input"
                                style={{ borderRadius: "12px 0 0 12px !important" }}
                                placeholder="••••••••"
                                value={sifre}
                                required
                                autoComplete="current-password"
                                onChange={(e) => setSifre(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn input-group-text-btn"
                                onClick={() => setSifreGoster(!sifreGoster)}
                            >
                                <i className={`bi bi-${sifreGoster ? "eye-slash" : "eye"}`}></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 custom-btn text-white mt-2"
                        disabled={yukleniyor}
                    >
                        {yukleniyor ? (
                            <div className="spinner-border spinner-border-sm text-white me-2" role="status"></div>
                        ) : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Giris;