import React, { useState, useEffect } from 'react';
import type { Asset } from '../../types/Asset';
import { useNavigate } from 'react-router-dom';

// API imports
import { 
  getAllAssets, 
  createAsset,
  updateAsset,
  qrGeneratorApi,
  assetsApi
} from '../../api/assets/index';

import { categoriesApi } from '../../api/categories';
import { departmentsApi } from '../../api/departments';
import { getAllUsers } from '../../api/users/getAllUsers';
import { getAssetStats } from '../../api/assetHelpers';

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
  const navigate = useNavigate();

  // State management
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal states
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        loadAssets(),
        loadCategories(),
        loadDepartments(),
        loadUsers()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    const data = await getAllAssets();
    const typedAssets: Asset[] = data.map(asset => ({
      ...asset,
      status: asset.status as 'Available' | 'Assigned'
    }));
    setAssets(typedAssets);
  };

  const loadCategories = async () => {
    const data = await categoriesApi.getAll();
    setCategories(data);
  };

  const loadDepartments = async () => {
    const data = await departmentsApi.getAll();
    setDepartments(data);
  };

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  // Client-side filtreleme
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchTerm || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    const matchesCategory = !categoryFilter || asset.categoryId === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length && filteredAssets.length > 0) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
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

  const handleQRCode = async (asset: Asset) => {
    try {
      navigate(`/dashboard/assets/qr-generator/${asset.id}`, {
        state: {
          assetId: asset.id,
          assetNumber: asset.assetNumber,
          name: asset.name
        }
      });
    } catch (error) {
      console.error('QR sayfasına yönlendirme hatası:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssetId) return;
    try {
      await assetsApi.delete(selectedAssetId);
      await loadAssets();
      setShowDeleteConfirm(false);
      setSelectedAssetId(null);
      showAlert('Asset başarıyla silindi!', 'success');
    } catch (error) {
      showAlert('Asset silinemedi!', 'danger');
    }
  };

  // CSV Export
  const handleExport = () => {
    const dataToExport = selectedAssets.length > 0 
      ? filteredAssets.filter(asset => selectedAssets.includes(asset.id))
      : filteredAssets;
    const csvContent = [
      ['Asset No', 'İsim', 'Seri No', 'Durum', 'Kategori', 'Tarih'],
      ...dataToExport.map(asset => [
        asset.assetNumber,
        asset.name,
        asset.serialNumber,
        getStatusText(asset.status),
        categories.find(c => c.id === asset.categoryId)?.name || '',
        formatDate(asset.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `assets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadgeColor = (status: string) => {
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const showAlert = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    // Toast notification implementation
    console.log(`${type}: ${message}`);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📦 Asset Yönetimi</h4>
          <p className="text-muted mb-0">
            Tüm zimmet kayıtlarını görüntüle ve yönet • {assets.length} asset
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={handleExport}
          >
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Yeni Asset
          </button>
        </div>
      </div>

      {/* Stats Cards - Compact Version */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary bg-opacity-10">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-boxes text-primary fs-4 me-2"></i>
                <div>
                  <div className="fw-bold text-primary">{assets.length}</div>
                  <small className="text-muted">Toplam</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success bg-opacity-10">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle text-success fs-4 me-2"></i>
                <div>
                  <div className="fw-bold text-success">{assets.filter(a => a.status === 'Available').length}</div>
                  <small className="text-muted">Müsait</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-primary bg-opacity-10">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-check text-primary fs-4 me-2"></i>
                <div>
                  <div className="fw-bold text-primary">{assets.filter(a => a.status === 'Assigned').length}</div>
                  <small className="text-muted">Atanmış</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning bg-opacity-10">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-tools text-warning fs-4 me-2"></i>
                <div>
                  <div className="fw-bold text-warning">{assets.filter(a => a.status === 'Maintenance').length}</div>
                  <small className="text-muted">Bakımda</small>
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
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Asset ara (isim, asset no, seri no)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="Available">Müsait</option>
                <option value="Assigned">Atanmış</option>
                <option value="Maintenance">Bakımda</option>
                <option value="Damaged">Hasarlı</option>
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setCategoryFilter('');
                }}
                title="Filtreleri Temizle"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
              <span className="fw-medium">
                {filteredAssets.length} asset
                {selectedAssets.length > 0 && ` (${selectedAssets.length} seçili)`}
              </span>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="mt-2 text-muted">Assets yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <h6 className="text-danger">Hata!</h6>
              <p className="text-muted">{error}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={loadAllData}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Tekrar Dene
              </button>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-3">
                <i className="bi bi-inbox fs-1"></i>
              </div>
              <h6 className="text-muted">Asset Bulunamadı</h6>
              <p className="text-muted">
                {searchTerm || statusFilter || categoryFilter ? 'Arama kriterlerinizi değiştirip tekrar deneyin' : 'Henüz asset eklenmemiş'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Asset</th>
                    <th>Kategori</th>
                    <th>Durum</th>
                    <th>Atanan</th>
                    <th>Tarih</th>
                    <th style={{ width: '120px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
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
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-box text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-medium">{asset.name}</div>
                            <small className="text-muted">
                              {asset.assetNumber} • {asset.serialNumber}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {categories.find(c => c.id === asset.categoryId)?.name || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(asset.status)}`}>
                          {getStatusText(asset.status)}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {asset.assignedToName || 'Atanmamış'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(asset.createdAt)}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewDetails(asset.id)}
                            title="Görüntüle"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleQRCode(asset)}
                            title="QR Kod"
                          >
                            <i className="bi bi-qr-code"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleEdit(asset.id)}
                            title="Düzenle"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setSelectedAssetId(asset.id);
                              setShowDeleteConfirm(true);
                            }}
                            title="Sil"
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
          )}
        </div>
      </div>

      {/* Modals burada olacak - AssetDetailsModal, EditAssetModal, AddAssetModal, DeleteConfirmModal */}
      {showDetailsModal && selectedAssetId && (
        <AssetDetailsModal
          assetId={selectedAssetId}
          assets={assets}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAssetId(null);
          }}
        />
      )}

      {showEditModal && selectedAssetId && (
        <EditAssetModal
          assetId={selectedAssetId}
          assets={assets}
          onSuccess={async () => {
            setShowEditModal(false);
            setSelectedAssetId(null);
            await loadAssets();
            showAlert('Asset başarıyla güncellendi!', 'success');
          }}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedAssetId(null);
          }}
          categories={categories}
        />
      )}

      {showAddModal && (
        <AddAssetModal
          onSuccess={async () => {
            setShowAddModal(false);
            await loadAssets();
            showAlert('Asset başarıyla eklendi!', 'success');
          }}
          onCancel={() => setShowAddModal(false)}
          categories={categories}
          users={users}
        />
      )}

      {showDeleteConfirm && selectedAssetId && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <div className="modal-header border-0 p-4 bg-danger">
                <h4 className="modal-title text-white fw-bold mb-0">
                  <i className="bi bi-trash me-3"></i>
                  Asset Sil
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
  );
};

