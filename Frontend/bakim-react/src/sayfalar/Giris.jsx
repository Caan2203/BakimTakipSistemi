import "../assets/login.css";
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
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

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
            className="login-page d-flex justify-content-center align-items-center position-relative overflow-hidden p-3"
            onMouseMove={(e) =>
                setMouse({
                    x: e.clientX,
                    y: e.clientY
                })
            }
            style={{
                minHeight: "100vh",
                fontFamily: "'Inter', sans-serif"
            }}
        >
            <div className="grid-bg"></div>

            {/* Fareyi Takip Eden Işık */}
            <div
                style={{
                    position: "absolute",
                    left: mouse.x - 220,
                    top: mouse.y - 220,
                    width: 440,
                    height: 440,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(255,255,255,.22), transparent 70%)",
                    pointerEvents: "none",
                    transition: "all .12s linear",
                    filter: "blur(30px)",
                    zIndex: 2
                }}
            ></div>

            {/* Kendi Kendine Hareket Eden Ambians Küreleri */}
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            <div className="ambient-orb orb-3"></div>

            {/* Çift Kolonlu Giriş Kartı */}
            <div
                className="card login-card border-0 overflow-hidden"
                style={{
                    width: "960px",
                    maxWidth: "100%",
                    background: "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "28px",
                    animation: "fadeUp .8s ease",
                    zIndex: 3
                }}
            >
                <style>{`
                    /* Canlı ve Hareketli Arka Plan Gradient Animasyonu */
                    .login-page {
                        background: linear-gradient(-45deg, #031b4e, #063eb8, #1d4ed8, #0f172a);
                        background-size: 400% 400%;
                        animation: gradientBG 12s ease infinite;
                    }

                    @keyframes gradientBG {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    /* Yüzen Ambians Küreleri */
                    .ambient-orb {
                        position: absolute;
                        border-radius: 50%;
                        filter: blur(80px);
                        pointer-events: none;
                        opacity: 0.6;
                        z-index: 1;
                    }

                    .orb-1 {
                        width: 500px;
                        height: 500px;
                        background: radial-gradient(circle, #2563eb, transparent 70%);
                        top: -10%;
                        left: -10%;
                        animation: floatOrb1 14s ease-in-out infinite alternate;
                    }

                    .orb-2 {
                        width: 600px;
                        height: 600px;
                        background: radial-gradient(circle, #1d4ed8, transparent 70%);
                        bottom: -15%;
                        right: -10%;
                        animation: floatOrb2 18s ease-in-out infinite alternate;
                    }

                    .orb-3 {
                        width: 350px;
                        height: 350px;
                        background: radial-gradient(circle, #60a5fa, transparent 70%);
                        top: 40%;
                        left: 60%;
                        animation: floatOrb3 10s ease-in-out infinite alternate;
                    }

                    @keyframes floatOrb1 {
                        0% { transform: translate(0, 0) scale(1); }
                        100% { transform: translate(120px, 80px) scale(1.15); }
                    }

                    @keyframes floatOrb2 {
                        0% { transform: translate(0, 0) scale(1); }
                        100% { transform: translate(-100px, -90px) scale(1.2); }
                    }

                    @keyframes floatOrb3 {
                        0% { transform: translate(0, 0) scale(0.9); }
                        100% { transform: translate(-80px, 60px) scale(1.1); }
                    }

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(35px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    /* Sol Taraf Görsel Alanı Animasyonu */
                    .hero-img-floating {
                        animation: heroFloat 5s ease-in-out infinite;
                    }

                    @keyframes heroFloat {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-10px) rotate(1deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }

                    .login-card {
                        transition: .35s;
                    }

                    .login-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 30px 70px rgba(0,0,0,.35), 0 0 45px rgba(37,99,235,.35);
                    }

                    .login-logo {
                        transition: .35s;
                    }

                    .login-logo:hover {
                        transform: rotate(12deg) scale(1.08);
                    }

                    h3 {
                        animation: titleFloat 3s ease infinite;
                    }

                    @keyframes titleFloat {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                        100% { transform: translateY(0); }
                    }

                    .custom-input {
                        background: #ffffff !important;
                        color: #1f2937 !important;
                        border: 1px solid #dbe3ef !important;
                        border-left: none !important;
                        border-radius: 0 12px 12px 0 !important;
                        padding: 12px 16px;
                        transition: all 0.3s ease;
                    }

                    .custom-input::placeholder {
                        color: #94a3b8;
                    }

                    .custom-input:focus {
                        border-color: #2563eb !important;
                        box-shadow: 0 0 0 4px rgba(37,99,235,.15) !important;
                    }

                    .input-group-text {
                        background: white;
                        border-radius: 12px 0 0 12px;
                        border-right: none;
                        border: 1px solid #dbe3ef;
                        color: #64748b;
                        padding-left: 16px;
                    }

                    .input-group-text-btn {
                        background: #ffffff !important;
                        color: #64748b !important;
                        border: 1px solid #dbe3ef !important;
                        border-left: none !important;
                        border-radius: 0 12px 12px 0 !important;
                        transition: all 0.3s ease;
                    }

                    .input-group-text-btn:hover {
                        color: #1f2937 !important;
                    }
                `}</style>

                <div className="row g-0 align-items-center">
                    {/* SOL TARAF: Görsel ve Ambians Paneli */}
                    <div 
                        className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #1e40af 0%, #031b4e 100%)",
                            minHeight: "560px"
                        }}
                    >
                        {/* Görsel Bölümündeki Işık Süzmesi */}
                        <div 
                            className="position-absolute"
                            style={{
                                width: "250px",
                                height: "250px",
                                background: "rgba(59, 130, 246, 0.4)",
                                borderRadius: "50%",
                                filter: "blur(50px)",
                                top: "-20px",
                                left: "-20px"
                            }}
                        ></div>

                        <div>
                            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold mb-3 shadow-sm">
                                <i className="bi bi-shield-check me-1"></i> Güvenli Altyapı
                            </span>
                            <h4 className="fw-bold mb-2">Akıllı Bakım & Ürün Yönetimi</h4>
                            <p className="small text-white-50">Formal Alüminyum San. ve Tic. A.Ş. &  ACAR HOLDİNG işbirliğiyle.©  </p>
                        </div>

                        {/* Büyütülmüş Ambians Görseli */}
                        <div className="text-center my-4 hero-img-floating">
                            <img 
                                src="/İmages.jpeg" 
                                alt="Bakım Ambians Görseli" 
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ 
                                    maxHeight: "300px", 
                                    width: "100%",
                                    objectFit: "cover",
                                    filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.4))" 
                                }}
                            />
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
                                <i className="bi bi-cpu text-white fs-5"></i>
                            </div>
                            <div className="small">
                                <div className="fw-semibold">Kesintisiz Takip</div>
                                <div className="text-white-50" style={{ fontSize: "12px" }}>Endüstri 4.0 Standardında</div>
                            </div>
                        </div>
                    </div>

                    {/* SAĞ TARAF: Giriş Formu */}
                    <div className="col-lg-6">
                        <form
                            className="card-body p-4 p-md-5"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!yukleniyor) girisYap();
                            }}
                        >
                            <div className="text-center mb-4">
                                <div className="login-logo mb-3">
                                    <i className="bi bi-tools"></i>
                                </div>
                                <h3 className="fw-bold text-dark">
                                    Bakım Takip Sistemi
                                </h3>
                                <p className="text-secondary mb-1">
                                    Yönetim Paneli
                                </p>
                            </div>

                            <div
                                className="text-center mb-4"
                                style={{
                                    color: "#6c757d",
                                    fontSize: 14
                                }}
                            >
                                Endüstriyel Bakım ve Ürün Yönetim Platformu
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-semibold mb-2">
                                    Kullanıcı Adı
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control custom-input"
                                        placeholder="Kullanıcı adınızı girin"
                                        value={kullaniciAdi}
                                        required
                                        onChange={(e) => setKullaniciAdi(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-secondary small fw-semibold mb-2">
                                    Şifre
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock-fill"></i>
                                    </span>
                                    <input
                                        type={sifreGoster ? "text" : "password"}
                                        className="form-control custom-input"
                                        style={{ borderRadius: "0 !important" }}
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
                                className="btn login-btn w-100 text-white"
                                disabled={yukleniyor}
                            >
                                {yukleniyor ? (
                                    <div className="spinner-border spinner-border-sm text-white me-2" role="status"></div>
                                ) : (
                                    <>
                                        Giriş Yap<i className="bi bi-arrow-right ms-2"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Giris;