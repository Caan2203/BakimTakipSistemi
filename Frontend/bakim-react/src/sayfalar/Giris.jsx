import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Giris() {
    const [kullaniciAdi, setKullaniciAdi] = useState("");
    const [sifre, setSifre] = useState("");
    const navigate = useNavigate();
    const [sifreGoster, setSifreGoster] = useState(false);

    const girisYap = async () => {
        try {
            const cevap = await axios.post(
                "https://localhost:7020/api/Kullanici/giris",
                {
                    kullaniciAdi,
                    sifre
                }
            );

            localStorage.setItem("token", cevap.data.token);
            localStorage.setItem("kullanici", cevap.data.kullanici);
            localStorage.setItem("rol", cevap.data.rol);
            localStorage.setItem("ad", cevap.data.ad);
            localStorage.setItem("soyad", cevap.data.soyad);

            alert("Giriş başarılı");
            navigate("/gosterge-paneli");

        } catch (error) {
            alert("Kullanıcı adı veya şifre yanlış.");
        }
    };

    return (
        <div
    className="d-flex justify-content-center align-items-center"
    style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0d6efd,#5b9dff)"
    }}
>
            <div
    className="card shadow-lg border-0"
    style={{
        width: "430px",
        borderRadius: "20px"
    }}
>
                <form
                    className="card-body"
                    onSubmit={(e) => {
                        e.preventDefault();
                        girisYap();
                    }}
                >
                  <div className="text-center mb-4">

    <i
        className="bi bi-tools"
        style={{
            fontSize: 100,
            color: "#0d6efd"
        }}
    ></i>

    <h2 className="mt-3 fw-bold">
        Bakım Takip Sistemi
    </h2>

    <p className="text-muted">
        Yönetim Paneline Hoş Geldiniz
    </p>

</div>

                    <div className="mb-3">
                        <label className="fw-semibold">
    Kullanıcı Adı
</label>
                        <input
                            className="form-control"
                            value={kullaniciAdi}
                            required
                            onChange={(e) => setKullaniciAdi(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                      <label className="fw-semibold">
    Şifre
</label>
                       <div className="input-group">

    <input
        type={sifreGoster ? "text" : "password"}
        className="form-control"
        value={sifre}
        autoComplete="current-password"
        onChange={(e) => setSifre(e.target.value)}
    />
                            
                        </div>
                    </div>
                    <button
    type="submit"
    className="btn btn-primary w-100 py-2 fw-bold mt-3"
>
    Giriş Yap
</button>

                       
                </form>
            </div>
        </div>
    );
}

export default Giris;