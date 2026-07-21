function ProfilModal({ show, onClose }) {

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.45)" }}>
            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content border-0 rounded-4 shadow">

                    <div className="modal-header">
                        <h5 className="fw-bold mb-0">
                            Profil Bilgileri
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
                                width:90,
                                height:90,
                                fontSize:34,
                                color:"#fff",
                                background:"linear-gradient(135deg,#2563eb,#38bdf8)"
                            }}
                        >
                            OA
                        </div>

                        <h4 className="fw-bold">
                            Osman Can ACAR
                        </h4>

                        <span className="badge bg-primary">
                            Yönetici
                        </span>

                        <hr />

                        <div className="text-start">

                            <p><strong>E-Posta</strong></p>
                            <p className="text-muted">
                                osman@bakimtakip.com
                            </p>

                            <p><strong>Son Giriş</strong></p>
                            <p className="text-muted">
                                Bugün 15:05
                            </p>

                            <p><strong>Yetki</strong></p>
                            <p className="text-success">
                                Sistem Yöneticisi
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProfilModal;