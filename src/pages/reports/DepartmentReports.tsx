 import React, { useState, useEffect } from 'react';

const DepartmentReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [reportType, setReportType] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState<{ show: boolean; department: any }>({ show: false, department: null });
  const [showAnalysisModal, setShowAnalysisModal] = useState<{ show: boolean; department: any }>({ show: false, department: null });
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const itemsPerPage = 10;

  const [departments] = useState([
    {
      id: 'it',
      name: 'IT Departmanı',
      totalAssets: 145,
      activeAssets: 138,
      totalValue: 850000,
      employeeCount: 12,
      avgAssetPerEmployee: 12.1,
      utilizationRate: 95.2,
      maintenanceCount: 3,
      pendingRequests: 2,
      categories: {
        'Bilgisayar': 45,
        'Monitör': 38,
        'Telefon': 15,
        'Yazıcı': 8,
        'Aksesuar': 39
      },
      monthlyTrend: [
        { month: 'Oca', assets: 140, requests: 5 },
        { month: 'Şub', assets: 142, requests: 3 },
        { month: 'Mar', assets: 145, requests: 7 }
      ]
    },
    {
      id: 'finance',
      name: 'Finans Departmanı',
      totalAssets: 89,
      activeAssets: 85,
      totalValue: 420000,
      employeeCount: 8,
      avgAssetPerEmployee: 11.1,
      utilizationRate: 95.5,
      maintenanceCount: 1,
      pendingRequests: 1,
      categories: {
        'Bilgisayar': 24,
        'Monitör': 18,
        'Telefon': 8,
        'Yazıcı': 4,
        'Aksesuar': 35
      },
      monthlyTrend: [
        { month: 'Oca', assets: 85, requests: 2 },
        { month: 'Şub', assets: 87, requests: 4 },
        { month: 'Mar', assets: 89, requests: 3 }
      ]
    },
    {
      id: 'hr',
      name: 'İK Departmanı',
      totalAssets: 67,
      activeAssets: 63,
      totalValue: 280000,
      employeeCount: 6,
      avgAssetPerEmployee: 11.2,
      utilizationRate: 94.0,
      maintenanceCount: 2,
      pendingRequests: 3,
      categories: {
        'Bilgisayar': 18,
        'Monitör': 15,
        'Telefon': 6,
        'Yazıcı': 3,
        'Aksesuar': 25
      },
      monthlyTrend: [
        { month: 'Oca', assets: 65, requests: 4 },
        { month: 'Şub', assets: 66, requests: 2 },
        { month: 'Mar', assets: 67, requests: 5 }
      ]
    },
    {
      id: 'sales',
      name: 'Satış Departmanı',
      totalAssets: 124,
      activeAssets: 118,
      totalValue: 650000,
      employeeCount: 15,
      avgAssetPerEmployee: 8.3,
      utilizationRate: 95.2,
      maintenanceCount: 4,
      pendingRequests: 5,
      categories: {
        'Bilgisayar': 30,
        'Monitör': 25,
        'Telefon': 15,
        'Yazıcı': 6,
        'Aksesuar': 48
      },
      monthlyTrend: [
        { month: 'Oca', assets: 120, requests: 8 },
        { month: 'Şub', assets: 122, requests: 6 },
        { month: 'Mar', assets: 124, requests: 9 }
      ]
    },
    {
      id: 'marketing',
      name: 'Pazarlama Departmanı',
      totalAssets: 98,
      activeAssets: 92,
      totalValue: 520000,
      employeeCount: 10,
      avgAssetPerEmployee: 9.8,
      utilizationRate: 93.9,
      maintenanceCount: 3,
      pendingRequests: 2,
      categories: {
        'Bilgisayar': 25,
        'Monitör': 20,
        'Telefon': 10,
        'Yazıcı': 5,
        'Aksesuar': 38
      },
      monthlyTrend: [
        { month: 'Oca', assets: 95, requests: 4 },
        { month: 'Şub', assets: 96, requests: 3 },
        { month: 'Mar', assets: 98, requests: 6 }
      ]
    },
    {
      id: 'operations',
      name: 'Operasyon Departmanı',
      totalAssets: 156,
      activeAssets: 148,
      totalValue: 720000,
      employeeCount: 18,
      avgAssetPerEmployee: 8.7,
      utilizationRate: 94.9,
      maintenanceCount: 5,
      pendingRequests: 4,
      categories: {
        'Bilgisayar': 36,
        'Monitör': 32,
        'Telefon': 18,
        'Yazıcı': 8,
        'Aksesuar': 62
      },
      monthlyTrend: [
        { month: 'Oca', assets: 150, requests: 7 },
        { month: 'Şub', assets: 153, requests: 5 },
        { month: 'Mar', assets: 156, requests: 8 }
      ]
    }
  ]);

  const [overallStats] = useState({
    totalDepartments: 6,
    totalAssets: 679,
    totalValue: 3440000,
    avgUtilization: 94.8,
    totalEmployees: 69,
    avgAssetsPerDept: 113.2,
    totalMaintenance: 18,
    totalPendingRequests: 17
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Filtrelenen departmanlar
  const filteredDepartments = selectedDepartment === 'all' 
    ? departments 
    : departments.filter(dept => dept.id === selectedDepartment);

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(startIndex, startIndex + itemsPerPage);

  const getUtilizationColor = (rate: number) => {
    if (rate >= 95) return 'text-success';
    if (rate >= 90) return 'text-warning';
    return 'text-danger';
  };

  const getUtilizationBadge = (rate: number) => {
    if (rate >= 95) return 'bg-success';
    if (rate >= 90) return 'bg-warning';
    return 'bg-danger';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = () => {
    const reportData = selectedDepartment === 'all' ? departments : filteredDepartments;
    const csvContent = [
      ['Departman', 'Toplam Varlık', 'Aktif Varlık', 'Toplam Değer', 'Çalışan Sayısı', 'Kullanım Oranı', 'Bakım Sayısı', 'Bekleyen Talep'],
      ...reportData.map(dept => [
        dept.name,
        dept.totalAssets,
        dept.activeAssets,
        dept.totalValue,
        dept.employeeCount,
        `${dept.utilizationRate}%`,
        dept.maintenanceCount,
        dept.pendingRequests
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `departman_raporu_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openDetailModal = (department: any) => {
    setShowDetailModal({ show: true, department });
  };

  const closeDetailModal = () => {
    setShowDetailModal({ show: false, department: null });
  };

  const openAnalysisModal = (department: any) => {
    setShowAnalysisModal({ show: true, department });
  };

  const closeAnalysisModal = () => {
    setShowAnalysisModal({ show: false, department: null });
  };

  const openComparisonModal = () => {
    setShowComparisonModal(true);
  };

  const closeComparisonModal = () => {
    setShowComparisonModal(false);
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Departman raporları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📊 Departman Raporları</h4>
          <p className="text-muted mb-0">
            Departman bazında varlık analizi ve performans raporları • {overallStats.totalDepartments} departman
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
          <button 
            className="btn btn-info btn-sm"
            onClick={openComparisonModal}
          >
            <i className="bi bi-bar-chart me-1"></i>
            Karşılaştır
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Toplam Varlık</p>
                  <h3 className="mb-0 fw-bold text-primary">{overallStats.totalAssets.toLocaleString()}</h3>
                  <small className="text-primary">
                    <i className="bi bi-building me-1"></i>
                    {overallStats.totalDepartments} departman
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-boxes text-primary fs-4"></i>
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
                  <p className="text-muted mb-1 small">Toplam Değer</p>
                  <h3 className="mb-0 fw-bold text-success">{formatCurrency(overallStats.totalValue)}</h3>
                  <small className="text-success">
                    <i className="bi bi-currency-exchange me-1"></i>
                    Varlık değeri
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-cash-stack text-success fs-4"></i>
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
                    Tüm departmanlar
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
                  <p className="text-muted mb-1 small">Toplam Çalışan</p>
                  <h3 className="mb-0 fw-bold text-warning">{overallStats.totalEmployees}</h3>
                  <small className="text-warning">
                    <i className="bi bi-people me-1"></i>
                    Aktif personel
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-person-badge text-warning fs-4"></i>
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
            <div className="col-md-3">
              <label className="form-label fw-medium">Departman</label>
              <select 
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Tüm Departmanlar</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Dönem</label>
              <select 
                className="form-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="thisMonth">Bu Ay</option>
                <option value="lastMonth">Geçen Ay</option>
                <option value="thisQuarter">Bu Çeyrek</option>
                <option value="thisYear">Bu Yıl</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Rapor Türü</label>
              <select 
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Genel Bakış</option>
                <option value="detailed">Detaylı Analiz</option>
                <option value="comparison">Karşılaştırma</option>
                <option value="trend">Trend Analizi</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedPeriod('thisMonth');
                  setReportType('overview');
                }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="row g-4 mb-4">
        {paginatedDepartments.map((dept) => (
          <div key={dept.id} className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">{dept.name}</h6>
                  <span className={`badge ${getUtilizationBadge(dept.utilizationRate)}`}>
                    {dept.utilizationRate}% Kullanım
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="mb-0 fw-bold text-primary">{dept.totalAssets}</h4>
                      <small className="text-muted">Toplam Varlık</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="mb-0 fw-bold text-success">{dept.activeAssets}</h4>
                      <small className="text-muted">Aktif Varlık</small>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-4">
                    <div className="text-center">
                      <h6 className="mb-0 fw-bold">{dept.employeeCount}</h6>
                      <small className="text-muted">Çalışan</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <h6 className="mb-0 fw-bold">{dept.maintenanceCount}</h6>
                      <small className="text-muted">Bakım</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <h6 className="mb-0 fw-bold">{dept.pendingRequests}</h6>
                      <small className="text-muted">Bekleyen</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Toplam Değer</small>
                    <small className="fw-medium">{formatCurrency(dept.totalValue)}</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Çalışan Başına</small>
                    <small className="fw-medium">{dept.avgAssetPerEmployee.toFixed(1)} varlık</small>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Kategori Dağılımı</h6>
                  <div className="row g-2">
                    {Object.entries(dept.categories).map(([category, count]) => (
                      <div key={category} className="col-6">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{category}</small>
                          <span className="badge bg-secondary bg-opacity-25 text-dark">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                    onClick={() => openDetailModal(dept)}
                  >
                    <i className="bi bi-eye me-1"></i>
                    Detaylar
                  </button>
                  <button 
                    className="btn btn-outline-info btn-sm flex-grow-1"
                    onClick={() => openAnalysisModal(dept)}
                  >
                    <i className="bi bi-graph-up me-1"></i>
                    Analiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-table me-2"></i>
              Detaylı Departman Listesi
            </h6>
            <small className="text-muted">
              {filteredDepartments.length} departman
            </small>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Departman</th>
                  <th className="text-center">Varlık</th>
                  <th className="text-center">Çalışan</th>
                  <th className="text-center">Kullanım</th>
                  <th className="text-center">Değer</th>
                  <th className="text-center">Bakım</th>
                  <th className="text-center">Talep</th>
                  <th className="text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDepartments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-building text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-medium">{dept.name}</div>
                          <small className="text-muted">{dept.avgAssetPerEmployee.toFixed(1)} varlık/kişi</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="fw-medium">{dept.totalAssets}</div>
                      <small className="text-success">{dept.activeAssets} aktif</small>
                    </td>
                    <td className="text-center">
                      <span className="fw-medium">{dept.employeeCount}</span>
                    </td>
                    <td className="text-center">
                      <span className={`fw-medium ${getUtilizationColor(dept.utilizationRate)}`}>
                        {dept.utilizationRate}%
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="fw-medium">{formatCurrency(dept.totalValue)}</div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${dept.maintenanceCount > 3 ? 'bg-warning' : 'bg-success'}`}>
                        {dept.maintenanceCount}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${dept.pendingRequests > 3 ? 'bg-warning' : 'bg-info'}`}>
                        {dept.pendingRequests}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <button 
                          className="btn btn-outline-primary btn-sm" 
                          title="Detaylar"
                          onClick={() => openDetailModal(dept)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-info btn-sm" 
                          title="Analiz"
                          onClick={() => openAnalysisModal(dept)}
                        >
                          <i className="bi bi-graph-up"></i>
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" title="Rapor">
                          <i className="bi bi-file-earmark-text"></i>
                        </button>
                      </div>
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

      {/* Detail Modal */}
      {showDetailModal.show && showDetailModal.department && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-building me-2"></i>
                  {showDetailModal.department.name} - Detaylı Rapor
                </h5>
                <button type="button" className="btn-close" onClick={closeDetailModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  {/* Genel Bilgiler */}
                  <div className="col-md-4">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          <i className="bi bi-info-circle me-2"></i>
                          Genel Bilgiler
                        </h6>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-2">
                            <strong>Toplam Varlık:</strong> {showDetailModal.department.totalAssets}
                          </li>
                          <li className="mb-2">
                            <strong>Aktif Varlık:</strong> {showDetailModal.department.activeAssets}
                          </li>
                          <li className="mb-2">
                            <strong>Çalışan Sayısı:</strong> {showDetailModal.department.employeeCount}
                          </li>
                          <li className="mb-2">
                            <strong>Kullanım Oranı:</strong> 
                            <span className={`ms-2 fw-bold ${getUtilizationColor(showDetailModal.department.utilizationRate)}`}>
                              {showDetailModal.department.utilizationRate}%
                            </span>
                          </li>
                          <li className="mb-2">
                            <strong>Toplam Değer:</strong> {formatCurrency(showDetailModal.department.totalValue)}
                          </li>
                          <li>
                            <strong>Kişi Başına Varlık:</strong> {showDetailModal.department.avgAssetPerEmployee.toFixed(1)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Kategori Dağılımı */}
                  <div className="col-md-4">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          <i className="bi bi-pie-chart me-2"></i>
                          Kategori Dağılımı
                        </h6>
                        <div className="space-y-3">
                          {Object.entries(showDetailModal.department.categories).map(([category, count]) => {
                            const percentage = ((count as number) / showDetailModal.department.totalAssets * 100).toFixed(1);
                            return (
                              <div key={category} className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-muted">{category}</span>
                                  <span className="fw-bold">{count} ({percentage}%)</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Durum Bilgileri */}
                  <div className="col-md-4">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Durum Bilgileri
                        </h6>
                        <div className="row g-3">
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded">
                              <div>
                                <i className="bi bi-tools text-warning me-2"></i>
                                Bakımdaki Varlık
                              </div>
                              <span className="badge bg-warning">{showDetailModal.department.maintenanceCount}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded">
                              <div>
                                <i className="bi bi-clock text-info me-2"></i>
                                Bekleyen Talep
                              </div>
                              <span className="badge bg-info">{showDetailModal.department.pendingRequests}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded">
                              <div>
                                <i className="bi bi-check-circle text-success me-2"></i>
                                Kullanımdaki Varlık
                              </div>
                              <span className="badge bg-success">{showDetailModal.department.activeAssets}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded">
                              <div>
                                <i className="bi bi-x-circle text-secondary me-2"></i>
                                İnaktif Varlık
                              </div>
                              <span className="badge bg-secondary">
                                {showDetailModal.department.totalAssets - showDetailModal.department.activeAssets}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aylık Trend */}
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          <i className="bi bi-graph-up me-2"></i>
                          Son 3 Ay Trend Analizi
                        </h6>
                        <div className="row g-3">
                          {showDetailModal.department.monthlyTrend.map((month, index) => (
                            <div key={index} className="col-md-4">
                              <div className="text-center p-3 bg-white rounded">
                                <h5 className="mb-1 fw-bold text-primary">{month.month}</h5>
                                <div className="mb-2">
                                  <small className="text-muted d-block">Varlık Sayısı</small>
                                  <span className="fw-bold">{month.assets}</span>
                                </div>
                                <div>
                                  <small className="text-muted d-block">Talep Sayısı</small>
                                  <span className="fw-bold">{month.requests}</span>
                                </div>
                              </div>
                            </div>
                          ))}
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
                <button type="button" className="btn btn-outline-success">
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  Excel
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeDetailModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysisModal.show && showAnalysisModal.department && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-graph-up me-2"></i>
                  {showAnalysisModal.department.name} - Performans Analizi
                </h5>
                <button type="button" className="btn-close" onClick={closeAnalysisModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  {/* Performans Skoru */}
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body text-center">
                        <h6 className="card-title fw-bold">Genel Performans Skoru</h6>
                        <div className="position-relative d-inline-block">
                          <svg width="120" height="120">
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#e9ecef"
                              strokeWidth="10"
                              fill="transparent"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#198754"
                              strokeWidth="10"
                              fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 50}`}
                              strokeDashoffset={`${2 * Math.PI * 50 * (1 - showAnalysisModal.department.utilizationRate / 100)}`}
                              transform="rotate(-90 60 60)"
                            />
                          </svg>
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <h3 className="mb-0 fw-bold text-success">{showAnalysisModal.department.utilizationRate}%</h3>
                          </div>
                        </div>
                        <p className="text-muted mt-2">Kullanım Oranı</p>
                      </div>
                    </div>
                  </div>

                  {/* KPI Metrikleri */}
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">KPI Metrikleri</h6>
                        <div className="space-y-3">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Varlık Verimliliği</span>
                            <div className="text-end">
                              <span className="fw-bold text-success">Yüksek</span>
                              <div className="progress mt-1" style={{ width: '60px', height: '4px' }}>
                                <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Maliyet Etkinliği</span>
                            <div className="text-end">
                              <span className="fw-bold text-primary">Orta</span>
                              <div className="progress mt-1" style={{ width: '60px', height: '4px' }}>
                                <div className="progress-bar bg-primary" style={{ width: '70%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Bakım Performansı</span>
                            <div className="text-end">
                              <span className="fw-bold text-warning">İyileştirilebilir</span>
                              <div className="progress mt-1" style={{ width: '60px', height: '4px' }}>
                                <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Talep Yönetimi</span>
                            <div className="text-end">
                              <span className="fw-bold text-info">İyi</span>
                              <div className="progress mt-1" style={{ width: '60px', height: '4px' }}>
                                <div className="progress-bar bg-info" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Öneriler */}
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          <i className="bi bi-lightbulb me-2"></i>
                          İyileştirme Önerileri
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="alert alert-info mb-2">
                              <i className="bi bi-info-circle me-2"></i>
                              <strong>Varlık Optimizasyonu:</strong> Kullanılmayan varlıkları diğer departmanlara transfer edilebilir.
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="alert alert-warning mb-2">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              <strong>Bakım Planlaması:</strong> Preventif bakım programı geliştirilmeli.
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="alert alert-success mb-2">
                              <i className="bi bi-check-circle me-2"></i>
                              <strong>Maliyet Tasarrufu:</strong> Toplu satın alma ile %15 tasarruf sağlanabilir.
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="alert alert-primary mb-2">
                              <i className="bi bi-graph-up me-2"></i>
                              <strong>Verimlilik:</strong> Çalışan eğitimleri ile kullanım oranı artırılabilir.
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
                  <i className="bi bi-download me-1"></i>
                  Analiz Raporu
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeAnalysisModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-bar-chart me-2"></i>
                  Departman Karşılaştırma Analizi
                </h5>
                <button type="button" className="btn-close" onClick={closeComparisonModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  {/* Top Performanslar */}
                  <div className="col-md-4">
                    <div className="card border-0 bg-success bg-opacity-10">
                      <div className="card-body">
                        <h6 className="card-title fw-bold text-success">
                          <i className="bi bi-trophy me-2"></i>
                          En İyi Performans
                        </h6>
                        <div className="text-center">
                          <h4 className="text-success">Finans Departmanı</h4>
                          <p className="mb-2">%95.5 Kullanım Oranı</p>
                          <span className="badge bg-success">Mükemmel</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 bg-primary bg-opacity-10">
                      <div className="card-body">
                        <h6 className="card-title fw-bold text-primary">
                          <i className="bi bi-cash-stack me-2"></i>
                          En Yüksek Değer
                        </h6>
                        <div className="text-center">
                          <h4 className="text-primary">IT Departmanı</h4>
                          <p className="mb-2">{formatCurrency(850000)}</p>
                          <span className="badge bg-primary">145 Varlık</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 bg-info bg-opacity-10">
                      <div className="card-body">
                        <h6 className="card-title fw-bold text-info">
                          <i className="bi bi-people me-2"></i>
                          En Verimli
                        </h6>
                        <div className="text-center">
                          <h4 className="text-info">İK Departmanı</h4>
                          <p className="mb-2">11.2 Varlık/Kişi</p>
                          <span className="badge bg-info">Optimum</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Karşılaştırma Tablosu */}
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Departman Karşılaştırma Tablosu</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Departman</th>
                                <th className="text-center">Kullanım %</th>
                                <th className="text-center">Varlık/Kişi</th>
                                <th className="text-center">Toplam Değer</th>
                                <th className="text-center">Durum</th>
                              </tr>
                            </thead>
                            <tbody>
                              {departments
                                .sort((a, b) => b.utilizationRate - a.utilizationRate)
                                .map((dept, index) => (
                                <tr key={dept.id}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className={`badge me-2 ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-dark' : 'bg-light text-dark'}`}>
                                        {index + 1}
                                      </span>
                                      {dept.name}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <span className={`fw-bold ${getUtilizationColor(dept.utilizationRate)}`}>
                                      {dept.utilizationRate}%
                                    </span>
                                  </td>
                                  <td className="text-center">{dept.avgAssetPerEmployee.toFixed(1)}</td>
                                  <td className="text-center">{formatCurrency(dept.totalValue)}</td>
                                  <td className="text-center">
                                    <span className={`badge ${getUtilizationBadge(dept.utilizationRate)}`}>
                                      {dept.utilizationRate >= 95 ? 'Mükemmel' : 
                                       dept.utilizationRate >= 90 ? 'İyi' : 'İyileştirilebilir'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grafik Gösterimi */}
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">Kullanım Oranları Dağılımı</h6>
                        <div className="row">
                          {departments.map((dept) => (
                            <div key={dept.id} className="col-md-2 mb-3">
                              <div className="text-center">
                                <small className="text-muted d-block">{dept.name}</small>
                                <div className="position-relative d-inline-block mt-1">
                                  <svg width="40" height="40">
                                    <circle
                                      cx="20"
                                      cy="20"
                                      r="18"
                                      stroke="#e9ecef"
                                      strokeWidth="4"
                                      fill="transparent"
                                    />
                                    <circle
                                      cx="20"
                                      cy="20"
                                      r="18"
                                      stroke={dept.utilizationRate >= 95 ? "#198754" : 
                                             dept.utilizationRate >= 90 ? "#ffc107" : "#dc3545"}
                                      strokeWidth="4"
                                      fill="transparent"
                                      strokeDasharray={`${2 * Math.PI * 18}`}
                                      strokeDashoffset={`${2 * Math.PI * 18 * (1 - dept.utilizationRate / 100)}`}
                                      transform="rotate(-90 20 20)"
                                    />
                                  </svg>
                                  <div className="position-absolute top-50 start-50 translate-middle">
                                    <small className="fw-bold">{dept.utilizationRate}%</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary">
                  <i className="bi bi-printer me-1"></i>
                  Karşılaştırma Raporu
                </button>
                <button type="button" className="btn btn-outline-success">
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  Excel Export
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeComparisonModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .position-relative {
          position: relative !important;
        }
        
        .position-absolute {
          position: absolute !important;
        }
        
        .top-50 {
          top: 50% !important;
        }
        
        .start-50 {
          left: 50% !important;
        }
        
        .translate-middle {
          transform: translate(-50%, -50%) !important;
        }
        
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        
        .modal {
          z-index: 1050;
        }
        
        .modal-backdrop {
          z-index: 1040;
        }
        
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
        
        @media (max-width: 768px) {
          .modal-dialog {
            margin: 0.5rem;
          }
          
          .modal-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DepartmentReportsPage;