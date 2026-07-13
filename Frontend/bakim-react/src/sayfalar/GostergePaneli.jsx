import { useEffect, useState } from "react";
import api from "../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function GostergePaneli() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardYukle();
  }, []);

  const dashboardYukle = async () => {
    try {
      const response = await api.get("/Dashboard");
      setDashboard(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const grafikVerisi = {
    labels: dashboard.monthlyLabels || [],
    datasets: [
      {
        label: "Yapılan Bakımlar",
        data: dashboard.monthlyMaintenanceCounts || [],
        borderColor: "rgb(54,162,235)",
        backgroundColor: "rgba(54,162,235,0.2)",
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Güvenli listeler oluşturuldu
  const upcomingProducts = dashboard.upcomingProducts || [];
  const overdueProducts = dashboard.overdueProducts || [];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gösterge Paneli</h2>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5>Toplam Ürün</h5>
              <h2>{dashboard.totalProducts}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5>Bakımdaki Ürün</h5>
              <h2>{dashboard.productsInMaintenance}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5>Personel</h5>
              <h2>{dashboard.totalEmployees}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5>Toplam Bakım</h5>
              <h2>{dashboard.totalMaintenances}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card border-success shadow h-100">
            <div className="card-header bg-success text-white">
              Yaklaşan Bakımlar
            </div>
            <div className="card-body text-center">
              <h2>{dashboard.upcomingMaintenances}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card border-danger shadow h-100">
            <div className="card-header bg-danger text-white">
              Geciken Bakımlar
            </div>
            <div className="card-body text-center">
              <h2>{dashboard.overdueMaintenances}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Son 6 Ay Bakım Grafiği</h5>
        </div>
        <div className="card-body">
          <Line data={grafikVerisi} />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow border-success h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Yaklaşan Bakımı Olan Ürünler</h5>
            </div>
            <div className="card-body">
              {upcomingProducts.length === 0 ? (
                <p className="text-center">Yaklaşan bakım bulunmuyor.</p>
              ) : (
                upcomingProducts.map((urun) => (
                  <div key={urun.id} className="border-bottom pb-2 mb-2">
                    <b>{urun.productName}</b>
                    <br />
                    <small>{urun.brand} {urun.model}</small>
                    <br />
                    <small className="text-success">
                      Bakım Tarihi : {" "}
                      {urun.nextMaintenanceDate ? new Date(urun.nextMaintenanceDate).toLocaleDateString("tr-TR") : "-"}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card shadow border-danger h-100">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Bakımı Geciken Ürünler</h5>
            </div>
            <div className="card-body">
              {overdueProducts.length === 0 ? (
                <p className="text-center">Geciken bakım bulunmuyor.</p>
              ) : (
                overdueProducts.map((urun) => (
                  <div key={urun.id} className="border-bottom pb-2 mb-2">
                    <b>{urun.productName}</b>
                    <br />
                    <small>{urun.brand} {urun.model}</small>
                    <br />
                    <span className="badge bg-danger">Bakımı Gecikmiş</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow mt-4">
        <div className="card-header">
          <h5 className="mb-0">Son Yapılan Bakımlar</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Ürün</th>
                <th>Personel</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.lastMaintenances?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Henüz bakım kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                dashboard.lastMaintenances?.map((bakim) => (
                  <tr key={bakim.id}>
                    <td>{bakim.product?.productName}</td>
                    <td>
                      {bakim.employee?.firstName} {bakim.employee?.lastName}
                    </td>
                    <td>
                      {bakim.maintenanceDate ? new Date(bakim.maintenanceDate).toLocaleDateString("tr-TR") : "-"}
                    </td>
                    <td>
                      <span className="badge bg-success">{bakim.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GostergePaneli;