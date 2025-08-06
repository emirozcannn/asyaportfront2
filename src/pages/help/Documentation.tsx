// src/pages/help/Documentation.tsx
import React, { useState } from 'react';

interface SystemFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'planned' | 'beta';
}

interface UserRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  color: string;
}

interface SystemRequirement {
  category: string;
  items: string[];
}

interface Integration {
  name: string;
  description: string;
  status: 'active' | 'planned';
  icon: string;
}

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Sistem özellikleri
  const systemFeatures: SystemFeature[] = [
    {
      id: '1',
      title: 'Zimmet Yönetimi',
      description: 'Tüm şirket varlıklarının merkezi takibi ve yönetimi',
      icon: 'bi-box-seam',
      status: 'active'
    },
    {
      id: '2',
      title: 'Kullanıcı Yönetimi',
      description: 'Rol tabanlı kullanıcı erişim kontrolü ve yetkilendirme',
      icon: 'bi-people',
      status: 'active'
    },
    {
      id: '3',
      title: 'Departman Yönetimi',
      description: 'Departman bazlı zimmet takibi ve raporlama',
      icon: 'bi-building',
      status: 'active'
    },
    {
      id: '4',
      title: 'Raporlama & Analytics',
      description: 'Detaylı raporlar ve analitik dashboard',
      icon: 'bi-graph-up',
      status: 'active'
    },
    {
      id: '5',
      title: 'Mobil Uygulama',
      description: 'iOS ve Android platformları için mobil erişim',
      icon: 'bi-phone',
      status: 'planned'
    },
    {
      id: '6',
      title: 'QR Kod Entegrasyonu',
      description: 'Zimmet etiketleri için QR kod desteği',
      icon: 'bi-qr-code',
      status: 'beta'
    }
  ];

  // Kullanıcı rolleri
  const userRoles: UserRole[] = [
    {
      id: '1',
      name: 'SuperAdmin',
      displayName: '🔧 Süper Yönetici',
      description: 'Sistemin tüm özelliklerine sınırsız erişim',
      permissions: [
        'Sistem yönetimi',
        'Tüm modüllere erişim',
        'Kullanıcı yönetimi',
        'Rol atama',
        'Sistem ayarları',
        'Veri yedekleme'
      ],
      color: 'danger'
    },
    {
      id: '2',
      name: 'Admin',
      displayName: '⚡ Sistem Yöneticisi',
      description: 'Günlük sistem operasyonları ve kullanıcı yönetimi',
      permissions: [
        'Kullanıcı yönetimi',
        'Departman yönetimi',
        'Zimmet yönetimi',
        'Rapor görüntüleme',
        'Sistem ayarları (sınırlı)'
      ],
      color: 'warning'
    },
    {
      id: '3',
      name: 'DepartmentAdmin',
      displayName: '👥 Departman Yöneticisi',
      description: 'Departman düzeyinde zimmet ve kullanıcı yönetimi',
      permissions: [
        'Departman kullanıcıları yönetimi',
        'Departman zimmetleri',
        'Talep onaylama',
        'Departman raporları'
      ],
      color: 'info'
    },
    {
      id: '4',
      name: 'User',
      displayName: '👤 Kullanıcı',
      description: 'Temel zimmet görüntüleme ve talep oluşturma',
      permissions: [
        'Zimmet görüntüleme',
        'Talep oluşturma',
        'Profil yönetimi',
        'Zimmet iade'
      ],
      color: 'primary'
    }
  ];

  // Sistem gereksinimleri
  const systemRequirements: SystemRequirement[] = [
    {
      category: 'Sunucu Gereksinimleri',
      items: [
        'Windows Server 2019+ veya Linux (Ubuntu 20.04+)',
        'Minimum 8GB RAM (16GB önerilen)',
        'Minimum 100GB SSD depolama alanı',
        '.NET 8.0 Runtime',
        'SQL Server 2019+ veya PostgreSQL 13+'
      ]
    },
    {
      category: 'İstemci Gereksinimleri',
      items: [
        'Modern web tarayıcısı (Chrome 90+, Firefox 88+, Safari 14+)',
        'JavaScript desteği aktif',
        'Minimum 1366x768 ekran çözünürlüğü',
        'İnternet bağlantısı (minimum 1 Mbps)'
      ]
    },
    {
      category: 'Mobil Gereksinimler',
      items: [
        'iOS 13.0+ (iPhone/iPad)',
        'Android 8.0+ (API Level 26)',
        'Minimum 2GB RAM',
        '4G/5G veya Wi-Fi bağlantısı'
      ]
    }
  ];

  // Entegrasyonlar
  const integrations: Integration[] = [
    {
      name: 'SAP Integration',
      description: 'SAP ERP sistemi ile çift yönlü veri senkronizasyonu',
      status: 'active',
      icon: 'bi-diagram-3'
    },
    {
      name: 'OPUS Integration',
      description: 'OPUS İK sistemi ile personel bilgileri entegrasyonu',
      status: 'active',
      icon: 'bi-person-badge'
    },
    {
      name: 'Active Directory',
      description: 'Kurumsal kullanıcı kimlik doğrulama',
      status: 'planned',
      icon: 'bi-shield-check'
    },
    {
      name: 'Email Notifications',
      description: 'SMTP üzerinden otomatik email bildirimleri',
      status: 'active',
      icon: 'bi-envelope'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'planned':
        return 'bg-warning';
      case 'beta':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'planned':
        return 'Planlanıyor';
      case 'beta':
        return 'Beta';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">📋 Sistem Dokümantasyonu</h4>
              <p className="text-muted mb-0">Asyaport Zimmet Takip Sistemi - Teknik Dokümantasyon</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-download me-1"></i>
                PDF İndir
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-printer me-1"></i>
                Yazdır
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Info Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3d6f 100%)' }}>
            <div className="card-body text-white p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-2 fw-bold">
                    <i className="bi bi-building me-2"></i>
                    Asyaport Zimmet Takip Sistemi
                  </h5>
                  <p className="mb-3 opacity-90">
                    Asyaport Liman A.Ş. için geliştirilmiş modern, güvenli ve kullanıcı dostu zimmet takip çözümü. 
                    Türkiye'nin en büyük konteyner limanlarından biri olan Asyaport'un tüm varlıklarını 
                    etkin şekilde yönetmek için tasarlandı.
                  </p>
                  <div className="d-flex gap-3">
                    <span className="badge bg-light text-dark">
                      <i className="bi bi-calendar me-1"></i>
                      Sürüm 2.1.0
                    </span>
                    <span className="badge bg-light text-dark">
                      <i className="bi bi-clock me-1"></i>
                      Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-end">
                      <span className="badge bg-success fs-6">
                        <i className="bi bi-check-circle me-1"></i>
                        Sistem Aktif
                      </span>
                    </div>
                    <div className="text-end opacity-90">
                      <small>Barbaros / Tekirdağ</small><br />
                      <small>2.5M TEU Kapasiteli Liman</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill bg-light rounded p-1">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-house me-1"></i>
                Genel Bakış
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                <i className="bi bi-gear me-1"></i>
                Özellikler
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
                onClick={() => setActiveTab('roles')}
              >
                <i className="bi bi-people me-1"></i>
                Kullanıcı Rolleri
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'requirements' ? 'active' : ''}`}
                onClick={() => setActiveTab('requirements')}
              >
                <i className="bi bi-cpu me-1"></i>
                Sistem Gereksinimleri
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'integrations' ? 'active' : ''}`}
                onClick={() => setActiveTab('integrations')}
              >
                <i className="bi bi-diagram-3 me-1"></i>
                Entegrasyonlar
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-lg-8">
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-info-circle me-2 text-primary"></i>
                      Sistem Hakkında
                    </h5>
                    <p className="text-muted mb-4">
                      Asyaport Zimmet Takip Sistemi, modern liman operasyonlarının gerektirdiği karmaşık 
                      varlık yönetimi ihtiyaçlarını karşılamak için geliştirilmiştir. Sistem, konteyner 
                      vinçlerinden ofis ekipmanlarına, güvenlik sistemlerinden araçlara kadar geniş bir 
                      varlık yelpazesini takip etme kabiliyetine sahiptir.
                    </p>
                    
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center p-3">
                            <div className="text-primary mb-2">
                              <i className="bi bi-building fs-1"></i>
                            </div>
                            <h6 className="fw-bold">Liman Operasyonları</h6>
                            <small className="text-muted">
                              Liman ekipmanları ve operasyonel varlıklar
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center p-3">
                            <div className="text-success mb-2">
                              <i className="bi bi-laptop fs-1"></i>
                            </div>
                            <h6 className="fw-bold">Ofis Ekipmanları</h6>
                            <small className="text-muted">
                              Bilgisayar, telefon ve ofis malzemeleri
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center p-3">
                            <div className="text-warning mb-2">
                              <i className="bi bi-car-front fs-1"></i>
                            </div>
                            <h6 className="fw-bold">Araç Filosu</h6>
                            <small className="text-muted">
                              Şirket araçları ve operasyonel araçlar
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info d-flex align-items-start">
                      <i className="bi bi-lightbulb me-3 mt-1"></i>
                      <div>
                        <strong>Önemli Not:</strong> Bu sistem SAP ve OPUS entegrasyonları ile 
                        çalışmakta olup, tüm varlık hareketleri gerçek zamanlı olarak merkezi 
                        sistemlerle senkronize edilmektedir.
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="card border-0 bg-primary text-white h-100">
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-3">
                          <i className="bi bi-graph-up me-2"></i>
                          Sistem İstatistikleri
                        </h6>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>Kayıtlı Varlık</small>
                            <small className="fw-bold">2,847</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-light" style={{ width: '85%' }}></div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>Aktif Kullanıcı</small>
                            <small className="fw-bold">156</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-light" style={{ width: '92%' }}></div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>Departman Sayısı</small>
                            <small className="fw-bold">24</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-light" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        <hr className="opacity-25" />

                        <div className="text-center">
                          <small className="opacity-75">Son güncellenme</small><br />
                          <strong>{new Date().toLocaleString('tr-TR')}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="row g-4">
              {systemFeatures.map((feature) => (
                <div key={feature.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start mb-3">
                        <div className="icon-wrapper me-3">
                          <i className={`bi ${feature.icon} text-primary fs-4`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold mb-0">{feature.title}</h6>
                            <span className={`badge ${getStatusBadge(feature.status)}`}>
                              {getStatusText(feature.status)}
                            </span>
                          </div>
                          <p className="text-muted mb-0">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="row g-4">
              {userRoles.map((role) => (
                <div key={role.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${role.color} fs-6`}>
                        {role.displayName}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted mb-3">{role.description}</p>
                      <h6 className="fw-bold mb-3">Yetkiler:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {role.permissions.map((permission, index) => (
                          <span key={index} className="badge bg-light text-dark">
                            <i className="bi bi-check-circle me-1"></i>
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="row g-4">
              {systemRequirements.map((req, index) => (
                <div key={index} className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-light border-0">
                      <h6 className="fw-bold mb-0">
                        <i className="bi bi-cpu me-2 text-primary"></i>
                        {req.category}
                      </h6>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled mb-0">
                        {req.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="mb-2">
                            <i className="bi bi-check-circle text-success me-2"></i>
                            <small>{item}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="row g-4">
              {integrations.map((integration, index) => (
                <div key={index} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start">
                        <div className="icon-wrapper me-3">
                          <i className={`bi ${integration.icon} text-primary fs-4`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold mb-0">{integration.name}</h6>
                            <span className={`badge ${getStatusBadge(integration.status)}`}>
                              {getStatusText(integration.status)}
                            </span>
                          </div>
                          <p className="text-muted mb-0">{integration.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body p-4 text-center">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <h6 className="fw-bold mb-0">
                    <i className="bi bi-headset me-2 text-primary"></i>
                    Teknik Destek
                  </h6>
                  <small className="text-muted">7/24 destek hattı</small>
                </div>
                <div className="col-md-4">
                  <h6 className="fw-bold mb-0">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    support@asyaport.com
                  </h6>
                  <small className="text-muted">Email destek</small>
                </div>
                <div className="col-md-4">
                  <h6 className="fw-bold mb-0">
                    <i className="bi bi-phone me-2 text-primary"></i>
                    +90 282 123 45 67
                  </h6>
                  <small className="text-muted">Telefon destek</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;