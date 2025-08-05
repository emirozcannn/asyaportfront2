// src/pages/assets/AssetStatus.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types - API'den import edilecek
interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  serialNumber: string;
  category: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  currentUser?: {
    id: string;
    fullName: string;
    email: string;
    department?: string;
  };
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired' | 'Lost' | 'Damaged';
  location?: string;
  lastStatusChange?: string;
  statusHistory?: StatusHistoryItem[];
  maintenanceInfo?: {
    startDate: string;
    expectedEndDate?: string;
    note?: string;
    technician?: string;
  };
  retirementInfo?: {
    reason: string;
    date: string;
    disposalMethod?: string;
  };
}

interface StatusHistoryItem {
  id: string;
  fromStatus: string;
  toStatus: string;
  changeDate: string;
  changedBy: string;
  reason?: string;
  notes?: string;
}

interface StatusFilters {
  status?: string;
  categoryId?: string;
  dateRange?: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  userId?: string;
}

interface StatusChangeData {
  assetId: string;
  newStatus: string;
  reason: string;
  notes?: string;
  maintenanceInfo?: {
    expectedEndDate?: string;
    technician?: string;
    note?: string;
  };
  retirementInfo?: {
    reason: string;
    disposalMethod?: string;
  };
}

const AssetStatus: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<StatusFilters>({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  const [statusChangeData, setStatusChangeData] = useState<StatusChangeData>({
    assetId: '',
    newStatus: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Status statistics
  const [statusStats, setStatusStats] = useState({
    available: 0,
    assigned: 0,
    maintenance: 0,
    retired: 0,
    lost: 0,
    damaged: 0
  });

  // Load assets
  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API call will be here
      // const response = await getAssetsWithStatus(filters);
      // setAssets(response.assets);
      // setStatusStats(response.stats);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Asset durumları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
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

  // Status change modal
  const openStatusModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setStatusChangeData({
      assetId: asset.id,
      newStatus: '',
      reason: ''
    });
    setShowStatusModal(true);
  };

  const openHistoryModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowHistoryModal(true);
  };

  // Form validation
  const validateStatusChange = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!statusChangeData.newStatus) {
      newErrors.newStatus = 'Yeni durum seçimi gereklidir';
    }

    if (!statusChangeData.reason) {
      newErrors.reason = 'Durum değişiklik nedeni gereklidir';
    }

    if (statusChangeData.newStatus === 'Maintenance' && !statusChangeData.maintenanceInfo?.technician) {
      newErrors.technician = 'Bakım teknisyeni gereklidir';
    }

    if (statusChangeData.newStatus === 'Retired' && !statusChangeData.retirementInfo?.reason) {
      newErrors.retirementReason = 'Emeklilik nedeni gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit status change
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStatusChange()) return;

    try {
      console.log('Durum değiştiriliyor:', statusChangeData);
      // API call will be here
      // await changeAssetStatus(statusChangeData);
      
      setShowStatusModal(false);
      resetStatusForm();
      loadAssets();
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  const resetStatusForm = () => {
    setStatusChangeData({
      assetId: '',
      newStatus: '',
      reason: ''
    });
    setErrors({});
    setSelectedAsset(null);
  };

  // Bulk status change
  const handleBulkStatusChange = (newStatus: string) => {
    if (selectedAssets.length === 0) {
      alert('Lütfen durum değiştirilecek asset(ları) seçin');
      return;
    }
    
    navigate(`/dashboard/assets/bulk-operations?operation=update_status&status=${newStatus}&assets=${selectedAssets.join(',')}`);
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    const statusMap = {
      Available: { color: 'success', icon: 'bi-check-circle', text: 'Müsait', bgColor: 'bg-success' },
      Assigned: { color: 'primary', icon: 'bi-person-check', text: 'Atanmış', bgColor: 'bg-primary' },
      Maintenance: { color: 'warning', icon: 'bi-tools', text: 'Bakımda', bgColor: 'bg-warning' },
      Retired: { color: 'secondary', icon: 'bi-archive', text: 'Emekli', bgColor: 'bg-secondary' },
      Lost: { color: 'danger', icon: 'bi-exclamation-triangle', text: 'Kayıp', bgColor: 'bg-danger' },
      Damaged: { color: 'danger', icon: 'bi-x-circle', text: 'Hasarlı', bgColor: 'bg-danger' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.Available;
  };

  // Get status change suggestions
  const getStatusChangeSuggestions = (currentStatus: string) => {
    const suggestions = {
      Available: ['Assigned', 'Maintenance', 'Damaged', 'Lost'],
      Assigned: ['Available', 'Maintenance', 'Retired', 'Damaged', 'Lost'],
      Maintenance: ['Available', 'Retired', 'Damaged'],
      Retired: [], // Usually no status changes from retired
      Lost: ['Available', 'Damaged'], // If found
      Damaged: ['Available', 'Maintenance', 'Retired']
    };
    return suggestions[currentStatus as keyof typeof suggestions] || [];
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📊 Asset Durumları</h4>
          <p className="text-muted mb-0">Asset durumlarını takip edin ve yönetin</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-clock-history me-1"></i>
            Durum Geçmişi
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-download me-1"></i>
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-check-circle text-success fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{statusStats.available.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Müsait</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-person-check text-primary fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{statusStats.assigned.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Atanmış</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-tools text-warning fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{statusStats.maintenance.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Bakımda</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-archive text-secondary fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{statusStats.retired.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Emekli</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-exclamation-triangle text-danger fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{statusStats.lost.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Kayıp</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-x-circle text-danger fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{statusStats.damaged.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Hasarlı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status Change Buttons */}
      {selectedAssets.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-medium">
                {selectedAssets.length} asset seçili - Toplu durum değiştir:
              </span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleBulkStatusChange('Available')}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Müsait Yap
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleBulkStatusChange('Maintenance')}
                >
                  <i className="bi bi-tools me-1"></i>
                  Bakıma Al
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleBulkStatusChange('Retired')}
                >
                  <i className="bi bi-archive me-1"></i>
                  Emekliye Ayır
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Tüm Durumlar</option>
                <option value="Available">Müsait</option>
                <option value="Assigned">Atanmış</option>
                <option value="Maintenance">Bakımda</option>
                <option value="Retired">Emekli</option>
                <option value="Lost">Kayıp</option>
                <option value="Damaged">Hasarlı</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.categoryId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
              >
                <option value="">Tüm Kategoriler</option>
                <option value="comp">Bilgisayar ve Donanım</option>
                <option value="safe">İş Güvenliği</option>
                <option value="office">Ofis Malzemeleri</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.dateRange || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              >
                <option value="">Tüm Zamanlar</option>
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="custom">Özel Tarih</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.userId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              >
                <option value="">Tüm Kullanıcılar</option>
                <option value="user1">Ahmet Yılmaz</option>
                <option value="user2">Ayşe Demir</option>
              </select>
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
                  checked={selectedAssets.length === assets.length && assets.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
              <span className="fw-medium">
                {assets.length} asset {selectedAssets.length > 0 && `(${selectedAssets.length} seçili)`}
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
              <p className="mt-2 text-muted">Asset durumları yükleniyor...</p>
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
              <p className="text-muted">Filtrelere uygun asset bulunmuyor</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Asset Bilgileri</th>
                    <th>Kategori</th>
                    <th>Mevcut Durum</th>
                    <th>Atanan Kişi</th>
                    <th>Son Değişiklik</th>
                    <th>Ek Bilgi</th>
                    <th style={{ width: '140px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => {
                    const statusInfo = getStatusInfo(asset.status);
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
                              style={{ backgroundColor: `${asset.category.color}20`, color: asset.category.color }}
                            >
                              <i className={`${asset.category.icon}`}></i>
                            </div>
                            <div>
                              <div className="fw-medium">{asset.name}</div>
                              <div className="small text-muted">
                                {asset.assetNumber} • {asset.serialNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {asset.category.name}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.bgColor}`}>
                            <i className={`${statusInfo.icon} me-1`}></i>
                            {statusInfo.text}
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
                          <span className="small text-muted">
                            {asset.lastStatusChange ? 
                              new Date(asset.lastStatusChange).toLocaleDateString('tr-TR') : 
                              '-'
                            }
                          </span>
                        </td>
                        <td>
                          {asset.status === 'Maintenance' && asset.maintenanceInfo && (
                            <div className="small text-muted">
                              <div><strong>Teknisyen:</strong> {asset.maintenanceInfo.technician}</div>
                              {asset.maintenanceInfo.expectedEndDate && (
                                <div><strong>Bitiş:</strong> {new Date(asset.maintenanceInfo.expectedEndDate).toLocaleDateString('tr-TR')}</div>
                              )}
                            </div>
                          )}
                          {asset.status === 'Retired' && asset.retirementInfo && (
                            <div className="small text-muted">
                              <div><strong>Neden:</strong> {asset.retirementInfo.reason}</div>
                              <div><strong>Tarih:</strong> {new Date(asset.retirementInfo.date).toLocaleDateString('tr-TR')}</div>
                            </div>
                          )}
                          {asset.location && (
                            <div className="small text-muted">
                              <strong>Konum:</strong> {asset.location}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openStatusModal(asset)}
                              title="Durum Değiştir"
                            >
                              <i className={statusInfo.icon}></i>
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => openHistoryModal(asset)}
                              title="Durum Geçmişi"
                            >
                              <i className="bi bi-clock-history"></i>
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
                                    onClick={() => navigate(`/dashboard/assets/${asset.id}`)}
                                  >
                                    <i className="bi bi-eye me-2"></i>Detaylar
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                {getStatusChangeSuggestions(asset.status).map(status => {
                                  const suggestionInfo = getStatusInfo(status);
                                  return (
                                    <li key={status}>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => {
                                          openStatusModal(asset);
                                          setStatusChangeData(prev => ({ ...prev, newStatus: status }));
                                        }}
                                      >
                                        <i className={`${suggestionInfo.icon} me-2`}></i>
                                        {suggestionInfo.text} Yap
                                      </button>
                                    </li>
                                  );
                                })}
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
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedAsset && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Asset Durum Değiştir
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowStatusModal(false);
                    resetStatusForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleStatusChange}>
                <div className="modal-body">
                  <div className="alert alert-info mb-4">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded p-2 me-3"
                        style={{ backgroundColor: `${selectedAsset.category.color}20`, color: selectedAsset.category.color }}
                      >
                        <i className={`${selectedAsset.category.icon}`}></i>
                      </div>
                      <div>
                        <strong>{selectedAsset.name}</strong><br />
                        <small>{selectedAsset.assetNumber} • {selectedAsset.serialNumber}</small><br />
                        <span className={`badge ${getStatusInfo(selectedAsset.status).bgColor} mt-1`}>
                          Mevcut: {getStatusInfo(selectedAsset.status).text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Yeni Durum <span className="text-danger">*</span></label>
                      <select
                        className={`form-select ${errors.newStatus ? 'is-invalid' : ''}`}
                        value={statusChangeData.newStatus}
                        onChange={(e) => setStatusChangeData(prev => ({ ...prev, newStatus: e.target.value }))}
                      >
                        <option value="">Durum seçin...</option>
                        {getStatusChangeSuggestions(selectedAsset.status).map(status => {
                          const statusInfo = getStatusInfo(status);
                          return (
                            <option key={status} value={status}>
                              {statusInfo.text}
                            </option>
                          );
                        })}
                      </select>
                      {errors.newStatus && <div className="invalid-feedback">{errors.newStatus}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Değişiklik Nedeni <span className="text-danger">*</span></label>
                      <select
                        className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                        value={statusChangeData.reason}
                        onChange={(e) => setStatusChangeData(prev => ({ ...prev, reason: e.target.value }))}
                      >
                        <option value="">Neden seçin...</option>
                        <option value="scheduled_maintenance">Planlı Bakım</option>
                        <option value="emergency_repair">Acil Onarım</option>
                        <option value="user_request">Kullanıcı İsteği</option>
                        <option value="policy_change">Politika Değişikliği</option>
                        <option value="end_of_life">Ömür Sonu</option>
                        <option value="damage">Hasar</option>
                        <option value="loss">Kayıp</option>
                        <option value="other">Diğer</option>
                      </select>
                      {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                    </div>

                    {/* Maintenance specific fields */}
                    {statusChangeData.newStatus === 'Maintenance' && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label">Teknisyen <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className={`form-control ${errors.technician ? 'is-invalid' : ''}`}
                            value={statusChangeData.maintenanceInfo?.technician || ''}
                            onChange={(e) => setStatusChangeData(prev => ({
                              ...prev,
                              maintenanceInfo: { ...prev.maintenanceInfo, technician: e.target.value }
                            }))}
                            placeholder="Bakım teknisyeni adı"
                          />
                          {errors.technician && <div className="invalid-feedback">{errors.technician}</div>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Tahmini Bitiş Tarihi</label>
                          <input
                            type="date"
                            className="form-control"
                            value={statusChangeData.maintenanceInfo?.expectedEndDate || ''}
                            onChange={(e) => setStatusChangeData(prev => ({
                              ...prev,
                              maintenanceInfo: { ...prev.maintenanceInfo, expectedEndDate: e.target.value }
                            }))}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Bakım Notu</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={statusChangeData.maintenanceInfo?.note || ''}
                            onChange={(e) => setStatusChangeData(prev => ({
                              ...prev,
                              maintenanceInfo: { ...prev.maintenanceInfo, note: e.target.value }
                            }))}
                            placeholder="Bakım detayları ve açıklamaları..."
                          />
                        </div>
                      </>
                    )}

                    {/* Retirement specific fields */}
                    {statusChangeData.newStatus === 'Retired' && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label">Emeklilik Nedeni <span className="text-danger">*</span></label>
                          <select
                            className={`form-select ${errors.retirementReason ? 'is-invalid' : ''}`}
                            value={statusChangeData.retirementInfo?.reason || ''}
                            onChange={(e) => setStatusChangeData(prev => ({
                              ...prev,
                              retirementInfo: { ...prev.retirementInfo, reason: e.target.value }
                            }))}
                          >
                            <option value="">Neden seçin...</option>
                            <option value="end_of_life">Ömür Sonu</option>
                            <option value="obsolete">Eskimiş</option>
                            <option value="damaged_beyond_repair">Onarılamaz Hasar</option>
                            <option value="policy_change">Politika Değişikliği</option>
                            <option value="upgrade">Yenileme</option>
                            <option value="other">Diğer</option>
                          </select>
                          {errors.retirementReason && <div className="invalid-feedback">{errors.retirementReason}</div>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">İmha Yöntemi</label>
                          <select
                            className="form-select"
                            value={statusChangeData.retirementInfo?.disposalMethod || ''}
                            onChange={(e) => setStatusChangeData(prev => ({
                              ...prev,
                              retirementInfo: { ...prev.retirementInfo, disposalMethod: e.target.value }
                            }))}
                          >
                            <option value="">Seçin...</option>
                            <option value="recycle">Geri Dönüşüm</option>
                            <option value="donate">Bağış</option>
                            <option value="sell">Satış</option>
                            <option value="destroy">İmha</option>
                            <option value="return_vendor">Tedarikçiye İade</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="col-12">
                      <label className="form-label">Ek Notlar</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={statusChangeData.notes || ''}
                        onChange={(e) => setStatusChangeData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Durum değişikliği ile ilgili ek bilgiler..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowStatusModal(false);
                      resetStatusForm();
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-${statusChangeData.newStatus ? getStatusInfo(statusChangeData.newStatus).color : 'primary'}`}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Durumu Değiştir
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Status History Modal */}
      {showHistoryModal && selectedAsset && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-clock-history me-2"></i>
                  Durum Geçmişi
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHistoryModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info mb-4">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded p-2 me-3"
                      style={{ backgroundColor: `${selectedAsset.category.color}20`, color: selectedAsset.category.color }}
                    >
                      <i className={`${selectedAsset.category.icon}`}></i>
                    </div>
                    <div>
                      <strong>{selectedAsset.name}</strong><br />
                      <small>{selectedAsset.assetNumber} • {selectedAsset.serialNumber}</small>
                    </div>
                  </div>
                </div>

                {selectedAsset.statusHistory && selectedAsset.statusHistory.length > 0 ? (
                  <div className="timeline">
                    {selectedAsset.statusHistory.map((historyItem, index) => {
                      const fromStatusInfo = getStatusInfo(historyItem.fromStatus);
                      const toStatusInfo = getStatusInfo(historyItem.toStatus);
                      
                      return (
                        <div key={historyItem.id} className="timeline-item mb-4">
                          <div className="d-flex">
                            <div className="timeline-marker me-3">
                              <div className={`rounded-circle p-2 ${toStatusInfo.bgColor}`}>
                                <i className={`${toStatusInfo.icon} text-white small`}></i>
                              </div>
                              {index < selectedAsset.statusHistory!.length - 1 && (
                                <div className="timeline-line"></div>
                              )}
                            </div>
                            <div className="flex-grow-1">
                              <div className="card border-0 bg-light">
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                      <h6 className="mb-1">
                                        <span className={`badge ${fromStatusInfo.bgColor} me-2`}>
                                          {fromStatusInfo.text}
                                        </span>
                                        <i className="bi bi-arrow-right mx-2"></i>
                                        <span className={`badge ${toStatusInfo.bgColor}`}>
                                          {toStatusInfo.text}
                                        </span>
                                      </h6>
                                      <p className="text-muted small mb-1">
                                        <strong>Değiştiren:</strong> {historyItem.changedBy}
                                      </p>
                                      <p className="text-muted small mb-0">
                                        <strong>Tarih:</strong> {new Date(historyItem.changeDate).toLocaleString('tr-TR')}
                                      </p>
                                    </div>
                                  </div>
                                  {historyItem.reason && (
                                    <p className="small mb-1">
                                      <strong>Neden:</strong> {historyItem.reason}
                                    </p>
                                  )}
                                  {historyItem.notes && (
                                    <p className="small mb-0 text-muted">
                                      <strong>Not:</strong> {historyItem.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-muted mb-3">
                      <i className="bi bi-clock fs-1"></i>
                    </div>
                    <h6 className="text-muted">Durum Geçmişi Bulunamadı</h6>
                    <p className="text-muted">Bu asset için henüz durum değişikliği kaydı bulunmuyor</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowHistoryModal(false)}
                >
                  Kapat
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowHistoryModal(false);
                    openStatusModal(selectedAsset);
                  }}
                >
                  <i className="bi bi-arrow-repeat me-1"></i>
                  Durum Değiştir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for timeline */}
      <style jsx>{`
        .timeline-marker {
          position: relative;
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 100%;
          width: 2px;
          height: 40px;
          background-color: #dee2e6;
          transform: translateX(-50%);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AssetStatus;