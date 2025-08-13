import React, { useState, useEffect } from 'react';

const RoleHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChangeType, setSelectedChangeType] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState<{ show: boolean; change: any }>({ show: false, change: null });
  const itemsPerPage = 15;

  const [permissionChanges] = useState([
    {
      id: 1,
      targetUserId: 'usr_015',
      targetUserName: 'Hakan Yıldız',
      changedBy: 'usr_002',
      changedByName: 'Ali Özkan',
      changedByRole: 'SuperAdmin',
      changeType: 'ROLE_UPGRADE',
      oldRole: 'User',
      newRole: 'departmentAdmin',
      oldPermissions: ['view_assets', 'request_assignment'],
      newPermissions: ['view_assets', 'request_assignment', 'approve_assignments', 'manage_department_users'],
      reason: 'Departman yöneticisi pozisyonuna terfi',
      department: 'IT Departmanı',
      effectiveDate: '2025-08-13T08:30:00Z',
      timestamp: '2025-08-13T08:30:15Z',
      ipAddress: '192.168.1.101',
      status: 'active',
      riskLevel: 'medium',
      approvalRequired: true,
      approvedBy: 'usr_001'
    },
    {
      id: 2,
      targetUserId: 'usr_018',
      targetUserName: 'Selin Kara',
      changedBy: 'usr_007',
      changedByName: 'Mehmet Demir',
      changedByRole: 'departmentAdmin',
      changeType: 'PERMISSION_GRANT',
      oldRole: 'User',
      newRole: 'User',
      oldPermissions: ['view_assets', 'request_assignment'],
      newPermissions: ['view_assets', 'request_assignment', 'view_reports'],
      reason: 'Muhasebe raporlarına erişim yetkisi verildi',
      department: 'Muhasebe Departmanı',
      effectiveDate: '2025-08-13T07:15:00Z',
      timestamp: '2025-08-13T07:15:22Z',
      ipAddress: '192.168.1.112',
      status: 'active',
      riskLevel: 'low',
      approvalRequired: false,
      approvedBy: null
    },
    {
      id: 3,
      targetUserId: 'usr_022',
      targetUserName: 'Burak Çelik',
      changedBy: 'usr_001',
      changedByName: 'Ahmet Yılmaz',
      changedByRole: 'Admin',
      changeType: 'ROLE_DOWNGRADE',
      oldRole: 'departmentAdmin',
      newRole: 'User',
      oldPermissions: ['view_assets', 'request_assignment', 'approve_assignments', 'manage_department_users'],
      newPermissions: ['view_assets', 'request_assignment'],
      reason: 'Departman değişikliği nedeniyle yetki düşürülmesi',
      department: 'İK Departmanı',
      effectiveDate: '2025-08-12T16:45:00Z',
      timestamp: '2025-08-12T16:45:33Z',
      ipAddress: '192.168.1.105',
      status: 'active',
      riskLevel: 'high',
      approvalRequired: true,
      approvedBy: 'usr_002'
    },
    {
      id: 4,
      targetUserId: 'usr_025',
      targetUserName: 'Deniz Akar',
      changedBy: 'usr_002',
      changedByName: 'Ali Özkan',
      changedByRole: 'SuperAdmin',
      changeType: 'ACCOUNT_SUSPENSION',
      oldRole: 'User',
      newRole: 'Suspended',
      oldPermissions: ['view_assets', 'request_assignment'],
      newPermissions: [],
      reason: 'Güvenlik ihlali nedeniyle hesap askıya alındı',
      department: 'Satış Departmanı',
      effectiveDate: '2025-08-12T14:30:00Z',
      timestamp: '2025-08-12T14:30:45Z',
      ipAddress: '192.168.1.101',
      status: 'suspended',
      riskLevel: 'critical',
      approvalRequired: true,
      approvedBy: 'usr_001'
    },
    {
      id: 5,
      targetUserId: 'usr_019',
      targetUserName: 'Cem Yılmaz',
      changedBy: 'usr_007',
      changedByName: 'Mehmet Demir',
      changedByRole: 'departmentAdmin',
      changeType: 'PERMISSION_REVOKE',
      oldRole: 'User',
      newRole: 'User',
      oldPermissions: ['view_assets', 'request_assignment', 'export_reports'],
      newPermissions: ['view_assets', 'request_assignment'],
      reason: 'Rapor dışa aktarma yetkisi kaldırıldı',
      department: 'Pazarlama Departmanı',
      effectiveDate: '2025-08-12T11:20:00Z',
      timestamp: '2025-08-12T11:20:18Z',
      ipAddress: '192.168.1.112',
      status: 'active',
      riskLevel: 'low',
      approvalRequired: false,
      approvedBy: null
    },
    {
      id: 6,
      targetUserId: 'usr_030',
      targetUserName: 'Ayça Demir',
      changedBy: 'usr_001',
      changedByName: 'Ahmet Yılmaz',
      changedByRole: 'Admin',
      changeType: 'BULK_PERMISSION_UPDATE',
      oldRole: 'User',
      newRole: 'User',
      oldPermissions: ['view_assets'],
      newPermissions: ['view_assets', 'request_assignment', 'view_department_assets'],
      reason: 'Toplu yetki güncellemesi - yeni personel standart yetkileri',
      department: 'Finans Departmanı',
      effectiveDate: '2025-08-11T09:00:00Z',
      timestamp: '2025-08-11T09:00:42Z',
      ipAddress: '192.168.1.105',
      status: 'active',
      riskLevel: 'low',
      approvalRequired: false,
      approvedBy: null
    },
    {
      id: 7,
      targetUserId: 'usr_012',
      targetUserName: 'Mustafa Koç',
      changedBy: 'usr_002',
      changedByName: 'Ali Özkan',
      changedByRole: 'SuperAdmin',
      changeType: 'EMERGENCY_ACCESS',
      oldRole: 'User',
      newRole: 'User',
      oldPermissions: ['view_assets', 'request_assignment'],
      newPermissions: ['view_assets', 'request_assignment', 'emergency_access'],
      reason: 'Acil durum erişimi - sistem bakımı için geçici yetki',
      department: 'IT Departmanı',
      effectiveDate: '2025-08-10T22:15:00Z',
      timestamp: '2025-08-10T22:15:30Z',
      ipAddress: '192.168.1.101',
      status: 'expired',
      riskLevel: 'high',
      approvalRequired: true,
      approvedBy: 'usr_001',
      expiryDate: '2025-08-11T06:00:00Z'
    },
    {
      id: 8,
      targetUserId: 'usr_008',
      targetUserName: 'Can Yılmaz',
      changedBy: 'usr_009',
      changedByName: 'Zeynep Acar',
      changedByRole: 'departmentAdmin',
      changeType: 'DEPARTMENT_TRANSFER',
      oldRole: 'User',
      newRole: 'User',
      oldPermissions: ['view_assets', 'request_assignment', 'view_hr_assets'],
      newPermissions: ['view_assets', 'request_assignment', 'view_marketing_assets'],
      reason: 'Departman transferi - İK\'den Pazarlama\'ya geçiş',
      department: 'Pazarlama Departmanı',
      effectiveDate: '2025-08-10T14:30:00Z',
      timestamp: '2025-08-10T14:30:55Z',
      ipAddress: '192.168.1.130',
      status: 'active',
      riskLevel: 'medium',
      approvalRequired: true,
      approvedBy: 'usr_001'
    },
    {
      id: 9,
      targetUserId: 'usr_035',
      targetUserName: 'Kaan Özkan',
      changedBy: 'usr_001',
      changedByName: 'Ahmet Yılmaz',
      changedByRole: 'Admin',
      changeType: 'ACCOUNT_REACTIVATION',
      oldRole: 'Suspended',
      newRole: 'User',
      oldPermissions: [],
      newPermissions: ['view_assets', 'request_assignment'],
      reason: 'Hesap yeniden aktifleştirildi - soruşturma tamamlandı',
      department: 'Operasyon Departmanı',
      effectiveDate: '2025-08-09T10:00:00Z',
      timestamp: '2025-08-09T10:00:25Z',
      ipAddress: '192.168.1.105',
      status: 'active',
      riskLevel: 'medium',
      approvalRequired: true,
      approvedBy: 'usr_002'
    },
    {
      id: 10,
      targetUserId: 'usr_041',
      targetUserName: 'Elif Aydın',
      changedBy: 'usr_002',
      changedByName: 'Ali Özkan',
      changedByRole: 'SuperAdmin',
      changeType: 'ADMIN_PROMOTION',
      oldRole: 'departmentAdmin',
      newRole: 'Admin',
      oldPermissions: ['view_assets', 'request_assignment', 'approve_assignments', 'manage_department_users'],
      newPermissions: ['view_assets', 'request_assignment', 'approve_assignments', 'manage_department_users', 'manage_all_users', 'view_system_logs', 'manage_permissions'],
      reason: 'Sistem yöneticisi pozisyonuna terfi',
      department: 'IT Departmanı',
      effectiveDate: '2025-08-08T08:00:00Z',
      timestamp: '2025-08-08T08:00:12Z',
      ipAddress: '192.168.1.101',
      status: 'active',
      riskLevel: 'critical',
      approvalRequired: true,
      approvedBy: 'CEO'
    }
  ]);

  const [stats] = useState({
    totalChanges: 234,
    thisMonthChanges: 18,
    pendingApprovals: 3,
    riskyCh‌anges: 7,
    roleUpgrades: 12,
    roleDowngrades: 4
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Filtreleme
  const filteredChanges = permissionChanges.filter(change => {
    const matchesSearch = !searchTerm || 
      change.targetUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.changedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChangeType = !selectedChangeType || change.changeType === selectedChangeType;
    const matchesRole = !selectedRole || change.newRole === selectedRole || change.oldRole === selectedRole;
    
    return matchesSearch && matchesChangeType && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChanges = filteredChanges.slice(startIndex, startIndex + itemsPerPage);

  const getChangeTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'ROLE_UPGRADE': return 'bg-success';
      case 'ROLE_DOWNGRADE': return 'bg-warning';
      case 'PERMISSION_GRANT': return 'bg-info';
      case 'PERMISSION_REVOKE': return 'bg-secondary';
      case 'ACCOUNT_SUSPENSION': return 'bg-danger';
      case 'ACCOUNT_REACTIVATION': return 'bg-success';
      case 'EMERGENCY_ACCESS': return 'bg-warning';
      case 'ADMIN_PROMOTION': return 'bg-primary';
      case 'DEPARTMENT_TRANSFER': return 'bg-info';
      case 'BULK_PERMISSION_UPDATE': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getChangeTypeDisplayName = (type: string) => {
    switch (type) {
      case 'ROLE_UPGRADE': return 'Rol Yükseltme';
      case 'ROLE_DOWNGRADE': return 'Rol Düşürme';
      case 'PERMISSION_GRANT': return 'Yetki Verme';
      case 'PERMISSION_REVOKE': return 'Yetki İptal';
      case 'ACCOUNT_SUSPENSION': return 'Hesap Askıya Alma';
      case 'ACCOUNT_REACTIVATION': return 'Hesap Aktifleştirme';
      case 'EMERGENCY_ACCESS': return 'Acil Erişim';
      case 'ADMIN_PROMOTION': return 'Admin Terfi';
      case 'DEPARTMENT_TRANSFER': return 'Departman Transfer';
      case 'BULK_PERMISSION_UPDATE': return 'Toplu Güncelleme';
      default: return type;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-danger';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-info';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getRiskDisplayName = (risk: string) => {
    switch (risk) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return risk;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'suspended': return 'bg-danger';
      case 'expired': return 'bg-secondary';
      case 'pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'suspended': return 'Askıda';
      case 'expired': return 'Süresi Dolmuş';
      case 'pending': return 'Beklemede';
      default: return status;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'Süper Admin';
      case 'Admin': return 'Admin';
      case 'departmentAdmin': return 'Departman Admin';
      case 'User': return 'Kullanıcı';
      case 'Suspended': return 'Askıya Alınmış';
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

  const exportChanges = () => {
    const csvContent = [
      ['Zaman', 'Hedef Kullanıcı', 'Değiştiren', 'Değişiklik Türü', 'Eski Rol', 'Yeni Rol', 'Departman', 'Gerekçe', 'Risk', 'Durum'],
      ...filteredChanges.map(change => [
        formatTimestamp(change.timestamp),
        change.targetUserName,
        change.changedByName,
        getChangeTypeDisplayName(change.changeType),
        getRoleDisplayName(change.oldRole),
        getRoleDisplayName(change.newRole),
        change.department,
        change.reason,
        getRiskDisplayName(change.riskLevel),
        getStatusDisplayName(change.status)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `yetki_degisiklik_gecmisi_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openDetailsModal = (change: any) => {
    setShowDetails({ show: true, change });
  };

  const closeDetailsModal = () => {
    setShowDetails({ show: false, change: null });
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Yetki değişiklik geçmişi yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🔄 Yetki Değişiklik Geçmişi</h4>
          <p className="text-muted mb-0">
            Kullanıcı rol değişiklikleri ve yetki güncellemeleri • {stats.totalChanges} toplam değişiklik
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={exportChanges}
          >
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-shield-check me-1"></i>
            Denetim Raporu
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-primary">{stats.totalChanges}</h5>
              <small className="text-muted">Toplam Değişiklik</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-info">{stats.thisMonthChanges}</h5>
              <small className="text-muted">Bu Ay</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-warning">{stats.pendingApprovals}</h5>
              <small className="text-muted">Bekleyen Onay</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-danger">{stats.riskyCh‌anges}</h5>
              <small className="text-muted">Riskli Değişiklik</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-success">{stats.roleUpgrades}</h5>
              <small className="text-muted">Rol Yükseltme</small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-secondary">{stats.roleDowngrades}</h5>
              <small className="text-muted">Rol Düşürme</small>
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
                  placeholder="Kullanıcı, değiştiren, gerekçe veya departman ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedChangeType}
                onChange={(e) => setSelectedChangeType(e.target.value)}
              >
                <option value="">Tüm Değişiklikler</option>
                <option value="ROLE_UPGRADE">Rol Yükseltme</option>
                <option value="ROLE_DOWNGRADE">Rol Düşürme</option>
                <option value="PERMISSION_GRANT">Yetki Verme</option>
                <option value="PERMISSION_REVOKE">Yetki İptal</option>
                <option value="ACCOUNT_SUSPENSION">Hesap Askıya Alma</option>
                <option value="ADMIN_PROMOTION">Admin Terfi</option>
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Tüm Roller</option>
                <option value="SuperAdmin">Süper Admin</option>
                <option value="Admin">Admin</option>
                <option value="departmentAdmin">Departman Admin</option>
                <option value="User">Kullanıcı</option>
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="quarter">Son 3 Ay</option>
                <option value="year">Bu Yıl</option>
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedChangeType('');
                  setSelectedRole('');
                  setSelectedTimeRange('month');
                }}
              >
                <i className="bi bi-x-lg me-1"></i>
                Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Changes Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium">
              {filteredChanges.length} yetki değişikliği bulundu
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
                  <th>Hedef Kullanıcı</th>
                  <th>Değişiklik</th>
                  <th>Rol Değişimi</th>
                  <th>Değiştiren</th>
                  <th>Gerekçe</th>
                  <th>Risk</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginatedChanges.map((change) => (
                  <tr key={change.id}>
                    <td>
                      <small className="text-muted">
                        {formatTimestamp(change.timestamp)}
                      </small>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{change.targetUserName}</div>
                        <small className="text-muted">{change.department}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getChangeTypeBadgeColor(change.changeType)}`}>
                        {getChangeTypeDisplayName(change.changeType)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <span className="badge bg-secondary bg-opacity-25 text-dark small">
                          {getRoleDisplayName(change.oldRole)}
                        </span>
                        <i className="bi bi-arrow-right text-muted"></i>
                        <span className="badge bg-primary bg-opacity-25 text-dark small">
                          {getRoleDisplayName(change.newRole)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{change.changedByName}</div>
                        <small className="text-muted">{change.changedByRole}</small>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted" title={change.reason}>
                        {change.reason.length > 40 ? change.reason.substring(0, 40) + '...' : change.reason}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${getRiskBadgeColor(change.riskLevel)}`}>
                        {getRiskDisplayName(change.riskLevel)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeColor(change.status)}`}>
                        {getStatusDisplayName(change.status)}
                      </span>
                      {change.approvalRequired && (
                        <div>
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Onaylı
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openDetailsModal(change)}
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
      {showDetails.show && showDetails.change && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Yetki Değişiklik Detayları
                </h5>
                <button type="button" className="btn-close" onClick={closeDetailsModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Hedef Kullanıcı Bilgileri</h6>
                        <ul className="list-unstyled mb-0">
                          <li><strong>Adı:</strong> {showDetails.change.targetUserName}</li>
                          <li><strong>Kullanıcı ID:</strong> {showDetails.change.targetUserId}</li>
                          <li><strong>Departman:</strong> {showDetails.change.department}</li>
                          <li><strong>Eski Rol:</strong> <span className="badge bg-secondary">{getRoleDisplayName(showDetails.change.oldRole)}</span></li>
                          <li><strong>Yeni Rol:</strong> <span className="badge bg-primary">{getRoleDisplayName(showDetails.change.newRole)}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Değişiklik Bilgileri</h6>
                        <ul className="list-unstyled mb-0">
                          <li><strong>Değiştiren:</strong> {showDetails.change.changedByName}</li>
                          <li><strong>Değiştiren Rolü:</strong> {showDetails.change.changedByRole}</li>
                          <li><strong>Değişiklik Türü:</strong> <span className={`badge ${getChangeTypeBadgeColor(showDetails.change.changeType)}`}>{getChangeTypeDisplayName(showDetails.change.changeType)}</span></li>
                          <li><strong>Risk Seviyesi:</strong> <span className={`badge ${getRiskBadgeColor(showDetails.change.riskLevel)}`}>{getRiskDisplayName(showDetails.change.riskLevel)}</span></li>
                          <li><strong>IP Adresi:</strong> <code>{showDetails.change.ipAddress}</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Zaman Bilgileri</h6>
                        <div className="row">
                          <div className="col-md-4">
                            <strong>Değişiklik Zamanı:</strong>
                            <p className="mb-0">{formatTimestamp(showDetails.change.timestamp)}</p>
                          </div>
                          <div className="col-md-4">
                            <strong>Yürürlük Tarihi:</strong>
                            <p className="mb-0">{formatTimestamp(showDetails.change.effectiveDate)}</p>
                          </div>
                          <div className="col-md-4">
                            {showDetails.change.expiryDate && (
                              <>
                                <strong>Son Geçerlilik:</strong>
                                <p className="mb-0">{formatTimestamp(showDetails.change.expiryDate)}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Eski Yetkiler</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {showDetails.change.oldPermissions.map((permission, index) => (
                            <span key={index} className="badge bg-secondary bg-opacity-50 text-dark">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Yeni Yetkiler</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {showDetails.change.newPermissions.map((permission, index) => (
                            <span key={index} className="badge bg-primary bg-opacity-50 text-dark">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Gerekçe</h6>
                        <p className="mb-0">{showDetails.change.reason}</p>
                      </div>
                    </div>
                  </div>

                  {showDetails.change.approvalRequired && (
                    <div className="col-12">
                      <div className="alert alert-success">
                        <i className="bi bi-check-circle me-2"></i>
                        <strong>Onay Durumu:</strong> Bu değişiklik 
                        {showDetails.change.approvedBy && (
                          <span> <strong>{showDetails.change.approvedBy}</strong> tarafından</span>
                        )} onaylanmıştır.
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <strong>Durum:</strong> 
                        <span className={`badge ${getStatusBadgeColor(showDetails.change.status)} ms-2`}>
                          {getStatusDisplayName(showDetails.change.status)}
                        </span>
                      </div>
                      <div>
                        <small className="text-muted">
                          Değişiklik ID: {showDetails.change.id}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary">
                  <i className="bi bi-printer me-1"></i>
                  Yazdır
                </button>
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

export default RoleHistory;