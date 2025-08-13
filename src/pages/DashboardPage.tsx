import React, { useState, useEffect } from 'react';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 1247,
    totalUsers: 156,
    activeAssignments: 89,
    pendingRequests: 23,
    totalValue: 2840000,
    departments: 12,
    maintenanceItems: 8,
    overdueReturns: 5
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'Zimmet Onaylandı',
      description: 'Ahmet Y. - Dell Latitude 7420',
      time: '2 saat önce',
      status: 'success'
    },
    {
      id: 2,
      type: 'return',
      title: 'Zimmet İade Edildi',
      description: 'Fatma K. - iPhone 14 Pro',
      time: '4 saat önce',
      status: 'info'
    },
    {
      id: 3,
      type: 'request',
      title: 'Yeni Zimmet Talebi',
      description: 'Mehmet D. - MacBook Pro 16"',
      time: '6 saat önce',
      status: 'warning'
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Bakım Tamamlandı',
      description: 'IT Dept. - HP EliteBook 840',
      time: '1 gün önce',
      status: 'success'
    },
    {
      id: 5,
      type: 'user',
      title: 'Yeni Kullanıcı Eklendi',
      description: 'Ayşe M. - İK Departmanı',
      time: '2 gün önce',
      status: 'primary'
    }
  ]);

  const [assetCategories] = useState([
    { name: 'Bilgisayar', count: 456, icon: 'bi-laptop', color: 'primary' },
    { name: 'Telefon', count: 234, icon: 'bi-phone', color: 'success' },
    { name: 'Monitör', count: 189, icon: 'bi-display', color: 'info' },
    { name: 'Yazıcı', count: 67, icon: 'bi-printer', color: 'warning' },
    { name: 'Tablet', count: 123, icon: 'bi-tablet', color: 'danger' },
    { name: 'Aksesuar', count: 178, icon: 'bi-mouse', color: 'secondary' }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const getTimelineMarkerClass = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success';
      case 'primary': return 'bg-primary';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      case 'danger': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary rounded-circle p-2 me-3">
            <i className="bi bi-building text-white fs-4"></i>
          </div>
          <div>
            <h3 className="mb-0 fw-bold text-dark">AsyaPort Zimmet Takibi</h3>
            <p className="mb-0 text-muted">Sistem Yönetim Paneli</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-download me-1"></i>
            Rapor Al
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1"></i>
            Yeni Zimmet
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Toplam Varlık</p>
                  <h3 className="mb-0 fw-bold text-primary">{stats.totalAssets.toLocaleString()}</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +12% bu ay
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-box-seam text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Toplam Kullanıcı</p>
                  <h3 className="mb-0 fw-bold text-success">{stats.totalUsers}</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +8% bu ay
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-people text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Aktif Zimmet</p>
                  <h3 className="mb-0 fw-bold text-info">{stats.activeAssignments}</h3>
                  <small className="text-info">
                    <i className="bi bi-check-circle me-1"></i>
                    Kullanımda
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-person-check text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Bekleyen Talep</p>
                  <h3 className="mb-0 fw-bold text-warning">{stats.pendingRequests}</h3>
                  <small className="text-warning">
                    <i className="bi bi-clock me-1"></i>
                    İnceleme bekliyor
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-hourglass-split text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-primary">₺{(stats.totalValue / 1000000).toFixed(1)}M</h5>
              <small className="text-muted">Toplam Varlık Değeri</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-success">{stats.departments}</h5>
              <small className="text-muted">Aktif Departman</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-warning">{stats.maintenanceItems}</h5>
              <small className="text-muted">Bakımda</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-danger">{stats.overdueReturns}</h5>
              <small className="text-muted">Geciken İade</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body text-center py-4">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-plus-lg fs-3 text-primary"></i>
              </div>
              <h6 className="card-title mb-2 fw-bold">Yeni Zimmet</h6>
              <p className="card-text text-muted mb-3 small">Sisteme yeni zimmet kaydı ekle</p>
              <button className="btn btn-primary btn-sm px-4">
                <i className="bi bi-plus-circle me-1"></i>
                Ekle
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body text-center py-4">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-search fs-3 text-success"></i>
              </div>
              <h6 className="card-title mb-2 fw-bold">Zimmet Ara</h6>
              <p className="card-text text-muted mb-3 small">Mevcut zimmetleri listele ve yönet</p>
              <button className="btn btn-success btn-sm px-4">
                <i className="bi bi-search me-1"></i>
                Ara
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body text-center py-4">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-bar-chart fs-3 text-info"></i>
              </div>
              <h6 className="card-title mb-2 fw-bold">Raporlar</h6>
              <p className="card-text text-muted mb-3 small">Detaylı analizler ve raporlar</p>
              <button className="btn btn-info btn-sm px-4">
                <i className="bi bi-graph-up me-1"></i>
                Görüntüle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="row g-4">
        {/* Recent Activities */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-activity me-2 text-primary"></i>
                Son Aktiviteler
              </h6>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Son 24 saat</small>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
            <div className="card-body pt-0">
              <div className="timeline">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="timeline-item d-flex align-items-center py-3">
                    <div className={`timeline-marker ${getTimelineMarkerClass(activity.status)}`}></div>
                    <div className="timeline-content ms-3 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <span className="fw-medium d-block">{activity.title}</span>
                          <small className="text-muted">{activity.description}</small>
                        </div>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <button className="btn btn-link btn-sm text-decoration-none">
                  <i className="bi bi-arrow-right me-1"></i>
                  Tüm aktiviteleri görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Categories & Quick Access */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-grid-3x3-gap text-primary me-2"></i>
                Varlık Kategorileri
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-4">
                {assetCategories.map((category, index) => (
                  <div key={index} className="col-6">
                    <div className={`card border-0 bg-${category.color} bg-opacity-10 text-center`}>
                      <div className="card-body py-3">
                        <i className={`bi ${category.icon} text-${category.color} fs-4 mb-2`}></i>
                        <h6 className="mb-1 fw-bold">{category.count}</h6>
                        <small className="text-muted">{category.name}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm text-start">
                  <i className="bi bi-person-plus me-2"></i>
                  Yeni Kullanıcı
                </button>
                <button className="btn btn-outline-success btn-sm text-start">
                  <i className="bi bi-gear me-2"></i>
                  Sistem Ayarları
                </button>
                <button className="btn btn-outline-warning btn-sm text-start">
                  <i className="bi bi-tools me-2"></i>
                  Bakım Yönetimi
                </button>
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
          position: relative;
        }
        
        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 32px;
          width: 2px;
          height: 40px;
          background: #e9ecef;
          z-index: -1;
        }
        
        .timeline-item {
          position: relative;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .btn {
          transition: all 0.2s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
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