// Asset Details Modal Component - Düzeltilmiş versiyon
interface AssetDetailsModalProps {
  assetId: string;
  assets?: Asset[]; // Props'a assets ekleyin
  onClose: () => void;
}

const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ assetId, assets, onClose }) => {
  const [assetDetails, setAssetDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

   // Helper functions
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

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        // Önce assets props'undan asset'ı bulmaya çalış
        if (assets && Array.isArray(assets)) {
          const existingAsset = assets.find((a: Asset) => a.id === assetId);
          if (existingAsset) {
            setAssetDetails(existingAsset);
            setLoading(false);
            return;
          }
        }
        
        // Eğer props'ta yoksa API'den çek
        if (assetId) {
          const asset = await assetsApi.getById(assetId);
          setAssetDetails(asset);
        }
      } catch (error) {
        console.error('Asset detayları yüklenirken hata:', error);
        setAssetDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      loadAssetDetails();
    }
  }, [assetId, assets]);

 if (loading) {
    return (
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <div className="modal-body p-5 text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p>Asset detayları yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div className="modal-header border-0 p-4 bg-primary">
            <h4 className="modal-title text-white fw-bold mb-0">
              <i className="bi bi-eye me-3"></i>
              Asset Detayları
            </h4>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body p-4">
            {assetDetails ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Asset Adı</label>
                  <p className="form-control-plaintext fw-bold">{assetDetails.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Asset Numarası</label>
                  <p className="form-control-plaintext fw-bold">{assetDetails.assetNumber}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Seri Numarası</label>
                  <p className="form-control-plaintext">{assetDetails.serialNumber}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Kategori</label>
                  <p className="form-control-plaintext">{assetDetails.categoryName || 'Belirtilmemiş'}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Durum</label><br/>
                  <span className={`badge ${getStatusColor(assetDetails.status)} px-3 py-2`}>
                    {getStatusText(assetDetails.status)}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Departman</label>
                  <p className="form-control-plaintext">{assetDetails.departmentName || 'Atanmamış'}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Atanan Kişi</label>
                  <p className="form-control-plaintext">{assetDetails.assignedToName || 'Atanmamış'}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Oluşturma Tarihi</label>
                  <p className="form-control-plaintext">{formatDate(assetDetails.createdAt)}</p>
                </div>
                {assetDetails.notes && (
                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted">Notlar</label>
                    <p className="form-control-plaintext">{assetDetails.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="bg-danger bg-opacity-10 rounded-circle p-4 mb-4 d-inline-block">
                  <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Asset Bulunamadı</h5>
                <p className="text-muted">Asset detayları yüklenemedi</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0 p-4 bg-light">
            <button
              type="button"
              className="btn btn-secondary shadow-sm"
              onClick={onClose}
              style={{ borderRadius: '6px', padding: '10px 20px' }}
            >
              <i className="bi bi-x-lg me-2"></i>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
interface EditAssetModalProps {
  assetId: string;
  assets?: Asset[]; // ← BU SATIRI EKLEYİN
  onSuccess: () => void;
  onCancel: () => void;
  categories: Category[];
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({
  assetId,
  assets, // ← BU SATIRI EKLEYİN
  onSuccess,
  onCancel,
  categories
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
    notes: '',
    status: 'Available'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load existing asset data
useEffect(() => {
  const loadAssetData = async () => {
    try {
      // assets prop'undan kontrol et
    if (assets && Array.isArray(assets)) {
        const existingAsset = assets.find((a: Asset) => a.id === assetId);
        if (existingAsset) {
          setFormData({
            name: existingAsset.name || '',
            description: (existingAsset as any).description || '',
            serialNumber: existingAsset.serialNumber || '',
            assetNumber: existingAsset.assetNumber || '',
            categoryId: existingAsset.categoryId || '',
            brand: (existingAsset as any).brand || '',
            model: (existingAsset as any).model || '',
            purchaseDate: (existingAsset as any).purchaseDate || '',
            purchasePrice: (existingAsset as any).purchasePrice || undefined,
            warranty: (existingAsset as any).warranty || '',
            location: (existingAsset as any).location || '',
            notes: (existingAsset as any).notes || '',
            status: existingAsset.status || 'Available'
            
          });
          setLoadingData(false);
          return;
        }
      }
      
      // Eğer liste'de yoksa API'den çek
      if (assetId) {
        const asset = await assetsApi.getById(assetId);
        setFormData({
          name: asset.name || '',
          description: (asset as any).description || '',
          serialNumber: asset.serialNumber || '',
          assetNumber: asset.assetNumber || '',
          categoryId: asset.categoryId || '',
          brand: (asset as any).brand || '',
          model: (asset as any).model || '',
          purchaseDate: (asset as any).purchaseDate || '',
          purchasePrice: (asset as any).purchasePrice || undefined,
          warranty: (asset as any).warranty || '',
          location: (asset as any).location || '',
          notes: (asset as any).notes || '',
          status: asset.status || 'Available'
        });
      }
    } catch (error) {
      console.error('Asset verileri yüklenirken hata:', error);
      setErrors({ submit: 'Asset verileri yüklenemedi!' });
    } finally {
      setLoadingData(false);
    }
  };

  if (assetId) {
    loadAssetData();
  }
}, [assetId, assets]); // assets'ı dependency'ye ekleyin
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Asset adı gereklidir';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Seri numarası gereklidir';
    }

    if (!formData.assetNumber.trim()) {
      newErrors.assetNumber = 'Asset numarası gereklidir';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori seçimi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);
  try {
    const updateData = {
      id: assetId, // ← ID'yi ekleyin
      name: formData.name,
      serialNumber: formData.serialNumber,
      assetNumber: formData.assetNumber,
      categoryId: formData.categoryId,
      status: formData.status, // Sadece valid status'lar: Available, Assigned, Damaged
      qrCode: `QR-${formData.assetNumber}`, // ← QR kod ekleyin
      createdBy: "30549f61-ed08-4867-bce0-b80a64ae7199", // ← Geçici user ID
      createdAt: new Date().toISOString(), // ← Oluşturma tarihi ekleyin
      updatedAt: new Date().toISOString()
    };

    // updateAsset API çağrısı - URL'yi düzeltin
    const response = await fetch(`https://localhost:7190/api/Assets/${assetId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Asset güncellenemedi: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Update başarılı:', result);
    onSuccess();
  } catch (error) {
    console.error('Asset güncelleme hatası:', error);
    setErrors({ submit: `Asset güncellenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` });
  } finally {
    setLoading(false);
  }
};

  if (loadingData) {
    return (
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <div className="modal-body p-5 text-center">
              <div className="spinner-border text-warning mb-3" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p>Asset verileri yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div className="modal-header border-0 p-4 bg-warning">
            <h4 className="modal-title text-white fw-bold mb-0">
              <i className="bi bi-pencil me-3"></i>
              Asset Düzenle
            </h4>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Asset Adı <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Örn: Dell Laptop"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Kategori <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  >
                    <option value="">Kategori Seçin</option>
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
                    placeholder="Örn: ABC123456"
                  />
                  {errors.serialNumber && <div className="invalid-feedback">{errors.serialNumber}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Asset Numarası <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.assetNumber ? 'is-invalid' : ''}`}
                    value={formData.assetNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, assetNumber: e.target.value }))}
                    placeholder="Örn: AST-001"
                    readOnly
                  />
                  {errors.assetNumber && <div className="invalid-feedback">{errors.assetNumber}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Durum</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Available">Müsait</option>
                    <option value="Assigned">Atanmış</option>
                    <option value="Maintenance">Bakımda</option>
                    {/* Damaged kaldırıldı */}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Marka</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Örn: Dell, HP, Lenovo"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Örn: Latitude 5520"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Konum</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Örn: IT Ofisi, Depo"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Açıklama</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Asset hakkında ek bilgiler..."
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Notlar</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ek notlar, özel durumlar..."
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer border-0 p-4 bg-light">
              <button
                type="button"
                className="btn btn-light shadow-sm"
                onClick={onCancel}
                disabled={loading}
                style={{ borderRadius: '6px', padding: '10px 20px' }}
              >
                <i className="bi bi-x-lg me-2"></i>
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-warning shadow-sm"
                disabled={loading}
                style={{ borderRadius: '6px', padding: '10px 20px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-pencil me-2"></i>
                    Asset Güncelle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
    notes: '',
    status: 'Available'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-generate asset number
  const generateAssetNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setFormData(prev => ({ ...prev, assetNumber: `AST-${timestamp}-${random}` }));
  };

  // Form validation
  // Form validation
const validateForm = (): boolean => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Asset adı gereklidir';
  }

  if (!formData.serialNumber.trim()) {
    newErrors.serialNumber = 'Seri numarası gereklidir';
  }

  if (!formData.assetNumber.trim()) {
    newErrors.assetNumber = 'Asset numarası gereklidir';
  }

  if (!formData.categoryId) {
    newErrors.categoryId = 'Kategori seçimi gereklidir';
  }

  // Status validation ekleyin
  if (!['Available', 'Assigned', 'Damaged'].includes(formData.status)) {
    newErrors.status = 'Geçersiz durum seçimi';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const assetData = {
        name: formData.name,
        description: formData.description,
        serialNumber: formData.serialNumber,
        assetNumber: formData.assetNumber,
        categoryId: formData.categoryId,
        brand: formData.brand,
        model: formData.model,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice || undefined,
        warranty: formData.warranty || undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        status: formData.status as 'Available' | 'Assigned',
        qrCode: `QR-${formData.assetNumber}`,
        createdBy: 'current-user-id', // Bu gerçek user ID olmalı
        createdAt: new Date().toISOString()
      };

      await createAsset(assetData);
      onSuccess();
    } catch (error) {
      console.error('Asset oluşturma hatası:', error);
      setErrors({ submit: 'Asset oluşturulurken bir hata oluştu!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div className="modal-header border-0 p-4 bg-success">
            <h4 className="modal-title text-white fw-bold mb-0">
              <i className="bi bi-plus-lg me-3"></i>
              Yeni Asset Ekle
            </h4>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onCancel}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Asset Adı <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Örn: Dell Laptop"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Kategori <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  >
                    <option value="">Kategori Seçin</option>
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
                    placeholder="Örn: ABC123456"
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
                      placeholder="Örn: AST-001"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={generateAssetNumber}
                      title="Otomatik Oluştur"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                  {errors.assetNumber && <div className="invalid-feedback">{errors.assetNumber}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Marka</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Örn: Dell, HP, Lenovo"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Örn: Latitude 5520"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Satın Alma Tarihi</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Satın Alma Fiyatı (₺)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Garanti Süresi</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.warranty}
                    onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                    placeholder="Örn: 2 yıl, 24 ay"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Konum</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Örn: IT Ofisi, Depo"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Açıklama</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Asset hakkında ek bilgiler..."
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Notlar</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ek notlar, özel durumlar..."
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer border-0 p-4 bg-light">
              <button
                type="button"
                className="btn btn-light shadow-sm"
                onClick={onCancel}
                disabled={loading}
                style={{ borderRadius: '6px', padding: '10px 20px' }}
              >
                <i className="bi bi-x-lg me-2"></i>
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-success shadow-sm"
                disabled={loading}
                style={{ borderRadius: '6px', padding: '10px 20px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-2"></i>
                    Asset Ekle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AllAssets;