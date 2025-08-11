import React, { useState, useEffect } from 'react';

// API imports - mevcut API yapınızı kullanıyoruz
import { 
  getAllAssets, 
  getFilteredAssets, 
  getAssetStats,
  deleteAsset,
  categoriesApi,
  departmentsApi,
  qrGeneratorApi,
  exportImportApi,
  bulkOperationsApi,
  usersApi,
  type AssetResponse 
} from '../../api/assets/index';

interface Category {
  id: string;
  name: string;
  code: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const AllAssets: React.FC = () => {
  // State management
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AssetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'assetNumber' | 'status' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Data for dropdowns
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, statusFilter, categoryFilter, departmentFilter, sortBy, sortOrder]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAssets(),
        loadCategories(),
        loadDepartments(),
        loadUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      showAlert('Veriler yüklenirken hata oluştu!', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      const data = await getAllAssets();
      setAssets(data);
    } catch (error) {
      console.error('Assets yüklenirken hata:', error);
      showAlert('Assets yüklenemedi!', 'danger');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await departmentsApi.getAll();
      setDepartments(data);
    } catch (error) {
      console.error('Departmanlar yüklenirken hata:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getAssetStats();
      setStats(data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(term) ||
        asset.assetNumber.toLowerCase().includes(term) ||
        asset.serialNumber.toLowerCase().includes(term) ||
        (asset.assignedToName && asset.assignedToName.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(asset => asset.categoryId === categoryFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(asset => asset.departmentId === departmentFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }
      
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? multiplier : aValue < bValue ? -multiplier : 0;
    });

    setFilteredAssets(filtered);
  };

  const handleSort = (field: 'name' | 'assetNumber' | 'status' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = (assetId: string) => {
    setSelectedAssetId(assetId);
    setShowDetailsModal(true);
  };

  const handleEdit = (assetId: string) => {
    setSelectedAssetId(assetId);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAssetId) return;
    
    try {
      await deleteAsset(selectedAssetId);
      await loadAssets(); // Listeyi yenile
      setShowDeleteConfirm(false);
      setSelectedAssetId(null);
      showAlert('Asset başarıyla silindi!', 'success');
    } catch (error) {
      console.error('Asset silinirken hata:', error);
      showAlert('Asset silinirken hata oluştu!', 'danger');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.length === 0) return;
    
    try {
      const result = await bulkOperationsApi.deleteMultiple(selectedAssets);
      await loadAssets(); // Listeyi yenile
      setShowBulkDeleteConfirm(false);
      setSelectedAssets([]);
      
      if (result.success) {
        showAlert(`${result.successCount} asset başarıyla silindi!`, 'success');
      } else {
        showAlert(`${result.successCount} asset silindi, ${result.errorCount} hata oluştu!`, 'warning');
      }
    } catch (error) {
      console.error('Toplu silme hatası:', error);
      showAlert('Toplu silme işlemi başarısız!', 'danger');
    }
  };

  const handleQRCode = (asset: AssetResponse) => {
    qrGeneratorApi.generateQR(asset.id, asset.assetNumber, asset.name);
  };

  const handleExport = async () => {
    try {
      const result = await exportImportApi.exportToCSV(selectedAssets.length > 0 ? selectedAssets : undefined);
      showAlert(`${result.exportedCount} asset başarıyla dışa aktarıldı!`, 'success');
    } catch (error) {
      console.error('Export hatası:', error);
      showAlert('Export işlemi başarısız!', 'danger');
    }
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-success';
      case 'Assigned': return 'bg-primary';
      case 'Maintenance': return 'bg-warning';
      case 'Damaged': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Available': return 'Müsait';
      case 'Assigned': return 'Atanmış';
      case 'Maintenance': return 'Bakımda';
      case 'Damaged': return 'Hasarlı';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const showAlert = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed shadow-lg border-0`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.borderRadius = '12px';
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'danger' ? 'exclamation-triangle-fill' : 'info-circle-fill'} me-2"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentNode) alertDiv.remove();
    }, 4000);
  };

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }}></div>
            <h4 className="text-dark fw-bold mb-2">Assets Yükleniyor...</h4>
            <p className="text-muted">Lütfen bekleyiniz</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet" />
      
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header */}
        <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-3">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-decoration-none text-primary">
                        <i className="bi bi-house-door me-1"></i>
                        Ana Sayfa
                      </a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Tüm Asset'lar</li>
                  </ol>
                </nav>
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                    <i className="bi bi-boxes text-primary fs-4"></i>
                  </div>
                  <div>
                    <h2 className="mb-1 fw-bold text-dark">Asset Yönetimi</h2>
                    <p className="text-muted mb-0">Tüm zimmet kayıtlarını görüntüle ve yönet</p>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={handleExport}
                  className="btn btn-outline-primary shadow-sm"
                  style={{ borderRadius: '6px', padding: '10px 20px' }}
                >
                  <i className="bi bi-download me-2"></i>
                  Dışa Aktar
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary shadow-sm"
                  style={{ borderRadius: '6px', padding: '10px 20px' }}
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Yeni Asset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="row g-4 mb-5">
            <div className="col-md-2">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                    <i className="bi bi-boxes text-primary fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-2 text-primary">{stats.total || assets.length}</h3>
                  <p className="text-muted mb-0 fw-medium">Toplam</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <div className="card-body text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                    <i className="bi bi-check-circle text-success fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-2 text-success">{stats.available || assets.filter(a => a.status === 'Available').length}</h3>
                  <p className="text-muted mb-0 fw-medium">Müsait</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                    <i className="bi bi-person-check text-primary fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-2 text-primary">{stats.assigned || assets.filter(a => a.status === 'Assigned').length}</h3>
                  <p className="text-muted mb-0 fw-medium">Atanmış</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <div className="card-body text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                    <i className="bi bi-tools text-warning fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-2 text-warning">{stats.maintenance || assets.filter(a => a.status === 'Maintenance').length}</h3>
                  <p className="text-muted mb-0 fw-medium">Bakımda</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <div className="card-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                    <i className="bi bi-exclamation-triangle text-danger fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-2 text-danger">{stats.damaged || assets.filter(a => a.status === 'Damaged').length}</h3>
                  <p className="text-muted mb-0 fw-medium">Hasarlı</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
          <div className="card-header border-0 p-4" style={{ backgroundColor: '#ffffff', borderRadius: '8px 8px 0 0' }}>
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <i className="bi bi-funnel text-primary fs-4"></i>
              </div>
              <h4 className="mb-0 fw-bold text-dark">Filtreler</h4>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-search me-2"></i>
                  Asset Ara
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm border-0 bg-light"
                  placeholder="İsim, asset no, seri no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-tags me-2"></i>
                  Kategori
                </label>
                <select
                  className="form-select shadow-sm border-0 bg-light"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                >
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-activity me-2"></i>
                  Durum
                </label>
                <select
                  className="form-select shadow-sm border-0 bg-light"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="Available">Müsait</option>
                  <option value="Assigned">Atanmış</option>
                  <option value="Maintenance">Bakımda</option>
                  <option value="Damaged">Hasarlı</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-building me-2"></i>
                  Departman
                </label>
                <select
                  className="form-select shadow-sm border-0 bg-light"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                >
                  <option value="all">Tüm Departmanlar</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted">
            Toplam <span className="fw-bold text-dark">{filteredAssets.length}</span> asset gösteriliyor
            {searchTerm && (
              <span> • "<span className="fw-bold text-dark">{searchTerm}</span>" için sonuçlar</span>
            )}
            {selectedAssets.length > 0 && (
              <span> • <span className="fw-bold text-primary">{selectedAssets.length}</span> asset seçili</span>
            )}
          </div>
          <div className="d-flex gap-2">
            {selectedAssets.length > 0 && (
              <>
                <button
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className="btn btn-outline-danger btn-sm"
                  style={{ borderRadius: '6px' }}
                >
                  <i className="bi bi-trash me-1"></i>
                  Seçilenleri Sil ({selectedAssets.length})
                </button>
                <button
                  onClick={handleExport}
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderRadius: '6px' }}
                >
                  <i className="bi bi-download me-1"></i>
                  Seçilenleri Dışa Aktar
                </button>
              </>
            )}
            {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || departmentFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setDepartmentFilter('all');
                }}
                className="btn btn-outline-secondary btn-sm"
                style={{ borderRadius: '6px' }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Assets Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
          <div className="card-header border-0 p-4" style={{ backgroundColor: '#ffffff', borderRadius: '8px 8px 0 0' }}>
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <i className="bi bi-list-ul text-primary fs-4"></i>
              </div>
              <h4 className="mb-0 fw-bold text-dark">Asset Listesi</h4>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="text-dark fw-semibold border-0 px-4 py-3" style={{ fontSize: '0.95rem' }}>
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                          onChange={handleSelectAll}
                        />
                        <i className="bi bi-check-square me-2"></i>
                        Seç
                      </div>
                    </th>
                    <th
                      className="text-dark fw-semibold cursor-pointer border-0 px-4 py-3"
                      onClick={() => handleSort('name')}
                      style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-box me-2"></i>
                        Asset Bilgileri
                        {sortBy === 'name' && (
                          <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-2`}></i>
                        )}
                      </div>
                    </th>
                    <th className="text-dark fw-semibold border-0 px-4 py-3" style={{ fontSize: '0.95rem' }}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-tags me-2"></i>
                        Kategori
                      </div>
                    </th>
                    <th className="text-dark fw-semibold border-0 px-4 py-3" style={{ fontSize: '0.95rem' }}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person me-2"></i>
                        Atanan Kişi
                      </div>
                    </th>
                    <th
                      className="text-dark fw-semibold cursor-pointer border-0 px-4 py-3"
                      onClick={() => handleSort('status')}
                      style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-activity me-2"></i>
                        Durum
                        {sortBy === 'status' && (
                          <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-2`}></i>
                        )}
                      </div>
                    </th>
                    <th className="text-dark fw-semibold border-0 px-4 py-3" style={{ fontSize: '0.95rem' }}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-building me-2"></i>
                        Departman
                      </div>
                    </th>
                    <th
                      className="text-dark fw-semibold cursor-pointer border-0 px-4 py-3"
                      onClick={() => handleSort('createdAt')}
                      style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar-check me-2"></i>
                        Tarih
                        {sortBy === 'createdAt' && (
                          <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-2`}></i>
                        )}
                      </div>
                    </th>
                    <th className="text-dark fw-semibold border-0 px-4 py-3" style={{ fontSize: '0.95rem' }}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-gear me-2"></i>
                        İşlemler
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset, index) => (
                    <tr key={asset.id} className="border-0" style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => handleSelectAsset(asset.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-box text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-semibold text-dark" style={{ fontSize: '1.05rem' }}>{asset.name}</div>
                            <div className="text-muted small">
                              <span className="badge bg-light text-dark me-2">{asset.assetNumber}</span>
                              <span className="badge bg-light text-dark">{asset.serialNumber}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        {asset.categoryName ? (
                          <span className="badge bg-purple text-white px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '8px', backgroundColor: '#6f42c1' }}>
                            {asset.categoryName}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-3">
                        {asset.assignedToName ? (
                          <div>
                            <div className="fw-semibold text-dark">{asset.assignedToName}</div>
                            <div className="text-muted small">{asset.assignedToEmployeeNumber}</div>
                          </div>
                        ) : (
                          <span className="text-muted">Atanmamış</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusColor(asset.status)} px-3 py-2 fw-semibold`} style={{ fontSize: '0.9rem', borderRadius: '8px' }}>
                          {getStatusText(asset.status)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        {asset.departmentName ? (
                          <span className="badge bg-info text-white px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '8px' }}>
                            {asset.departmentName}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center text-muted">
                          <i className="bi bi-calendar3 me-2"></i>
                          <span style={{ fontSize: '0.95rem' }}>
                            {asset.updatedAt ? formatDate(asset.updatedAt) : formatDate(asset.createdAt)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleViewDetails(asset.id)}
                            className="btn btn-outline-primary btn-sm shadow-sm"
                            title="Detayları Görüntüle"
                            style={{ borderRadius: '6px', padding: '8px 12px' }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          
                          <button
                            onClick={() => handleQRCode(asset)}
                            className="btn btn-outline-success btn-sm shadow-sm"
                            title="QR Kod"
                            style={{ borderRadius: '6px', padding: '8px 12px' }}
                          >
                            <i className="bi bi-qr-code"></i>
                          </button>
                          
                          <button
                            onClick={() => handleEdit(asset.id)}
                            className="btn btn-outline-warning btn-sm shadow-sm"
                            title="Düzenle"
                            style={{ borderRadius: '6px', padding: '8px 12px' }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedAssetId(asset.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="btn btn-outline-danger btn-sm shadow-sm"
                            title="Sil"
                            style={{ borderRadius: '6px', padding: '8px 12px' }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredAssets.length === 0 && !loading && (
              <div className="text-center py-5">
                <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '400px', borderRadius: '8px' }}>
                  <div className="card-body p-5">
                    <div className="bg-light rounded-circle p-4 mb-4 d-inline-block">
                      <i className="bi bi-inbox fs-1 text-muted"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Asset Bulunamadı</h5>
                    <p className="text-muted mb-4">
                      {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || departmentFilter !== 'all'
                        ? 'Filtreleri değiştirmeyi deneyin veya yeni asset ekleyin'
                        : 'Henüz hiç asset eklenmemiş. İlk asset\'ınızı ekleyin!'
                      }
                    </p>
                    <button
                      className="btn btn-primary shadow-sm"
                      onClick={() => setShowAddModal(true)}
                      style={{ borderRadius: '6px', padding: '10px 20px' }}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Yeni Asset Ekle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Asset Modal */}
        {showAddModal && (
          <AddAssetModal
            onSuccess={() => {
              setShowAddModal(false);
              loadAssets();
              showAlert('Asset başarıyla oluşturuldu!', 'success');
            }}
            onCancel={() => setShowAddModal(false)}
            categories={categories}
            users={users}
          />
        )}

        {/* Asset Details Modal */}
        {showDetailsModal && selectedAssetId && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <div className="modal-header border-0 p-4 bg-primary">
                  <h4 className="modal-title text-white fw-bold mb-0">
                    <i className="bi bi-eye me-3"></i>
                    Asset Detayları
                  </h4>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedAssetId(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center py-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-4 mb-4 d-inline-block">
                      <i className="bi bi-box text-primary fs-1"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Asset Detayları</h5>
                    <p className="text-muted">Asset detayları modalı buraya gelecek</p>
                    <p className="text-sm text-muted mt-2">Asset ID: {selectedAssetId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Asset Modal */}
        {showEditModal && selectedAssetId && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <div className="modal-header border-0 p-4 bg-warning">
                  <h4 className="modal-title text-white fw-bold mb-0">
                    <i className="bi bi-pencil me-3"></i>
                    Asset Düzenle
                  </h4>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAssetId(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center py-4">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-4 mb-4 d-inline-block">
                      <i className="bi bi-pencil text-warning fs-1"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Asset Düzenleme</h5>
                    <p className="text-muted">Asset düzenleme modalı buraya gelecek</p>
                    <p className="text-sm text-muted mt-2">Asset ID: {selectedAssetId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {showBulkDeleteConfirm && selectedAssets.length > 0 && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <div className="modal-header border-0 p-4 bg-danger">
                  <h4 className="modal-title text-white fw-bold mb-0">
                    <i className="bi bi-trash me-3"></i>
                    Toplu Silme İşlemi
                  </h4>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => {
                      setShowBulkDeleteConfirm(false);
                      setSelectedAssets([]);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-4 mb-4 d-inline-block">
                      <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Toplu Silme İşlemini Onayla</h5>
                    <p className="text-muted mb-0">
                      Seçili <strong>{selectedAssets.length}</strong> asset'i kalıcı olarak silmek istediğinizden emin misiniz?
                      <br />
                      <strong>Bu işlem geri alınamaz.</strong>
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 bg-light">
                  <button
                    type="button"
                    className="btn btn-light shadow-sm"
                    onClick={() => {
                      setShowBulkDeleteConfirm(false);
                      setSelectedAssets([]);
                    }}
                    style={{ borderRadius: '6px', padding: '10px 20px' }}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="btn btn-danger shadow-sm"
                    style={{ borderRadius: '6px', padding: '10px 20px' }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    {selectedAssets.length} Asset'i Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteConfirm && selectedAssetId && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <div className="modal-header border-0 p-4 bg-danger">
                  <h4 className="modal-title text-white fw-bold mb-0">
                    <i className="bi bi-trash me-3"></i>
                    Asset'i Sil
                  </h4>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedAssetId(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-4 mb-4 d-inline-block">
                      <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Silme İşlemini Onayla</h5>
                    <p className="text-muted mb-0">
                      Bu asset'i kalıcı olarak silmek istediğinizden emin misiniz? 
                      <br />
                      <strong>Bu işlem geri alınamaz.</strong>
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 bg-light">
                  <button
                    type="button"
                    className="btn btn-light shadow-sm"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedAssetId(null);
                    }}
                    style={{ borderRadius: '6px', padding: '10px 20px' }}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger shadow-sm"
                    style={{ borderRadius: '6px', padding: '10px 20px' }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .cursor-pointer {
            cursor: pointer;
          }
          .cursor-pointer:hover {
            background-color: rgba(0,0,0,0.05) !important;
          }
          .table tbody tr:hover {
            background-color: rgba(13, 110, 253, 0.08) !important;
            transition: all 0.2s ease;
          }
          .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(0,0,0,0.15);
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
        `}</style>
      </div>
    </>
  );
};

// Add Asset Modal Component
interface AddAssetModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  categories: Category[];
  users: any[];
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  onSuccess,
  onCancel,
  categories,
  users
}) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serialNumber: '',
    assetNumber: '',
    categoryId: '',
    brand: '',
    model: '',
    purchaseDate: '',
    purchasePrice: undefined as number | undefined,
    warranty: '',
    location: '',
    assignedUserId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Asset adı gereklidir';
      if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Seri numarası gereklidir';
      if (!formData.assetNumber.trim()) newErrors.assetNumber = 'Asset numarası gereklidir';
      if (!formData.categoryId) newErrors.categoryId = 'Kategori seçimi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-generate asset number
  const generateAssetNumber = () => {
    const prefix = 'AP-';
    const category = categories.find(c => c.id === formData.categoryId);
    const categoryCode = category?.code || 'GEN';
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    setFormData(prev => ({
      ...prev,
      assetNumber: `${prefix}${categoryCode}-${randomNum}`
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      // Backend API'ye uygun veri yapısı
      const assetDto = {
        assetNumber: formData.assetNumber,
        name: formData.name,
        serialNumber: formData.serialNumber,
        categoryId: formData.categoryId,
        status: 'Available',
        description: formData.description || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice,
        warranty: formData.warranty || undefined,
        location: formData.location || undefined,
        assignedUserId: formData.assignedUserId || undefined,
        notes: formData.notes || undefined,
        createdBy: '30549f61-ed08-4867-bce0-b80a64ae7199', // Mevcut user ID
        qrCode: `QR-${formData.assetNumber}`
      };
      
      // Mock API call - gerçek implementasyonda assetsApi.create kullanılacak
      console.log('Creating asset:', assetDto);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Asset oluşturma hatası:', error);
      setErrors({ submit: 'Asset oluşturulamadı. Lütfen bilgileri kontrol edin.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div className="modal-header border-0 p-4 bg-primary">
            <h4 className="modal-title text-white fw-bold mb-0">
              <i className="bi bi-plus-circle me-3"></i>
              Yeni Asset Ekle
            </h4>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>

          {/* Progress Steps */}
          <div className="modal-body p-0">
            <div className="bg-light p-4 border-bottom">
              <div className="d-flex justify-content-center">
                <div className={`text-center me-5 ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{width: '35px', height: '35px'}}>
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div className="small fw-medium">Temel Bilgiler</div>
                </div>
                <div className={`text-center me-5 ${currentStep >= 2 ? 'text-primary' : 'text-muted'}`}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{width: '35px', height: '35px'}}>
                    <i className="bi bi-gear"></i>
                  </div>
                  <div className="small fw-medium">Detay Bilgileri</div>
                </div>
                <div className={`text-center ${currentStep >= 3 ? 'text-primary' : 'text-muted'}`}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{width: '35px', height: '35px'}}>
                    <i className="bi bi-person-check"></i>
                  </div>
                  <div className="small fw-medium">Atama & Onay</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div>
                    <h6 className="mb-3 fw-bold text-primary">
                      <i className="bi bi-info-circle me-2"></i>
                      Temel Bilgiler
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Asset Adı <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Örn: Dell P2422H Monitor 24''"
                          style={{ borderRadius: '6px' }}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Kategori <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                          value={formData.categoryId}
                          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                          style={{ borderRadius: '6px' }}
                        >
                          <option value="">Kategori seçin...</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Seri Numarası <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.serialNumber ? 'is-invalid' : ''}`}
                          value={formData.serialNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                          placeholder="Örn: DM2024001"
                          style={{ borderRadius: '6px' }}
                        />
                        {errors.serialNumber && <div className="invalid-feedback">{errors.serialNumber}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Asset Numarası <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <input
                            type="text"
                            className={`form-control ${errors.assetNumber ? 'is-invalid' : ''}`}
                            value={formData.assetNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, assetNumber: e.target.value }))}
                            placeholder="Örn: AP-COMP-001"
                            style={{ borderRadius: '6px 0 0 6px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={generateAssetNumber}
                            title="Otomatik oluştur"
                            style={{ borderRadius: '0 6px 6px 0' }}
                          >
                            <i className="bi bi-magic"></i>
                          </button>
                        </div>
                        {errors.assetNumber && <div className="invalid-feedback">{errors.assetNumber}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Açıklama</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Asset hakkında detaylı açıklama..."
                          style={{ borderRadius: '6px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Detailed Information */}
                {currentStep === 2 && (
                  <div>
                    <h6 className="mb-3 fw-bold text-primary">
                      <i className="bi bi-gear me-2"></i>
                      Detay Bilgileri
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Marka</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.brand}
                          onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                          placeholder="Örn: Dell"
                          style={{ borderRadius: '6px' }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Model</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.model}
                          onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                          placeholder="Örn: P2422H"
                          style={{ borderRadius: '6px' }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Satın Alma Tarihi</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.purchaseDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                          style={{ borderRadius: '6px' }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Satın Alma Fiyatı</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={formData.purchasePrice || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value ? Number(e.target.value) : undefined }))}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            style={{ borderRadius: '6px 0 0 6px' }}
                          />
                          <span className="input-group-text" style={{ borderRadius: '0 6px 6px 0' }}>₺</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Garanti Süresi</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.warranty}
                          onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                          placeholder="Örn: 3 yıl"
                          style={{ borderRadius: '6px' }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Konum</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Örn: BT Departmanı - 2. Kat"
                          style={{ borderRadius: '6px' }}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Notlar</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Ek notlar ve özel durumlar..."
                          style={{ borderRadius: '6px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Assignment */}
                {currentStep === 3 && (
                  <div>
                    <h6 className="mb-3 fw-bold text-primary">
                      <i className="bi bi-person-check me-2"></i>
                      Atama ve Onay
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Kullanıcıya Ata (Opsiyonel)</label>
                        <select
                          className="form-select"
                          value={formData.assignedUserId}
                          onChange={(e) => setFormData(prev => ({ ...prev, assignedUserId: e.target.value }))}
                          style={{ borderRadius: '6px' }}
                        >
                          <option value="">Şimdilik atama yapma...</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName} ({user.email})
                            </option>
                          ))}
                        </select>
                        <div className="form-text">Asset'i daha sonra da birine atayabilirsiniz.</div>
                      </div>

                      {/* Summary */}
                      <div className="col-12 mt-4">
                        <div className="alert alert-light border" style={{ borderRadius: '8px' }}>
                          <h6 className="alert-heading">
                            <i className="bi bi-clipboard-check me-2"></i>
                            Özet
                          </h6>
                          <hr />
                          <div className="row">
                            <div className="col-md-6">
                              <strong>Asset Adı:</strong> {formData.name}<br />
                              <strong>Seri No:</strong> {formData.serialNumber}<br />
                              <strong>Asset No:</strong> {formData.assetNumber}
                            </div>
                            <div className="col-md-6">
                              <strong>Kategori:</strong> {categories.find(c => c.id === formData.categoryId)?.name}<br />
                              <strong>Marka/Model:</strong> {formData.brand} {formData.model}<br />
                              <strong>Atanan Kişi:</strong> {formData.assignedUserId ? users.find(u => u.id === formData.assignedUserId)?.fullName : 'Atanmamış'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="alert alert-danger mt-3" style={{ borderRadius: '8px' }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.submit}
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 p-4 bg-light">
                <div className="d-flex justify-content-between w-100">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        style={{ borderRadius: '6px' }}
                      >
                        <i className="bi bi-arrow-left me-1"></i>
                        Önceki Adım
                      </button>
                    )}
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-light shadow-sm"
                      onClick={onCancel}
                      style={{ borderRadius: '6px', padding: '10px 20px' }}
                    >
                      <i className="bi bi-x-lg me-2"></i>
                      İptal
                    </button>
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary shadow-sm"
                        onClick={() => {
                          if (validateStep(currentStep)) {
                            setCurrentStep(prev => prev + 1);
                          }
                        }}
                        style={{ borderRadius: '6px', padding: '10px 20px' }}
                      >
                        Sonraki Adım
                        <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success shadow-sm"
                        disabled={loading}
                        style={{ borderRadius: '6px', padding: '10px 20px' }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Oluşturuluyor...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Asset'i Oluştur
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAssets;