import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


type DashboardProps = {
  children?: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div className="dashboard-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'row', overflowX: 'hidden' }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: 260 }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Navbar />
        </div>
        <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start" style={{ minHeight: 'calc(100vh - 60px)', width: '100%', padding: 0, margin: 0, background: 'none' }}>
          <div className="w-100" style={{ maxWidth: 1400, width: '100%' }}>
            {children ? (
              children
            ) : (
              <>
                <h2 className="mb-4 dashboard-title">Dashboard</h2>
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-lg h-100 modern-card">
                      <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <i className="bi bi-people fs-1 mb-3" style={{ color: '#4f8cff' }}></i>
                        <h5 className="card-title mb-1">Toplam Kullanıcı</h5>
                        <span className="fs-2 fw-bold">123</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-lg h-100 modern-card">
                      <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <i className="bi bi-box-seam fs-1 mb-3" style={{ color: '#34c77b' }}></i>
                        <h5 className="card-title mb-1">Toplam Varlık</h5>
                        <span className="fs-2 fw-bold">456</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-lg h-100 modern-card">
                      <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <i className="bi bi-graph-up-arrow fs-1 mb-3" style={{ color: '#ffb347' }}></i>
                        <h5 className="card-title mb-1">Aktif Atamalar</h5>
                        <span className="fs-2 fw-bold">78</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row g-4">
                  <div className="col-md-8">
                    <div className="card border-0 shadow-lg h-100 modern-card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Genel Bakış</h5>
                        <div className="bg-secondary bg-opacity-10 rounded p-5 text-center text-muted">
                          Grafik veya özet alanı (placeholder)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-lg h-100 modern-card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Duyurular</h5>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-2"><span className="badge bg-info me-2">Yeni</span> Yeni kullanıcı eklendi.</li>
                          <li className="mb-2"><span className="badge bg-warning me-2">Uyarı</span> Bakım zamanı yaklaşıyor.</li>
                          <li><span className="badge bg-success me-2">Bilgi</span> Sistem güncellendi.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
