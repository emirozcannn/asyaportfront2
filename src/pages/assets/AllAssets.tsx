import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Asset, AssetFilter } from '../../api/types/assets';
import { assetsApi } from '../../api/assets';
import { categoriesApi } from '../../api/assets/categories';
import { bulkOperationsApi } from '../../api/assets/bulkOperations';


interface AssetFilters {
  search?: string;
  categoryId?: string;
  status?: string;
  assignedUserId?: string;
  location?: string;
  sortBy?: 'name' | 'assetNumber' | 'createdAt' | 'updatedAt' | 'purchaseDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Notification Component
const Toast: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  show: boolean;
  onClose: () => void;
}> = ({ type, message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getToastClass = () => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getToastClass()} alert-dismissible position-fixed`} 
         style={{ top: '20px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
      <div className="d-flex align-items-center">
        <i className={`bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-x-circle' : 'bi-info-circle'} me-2`}></i>
        {message}
        <button type="button" className="btn-close ms-auto" onClick={onClose}></button>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetName?: string;
  isMultiple?: boolean;
  count?: number;
}> = ({ show, onClose, onConfirm, assetName, isMultiple = false, count = 1 }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Silme Onayı
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-3">
              {isMultiple 
                ? `Seçili ${count} asset'i kalıcı olarak silmek istediğinizden emin misiniz?`
                : `"${assetName}" asset'ini kalıcı olarak silmek istediğinizden emin misiniz?`
              }
            </p>
            <div className="alert alert-warning mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Bu işlem geri alınamaz. Tüm ilgili veriler silinecektir.
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              <i className="bi bi-trash me-1"></i>
              {isMultiple ? 'Tümünü Sil' : 'Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllAssets: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'cards'>('table');
  const [operationLoading, setOperationLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    assetId?: string;
    assetName?: string;
    isMultiple?: boolean;
    assetIds?: string[];
  }>({ show: false });
  
  const [filters, setFilters] = useState<AssetFilters>({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
    retired: 0,
    totalValue: 0
  });

  // Show toast notification
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setToast({ show: true, type, message });
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const categoriesData = await categoriesApi.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Categories load failed:', error);
    }
  };

  // Load assets
  const loadAssets = async (newFilters?: AssetFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = { ...filters, ...newFilters };
      
      // API call to get assets
      const assetsData = await assetsApi.getAll(filterParams);
      setAssets(assetsData);
      
      // Calculate basic stats from the data
      const statsData = {
        total: assetsData.length,
        available: assetsData.filter(a => a.status === 'Available').length,
        assigned: assetsData.filter(a => a.status === 'Assigned').length,
        maintenance: assetsData.filter(a => a.status === 'Maintenance').length,
        retired: assetsData.filter(a => a.status === 'Retired').length,
        totalValue: assetsData.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)
      };
      setStats(statsData);
      
      // Set pagination info
      setPagination({
        total: assetsData.length,
        page: filterParams.page || 1,
        limit: filterParams.limit || 20,
        totalPages: Math.ceil(assetsData.length / (filterParams.limit || 20))
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Asset\'lar yüklenemedi';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
    loadCategories();
  }, [filters]);

  // Asset selection
  const handleAssetSelect = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === assets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(assets.map(asset => asset.id));
    }
  };

  // Filter handlers
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: keyof AssetFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Single asset deletion
  const handleDeleteAsset = async (assetId: string, assetName: string) => {
    setDeleteModal({ show: true, assetId, assetName });
  };

  const confirmDeleteAsset = async () => {
    if (!deleteModal.assetId) return;

    try {
      setOperationLoading(true);
      await assetsApi.delete(deleteModal.assetId);
      
      showToast('success', `Asset "${deleteModal.assetName}" başarıyla silindi`);
      await loadAssets();
      setSelectedAssets(prev => prev.filter(id => id !== deleteModal.assetId));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Asset silinirken hata oluştu';
      showToast('error', errorMessage);
    } finally {
      setOperationLoading(false);
      setDeleteModal({ show: false });
    }
  };

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedAssets.length === 0) {
      showToast('warning', 'Lütfen silmek istediğiniz asset(ları) seçin');
      return;
    }
    
    setDeleteModal({ 
      show: true, 
      isMultiple: true, 
      assetIds: selectedAssets 
    });
  };

  const confirmBulkDelete = async () => {
    if (!deleteModal.assetIds || deleteModal.assetIds.length === 0) return;

    try {
      setOperationLoading(true);
      const result = await bulkOperationsApi.bulkDelete(deleteModal.assetIds);
      
      if (result.success) {
        showToast('success', `${result.processedCount} asset başarıyla silindi`);
        await loadAssets();
        setSelectedAssets([]);
      } else {
        showToast('error', `İşlem başarısız: ${result.errorCount} hata`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Toplu silme işlemi sırasında hata oluştu';
      showToast('error', errorMessage);
    } finally {
      setOperationLoading(false);
      setDeleteModal({ show: false });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedAssets.length === 0) {
      showToast('warning', 'Lütfen işlem yapılacak asset(ları) seçin');
      return;
    }
    
    try {
      setOperationLoading(true);
      let result;
      
      switch (action) {
        case 'bulk_transfer':
          navigate(`/dashboard/assets/bulk-operations?operation=transfer&assets=${selectedAssets.join(',')}`);
          return;
          
        case 'bulk_assign':
          navigate(`/dashboard/assets/bulk-operations?operation=assign&assets=${selectedAssets.join(',')}`);
          return;
          
        case 'bulk_maintenance':
          result = await bulkOperationsApi.bulkUpdateStatus(selectedAssets, 'Maintenance');
          showToast('success', `${result.processedCount} asset bakıma alındı`);
          break;
          
        case 'bulk_available':
          result = await bulkOperationsApi.bulkUpdateStatus(selectedAssets, 'Available');
          showToast('success', `${result.processedCount} asset müsait duruma getirildi`);
          break;
          
        case 'bulk_delete':
          handleBulkDelete();
          return;
          
        default:
          console.log('Unknown bulk action:', action);
          return;
      }
      
      await loadAssets();
      setSelectedAssets([]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Toplu işlem sırasında hata oluştu';
      showToast('error', errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Quick actions
  const handleQuickAssign = (assetId: string) => {
    navigate(`/dashboard/assets/transfer?assetId=${assetId}`);
  };

  const handleQRGenerate = (assetId: string) => {
    navigate(`/dashboard/assets/qr-generator?assetId=${assetId}`);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return { bg: 'bg-success', text: 'Müsait' };
      case 'Assigned': return { bg: 'bg-primary', text: 'Atanmış' };
      case 'Maintenance': return { bg: 'bg-warning', text: 'Bakımda' };
      case 'Retired': return { bg: 'bg-secondary', text: 'Emekli' };
      default: return { bg: 'bg-secondary', text: status };
    }
  };

  // Export functionality
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log('Exporting assets in format:', format);
    // API call will be here
    // exportAssets(filters, format);
  };

  return (
    <div className="container-fluid p-4">
      {/* Toast Notifications */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false })}
        onConfirm={deleteModal.isMultiple ? confirmBulkDelete : confirmDeleteAsset}
        assetName={deleteModal.assetName}
        isMultiple={deleteModal.isMultiple}
        count={deleteModal.assetIds?.length}
      />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📦 Tüm Asset'lar</h4>
          <p className="text-muted mb-0">Tüm zimmet kayıtlarını görüntüle ve yönet</p>
        </div>
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button className="btn btn-outline-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
              <i className="bi bi-download me-1"></i>
              Dışa Aktar
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => handleExport('excel')}>
                <i className="bi bi-file-earmark-excel me-2"></i>Excel
              </button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('csv')}>
                <i className="bi bi-file-earmark-text me-2"></i>CSV
              </button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('pdf')}>
                <i className="bi bi-file-earmark-pdf me-2"></i>PDF
              </button></li>
            </ul>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/dashboard/assets/add')}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Yeni Asset
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-flex mb-2">
                <i className="bi bi-boxes text-primary"></i>
              </div>
              <h5 className="fw-bold mb-1">{stats.total.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Toplam</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-flex mb-2">
                <i className="bi bi-check-circle text-success"></i>
              </div>
              <h5 className="fw-bold mb-1">{stats.available.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Müsait</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-flex mb-2">
                <i className="bi bi-person-check text-info"></i>
              </div>
              <h5 className="fw-bold mb-1">{stats.assigned.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Atanmış</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="bg-warning bg-opacity-10 rounded-circle p-2 d-inline-flex mb-2">
                <i className="bi bi-tools text-warning"></i>
              </div>
              <h5 className="fw-bold mb-1">{stats.maintenance.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Bakımda</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-2 d-inline-flex mb-2">
                <i className="bi bi-archive text-secondary"></i>
              </div>
              <h5 className="fw-bold mb-1">{stats.retired.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Emekli</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-flex mb-2">
                <i className="bi bi-currency-dollar text-success"></i>
              </div>
              <h5 className="fw-bold mb-1">₺{stats.totalValue.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Toplam Değer</p>
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
                  placeholder="Asset ara (isim, asset no, seri no)..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="Available">Müsait</option>
                <option value="Assigned">Atanmış</option>
                <option value="Maintenance">Bakımda</option>
                <option value="Retired">Emekli</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">Tüm Konumlar</option>
                <option value="it_dept">BT Departmanı</option>
                <option value="hr_dept">İK Departmanı</option>
                <option value="ops_dept">Operasyon</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
                }}
              >
                <option value="createdAt-desc">En Yeni</option>
                <option value="createdAt-asc">En Eski</option>
                <option value="name-asc">İsim (A-Z)</option>
                <option value="name-desc">İsim (Z-A)</option>
                <option value="assetNumber-asc">Asset No (A-Z)</option>
                <option value="updatedAt-desc">Son Güncelleme</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode & Bulk Actions */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedAssets.length === assets.length && assets.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          <span className="fw-medium me-3">
            {pagination.total} asset {selectedAssets.length > 0 && `(${selectedAssets.length} seçili)`}
          </span>
          
          {selectedAssets.length > 0 && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleBulkAction('bulk_assign')}
                disabled={operationLoading}
              >
                <i className="bi bi-person-plus me-1"></i>
                Toplu Ata
              </button>
              <button
                className="btn btn-outline-info btn-sm"
                onClick={() => handleBulkAction('bulk_transfer')}
                disabled={operationLoading}
              >
                <i className="bi bi-arrow-right-circle me-1"></i>
                Toplu Transfer
              </button>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => handleBulkAction('bulk_maintenance')}
                disabled={operationLoading}
              >
                {operationLoading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="bi bi-tools me-1"></i>
                )}
                Bakıma Al
              </button>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => handleBulkAction('bulk_available')}
                disabled={operationLoading}
              >
                <i className="bi bi-check-circle me-1"></i>
                Müsait Yap
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleBulkAction('bulk_delete')}
                disabled={operationLoading}
              >
                <i className="bi bi-trash me-1"></i>
                Sil
              </button>
            </div>
          )}
        </div>

        <div className="btn-group">
          <button
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('table')}
          >
            <i className="bi bi-table"></i>
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="bi bi-grid"></i>
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('cards')}
          >
            <i className="bi bi-card-list"></i>
          </button>
        </div>
      </div>

      {/* Assets Display */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Asset'lar yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <div className="text-danger mb-3">
            <i className="bi bi-exclamation-triangle fs-1"></i>
          </div>
          <h6 className="text-danger">Hata!</h6>
          <p className="text-muted">{error}</p>
          <button className="btn btn-outline-primary btn-sm" onClick={() => loadAssets()}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Tekrar Dene
          </button>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <i className="bi bi-inbox fs-1"></i>
          </div>
          <h6 className="text-muted">Asset Bulunamadı</h6>
          <p className="text-muted">Arama kriterlerinizi değiştirip tekrar deneyin</p>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/dashboard/assets/add')}
          >
            <i className="bi bi-plus-circle me-1"></i>
            İlk Asset'i Ekle
          </button>
        </div>
      ) : (
        <>
          {/* Table View */}
          {viewMode === 'table' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th 
                          className="cursor-pointer"
                          onClick={() => handleSortChange('name')}
                        >
                          Asset Bilgileri
                          {filters.sortBy === 'name' && (
                            <i className={`bi bi-chevron-${filters.sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                          )}
                        </th>
                        <th>Kategori</th>
                        <th>Atanan Kişi</th>
                        <th>Durum</th>
                        <th>Konum</th>
                        <th>Değer</th>
                        <th 
                          className="cursor-pointer"
                          onClick={() => handleSortChange('updatedAt')}
                        >
                          Son Güncelleme
                          {filters.sortBy === 'updatedAt' && (
                            <i className={`bi bi-chevron-${filters.sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                          )}
                        </th>
                        <th style={{ width: '120px' }}>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset) => {
                        const statusBadge = getStatusBadge(asset.status);
                        return (
                          <tr key={asset.id}>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedAssets.includes(asset.id)}
                                  onChange={() => handleAssetSelect(asset.id)}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded p-2 me-3 flex-shrink-0"
                                  style={{ 
                                    backgroundColor: `${asset.category?.color || '#6c757d'}20`, 
                                    color: asset.category?.color || '#6c757d' 
                                  }}
                                >
                                  <i className={`${asset.category?.icon || 'bi bi-box'}`}></i>
                                </div>
                                <div>
                                  <div className="fw-medium">{asset.name}</div>
                                  <div className="small text-muted">
                                    {asset.assetNumber} • {asset.serialNumber}
                                  </div>
                                  {asset.brand && asset.model && (
                                    <div className="small text-muted">
                                      {asset.brand} {asset.model}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {asset.category?.name || 'Kategori Yok'}
                              </span>
                            </td>
                            <td>
                              {asset.currentUser ? (
                                <div>
                                  <div className="fw-medium small">{asset.currentUser.fullName}</div>
                                  <div className="text-muted small">{asset.currentUser.department}</div>
                                </div>
                              ) : (
                                <span className="text-muted small">Atanmamış</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${statusBadge.bg}`}>
                                {statusBadge.text}
                              </span>
                            </td>
                            <td>
                              <span className="small text-muted">{asset.location || '-'}</span>
                            </td>
                            <td>
                              <span className="small text-muted">
                                {asset.purchasePrice ? `₺${asset.purchasePrice.toLocaleString()}` : '-'}
                              </span>
                            </td>
                            <td>
                              <span className="small text-muted">
                                {asset.updatedAt ? new Date(asset.updatedAt).toLocaleDateString('tr-TR') : '-'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => navigate(`/dashboard/assets/${asset.id}`)}
                                  title="Detaylar"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleQRGenerate(asset.id)}
                                  title="QR Kod"
                                >
                                  <i className="bi bi-qr-code"></i>
                                </button>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bi bi-three-dots"></i>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => navigate(`/dashboard/assets/${asset.id}/edit`)}
                                      >
                                        <i className="bi bi-pencil me-2"></i>Düzenle
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleQuickAssign(asset.id)}
                                      >
                                        <i className="bi bi-person-plus me-2"></i>
                                        {asset.currentUser ? 'Transfer Et' : 'Ata'}
                                      </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                      <button 
                                        className="dropdown-item text-danger"
                                        onClick={() => handleDeleteAsset(asset.id, asset.name)}
                                        disabled={operationLoading}
                                      >
                                        <i className="bi bi-trash me-2"></i>Sil
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="row g-3">
              {assets.map((asset) => {
                const statusBadge = getStatusBadge(asset.status);
                return (
                  <div key={asset.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedAssets.includes(asset.id)}
                              onChange={() => handleAssetSelect(asset.id)}
                            />
                          </div>
                          <span className={`badge ${statusBadge.bg}`}>
                            {statusBadge.text}
                          </span>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                          <div 
                            className="rounded p-2 me-3"
                            style={{ 
                              backgroundColor: `${asset.category?.color || '#6c757d'}20`, 
                              color: asset.category?.color || '#6c757d' 
                            }}
                          >
                            <i className={`${asset.category?.icon || 'bi bi-box'} fs-5`}></i>
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-bold mb-1 text-truncate">{asset.name}</h6>
                            <p className="text-muted small mb-0">{asset.category?.name || 'Kategori Yok'}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="small text-muted mb-1">
                            <strong>Asset No:</strong> {asset.assetNumber}
                          </div>
                          <div className="small text-muted mb-1">
                            <strong>Seri No:</strong> {asset.serialNumber}
                          </div>
                          {asset.currentUser && (
                            <div className="small text-muted">
                              <strong>Atanan:</strong> {asset.currentUser.fullName}
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {asset.purchasePrice && (
                              <small className="text-success fw-medium">
                                ₺{asset.purchasePrice.toLocaleString()}
                              </small>
                            )}
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="bi bi-three-dots"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/dashboard/assets/${asset.id}`)}
                                >
                                  <i className="bi bi-eye me-2"></i>Detaylar
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/dashboard/assets/${asset.id}/edit`)}
                                >
                                  <i className="bi bi-pencil me-2"></i>Düzenle
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleQRGenerate(asset.id)}
                                >
                                  <i className="bi bi-qr-code me-2"></i>QR Kod
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleQuickAssign(asset.id)}
                                >
                                  <i className="bi bi-person-plus me-2"></i>
                                  {asset.currentUser ? 'Transfer Et' : 'Ata'}
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteAsset(asset.id, asset.name)}
                                  disabled={operationLoading}
                                >
                                  <i className="bi bi-trash me-2"></i>Sil
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="row g-3">
              {assets.map((asset) => {
                const statusBadge = getStatusBadge(asset.status);
                return (
                  <div key={asset.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-1">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedAssets.includes(asset.id)}
                                onChange={() => handleAssetSelect(asset.id)}
                              />
                            </div>
                          </div>
                          <div className="col-md-1">
                            <div 
                              className="rounded p-3 text-center"
                              style={{ 
                                backgroundColor: `${asset.category?.color || '#6c757d'}20`, 
                                color: asset.category?.color || '#6c757d' 
                              }}
                            >
                              <i className={`${asset.category?.icon || 'bi bi-box'} fs-4`}></i>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div>
                              <h6 className="fw-bold mb-1">{asset.name}</h6>
                              <p className="text-muted small mb-1">{asset.category?.name || 'Kategori Yok'}</p>
                              <p className="text-muted small mb-0">
                                {asset.assetNumber} • {asset.serialNumber}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-2">
                            {asset.currentUser ? (
                              <div>
                                <div className="fw-medium small">{asset.currentUser.fullName}</div>
                                <div className="text-muted small">{asset.currentUser.department}</div>
                              </div>
                            ) : (
                              <span className="text-muted small">Atanmamış</span>
                            )}
                          </div>
                          <div className="col-md-1">
                            <span className={`badge ${statusBadge.bg}`}>
                              {statusBadge.text}
                            </span>
                          </div>
                          <div className="col-md-2">
                            <div className="small text-muted">
                              <div><strong>Konum:</strong> {asset.location || '-'}</div>
                              <div><strong>Değer:</strong> {asset.purchasePrice ? `₺${asset.purchasePrice.toLocaleString()}` : '-'}</div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="d-flex gap-1 justify-content-end">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => navigate(`/dashboard/assets/${asset.id}`)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleQRGenerate(asset.id)}
                              >
                                <i className="bi bi-qr-code"></i>
                              </button>
                              <div className="dropdown">
                                <button
                                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bi bi-three-dots"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => navigate(`/dashboard/assets/${asset.id}/edit`)}
                                    >
                                      <i className="bi bi-pencil me-2"></i>Düzenle
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleQuickAssign(asset.id)}
                                    >
                                      <i className="bi bi-person-plus me-2"></i>
                                      {asset.currentUser ? 'Transfer Et' : 'Ata'}
                                    </button>
                                  </li>
                                  <li><hr className="dropdown-divider" /></li>
                                  <li>
                                    <button 
                                      className="dropdown-item text-danger"
                                      onClick={() => handleDeleteAsset(asset.id, asset.name)}
                                      disabled={operationLoading}
                                    >
                                      <i className="bi bi-trash me-2"></i>Sil
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
                    Sayfa {pagination.page} / {pagination.totalPages} 
                    ({pagination.total} kayıttan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor)
                  </div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      })}

                      <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllAssets;