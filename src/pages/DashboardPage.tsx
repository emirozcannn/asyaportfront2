import React from 'react';
import Layout from '../components/Layout';

const DashboardPage: React.FC = () => {
  return (
    <Layout pageTitle="Ana Dashboard">
      <div className="container-fluid">
        {/* Dashboard Content */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title mb-3">Hoş Geldiniz! 👋</h5>
                <p className="card-text text-muted">
                  AsyaPort Zimmet Yönetim Sistemi'ne hoş geldiniz. Bu dashboard üzerinden 
                  tüm zimmet işlemlerinizi yönetebilir, raporları görüntüleyebilir ve sistem 
                  ayarlarını yapabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="bi bi-people fs-4 text-primary"></i>
                  </div>
                  <div>
                    <h6 className="card-title mb-1">Toplam Kullanıcı</h6>
                    <h3 className="mb-0 text-primary">156</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="bi bi-box-seam fs-4 text-success"></i>
                  </div>
                  <div>
                    <h6 className="card-title mb-1">Aktif Zimmet</h6>
                    <h3 className="mb-0 text-success">89</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="bi bi-clock-history fs-4 text-warning"></i>
                  </div>
                  <div>
                    <h6 className="card-title mb-1">Bekleyen Talep</h6>
                    <h3 className="mb-0 text-warning">23</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="bi bi-building fs-4 text-info"></i>
                  </div>
                  <div>
                    <h6 className="card-title mb-1">Departman</h6>
                    <h3 className="mb-0 text-info">12</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 pb-0">
                <h6 className="card-title mb-0">Son Aktiviteler</h6>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex align-items-center border-0 px-0">
                    <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3">
                      <i className="bi bi-check-circle text-success"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">Zimmet Talebi Onaylandı</div>
                      <small className="text-muted">Ahmet Yılmaz - Laptop Dell Latitude 7420</small>
                    </div>
                    <small className="text-muted">2 saat önce</small>
                  </div>
                  
                  <div className="list-group-item d-flex align-items-center border-0 px-0">
                    <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                      <i className="bi bi-person-plus text-primary"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">Yeni Kullanıcı Eklendi</div>
                      <small className="text-muted">Mehmet Özkan - İK Departmanı</small>
                    </div>
                    <small className="text-muted">4 saat önce</small>
                  </div>
                  
                  <div className="list-group-item d-flex align-items-center border-0 px-0">
                    <div className="bg-warning bg-opacity-10 rounded-3 p-2 me-3">
                      <i className="bi bi-exclamation-triangle text-warning"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">İade Tarihi Yaklaşıyor</div>
                      <small className="text-muted">Fatma Kaya - Monitor Samsung 24"</small>
                    </div>
                    <small className="text-muted">1 gün önce</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
