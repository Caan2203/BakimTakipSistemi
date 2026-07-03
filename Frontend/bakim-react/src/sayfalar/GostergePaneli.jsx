function GostergePaneli() {
    return (
        <div>

            <h2 className="mb-4">Gösterge Paneli</h2>

            <div className="row">

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Toplam Ürün</h5>
                            <h2>0</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Personel</h5>
                            <h2>0</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Bakımlar</h5>
                            <h2>0</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h5>Bakımı Geciken</h5>
                            <h2>0</h2>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default GostergePaneli;