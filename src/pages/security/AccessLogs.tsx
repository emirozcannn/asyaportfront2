import React, { useState, useEffect } from 'react';

const AccessLogs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState<{ show: boolean; log: any }>({ show: false, log: null });
  const itemsPerPage = 15;

  const [accessLogs] = useState([
    {
      id: 1,
      userId: 'usr_001',
      userName: 'Ahmet Yılmaz',
      userRole: 'Admin',
      action: 'LOGIN_SUCCESS',
      sessionId: 'sess_9f4e2d1a',
      ipAddress: '192.168.1.105',
      location: 'İstanbul, TR',
      device: 'Desktop',
      browser: 'Chrome 120.0.0.0',
      os: 'Windows 10',
      timestamp: '2025-08-13T09:15:23Z',
      duration: '2h 45m',
      status: 'active',
      riskScore: 1
    },
    {
      id: 2,
      userId: 'usr_003',
      userName: 'Fatma Kaya',
      userRole: 'User',
      action: 'LOGIN_SUCCESS',
      sessionId: 'sess_7b3c8e9f',
      ipAddress: '192.168.1.108',
      location: 'İstanbul, TR',
      device: 'Mobile',
      browser: 'Safari 17.0',
      os: 'iOS 17.1',
      timestamp: '2025-08-13T08:45:12Z',
      duration: '1h 22m',
      status: 'ended',
      riskScore: 1
    },
    {
      id: 3,
      userId: 'usr_011',
      userName: 'Ayşe Çelik',
      userRole: 'User',
      action: 'LOGIN_FAILED',
      sessionId: null,
      ipAddress: '192.168.1.125',
      location: 'İstanbul, TR',
      device: 'Desktop',
      browser: 'Chrome 120.0.0.0',
      os: 'Windows 10',
      timestamp: '2025-08-13T08:22:33Z',
      duration: null,
      status: 'failed',
      riskScore: 8,
      failureReason: 'Invalid password (3rd attempt)'
    },
    {
      id: 4,
      userId: 'usr_007',
      userName: 'Mehmet Demir',
      userRole: 'departmentAdmin',
      action: 'LOGIN_SUCCESS',
      sessionId: 'sess_4a1d7c2e',
      ipAddress: '192.168.1.112',
      location: 'Ankara, TR',
      device: 'Desktop',
      browser: 'Edge 119.0.0.0',
      os: 'Windows 11',
      timestamp: '2025-08-13T07:30:15Z',
      duration: '4h 15m',
      status: 'active',
      riskScore: 2
    },
    {
      id: 5,
      userId: 'unknown',
      userName: 'Bilinmeyen Kullanıcı',
      userRole: null,
      action: 'LOGIN_FAILED',
      sessionId: null,
      ipAddress: '203.45.67.89',
      location: 'Moskova, RU',
      device: 'Desktop',
      browser: 'Chrome 119.0.0.0',
      os: 'Linux',
      timestamp: '2025-08-13T06:45:20Z',
      duration: null,
      status: 'blocked',
      riskScore: 10,
      failureReason: 'Suspicious IP address'
    },
    {
      id: 6,
      userId: 'usr_002',
      userName: 'Ali Özkan',
      userRole: 'SuperAdmin',
      action: 'LOGOUT',
      sessionId: 'sess_8e5f9a3b',
      ipAddress: '192.168.1.101',
      location: 'İstanbul, TR',
      device: 'Desktop',
      browser: 'Chrome 120.0.0.0',
      os: 'macOS Sonoma',
      timestamp: '2025-08-13T06:15:45Z',
      duration: '6h 30m',
      status: 'ended',
      riskScore: 1
    },
    {
      id: 7,
      userId: 'usr_009',
      userName: 'Zeynep Acar',
      userRole: 'departmentAdmin',
      action: 'SESSION_TIMEOUT',
      sessionId: 'sess_2c7b4f1d',
      ipAddress: '192.168.1.130',
      location: 'İzmir, TR',
      device: 'Tablet',
      browser: 'Safari 17.0',
      os: 'iPadOS 17.1',
      timestamp: '2025-08-13T05:45:30Z',
      duration: '8h 0m',
      status: 'timeout',
      riskScore: 2
    },
    {
      id: 8,
      userId: 'usr_015',
      userName: 'Hakan Yıldız',
      userRole: 'User',
      action: 'LOGIN_FAILED',
      sessionId: null,
      ipAddress: '192.168.1.178',
      location: 'İstanbul, TR',
      device: 'Mobile',
      browser: 'Chrome Mobile 120.0',
      os: 'Android 14',
      timestamp: '2025-08-13T05:22:18Z',
      duration: null,
      status: 'failed',
      riskScore: 5,
      failureReason: 'Account temporarily locked'
    },
    {
      id: 9,
      userId: 'usr_004',
      userName: 'Hasan Yıldırım',
      userRole: 'User',
      action: 'LOGIN_SUCCESS',
      sessionId: 'sess_6d2a8e4c',
      ipAddress: '192.168.1.118',
      location: 'Bursa, TR',
      device: 'Desktop',
      browser: 'Firefox 118.0',
      os: 'Windows 11',
      timestamp: '2025-08-12T22:15:42Z',
      duration: '3h 45m',
      status: 'ended',
      riskScore: 1
    },
    {
      id: 10,
      userId: 'usr_012',
      userName: 'Mustafa Koç',
      userRole: 'User',
      action: 'FORCED_LOGOUT',
      sessionId: 'sess_1f5c9b7a',
      ipAddress: '192.168.1.142',
      location: 'İstanbul, TR',
      device: 'Desktop',
      browser: 'Chrome 120.0.0.0',
      os: 'Windows 10',
      timestamp: '2025-08-12T21:30:25Z',
      duration: '2h 10m',
      status: 'forced',
      riskScore: 6,
      failureReason: 'Admin forced logout'
    }
  ]);

  const [stats] = useState({
    totalSessions: 1456,
    activeSessions: 12,
    failedAttempts: 45,
    blockedIPs: 8,
    avgSessionDuration: '3h 24m',
    uniqueUsers: 67
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Filtreleme
  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.browser.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || log.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'ended': return 'bg-secondary';
      case 'failed': return 'bg-danger';
      case 'blocked': return 'bg-dark';
      case 'timeout': return 'bg-warning';
      case 'forced': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'ended': return 'Sonlandı';
      case 'failed': return 'Başarısız';
      case 'blocked': return 'Engellendi';
      case 'timeout': return 'Zaman Aşımı';
      case 'forced': return 'Zorla Çıkış';
      default: return status;
    }
  };

  const getActionDisplayName = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS': return 'Başarılı Giriş';
      case 'LOGIN_FAILED': return 'Başarısız Giriş';
      case 'LOGOUT': return 'Çıkış';
      case 'SESSION_TIMEOUT': return 'Oturum Zaman Aşımı';
      case 'FORCED_LOGOUT': return 'Zorla Çıkış';
      default: return action;
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-danger';
    if (score >= 5) return 'bg-warning';
    if (score >= 3) return 'bg-info';
    return 'bg-success';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 8) return 'Yüksek';
    if (score >= 5) return 'Orta';
    if (score >= 3) return 'Düşük';
    return 'Güvenli';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Zaman', 'Kullanıcı', 'İşlem', 'IP Adresi', 'Konum', 'Cihaz', 'Tarayıcı', 'Durum', 'Risk', 'Süre'],
      ...filteredLogs.map(log => [
        formatTimestamp(log.timestamp),
        log.userName,
        getActionDisplayName(log.action),
        log.ipAddress,
        log.location,
        log.device,
        log.browser,
        getStatusDisplayName(log.status),
        getRiskLevel(log.riskScore),
        log.duration || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sistem_erisim_loglari_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openDetailsModal = (log: any) => {
    setShowDetails({ show: true, log });
  };

  const closeDetailsModal = () => {
    setShowDetails({ show: false, log: null });
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Sistem erişim logları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🔐 Sistem Erişim Logları</h4>
          <p className="text-muted mb-0">
            Kullanıcı giriş/çıkış kayıtları ve oturum yönetimi • {stats.totalSessions} toplam oturum
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={exportLogs}
          >
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-shield-lock me-1"></i>
            Güvenlik Analizi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-primary">{stats.totalSessions.toLocaleString()}</h5>
              <small className="text-muted">Toplam Oturum</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-success">{stats.activeSessions}</h5>
              <small className="text-muted">Aktif Oturum</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-danger">{stats.failedAttempts}</h5>
              <small className="text-muted">Başarısız Giriş</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-warning">{stats.blockedIPs}</h5>
              <small className="text-muted">Engellenen IP</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-info">{stats.avgSessionDuration}</h5>
              <small className="text-muted">Ort. Oturum Süresi</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-secondary">{stats.uniqueUsers}</h5>
              <small className="text-muted">Benzersiz Kullanıcı</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kullanıcı, IP adresi, konum veya tarayıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="ended">Sonlandı</option>
                <option value="failed">Başarısız</option>
                <option value="blocked">Engellendi</option>
                <option value="timeout">Zaman Aşımı</option>
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="quarter">Son 3 Ay</option>
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setSelectedTimeRange('today');
                }}
              >
                <i className="bi bi-x-lg me-1"></i>
                Temizle
              </button>
            </div>
            <div className="col-md-1">
              <button className="btn btn-outline-primary w-100">
                <i className="bi bi-funnel"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Access Logs Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium">
              {filteredLogs.length} erişim kaydı bulundu
            </span>
            <small className="text-muted">
              Sayfa {currentPage} / {totalPages}
            </small>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Zaman</th>
                  <th>Kullanıcı</th>
                  <th>İşlem</th>
                  <th>IP & Konum</th>
                  <th>Cihaz</th>
                  <th>Süre</th>
                  <th>Risk</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <small className="text-muted">
                        {formatTimestamp(log.timestamp)}
                      </small>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{log.userName}</div>
                        {log.userRole && (
                          <small className="text-muted">
                            <span className="badge bg-secondary bg-opacity-25 text-dark">
                              {log.userRole}
                            </span>
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">{getActionDisplayName(log.action)}</span>
                      {log.sessionId && (
                        <div>
                          <small className="text-muted">ID: {log.sessionId}</small>
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <code className="bg-light px-2 py-1 rounded small">{log.ipAddress}</code>
                        <div>
                          <small className="text-muted">
                            <i className="bi bi-geo-alt me-1"></i>
                            {log.location}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <small className="fw-medium">{log.device}</small>
                        <div className="text-muted small">{log.browser}</div>
                        <div className="text-muted small">{log.os}</div>
                      </div>
                    </td>
                    <td>
                      <span className="small text-muted">
                        {log.duration || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getRiskBadgeColor(log.riskScore)}`}>
                        {getRiskLevel(log.riskScore)}
                      </span>
                      <div className="small text-muted">{log.riskScore}/10</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeColor(log.status)}`}>
                        {getStatusDisplayName(log.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openDetailsModal(log)}
                        title="Detayları Görüntüle"
                      >
                        <i className="bi bi-info-circle"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-transparent border-0">
            <nav>
              <ul className="pagination pagination-sm justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  >
                    Önceki
                  </button>
                </li>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else {
                    const start = Math.max(1, currentPage - 2);
                    pageNum = start + index;
                  }
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  >
                    Sonraki
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails.show && showDetails.log && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Erişim Detayları
                </h5>
                <button type="button" className="btn-close" onClick={closeDetailsModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Kullanıcı Bilgileri:</strong>
                    <ul className="list-unstyled mt-2">
                      <li><strong>Adı:</strong> {showDetails.log.userName}</li>
                      <li><strong>Rolü:</strong> {showDetails.log.userRole || 'N/A'}</li>
                      <li><strong>Kullanıcı ID:</strong> {showDetails.log.userId}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Oturum Bilgileri:</strong>
                    <ul className="list-unstyled mt-2">
                      <li><strong>Oturum ID:</strong> {showDetails.log.sessionId || 'N/A'}</li>
                      <li><strong>İşlem:</strong> {getActionDisplayName(showDetails.log.action)}</li>
                      <li><strong>Durum:</strong> <span className={`badge ${getStatusBadgeColor(showDetails.log.status)}`}>{getStatusDisplayName(showDetails.log.status)}</span></li>
                      <li><strong>Süre:</strong> {showDetails.log.duration || 'N/A'}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Ağ Bilgileri:</strong>
                    <ul className="list-unstyled mt-2">
                      <li><strong>IP Adresi:</strong> <code>{showDetails.log.ipAddress}</code></li>
                      <li><strong>Konum:</strong> {showDetails.log.location}</li>
                      <li><strong>Risk Skoru:</strong> <span className={`badge ${getRiskBadgeColor(showDetails.log.riskScore)}`}>{showDetails.log.riskScore}/10</span></li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Cihaz Bilgileri:</strong>
                    <ul className="list-unstyled mt-2">
                      <li><strong>Cihaz:</strong> {showDetails.log.device}</li>
                      <li><strong>Tarayıcı:</strong> {showDetails.log.browser}</li>
                      <li><strong>İşletim Sistemi:</strong> {showDetails.log.os}</li>
                    </ul>
                  </div>
                  <div className="col-12">
                    <strong>Zaman Damgası:</strong>
                    <p className="mt-1">{formatTimestamp(showDetails.log.timestamp)}</p>
                    {showDetails.log.failureReason && (
                      <>
                        <strong>Hata Nedeni:</strong>
                        <div className="alert alert-danger mt-2">
                          {showDetails.log.failureReason}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDetailsModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessLogs;