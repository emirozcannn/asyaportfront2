import React, { useState, useEffect } from 'react';

const UserReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState<{ show: boolean; user: any }>({ show: false, user: null });
  const itemsPerPage = 12;

  // Kullanıcı verileri
  const [users] = useState([
    {
      id: 'usr_001',
      fullName: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@asyaport.com',
      role: 'Admin',
      department: 'IT Departmanı',
      employeeNumber: 'EMP001',
      totalAssets: 8,
      activeAssets: 7,
      totalValue: 45000,
      utilizationRate: 92.5,
      lastActivity: '2025-08-13T09:15:00Z',
      performanceScore: 88,
      requestCount: 3,
      returnCount: 1
    },
    {
      id: 'usr_002',
      fullName: 'Fatma Kaya',
      email: 'fatma.kaya@asyaport.com',
      role: 'User',
      department: 'Finans Departmanı',
      employeeNumber: 'EMP002',
      totalAssets: 5,
      activeAssets: 5,
      totalValue: 28000,
      utilizationRate: 95.8,
      lastActivity: '2025-08-13T08:45:00Z',
      performanceScore: 94,
      requestCount: 2,
      returnCount: 0
    },
    {
      id: 'usr_003',
      fullName: 'Mehmet Demir',
      email: 'mehmet.demir@asyaport.com',
      role: 'departmentAdmin',
      department: 'İK Departmanı',
      employeeNumber: 'EMP003',
      totalAssets: 6,
      activeAssets: 6,
      totalValue: 35000,
      utilizationRate: 89.2,
      lastActivity: '2025-08-13T07:30:00Z',
      performanceScore: 86,
      requestCount: 4,
      returnCount: 2
    },
    {
      id: 'usr_004',
      fullName: 'Ayşe Çelik',
      email: 'ayse.celik@asyaport.com',
      role: 'User',
      department: 'Satış Departmanı',
      employeeNumber: 'EMP004',
      totalAssets: 7,
      activeAssets: 6,
      totalValue: 42000,
      utilizationRate: 91.7,
      lastActivity: '2025-08-12T16:20:00Z',
      performanceScore: 90,
      requestCount: 5,
      returnCount: 1
    },
    {
      id: 'usr_005',
      fullName: 'Can Özkan',
      email: 'can.ozkan@asyaport.com',
      role: 'User',
      department: 'Pazarlama Departmanı',
      employeeNumber: 'EMP005',
      totalAssets: 4,
      activeAssets: 4,
      totalValue: 22000,
      utilizationRate: 87.3,
      lastActivity: '2025-08-12T14:15:00Z',
      performanceScore: 84,
      requestCount: 2,
      returnCount: 0
    },
    {
      id: 'usr_006',
      fullName: 'Zeynep Acar',
      email: 'zeynep.acar@asyaport.com',
      role: 'departmentAdmin',
      department: 'Operasyon Departmanı',
      employeeNumber: 'EMP006',
      totalAssets: 9,
      activeAssets: 8,
      totalValue: 52000,
      utilizationRate: 94.1,
      lastActivity: '2025-08-13T10:30:00Z',
      performanceScore: 92,
      requestCount: 6,
      returnCount: 3
    }
  ]);

  // Genel istatistikler
  const [overallStats] = useState({
    totalUsers: 156,
    activeUsers: 142,
    totalAssetsAssigned: 456,
    avgUtilization: 91.7,
    totalValue: 2840000,
    pendingRequests: 23
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Filtreleme
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Yardımcı fonksiyonlar
  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return 'bg-success';
    if (score >= 80) return 'bg-info';
    if (score >= 70) return 'bg-warning';
    return 'bg-danger';
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'Admin': return 'Admin';
      case 'departmentAdmin': return 'Departman Admin';
      case 'User': return 'Kullanıcı';
      default: return role;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportReport = () => {
    const csvContent = [
      ['Ad Soyad', 'Email', 'Departman', 'Rol', 'Toplam Varlık', 'Performans Skoru', 'Kullanım Oranı'],
      ...filteredUsers.map(user => [
        user.fullName,
        user.email,
        user.department,
        getRoleDisplayName(user.role),
        user.totalAssets,
        user.performanceScore,
        `${user.utilizationRate}%`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kullanici_raporu_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openDetailModal = (user: any) => {
    setShowDetailModal({ show: true, user });
  };

  const closeDetailModal = () => {
    setShowDetailModal({ show: false, user: null });
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Kullanıcı raporları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">👥 Kullanıcı Raporları</h4>
          <p className="text-muted mb-0">
            Kullanıcı bazında varlık analizi ve performans raporları • {overallStats.totalUsers} kullanıcı
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={exportReport}
          >
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-file-earmark-pdf me-1"></i>
            PDF Rapor
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
                  <p className="text-muted mb-1 small">Toplam Kullanıcı</p>
                  <h3 className="mb-0 fw-bold text-primary">{overallStats.totalUsers}</h3>
                  <small className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    {overallStats.activeUsers} aktif
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-people text-primary fs-4"></i>
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
                  <p className="text-muted mb-1 small">Atanan Varlık</p>
                  <h3 className="mb-0 fw-bold text-success">{overallStats.totalAssetsAssigned}</h3>
                  <small className="text-success">
                    <i className="bi bi-box-seam me-1"></i>
                    Toplam zimmet
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-laptop text-success fs-4"></i>
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
                  <p className="text-muted mb-1 small">Ortalama Kullanım</p>
                  <h3 className="mb-0 fw-bold text-info">{overallStats.avgUtilization}%</h3>
                  <small className="text-info">
                    <i className="bi bi-graph-up me-1"></i>
                    Tüm kullanıcılar
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-speedometer2 text-info fs-4"></i>
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
                  <p className="text-muted mb-1 small">Bekleyen Talep</p>
                  <h3 className="mb-0 fw-bold text-warning">{overallStats.pendingRequests}</h3>
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

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-medium">Kullanıcı Ara</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="İsim, email veya personel no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Departman</label>
              <select 
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Tüm Departmanlar</option>
                <option value="IT Departmanı">IT Departmanı</option>
                <option value="Finans Departmanı">Finans Departmanı</option>
                <option value="İK Departmanı">İK Departmanı</option>
                <option value="Satış Departmanı">Satış Departmanı</option>
                <option value="Pazarlama Departmanı">Pazarlama Departmanı</option>
                <option value="Operasyon Departmanı">Operasyon Departmanı</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-medium">Rol</label>
              <select 
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Tüm Roller</option>
                <option value="Admin">Admin</option>
                <option value="departmentAdmin">Departman Admin</option>
                <option value="User">Kullanıcı</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('all');
                  setSelectedRole('all');
                }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Cards */}
      <div className="row g-4 mb-4">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-person text-primary fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{user.fullName}</h6>
                      <small className="text-muted">{user.employeeNumber}</small>
                    </div>
                  </div>
                  <span className={`badge ${getPerformanceBadge(user.performanceScore)}`}>
                    {user.performanceScore}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <div className="text-center">
                      <h5 className="mb-0 fw-bold text-primary">{user.totalAssets}</h5>
                      <small className="text-muted">Toplam Varlık</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h5 className="mb-0 fw-bold text-success">{user.activeAssets}</h5>
                      <small className="text-muted">Aktif Varlık</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Departman</small>
                    <small className="fw-medium">{user.department}</small>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Rol</small>
                    <span className="badge bg-secondary bg-opacity-25 text-dark">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Kullanım Oranı</small>
                    <span className="fw-bold text-info">{user.utilizationRate}%</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Toplam Değer</small>
                    <small className="fw-medium">{formatCurrency(user.totalValue)}</small>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <small className="text-primary fw-bold d-block">{user.requestCount}</small>
                        <small className="text-muted">Talep</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <small className="text-info fw-bold d-block">{user.returnCount}</small>
                        <small className="text-muted">İade</small>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-sm w-100"
                  onClick={() => openDetailModal(user)}
                >
                  <i className="bi bi-eye me-1"></i>
                  Detayları Görüntüle
                </button>
              </div>
              <div className="card-footer bg-transparent border-0 pt-0">
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  Son aktivite: {formatDateTime(user.lastActivity)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination">
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

      {/* Detail Modal */}
      {showDetailModal.show && showDetailModal.user && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person me-2"></i>
                  {showDetailModal.user.fullName} - Kullanıcı Detayları
                </h5>
                <button type="button" className="btn-close" onClick={closeDetailModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Genel Bilgiler</h6>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-2">
                            <strong>Email:</strong> {showDetailModal.user.email}
                          </li>
                          <li className="mb-2">
                            <strong>Personel No:</strong> {showDetailModal.user.employeeNumber}
                          </li>
                          <li className="mb-2">
                            <strong>Departman:</strong> {showDetailModal.user.department}
                          </li>
                          <li className="mb-2">
                            <strong>Rol:</strong> {getRoleDisplayName(showDetailModal.user.role)}
                          </li>
                          <li>
                            <strong>Son Aktivite:</strong> {formatDateTime(showDetailModal.user.lastActivity)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Varlık Bilgileri</h6>
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <div className="text-center p-2 bg-white rounded">
                              <h5 className="mb-0 fw-bold text-primary">{showDetailModal.user.totalAssets}</h5>
                              <small className="text-muted">Toplam</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-2 bg-white rounded">
                              <h5 className="mb-0 fw-bold text-success">{showDetailModal.user.activeAssets}</h5>
                              <small className="text-muted">Aktif</small>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>Kullanım Oranı</small>
                            <span className="fw-bold text-info">{showDetailModal.user.utilizationRate}%</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-info"
                              style={{ width: `${showDetailModal.user.utilizationRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <strong>Toplam Değer:</strong> {formatCurrency(showDetailModal.user.totalValue)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Performans Metrikleri</h6>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <div className="text-center p-3 bg-white rounded">
                              <h4 className="mb-0 fw-bold text-primary">{showDetailModal.user.performanceScore}</h4>
                              <small className="text-muted">Performans Skoru</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-3 bg-white rounded">
                              <h4 className="mb-0 fw-bold text-info">{showDetailModal.user.utilizationRate}%</h4>
                              <small className="text-muted">Kullanım Oranı</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-3 bg-white rounded">
                              <h4 className="mb-0 fw-bold text-success">{showDetailModal.user.requestCount}</h4>
                              <small className="text-muted">Toplam Talep</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-3 bg-white rounded">
                              <h4 className="mb-0 fw-bold text-warning">{showDetailModal.user.returnCount}</h4>
                              <small className="text-muted">İade Sayısı</small>
                            </div>
                          </div>
                        </div>
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
                <button type="button" className="btn btn-secondary" onClick={closeDetailModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .btn {
          transition: all 0.2s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem !important;
          }
          
          .modal-dialog {
            margin: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserReports;