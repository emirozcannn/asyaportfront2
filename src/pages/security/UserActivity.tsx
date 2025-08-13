import React, { useState, useEffect } from 'react';

const UserActivitiesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [activities] = useState([
    {
      id: 1,
      userId: 'usr_001',
      userName: 'Ahmet Yılmaz',
      userRole: 'Admin',
      activity: 'Sistem Girişi',
      description: 'Başarılı sistem girişi gerçekleştirildi',
      ipAddress: '192.168.1.105',
      userAgent: 'Chrome 120.0.0.0 - Windows 10',
      timestamp: '2025-08-13T09:15:23Z',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 2,
      userId: 'usr_003',
      userName: 'Fatma Kaya',
      userRole: 'User',
      activity: 'Zimmet Talebi',
      description: 'MacBook Pro 16" için zimmet talebi oluşturuldu',
      ipAddress: '192.168.1.108',
      userAgent: 'Firefox 118.0 - Windows 11',
      timestamp: '2025-08-13T09:12:45Z',
      status: 'info',
      riskLevel: 'low'
    },
    {
      id: 3,
      userId: 'usr_007',
      userName: 'Mehmet Demir',
      userRole: 'departmentAdmin',
      activity: 'Zimmet Onayı',
      description: 'Dell Latitude 7420 zimmet talebi onaylandı',
      ipAddress: '192.168.1.112',
      userAgent: 'Edge 119.0.0.0 - Windows 11',
      timestamp: '2025-08-13T08:45:12Z',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 4,
      userId: 'usr_002',
      userName: 'Ali Özkan',
      userRole: 'SuperAdmin',
      activity: 'Kullanıcı Silme',
      description: 'İnaktif kullanıcı hesabı silindi (ID: usr_045)',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome 120.0.0.0 - macOS',
      timestamp: '2025-08-13T08:30:15Z',
      status: 'warning',
      riskLevel: 'medium'
    },
    {
      id: 5,
      userId: 'usr_011',
      userName: 'Ayşe Çelik',
      userRole: 'User',
      activity: 'Başarısız Giriş',
      description: 'Hatalı şifre ile giriş denemesi (3. deneme)',
      ipAddress: '192.168.1.125',
      userAgent: 'Chrome 120.0.0.0 - Windows 10',
      timestamp: '2025-08-13T08:22:33Z',
      status: 'danger',
      riskLevel: 'high'
    },
    {
      id: 6,
      userId: 'usr_004',
      userName: 'Hasan Yıldırım',
      userRole: 'User',
      activity: 'Rapor İndirme',
      description: 'Zimmet listesi CSV formatında indirildi',
      ipAddress: '192.168.1.118',
      userAgent: 'Safari 17.0 - macOS',
      timestamp: '2025-08-13T07:55:20Z',
      status: 'info',
      riskLevel: 'low'
    },
    {
      id: 7,
      userId: 'usr_009',
      userName: 'Zeynep Acar',
      userRole: 'departmentAdmin',
      activity: 'Toplu İade',
      description: '5 adet zimmet kaydı toplu olarak iade edildi',
      ipAddress: '192.168.1.130',
      userAgent: 'Chrome 120.0.0.0 - Windows 11',
      timestamp: '2025-08-13T07:30:45Z',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 8,
      userId: 'usr_012',
      userName: 'Mustafa Koç',
      userRole: 'User',
      activity: 'Profil Güncelleme',
      description: 'Kullanıcı profil bilgileri güncellendi',
      ipAddress: '192.168.1.142',
      userAgent: 'Firefox 118.0 - Linux',
      timestamp: '2025-08-12T16:45:12Z',
      status: 'info',
      riskLevel: 'low'
    },
    {
      id: 9,
      userId: 'usr_005',
      userName: 'Elif Şahin',
      userRole: 'Admin',
      activity: 'Sistem Ayarları',
      description: 'Backup sıklığı ayarları değiştirildi',
      ipAddress: '192.168.1.155',
      userAgent: 'Chrome 120.0.0.0 - Windows 10',
      timestamp: '2025-08-12T15:20:30Z',
      status: 'warning',
      riskLevel: 'medium'
    },
    {
      id: 10,
      userId: 'usr_008',
      userName: 'Can Yılmaz',
      userRole: 'User',
      activity: 'Zimmet İade',
      description: 'iPhone 14 Pro zimmet iadesi tamamlandı',
      ipAddress: '192.168.1.167',
      userAgent: 'Edge 119.0.0.0 - Windows 11',
      timestamp: '2025-08-12T14:15:45Z',
      status: 'success',
      riskLevel: 'low'
    }
  ]);

  const [stats] = useState({
    totalActivities: 1247,
    todayActivities: 23,
    suspiciousActivities: 3,
    uniqueUsers: 45
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Filtreleme
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.ipAddress.includes(searchTerm);
    
    const matchesUser = !selectedUser || activity.userName === selectedUser;
    const matchesActivity = !selectedActivity || activity.activity === selectedActivity;
    
    return matchesSearch && matchesUser && matchesActivity;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger': return 'bg-danger';
      case 'info': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'Süper Admin';
      case 'Admin': return 'Admin';
      case 'departmentAdmin': return 'Departman Admin';
      case 'User': return 'Kullanıcı';
      default: return role;
    }
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

  const exportActivities = () => {
    const csvContent = [
      ['Zaman', 'Kullanıcı', 'Rol', 'Aktivite', 'Açıklama', 'IP Adresi', 'Risk Seviyesi'],
      ...filteredActivities.map(activity => [
        formatTimestamp(activity.timestamp),
        activity.userName,
        getRoleDisplayName(activity.userRole),
        activity.activity,
        activity.description,
        activity.ipAddress,
        activity.riskLevel
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kullanici_aktiviteleri_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Kullanıcı aktiviteleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📊 Kullanıcı Aktiviteleri</h4>
          <p className="text-muted mb-0">
            Sistem kullanıcı hareketleri ve güvenlik logları • {stats.totalActivities} toplam aktivite
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={exportActivities}
          >
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-shield-check me-1"></i>
            Güvenlik Raporu
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Toplam Aktivite</p>
                  <h3 className="mb-0 fw-bold text-primary">{stats.totalActivities.toLocaleString()}</h3>
                  <small className="text-primary">
                    <i className="bi bi-activity me-1"></i>
                    Tüm zamanlar
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-graph-up text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Bugünkü Aktivite</p>
                  <h3 className="mb-0 fw-bold text-success">{stats.todayActivities}</h3>
                  <small className="text-success">
                    <i className="bi bi-clock me-1"></i>
                    Son 24 saat
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-calendar-day text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Şüpheli Aktivite</p>
                  <h3 className="mb-0 fw-bold text-danger">{stats.suspiciousActivities}</h3>
                  <small className="text-danger">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    İnceleme gerekli
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-shield-exclamation text-danger fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Aktif Kullanıcı</p>
                  <h3 className="mb-0 fw-bold text-info">{stats.uniqueUsers}</h3>
                  <small className="text-info">
                    <i className="bi bi-people me-1"></i>
                    Bu hafta
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-person-check text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kullanıcı, aktivite veya IP adresi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Tüm Kullanıcılar</option>
                <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                <option value="Fatma Kaya">Fatma Kaya</option>
                <option value="Ali Özkan">Ali Özkan</option>
                <option value="Mehmet Demir">Mehmet Demir</option>
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
              >
                <option value="">Tüm Aktiviteler</option>
                <option value="Sistem Girişi">Sistem Girişi</option>
                <option value="Zimmet Talebi">Zimmet Talebi</option>
                <option value="Zimmet Onayı">Zimmet Onayı</option>
                <option value="Başarısız Giriş">Başarısız Giriş</option>
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedUser('');
                  setSelectedActivity('');
                  setDateRange('today');
                }}
              >
                <i className="bi bi-x-lg me-1"></i>
                Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium">
              {filteredActivities.length} aktivite bulundu
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
                  <th>Aktivite</th>
                  <th>Açıklama</th>
                  <th>IP Adresi</th>
                  <th>Risk</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <small className="text-muted">
                        {formatTimestamp(activity.timestamp)}
                      </small>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{activity.userName}</div>
                        <small className="text-muted">
                          <span className="badge bg-secondary bg-opacity-25 text-dark">
                            {getRoleDisplayName(activity.userRole)}
                          </span>
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">{activity.activity}</span>
                    </td>
                    <td>
                      <small className="text-muted">{activity.description}</small>
                    </td>
                    <td>
                      <code className="bg-light px-2 py-1 rounded small">{activity.ipAddress}</code>
                    </td>
                    <td>
                      <span className={`badge ${getRiskBadgeColor(activity.riskLevel)} text-uppercase`}>
                        {activity.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeColor(activity.status)}`}>
                        {activity.status}
                      </span>
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
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
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
    </div>
  );
};

export default UserActivitiesPage;