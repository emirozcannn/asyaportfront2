// src/pages/help/SystemStatus.tsx
import React, { useState, useEffect } from 'react';

interface SystemMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  status: 'operational' | 'degraded' | 'outage';
  threshold: {
    warning: number;
    critical: number;
  };
  icon: string;
  color: string;
}

interface SystemService {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  lastChecked: string;
  responseTime: number;
  icon: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedServices: string[];
  createdAt: string;
  updatedAt: string;
  updates: IncidentUpdate[];
}

interface IncidentUpdate {
  id: string;
  message: string;
  status: string;
  timestamp: string;
  author: string;
}

interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  type: 'scheduled' | 'emergency';
  status: 'planned' | 'in-progress' | 'completed';
  startTime: string;
  endTime: string;
  affectedServices: string[];
  impact: 'none' | 'minimal' | 'moderate' | 'major';
}

const SystemStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Modal state for service details
  const [selectedService, setSelectedService] = useState<SystemService | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const handleShowServiceModal = (service: SystemService) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };
  
  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setSelectedService(null);
  };

  // Sistem metrikleri
  const systemMetrics: SystemMetric[] = [
    {
      id: 'response_time',
      name: 'Ortalama Yanıt Süresi',
      description: 'API endpoint\'lerinin ortalama yanıt süresi',
      value: 247,
      unit: 'ms',
      status: 'operational',
      threshold: { warning: 500, critical: 1000 },
      icon: 'bi-speedometer2',
      color: 'success'
    },
    {
      id: 'cpu_usage',
      name: 'CPU Kullanımı',
      description: 'Sunucu CPU kullanım yüzdesi',
      value: 34,
      unit: '%',
      status: 'operational',
      threshold: { warning: 70, critical: 85 },
      icon: 'bi-cpu',
      color: 'success'
    },
    {
      id: 'memory_usage',
      name: 'Bellek Kullanımı',
      description: 'RAM kullanım yüzdesi',
      value: 68,
      unit: '%',
      status: 'degraded',
      threshold: { warning: 75, critical: 90 },
      icon: 'bi-memory',
      color: 'warning'
    },
    {
      id: 'disk_usage',
      name: 'Disk Kullanımı',
      description: 'Depolama alanı kullanım yüzdesi',
      value: 42,
      unit: '%',
      status: 'operational',
      threshold: { warning: 80, critical: 95 },
      icon: 'bi-hdd',
      color: 'success'
    },
    {
      id: 'active_users',
      name: 'Aktif Kullanıcılar',
      description: 'Şu anda sistemde aktif olan kullanıcı sayısı',
      value: 127,
      unit: 'kullanıcı',
      status: 'operational',
      threshold: { warning: 200, critical: 250 },
      icon: 'bi-people',
      color: 'info'
    },
    {
      id: 'database_connections',
      name: 'Veritabanı Bağlantıları',
      description: 'Aktif veritabanı bağlantı sayısı',
      value: 23,
      unit: 'bağlantı',
      status: 'operational',
      threshold: { warning: 80, critical: 100 },
      icon: 'bi-database',
      color: 'success'
    }
  ];

  // Sistem servisleri
  const systemServices: SystemService[] = [
    {
      id: 'web_app',
      name: 'Web Uygulaması',
      description: 'Ana web arayüzü ve kullanıcı etkileşimleri',
      status: 'operational',
      uptime: 99.94,
      lastChecked: new Date().toISOString(),
      responseTime: 247,
      icon: 'bi-globe'
    },
    {
      id: 'api_server',
      name: 'API Sunucusu',
      description: 'REST API servisleri ve veri işlemleri',
      status: 'operational',
      uptime: 99.87,
      lastChecked: new Date().toISOString(),
      responseTime: 156,
      icon: 'bi-server'
    },
    {
      id: 'database',
      name: 'Veritabanı',
      description: 'Ana veritabanı sunucusu (PostgreSQL)',
      status: 'operational',
      uptime: 99.98,
      lastChecked: new Date().toISOString(),
      responseTime: 23,
      icon: 'bi-database'
    },
    {
      id: 'sap_integration',
      name: 'SAP Entegrasyonu',
      description: 'SAP ERP sistemi ile veri senkronizasyonu',
      status: 'degraded',
      uptime: 97.12,
      lastChecked: new Date().toISOString(),
      responseTime: 1243,
      icon: 'bi-arrow-repeat'
    },
    {
      id: 'file_storage',
      name: 'Dosya Depolama',
      description: 'Dosya yükleme ve indirme servisleri',
      status: 'operational',
      uptime: 99.76,
      lastChecked: new Date().toISOString(),
      responseTime: 89,
      icon: 'bi-cloud-upload'
    },
    {
      id: 'email_service',
      name: 'E-posta Servisi',
      description: 'Bildirim ve e-posta gönderim servisi',
      status: 'operational',
      uptime: 99.45,
      lastChecked: new Date().toISOString(),
      responseTime: 234,
      icon: 'bi-envelope'
    },
    {
      id: 'backup_system',
      name: 'Yedekleme Sistemi',
      description: 'Otomatik veri yedekleme ve kurtarma',
      status: 'operational',
      uptime: 100.0,
      lastChecked: new Date().toISOString(),
      responseTime: 45,
      icon: 'bi-shield-check'
    },
    {
      id: 'mobile_api',
      name: 'Mobil API',
      description: 'Mobil uygulama için özel API endpoint\'leri',
      status: 'maintenance',
      uptime: 98.23,
      lastChecked: new Date().toISOString(),
      responseTime: 0,
      icon: 'bi-phone'
    }
  ];

  // Aktif olaylar
  const incidents: Incident[] = [
    {
      id: 'INC-2024-001',
      title: 'SAP Entegrasyonu Yavaşlığı',
      description: 'SAP sisteminden veri çekme işlemleri normalden yavaş gerçekleşiyor.',
      status: 'monitoring',
      severity: 'medium',
      affectedServices: ['sap_integration'],
      createdAt: '2024-08-06T08:15:00Z',
      updatedAt: '2024-08-06T10:30:00Z',
      updates: [
        {
          id: 'UPD-001',
          message: 'SAP sistem yöneticileri ile iletişime geçildi. Sorun araştırılıyor.',
          status: 'investigating',
          timestamp: '2024-08-06T08:15:00Z',
          author: 'Sistem Yöneticisi'
        },
        {
          id: 'UPD-002',
          message: 'Sorun SAP tarafında ağ gecikmeleri olarak tespit edildi. Çözüm uygulanıyor.',
          status: 'identified',
          timestamp: '2024-08-06T09:45:00Z',
          author: 'SAP Destek Ekibi'
        },
        {
          id: 'UPD-003',
          message: 'Ağ optimizasyonu tamamlandı. Performans izleniyor.',
          status: 'monitoring',
          timestamp: '2024-08-06T10:30:00Z',
          author: 'Sistem Yöneticisi'
        }
      ]
    }
  ];

  // Bakım planları
  const maintenanceWindows: MaintenanceWindow[] = [
    {
      id: 'MAINT-2024-008',
      title: 'Veritabanı Optimizasyonu',
      description: 'Veritabanı performans optimizasyonu ve index güncellemeleri yapılacak.',
      type: 'scheduled',
      status: 'planned',
      startTime: '2024-08-07T02:00:00Z',
      endTime: '2024-08-07T04:00:00Z',
      affectedServices: ['database', 'web_app', 'api_server'],
      impact: 'moderate'
    },
    {
      id: 'MAINT-2024-009',
      title: 'Mobil API Güncellemesi',
      description: 'Mobil uygulama API\'sinde güvenlik güncellemeleri ve yeni özellikler.',
      type: 'scheduled',
      status: 'in-progress',
      startTime: '2024-08-06T11:00:00Z',
      endTime: '2024-08-06T13:00:00Z',
      affectedServices: ['mobile_api'],
      impact: 'minimal'
    },
    {
      id: 'MAINT-2024-007',
      title: 'SSL Sertifikası Yenileme',
      description: 'SSL sertifikaları yenilendi. Sistem kısa süreliğine erişilemeyebilir.',
      type: 'scheduled',
      status: 'completed',
      startTime: '2024-08-05T23:00:00Z',
      endTime: '2024-08-05T23:15:00Z',
      affectedServices: ['web_app', 'api_server'],
      impact: 'minimal'
    }
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'degraded': return 'warning';
      case 'outage': return 'danger';
      case 'maintenance': return 'info';
      case 'investigating': return 'danger';
      case 'identified': return 'warning';
      case 'monitoring': return 'info';
      case 'resolved': return 'success';
      case 'planned': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return 'bi-check-circle-fill';
      case 'degraded': return 'bi-exclamation-triangle-fill';
      case 'outage': return 'bi-x-circle-fill';
      case 'maintenance': return 'bi-tools';
      default: return 'bi-question-circle';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Çalışıyor';
      case 'degraded': return 'Yavaş';
      case 'outage': return 'Çalışmıyor';
      case 'maintenance': return 'Bakımda';
      case 'investigating': return 'Araştırılıyor';
      case 'identified': return 'Tespit Edildi';
      case 'monitoring': return 'İzleniyor';
      case 'resolved': return 'Çözüldü';
      case 'planned': return 'Planlandı';
      case 'in-progress': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      default: return 'Bilinmiyor';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      case 'critical': return 'danger';
      default: return 'secondary';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'none': return 'success';
      case 'minimal': return 'info';
      case 'moderate': return 'warning';
      case 'major': return 'danger';
      default: return 'secondary';
    }
  };

  const getOverallStatus = () => {
    const outageCount = systemServices.filter(s => s.status === 'outage').length;
    const degradedCount = systemServices.filter(s => s.status === 'degraded').length;
    const maintenanceCount = systemServices.filter(s => s.status === 'maintenance').length;

    if (outageCount > 0) return { status: 'outage', text: 'Sistemde Sorunlar Var', color: 'danger' };
    if (degradedCount > 0) return { status: 'degraded', text: 'Sistemde Yavaşlık Var', color: 'warning' };
    if (maintenanceCount > 0) return { status: 'maintenance', text: 'Planlı Bakım', color: 'info' };
    return { status: 'operational', text: 'Tüm Sistemler Çalışıyor', color: 'success' };
  };

  const getOverallUptime = () => {
    const totalUptime = systemServices.reduce((sum, service) => sum + service.uptime, 0);
    return (totalUptime / systemServices.length).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const formatTimeDiff = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours} saat ${minutes} dakika önce`;
    return `${minutes} dakika önce`;
  };

  const overallStatus = getOverallStatus();

  return (
    <>
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1 fw-bold">📊 Sistem Durumu</h4>
                <p className="text-muted mb-0">Asyaport Zimmet Takip Sistemi - Gerçek Zamanlı Sistem İzleme</p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoRefresh">
                    <small>Otomatik Yenile</small>
                  </label>
                </div>
                <select
                  className="form-select form-select-sm"
                  style={{ width: '120px' }}
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  disabled={!autoRefresh}
                >
                  <option value={15}>15 saniye</option>
                  <option value={30}>30 saniye</option>
                  <option value={60}>1 dakika</option>
                  <option value={300}>5 dakika</option>
                </select>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setLastRefresh(new Date())}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Yenile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="row mb-4">
          <div className="col-12">
            <div className={`card border-0 shadow-sm text-white`} style={{ 
              background: `linear-gradient(135deg, ${
                overallStatus.color === 'success' ? '#28a745, #20c997' :
                overallStatus.color === 'warning' ? '#ffc107, #fd7e14' :
                overallStatus.color === 'danger' ? '#dc3545, #e83e8c' :
                '#17a2b8, #6f42c1'
              })` 
            }}>
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-3">
                        <i className={`bi ${getStatusIcon(overallStatus.status)} fs-2`}></i>
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1">{overallStatus.text}</h4>
                        <p className="mb-0 opacity-90">
                          Son güncelleme: {lastRefresh.toLocaleString('tr-TR')} • 
                          Genel Uptime: %{getOverallUptime()} • 
                          {systemServices.filter(s => s.status === 'operational').length}/{systemServices.length} servis çalışıyor
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="fs-4 fw-bold">{systemServices.filter(s => s.status === 'operational').length}</div>
                        <small className="opacity-75">Çalışıyor</small>
                      </div>
                      <div className="col-4">
                        <div className="fs-4 fw-bold">{incidents.filter(i => i.status !== 'resolved').length}</div>
                        <small className="opacity-75">Aktif Olay</small>
                      </div>
                      <div className="col-4">
                        <div className="fs-4 fw-bold">{maintenanceWindows.filter(m => m.status === 'planned').length}</div>
                        <small className="opacity-75">Planlı Bakım</small>
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
                  <i className="bi bi-speedometer2 me-1"></i>
                  Genel Bakış
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                  onClick={() => setActiveTab('services')}
                >
                  <i className="bi bi-server me-1"></i>
                  Servisler ({systemServices.length})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'incidents' ? 'active' : ''}`}
                  onClick={() => setActiveTab('incidents')}
                >
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Olaylar ({incidents.length})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'maintenance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('maintenance')}
                >
                  <i className="bi bi-tools me-1"></i>
                  Bakım ({maintenanceWindows.length})
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
              <div className="row g-4">
                {/* System Metrics */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold mb-0">
                        <i className="bi bi-graph-up me-2 text-primary"></i>
                        Sistem Metrikleri
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {systemMetrics.map((metric) => (
                          <div key={metric.id} className="col-lg-4 col-md-6">
                            <div className="card border-0 bg-light h-100">
                              <div className="card-body p-3">
                                <div className="d-flex align-items-start justify-content-between mb-2">
                                  <div className={`text-${metric.color}`}>
                                    <i className={`bi ${metric.icon} fs-4`}></i>
                                  </div>
                                  <span className={`badge bg-${getStatusColor(metric.status)}`}>
                                    {getStatusText(metric.status)}
                                  </span>
                                </div>
                                <h6 className="fw-bold mb-1">{metric.name}</h6>
                                <div className="d-flex align-items-baseline mb-2">
                                  <span className="fs-4 fw-bold me-2">{metric.value}</span>
                                  <span className="text-muted">{metric.unit}</span>
                                </div>
                                <small className="text-muted">{metric.description}</small>
                                
                                {/* Progress bar for percentage metrics */}
                                {metric.unit === '%' && (
                                  <div className="mt-2">
                                    <div className="progress" style={{ height: '4px' }}>
                                      <div 
                                        className={`progress-bar bg-${metric.color}`} 
                                        style={{ width: `${metric.value}%` }}
                                      ></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                      <small className="text-muted">0%</small>
                                      <small className="text-warning">Uyarı: {metric.threshold.warning}%</small>
                                      <small className="text-danger">Kritik: {metric.threshold.critical}%</small>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Service Status */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold mb-0">
                        <i className="bi bi-list-check me-2 text-primary"></i>
                        Hızlı Servis Durumu
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        {systemServices.map((service) => (
                          <div key={service.id} className="col-lg-3 col-md-6">
                            <div className="d-flex align-items-center p-2 rounded bg-light">
                              <i className={`bi ${service.icon} me-2 text-muted`}></i>
                              <div className="flex-grow-1 me-2">
                                <div className="fw-semibold small">{service.name}</div>
                                <small className="text-muted">{service.uptime}% uptime</small>
                              </div>
                              <span className={`badge bg-${getStatusColor(service.status)}`}>
                                <i className={`bi ${getStatusIcon(service.status)} me-1`}></i>
                                {getStatusText(service.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-server me-2 text-primary"></i>
                    Sistem Servisleri
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Servis</th>
                          <th>Durum</th>
                          <th>Uptime</th>
                          <th>Yanıt Süresi</th>
                          <th>Son Kontrol</th>
                          <th>Detaylar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemServices.map((service) => (
                          <tr key={service.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className={`bi ${service.icon} me-3 text-muted fs-5`}></i>
                                <div>
                                  <div className="fw-semibold">{service.name}</div>
                                  <small className="text-muted">{service.description}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${getStatusColor(service.status)} d-flex align-items-center w-auto`}>
                                <i className={`bi ${getStatusIcon(service.status)} me-1`}></i>
                                {getStatusText(service.status)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="fw-bold me-2">{service.uptime}%</span>
                                <div className="progress flex-grow-1" style={{ height: '4px', width: '60px' }}>
                                  <div 
                                    className={`progress-bar ${
                                      service.uptime >= 99.5 ? 'bg-success' :
                                      service.uptime >= 98 ? 'bg-warning' : 'bg-danger'
                                    }`}
                                    style={{ width: `${service.uptime}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${
                                service.responseTime === 0 ? 'bg-secondary' :
                                service.responseTime < 300 ? 'bg-success' :
                                service.responseTime < 1000 ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {service.responseTime === 0 ? 'N/A' : `${service.responseTime}ms`}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatTimeDiff(service.lastChecked)}
                              </small>
                            </td>
                            <td>
                              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleShowServiceModal(service)}>
                                <i className="bi bi-eye me-1"></i>
                                Detay
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Incidents Tab */}
            {activeTab === 'incidents' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-exclamation-triangle me-2 text-primary"></i>
                    Aktif Olaylar
                  </h5>
                </div>
                <div className="card-body">
                  {incidents.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-check-circle text-success fs-1"></i>
                      <h6 className="mt-2">Aktif olay bulunmuyor</h6>
                      <p className="text-muted">Tüm sistemler normal çalışıyor.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {incidents.map((incident) => (
                        <div key={incident.id} className="card border-start border-4 border-warning">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-bold">{incident.title}</h6>
                              <span className={`badge bg-${getSeverityColor(incident.severity)}`}>
                                {incident.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-muted mb-2">{incident.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge bg-${getStatusColor(incident.status)}`}>
                                {getStatusText(incident.status)}
                              </span>
                              <small className="text-muted">
                                {formatDate(incident.updatedAt)}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-tools me-2 text-primary"></i>
                    Bakım Planları
                  </h5>
                </div>
                <div className="card-body">
                  {maintenanceWindows.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-calendar-check text-success fs-1"></i>
                      <h6 className="mt-2">Planlı bakım bulunmuyor</h6>
                      <p className="text-muted">Yakın zamanda bakım planlanmamış.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {maintenanceWindows.map((maintenance) => (
                        <div key={maintenance.id} className="card border-start border-4 border-info">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-bold">{maintenance.title}</h6>
                              <span className={`badge bg-${getImpactColor(maintenance.impact)}`}>
                                {maintenance.impact.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-muted mb-2">{maintenance.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge bg-${getStatusColor(maintenance.status)}`}>
                                {getStatusText(maintenance.status)}
                              </span>
                              <small className="text-muted">
                                {formatDate(maintenance.startTime)} - {formatDate(maintenance.endTime)}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && showServiceModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header bg-light border-0 rounded-top-4">
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${selectedService.icon} me-2 text-primary`}></i>
                  {selectedService.name}
                </h5>
                <button type="button" className="btn-close" aria-label="Kapat" onClick={handleCloseServiceModal}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-8">
                    <div className="mb-2">
                      <span className={`badge bg-${getStatusColor(selectedService.status)} me-2`}>
                        <i className={`bi ${getStatusIcon(selectedService.status)} me-1`}></i>
                        {getStatusText(selectedService.status)}
                      </span>
                      <span className="badge bg-light text-dark border ms-1">
                        Uptime: <strong>{selectedService.uptime}%</strong>
                      </span>
                      <span className="badge bg-light text-dark border ms-1">
                        Yanıt: <strong>{selectedService.responseTime === 0 ? 'N/A' : `${selectedService.responseTime}ms`}</strong>
                      </span>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">{selectedService.description}</small>
                    </div>
                    <div>
                      <small className="text-muted">Son kontrol: {formatDate(selectedService.lastChecked)}</small>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <i className={`bi ${selectedService.icon} text-secondary`} style={{ fontSize: 64, opacity: 0.15 }}></i>
                  </div>
                </div>
                {/* Related Incidents */}
                {incidents.filter(i => i.affectedServices.includes(selectedService.id) && i.status !== 'resolved').length > 0 && (
                  <div className="alert alert-warning d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div>
                      <strong>Aktif Olay:</strong> {incidents.filter(i => i.affectedServices.includes(selectedService.id) && i.status !== 'resolved').map(i => i.title).join(', ')}
                    </div>
                  </div>
                )}
                {/* Related Maintenance */}
                {maintenanceWindows.filter(m => m.affectedServices.includes(selectedService.id) && m.status !== 'completed').length > 0 && (
                  <div className="alert alert-info d-flex align-items-center gap-2">
                    <i className="bi bi-tools fs-5"></i>
                    <div>
                      <strong>Bakım:</strong> {maintenanceWindows.filter(m => m.affectedServices.includes(selectedService.id) && m.status !== 'completed').map(m => m.title).join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light border-0 rounded-bottom-4">
                <button type="button" className="btn btn-secondary" onClick={handleCloseServiceModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SystemStatus;
