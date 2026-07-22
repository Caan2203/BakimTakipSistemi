import { useState } from "react";
import { sifreDegistir } from "../services/accountServisi";

function SifreDegistirModal({ show, onClose }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (!show) return null;

    const handleSave = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Yeni şifreler uyuşmuyor.");
            return;
        }

        try {
            const userName = localStorage.getItem("userName"); // veya aktif kullanıcının kullanıcı adı
            
            const response = await sifreDegistir({
                userName: userName,
                currentPassword: oldPassword,
                newPassword: newPassword
            });

            alert(response.data.message || "Şifre başarıyla değiştirildi.");
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || "Bir hata oluştu.";
            alert(errorMessage);
        }
    };

    return (
        <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,.45)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow border-0">
                    <div className="modal-header">
                        <h4 className="fw-bold">
                            🔒 Şifre Değiştir
                        </h4>
                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">
                                Mevcut Şifre
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Yeni Şifre
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Yeni Şifre Tekrar
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Vazgeç
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Şifreyi Güncelle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SifreDegistirModal;