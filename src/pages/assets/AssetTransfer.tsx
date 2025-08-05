// src/pages/assets/AssetTransfer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Asset Types - API'den import edilecek
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
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
  location?: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  department?: {
    id: string;
    name: string;
  };
  role?: string;
}

interface Department {
  id: string;
  name: string;
}

interface TransferData {
  assetId: string;
  fromUserId?: string;
  toUserId?: string;
  toDepartmentId?: string;
  transferType: 'user' | 'department' | 'location';
  newLocation?: string;
  reason?: string;
  notes?: string;
  transferDate: string;
}

const AssetTransfer: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [transferData, setTransferData] = useState<TransferData>({
    assetId: '',
    transferType: 'user',
    transferDate: new Date().toISOString().split('T')[0],
    reason: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load data
  useEffect(() => {
    loadAssets();
    loadUsers();
    loadDepartments();
  }, []);

  const loadAssets = async () => {
    try {
      // API call will be here
      // const assetsData = await getAvailableAssets();
      // setAssets(assetsData);
    } catch (error) {
      console.error('Asset yükleme hatası:', error);
    }
  };

  const loadUsers = async () => {
    try {
      // API call will be here
      // const usersData = await getAllUsers();
      // setUsers(usersData);
    } catch (error) {
      console.error('Kullanıcı yükleme hatası:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      // API call will be here
      // const departmentsData = await getAllDepartments();
      // setDepartments(departmentsData);
    } catch (error) {
      console.error('Departman yükleme hatası:', error);
    }
  };

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

  // Transfer modal
  const openTransferModal = (assetId?: string) => {
    if (assetId) {
      setSelectedAssets([assetId]);
    }
    
    if (selectedAssets.length === 0 && !assetId) {
      alert('Lütfen transfer edilecek asset(ları) seçin');
      return;
    }

    setTransferData(prev => ({
      ...prev,
      assetId: assetId || selectedAssets[0]
    }));
    setShowTransferModal(true);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!transferData.assetId) {
      newErrors.assetId = 'Asset seçimi gereklidir';
    }

    if (transferData.transferType === 'user' && !transferData.toUserId) {
      newErrors.toUserId = 'Hedef kullanıcı seçimi gereklidir';
    }

    if (transferData.transferType === 'department' && !transferData.toDepartmentId) {
      newErrors.toDepartmentId = 'Hedef departman seçimi gereklidir';
    }

    if (transferData.transferType === 'location' && !transferData.newLocation?.trim()) {
      newErrors.newLocation = 'Yeni konum bilgisi gereklidir';
    }

    if (!transferData.reason?.trim()) {
      newErrors.reason = 'Transfer nedeni gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Single or bulk transfer
      if (selectedAssets.length === 1) {
        // Single transfer
        console.log('Tekil transfer:', transferData);
        // await transferAsset(transferData);
      } else {
        // Bulk transfer
        console.log('Toplu transfer:', { selectedAssets, transferData });
        // await bulkTransferAssets(selectedAssets, transferData);
      }

      setShowTransferModal(false);
      setSelectedAssets([]);
      resetTransferForm();
      loadAssets(); // Refresh data
    } catch (error) {
      console.error('Transfer hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetTransferForm = () => {
    setTransferData({
      assetId: '',
      transferType: 'user',
      transferDate: new Date().toISOString().split('T')[0],
      reason: '',
      notes: ''
    });
    setErrors({});
  };

  // Get transfer type icon
  const getTransferTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return 'bi-person';
      case 'department': return 'bi-building';
      case 'location': return 'bi-geo-alt';
      default: return 'bi-arrow-right';
    }
  };

  // Filter assets based on search
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🔄 Zimmet Transferi</h4>
          <p className="text-muted mb-0">Asset'ları kullanıcılar, departmanlar veya konumlar arasında transfer edin</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-clock-history me-1"></i>
            Transfer Geçmişi
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openTransferModal()}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-arrow-right-circle me-1"></i>
            Transfer Et ({selectedAssets.length})
          </button>
        </div>
      </div>

      {/* Transfer Types Info */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <i className="bi bi-person text-primary fs-4"></i>
              </div>
              <h6 className="fw-bold">Kullanıcı Transferi</h6>
              <p className="text-muted small mb-0">Asset'i başka bir kullanıcıya ata</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <i className="bi bi-building text-success fs-4"></i>
              </div>
              <h6 className="fw-bold">Departman Transferi</h6>
              <p className="text-muted small mb-0">Asset'i başka departmana taşı</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <i className="bi bi-geo-alt text-warning fs-4"></i>
              </div>
              <h6 className="fw-bold">Konum Transferi</h6>
              <p className="text-muted small mb-0">Asset'in fiziksel konumunu değiştir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
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
              <select className="form-select">
                <option value="">Tüm Durumlar</option>
                <option value="available">Müsait</option>
                <option value="assigned">Atanmış</option>
                <option value="maintenance">Bakımda</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Tüm Kategoriler</option>
                <option value="comp">Bilgisayar</option>
                <option value="safe">İş Güvenliği</option>
                <option value="office">Ofis</option>
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
                  checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
              <span className="fw-medium">
                {filteredAssets.length} asset {selectedAssets.length > 0 && `(${selectedAssets.length} seçili)`}
              </span>
            </div>
            {selectedAssets.length > 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => openTransferModal()}
              >
                <i className="bi bi-arrow-right-circle me-1"></i>
                Toplu Transfer ({selectedAssets.length})
              </button>
            )}
          </div>
        </div>

        <div className="card-body p-0">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-3">
                <i className="bi bi-inbox fs-1"></i>
              </div>
              <h6 className="text-muted">Asset Bulunamadı</h6>
              <p className="text-muted">Transfer edilebilecek asset bulunmuyor</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Asset Bilgileri</th>
                    <th>Kategori</th>
                    <th>Mevcut Atama</th>
                    <th>Durum</th>
                    <th>Konum</th>
                    <th style={{ width: '100px' }}>İşlemler</th>
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
                        <div>
                          <div className="fw-medium">{asset.name}</div>
                          <div className="small text-muted">
                            Asset No: {asset.assetNumber} | Seri: {asset.serialNumber}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded p-1 me-2"
                            style={{ backgroundColor: `${asset.category.color}20`, color: asset.category.color }}
                          >
                            <i className={`${asset.category.icon} small`}></i>
                          </div>
                          <span className="small">{asset.category.name}</span>
                        </div>
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
                        <span className={`badge ${
                          asset.status === 'Available' ? 'bg-success' :
                          asset.status === 'Assigned' ? 'bg-primary' :
                          asset.status === 'Maintenance' ? 'bg-warning' : 'bg-secondary'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted">{asset.location || 'Belirtilmemiş'}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openTransferModal(asset.id)}
                        >
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Asset Transfer Et
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowTransferModal(false);
                    resetTransferForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleTransferSubmit}>
                <div className="modal-body">
                  {/* Transfer Type Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Transfer Tipi</label>
                    <div className="row g-2">
                      {[
                        { value: 'user', label: 'Kullanıcıya Transfer', icon: 'bi-person' },
                        { value: 'department', label: 'Departmana Transfer', icon: 'bi-building' },
                        { value: 'location', label: 'Konum Değişikliği', icon: 'bi-geo-alt' }
                      ].map(type => (
                        <div key={type.value} className="col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="transferType"
                              id={type.value}
                              value={type.value}
                              checked={transferData.transferType === type.value}
                              onChange={(e) => setTransferData(prev => ({ 
                                ...prev, 
                                transferType: e.target.value as 'user' | 'department' | 'location'
                              }))}
                            />
                            <label className="form-check-label" htmlFor={type.value}>
                              <i className={`${type.icon} me-2`}></i>
                              {type.label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Target Selection based on transfer type */}
                    {transferData.transferType === 'user' && (
                      <div className="col-12">
                        <label className="form-label">Hedef Kullanıcı <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.toUserId ? 'is-invalid' : ''}`}
                          value={transferData.toUserId || ''}
                          onChange={(e) => setTransferData(prev => ({ ...prev, toUserId: e.target.value }))}
                        >
                          <option value="">Kullanıcı seçin...</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName} - {user.department?.name} ({user.email})
                            </option>
                          ))}
                        </select>
                        {errors.toUserId && <div className="invalid-feedback">{errors.toUserId}</div>}
                      </div>
                    )}

                    {transferData.transferType === 'department' && (
                      <div className="col-12">
                        <label className="form-label">Hedef Departman <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.toDepartmentId ? 'is-invalid' : ''}`}
                          value={transferData.toDepartmentId || ''}
                          onChange={(e) => setTransferData(prev => ({ ...prev, toDepartmentId: e.target.value }))}
                        >
                          <option value="">Departman seçin...</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                        {errors.toDepartmentId && <div className="invalid-feedback">{errors.toDepartmentId}</div>}
                      </div>
                    )}

                    {transferData.transferType === 'location' && (
                      <div className="col-12">
                        <label className="form-label">Yeni Konum <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.newLocation ? 'is-invalid' : ''}`}
                          value={transferData.newLocation || ''}
                          onChange={(e) => setTransferData(prev => ({ ...prev, newLocation: e.target.value }))}
                          placeholder="Örn: BT Departmanı - 3. Kat - Oda 301"
                        />
                        {errors.newLocation && <div className="invalid-feedback">{errors.newLocation}</div>}
                      </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label">Transfer Tarihi</label>
                      <input
                        type="date"
                        className="form-control"
                        value={transferData.transferDate}
                        onChange={(e) => setTransferData(prev => ({ ...prev, transferDate: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Transfer Nedeni <span className="text-danger">*</span></label>
                      <select
                        className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                        value={transferData.reason || ''}
                        onChange={(e) => setTransferData(prev => ({ ...prev, reason: e.target.value }))}
                      >
                        <option value="">Neden seçin...</option>
                        <option value="employee_change">Personel Değişikliği</option>
                        <option value="department_transfer">Departman Transferi</option>
                        <option value="location_change">Konum Değişikliği</option>
                        <option value="upgrade">Upgrade/Yenileme</option>
                        <option value="maintenance">Bakım</option>
                        <option value="other">Diğer</option>
                      </select>
                      {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Notlar</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={transferData.notes || ''}
                        onChange={(e) => setTransferData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Transfer ile ilgili ek notlar ve açıklamalar..."
                      />
                    </div>
                  </div>

                  {/* Selected Assets Summary */}
                  {selectedAssets.length > 1 && (
                    <div className="mt-4">
                      <div className="alert alert-info">
                        <h6 className="alert-heading">
                          <i className="bi bi-info-circle me-2"></i>
                          Toplu Transfer
                        </h6>
                        <p className="mb-0">
                          <strong>{selectedAssets.length}</strong> asset seçili. 
                          Tüm seçili asset'lar aynı hedefe transfer edilecek.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowTransferModal(false);
                      resetTransferForm();
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Transfer Ediliyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i>
                        Transfer Et {selectedAssets.length > 1 && `(${selectedAssets.length})`}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTransfer;