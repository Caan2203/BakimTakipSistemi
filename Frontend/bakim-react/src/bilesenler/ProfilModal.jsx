function ProfilModal({ show, onClose }) {

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.45)" }}>
            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content border-0 rounded-4 shadow">

                    <div className="modal-header">
                        <h5 className="fw-bold mb-0">
                            👤 Kullanıcı Profili
                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    <div className="modal-body text-center">

                        <div
                            className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{
                                width: 90,
                                height: 90,
                                fontSize: 34,
                                color: "#fff",
                                background: "linear-gradient(135deg,#2563eb,#38bdf8)"
                            }}
                        >
                            OA
                        </div>

                        <h4 className="fw-bold mt-3 mb-1">
                            Osman Can ACAR
                        </h4>
                        <span className="badge bg-primary">
                            Yönetici
                        </span>
                        <div className="text-success mt-2">
                            ● Çevrimiçi
                        </div>

                        <div className="card border-0 bg-light mt-4">
                            <div className="card-body text-start">

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">E-posta</span>
                                    <strong>osmancan@bakim.com</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Telefon</span>
                                    <strong>0535 652 72 53</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Departman</span>
                                    <strong>Bakım Yönetimi</strong>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Son Giriş</span>
                                    <strong>22.07.2026 09:08</strong>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Kapat
                        </button>

                        <button className="btn btn-primary px-4">
                            Bilgileri Güncelle
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProfilModal;