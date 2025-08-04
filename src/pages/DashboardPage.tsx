import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary rounded-circle p-2 me-3">
              <i className="bi bi-building text-white fs-4"></i>
            </div>
            <div>
              <h3 className="mb-0 fw-bold text-dark">AsyaPort Zimmet Takibi</h3>
              <p className="mb-0 text-muted">Sistem Yönetim Paneli</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm bg-gradient" 
               style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-0 fw-bold">156</h2>
                  <p className="mb-0 opacity-75">Toplam Kullanıcı</p>
                </div>
                <i className="bi bi-people fs-1 opacity-25"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm bg-gradient" 
               style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-0 fw-bold">89</h2>
                  <p className="mb-0 opacity-75">Aktif Zimmet</p>
                </div>
                <i className="bi bi-box-seam fs-1 opacity-25"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm bg-gradient" 
               style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-0 fw-bold">23</h2>
                  <p className="mb-0 opacity-75">Bekleyen Talep</p>
                </div>
                <i className="bi bi-clock-history fs-1 opacity-25"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm bg-gradient" 
               style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-0 fw-bold">12</h2>
                  <p className="mb-0 opacity-75">Departman</p>
                </div>
                <i className="bi bi-building fs-1 opacity-25"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-4">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-plus-lg fs-2 text-primary"></i>
              </div>
              <h5 className="card-title mb-2">Yeni Zimmet</h5>
              <p className="card-text text-muted mb-3">Sisteme yeni zimmet kaydı ekle</p>
              <button className="btn btn-primary btn-sm px-4">Ekle</button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-4">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-search fs-2 text-success"></i>
              </div>
              <h5 className="card-title mb-2">Zimmet Ara</h5>
              <p className="card-text text-muted mb-3">Mevcut zimmetleri listele ve yönet</p>
              <button className="btn btn-success btn-sm px-4">Ara</button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-4">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-bar-chart fs-2 text-info"></i>
              </div>
              <h5 className="card-title mb-2">Raporlar</h5>
              <p className="card-text text-muted mb-3">Detaylı analizler ve raporlar</p>
              <button className="btn btn-info btn-sm px-4">Görüntüle</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities - Compact */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-activity me-2 text-primary"></i>
                Son Aktiviteler
              </h6>
              <small className="text-muted">Son 24 saat</small>
            </div>
            <div className="card-body pt-0">
              <div className="timeline">
                <div className="timeline-item d-flex align-items-center py-2">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content ms-3 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="fw-medium">Zimmet Onaylandı</span>
                        <small className="d-block text-muted">Ahmet Y. - Dell Latitude 7420</small>
                      </div>
                      <small className="text-muted">2sa</small>
                    </div>
                  </div>
                </div>
                
                <div className="timeline-item d-flex align-items-center py-2">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content ms-3 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="fw-medium">Yeni Kullanıcı</span>
                        <small className="d-block text-muted">Mehmet Ö. - İK Departmanı</small>
                      </div>
                      <small className="text-muted">4sa</small>
                    </div>
                  </div>
                </div>
                
                <div className="timeline-item d-flex align-items-center py-2">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content ms-3 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="fw-medium">İade Hatırlatması</span>
                        <small className="d-block text-muted">Fatma K. - Samsung Monitor</small>
                      </div>
                      <small className="text-muted">1g</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .timeline-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 24px;
          width: 2px;
          height: 40px;
          background: #e9ecef;
          z-index: -1;
        }
        
        .timeline-item {
          position: relative;
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem !important;
          }
          
          .timeline-content {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;