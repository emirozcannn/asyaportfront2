// src/pages/assets/BulkOperations.tsx
import React, { useState, useEffect } from 'react';

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
  };
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
  location?: string;
  purchaseDate?: string;
  warranty?: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  department?: {
    id: string;
    name: string;
  };
}

interface Department {
  id: string;
  name: string;
}

interface BulkOperationData {
  operation: 'assign' | 'transfer' | 'update_status' | 'update_location' | 'update_category' | 'maintenance' | 'retire';
  targetUserId?: string;
  targetDepartmentId?: string;
  newStatus?: string;
  newLocation?: string;
  newCategoryId?: string;
  maintenanceNote?: string;
  reason: string;
  notes?: string;
  scheduledDate?: string;
}

interface BulkOperationHistory {
  id: string;
  operation: string;
  assetCount: number;
  performedBy: string;
  performedAt: string;
  status: 'completed' | 'failed' | 'partial';
  details: string;
}

const BulkOperations: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [operationHistory, setOperationHistory] = useState<BulkOperationHistory[]>([]);
  
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [operationData, setOperationData] = useState<BulkOperationData>({
    operation: 'assign',
    reason: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load data
  useEffect(() => {
    loadAssets();
    loadUsers();
    loadDepartments();
    loadCategories();
    loadOperationHistory();
  }, []);

  const loadAssets = async () => {
    try {
      // API call will be here
      // const assetsData = await getAllAssets();
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

  const loadCategories = async () => {
    try {
      // API call will be here
      // const categoriesData = await getAssetCategories();
      // setCategories(categoriesData);
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
    }
  };

  const loadOperationHistory = async () => {
    try {
      // API call will be here
      // const historyData = await getBulkOperationHistory();
      // setOperationHistory(historyData);
    } catch (error) {
      console.error('Geçmiş yükleme hatası:', error);
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
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || asset.category.id === filterCategory;
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Operation handlers
  const startOperation = (operation: string) => {
    if (selectedAssets.length === 0) {
      alert('Lütfen işlem yapılacak asset(ları) seçin');
      return;
    }
    
    setCurrentOperation(operation);
    setOperationData({
      operation: operation as any,
      reason: ''
    });
    setShowOperationModal(true);
  };

  // Form validation
  const validateOperation = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!operationData.reason?.trim()) {
      newErrors.reason = 'İşlem nedeni gereklidir';
    }

    if (operationData.operation === 'assign' && !operationData.targetUserId) {
      newErrors.targetUserId = 'Hedef kullanıcı seçimi gereklidir';
    }

    if (operationData.operation === 'transfer' && !operationData.targetDepartmentId) {
      newErrors.targetDepartmentId = 'Hedef departman seçimi gereklidir';
    }

    if (operationData.operation === 'update_status' && !operationData.newStatus) {
      newErrors.newStatus = 'Yeni durum seçimi gereklidir';
    }

    if (operationData.operation === 'update_location' && !operationData.newLocation?.trim()) {
      newErrors.newLocation = 'Yeni konum bilgisi gereklidir';
    }

    if (operationData.operation === 'update_category' && !operationData.newCategoryId) {
      newErrors.newCategoryId = 'Yeni kategori seçimi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Execute bulk operation
  const executeBulkOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOperation()) return;

    setLoading(true);
    try {
      console.log('Toplu işlem yürütülüyor:', {
        assetIds: selectedAssets,
        operation: operationData
      });

      // API call will be here
      // await executeBulkOperation(selectedAssets, operationData);

      setShowOperationModal(false);
      setSelectedAssets([]);
      resetOperationData();
      loadAssets();
      loadOperationHistory();
    } catch (error) {
      console.error('Toplu işlem hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetOperationData = () => {
    setOperationData({
      operation: 'assign',
      reason: ''
    });
    setErrors({});
  };

  // Get operation info
  const getOperationInfo = (operation: string) => {
    const operations = {
      assign: { title: 'Kullanıcıya Ata', icon: 'bi-person-plus', color: 'primary' },
      transfer: { title: 'Departmana Transfer', icon: 'bi-building', color: 'info' },
      update_status: { title: 'Durum Güncelle', icon: 'bi-flag', color: 'warning' },
      update_location: { title: 'Konum Güncelle', icon: 'bi-geo-alt', color: 'success' },
      update_category: { title: 'Kategori Değiştir', icon: 'bi-tags', color: 'secondary' },
      maintenance: { title: 'Bakıma Al', icon: 'bi-tools', color: 'warning' },
      retire: { title: 'Emekliye Ayır', icon: 'bi-archive', color: 'danger' }
    };
    return operations[operation as keyof typeof operations] || operations.assign;
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">⚙️ Toplu İşlemler</h4>
          <p className="text-muted mb-0">Birden fazla asset üzerinde aynı anda işlem yapın</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-clock-history me-1"></i>
            İşlem Geçmişi
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-download me-1"></i>
            Şablon İndir
          </button>
        </div>
      </div>

      {/* Quick Operation Buttons */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-3 col-sm-4 col-6">
          <button
            className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
            onClick={() => startOperation('assign')}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-person-plus fs-4 mb-2"></i>
            <span className="small">Kullanıcıya Ata</span>
            {selectedAssets.length > 0 && (
              <span className="badge bg-primary mt-1">{selectedAssets.length}</span>
            )}
          </button>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-6">
          <button
            className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
            onClick={() => startOperation('transfer')}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-building fs-4 mb-2"></i>
            <span className="small">Departmana Transfer</span>
            {selectedAssets.length > 0 && (
              <span className="badge bg-info mt-1">{selectedAssets.length}</span>
            )}
          </button>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-6">
          <button
            className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
            onClick={() => startOperation('update_status')}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-flag fs-4 mb-2"></i>
            <span className="small">Durum Güncelle</span>
            {selectedAssets.length > 0 && (
              <span className="badge bg-warning mt-1">{selectedAssets.length}</span>
            )}
          </button>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-6">
          <button
            className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
            onClick={() => startOperation('update_location')}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-geo-alt fs-4 mb-2"></i>
            <span className="small">Konum Güncelle</span>
            {selectedAssets.length > 0 && (
              <span className="badge bg-success mt-1">{selectedAssets.length}</span>
            )}
          </button>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-6">
          <button
            className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
            onClick={() => startOperation('maintenance')}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-tools fs-4 mb-2"></i>
            <span className="small">Bakıma Al</span>
            {selectedAssets.length > 0 && (
              <span className="badge bg-warning mt-1">{selectedAssets.length}</span>
            )}
          </button>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-6">
          <button
            className="btn btn-outline-danger w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
            onClick={() => startOperation('retire')}
            disabled={selectedAssets.length === 0}
          >
            <i className="bi bi-archive fs-4 mb-2"></i>
            <span className="small">Emekliye Ayır</span>
            {selectedAssets.length > 0 && (
              <span className="badge bg-danger mt-1">{selectedAssets.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
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
                  placeholder="Asset ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="Available">Müsait</option>
                <option value="Assigned">Atanmış</option>
                <option value="Maintenance">Bakımda</option>
                <option value="Retired">Emekli</option>
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
              <div className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Toplu işlem yapmak için yukarıdaki butonları kullanın
              </div>
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
              <p className="text-muted">Arama kriterlerinizi değiştirip tekrar deneyin</p>
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
                    <th>Garanti</th>
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
                            {asset.assetNumber} | {asset.serialNumber}
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
                            <div className="text-muted small">{asset.currentUser.email}</div>
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
                        <span className="small text-muted">{asset.location || '-'}</span>
                      </td>
                      <td>
                        <span className="small text-muted">
                          {asset.warranty || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Operations */}
      {operationHistory.length > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-transparent border-0">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-clock-history me-2"></i>
              Son İşlemler
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {operationHistory.slice(0, 3).map((operation) => (
                <div key={operation.id} className="col-md-4">
                  <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="fw-medium">{operation.operation}</div>
                        <div className="small text-muted">{operation.assetCount} asset</div>
                      </div>
                      <span className={`badge ${
                        operation.status === 'completed' ? 'bg-success' :
                        operation.status === 'failed' ? 'bg-danger' : 'bg-warning'
                      }`}>
                        {operation.status}
                      </span>
                    </div>
                    <div className="small text-muted">
                      {operation.performedBy} - {new Date(operation.performedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operation Modal */}
      {showOperationModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`${getOperationInfo(currentOperation).icon} me-2`}></i>
                  {getOperationInfo(currentOperation).title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowOperationModal(false);
                    resetOperationData();
                  }}
                ></button>
              </div>
              <form onSubmit={executeBulkOperation}>
                <div className="modal-body">
                  <div className="alert alert-info mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>{selectedAssets.length}</strong> asset seçili. 
                    Bu işlem tüm seçili asset'lar için uygulanacak.
                  </div>

                  <div className="row g-3">
                    {/* Operation specific fields */}
                    {operationData.operation === 'assign' && (
                      <div className="col-12">
                        <label className="form-label">Hedef Kullanıcı <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.targetUserId ? 'is-invalid' : ''}`}
                          value={operationData.targetUserId || ''}
                          onChange={(e) => setOperationData(prev => ({ ...prev, targetUserId: e.target.value }))}
                        >
                          <option value="">Kullanıcı seçin...</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName} - {user.department?.name} ({user.email})
                            </option>
                          ))}
                        </select>
                        {errors.targetUserId && <div className="invalid-feedback">{errors.targetUserId}</div>}
                      </div>
                    )}

                    {operationData.operation === 'transfer' && (
                      <div className="col-12">
                        <label className="form-label">Hedef Departman <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.targetDepartmentId ? 'is-invalid' : ''}`}
                          value={operationData.targetDepartmentId || ''}
                          onChange={(e) => setOperationData(prev => ({ ...prev, targetDepartmentId: e.target.value }))}
                        >
                          <option value="">Departman seçin...</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                        {errors.targetDepartmentId && <div className="invalid-feedback">{errors.targetDepartmentId}</div>}
                      </div>
                    )}

                    {operationData.operation === 'update_status' && (
                      <div className="col-12">
                        <label className="form-label">Yeni Durum <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.newStatus ? 'is-invalid' : ''}`}
                          value={operationData.newStatus || ''}
                          onChange={(e) => setOperationData(prev => ({ ...prev, newStatus: e.target.value }))}
                        >
                          <option value="">Durum seçin...</option>
                          <option value="Available">Müsait</option>
                          <option value="Assigned">Atanmış</option>
                          <option value="Maintenance">Bakımda</option>
                          <option value="Retired">Emekli</option>
                        </select>
                        {errors.newStatus && <div className="invalid-feedback">{errors.newStatus}</div>}
                      </div>
                    )}

                    {operationData.operation === 'update_location' && (
                      <div className="col-12">
                        <label className="form-label">Yeni Konum <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.newLocation ? 'is-invalid' : ''}`}
                          value={operationData.newLocation || ''}
                          onChange={(e) => setOperationData(prev => ({ ...prev, newLocation: e.target.value }))}
                          placeholder="Örn: BT Departmanı - 3. Kat"
                        />
                        {errors.newLocation && <div className="invalid-feedback">{errors.newLocation}</div>}
                      </div>
                    )}

                    {operationData.operation === 'update_category' && (
                      <div className="col-12">
                        <label className="form-label">Yeni Kategori <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.newCategoryId ? 'is-invalid' : ''}`}
                          value={operationData.newCategoryId || ''}
                          onChange={(e) => setOperationData(prev => ({ ...prev, newCategoryId: e.target.value }))}
                        >
                          <option value="">Kategori seçin...</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.newCategoryId && <div className="invalid-feedback">{errors.newCategoryId}</div>}
                      </div>
                    )}

                    {operationData.operation === 'maintenance' && (
                      <div className="col-12">
                        <label className="form-label">Bakım Notu</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={operationData.maintenanceNote || ''}
                          onChange={(e) => setOperationData(prev => ({ ...prev, maintenanceNote: e.target.value }))}
                          placeholder="Bakım detayları ve açıklamaları..."
                        />
                      </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label">İşlem Tarihi</label>
                      <input
                        type="date"
                        className="form-control"
                        value={operationData.scheduledDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setOperationData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">İşlem Nedeni <span className="text-danger">*</span></label>
                      <select
                        className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                        value={operationData.reason}
                        onChange={(e) => setOperationData(prev => ({ ...prev, reason: e.target.value }))}
                      >
                        <option value="">Neden seçin...</option>
                        <option value="bulk_assignment">Toplu Atama</option>
                        <option value="reorganization">Yeniden Organizasyon</option>
                        <option value="maintenance_schedule">Bakım Programı</option>
                        <option value="inventory_update">Envanter Güncelleme</option>
                        <option value="policy_change">Politika Değişikliği</option>
                        <option value="other">Diğer</option>
                      </select>
                      {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Notlar</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={operationData.notes || ''}
                        onChange={(e) => setOperationData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Ek notlar ve açıklamalar..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowOperationModal(false);
                      resetOperationData();
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-${getOperationInfo(currentOperation).color}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <i className={`${getOperationInfo(currentOperation).icon} me-1`}></i>
                        İşlemi Uygula ({selectedAssets.length})
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

export default BulkOperations;