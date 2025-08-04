// src/pages/users/BulkUserOperations.tsx
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/users';

interface User {
  id: string;
  fullName: string;
  email: string;
  role?: string;
  status?: string;
  department?: {
    name: string;
  };
}

interface BulkOperation {
  type: 'status' | 'role' | 'department' | 'delete';
  value?: string;
  userIds: string[];
}

const BulkUserOperations: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [bulkOperation, setBulkOperation] = useState<BulkOperation>({
    type: 'status',
    userIds: []
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setBulkOperation(prev => ({ ...prev, userIds: selectedUsers }));
  }, [selectedUsers]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const executeBulkOperation = async () => {
    if (selectedUsers.length === 0) {
      alert('Lütfen kullanıcı seçin');
      return;
    }

    if (!bulkOperation.value && bulkOperation.type !== 'delete') {
      alert('Lütfen işlem değeri seçin');
      return;
    }

    const confirmMessage = `${selectedUsers.length} kullanıcı için ${
      bulkOperation.type === 'status' ? 'durum değişikliği' :
      bulkOperation.type === 'role' ? 'rol değişikliği' :
      bulkOperation.type === 'department' ? 'departman değişikliği' :
      'silme işlemi'
    } yapılacak. Onaylıyor musunuz?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setOperationLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (bulkOperation.type === 'delete') {
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        alert(`${selectedUsers.length} kullanıcı başarıyla silindi`);
      } else {
        // Update users with new values
        setUsers(prev => prev.map(user => {
          if (selectedUsers.includes(user.id)) {
            return {
              ...user,
              [bulkOperation.type]: bulkOperation.value
            };
          }
          return user;
        }));
        alert(`${selectedUsers.length} kullanıcı başarıyla güncellendi`);
      }
      
      setSelectedUsers([]);
      setBulkOperation({ type: 'status', userIds: [] });
      
    } catch (error) {
      alert('İşlem başarısız oldu');
    } finally {
      setOperationLoading(false);
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'status': return 'bi-toggle-on';
      case 'role': return 'bi-shield';
      case 'department': return 'bi-building';
      case 'delete': return 'bi-trash';
      default: return 'bi-gear';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Suspended': return 'bg-danger';
      default: return 'bg-primary';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SuperAdmin': return 'bg-danger';
      case 'Admin': return 'bg-warning';
      case 'DepartmentAdmin': return 'bg-info';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📚 Toplu İşlemler</h4>
          <p className="text-muted mb-0">Çoklu kullanıcı üzerinde toplu işlemler yapın</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary fs-6">
            {selectedUsers.length} kullanıcı seçili
          </span>
          <button 
            className="btn btn-danger btn-sm"
            onClick={executeBulkOperation}
            disabled={selectedUsers.length === 0 || operationLoading}
          >
            {operationLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                İşleniyor...
              </>
            ) : (
              <>
                <i className={`bi ${getOperationIcon(bulkOperation.type)} me-1`}></i>
                İşlemi Uygula
              </>
            )}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Bulk Operation Panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-gear me-2 text-primary"></i>
                Toplu İşlem Ayarları
              </h6>
            </div>
            <div className="card-body">
              {/* İşlem Tipi */}
              <div className="mb-3">
                <label className="form-label fw-medium">İşlem Tipi</label>
                <select 
                  className="form-select"
                  value={bulkOperation.type}
                  onChange={(e) => setBulkOperation(prev => ({ 
                    ...prev, 
                    type: e.target.value as any,
                    value: undefined 
                  }))}
                >
                  <option value="status">Durum Değiştir</option>
                  <option value="role">Rol Değiştir</option>
                  <option value="department">Departman Değiştir</option>
                  <option value="delete">Kullanıcıları Sil</option>
                </select>
              </div>

              {/* İşlem Değeri */}
              {bulkOperation.type !== 'delete' && (
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    {bulkOperation.type === 'status' ? 'Yeni Durum' :
                     bulkOperation.type === 'role' ? 'Yeni Rol' :
                     'Yeni Departman'}
                  </label>
                  <select 
                    className="form-select"
                    value={bulkOperation.value || ''}
                    onChange={(e) => setBulkOperation(prev => ({ 
                      ...prev, 
                      value: e.target.value 
                    }))}
                  >
                    <option value="">Seçin...</option>
                    {bulkOperation.type === 'status' && (
                      <>
                        <option value="Active">Aktif</option>
                        <option value="Inactive">Pasif</option>
                        <option value="Suspended">Askıda</option>
                      </>
                    )}
                    {bulkOperation.type === 'role' && (
                      <>
                        <option value="User">👤 Kullanıcı</option>
                        <option value="DepartmentAdmin">👥 Departman Yöneticisi</option>
                        <option value="Admin">⚡ Sistem Yöneticisi</option>
                        <option value="SuperAdmin">🔧 Süper Yönetici</option>
                      </>
                    )}
                    {bulkOperation.type === 'department' && (
                      <>
                        <option value="it">BT Departmanı</option>
                        <option value="hr">İnsan Kaynakları</option>
                        <option value="ops">Operasyon</option>
                        <option value="finance">Mali İşler</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Uyarı Mesajı */}
              {bulkOperation.type === 'delete' && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Dikkat!</strong> Bu işlem geri alınamaz.
                </div>
              )}

              {/* Özet */}
              <div className="bg-light rounded p-3">
                <h6 className="fw-semibold mb-2">İşlem Özeti</h6>
                <div className="d-flex justify-content-between mb-1">
                  <span>Seçili Kullanıcı:</span>
                  <span className="fw-medium">{selectedUsers.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>İşlem Tipi:</span>
                  <span className="fw-medium">
                    {bulkOperation.type === 'status' ? 'Durum Değiştir' :
                     bulkOperation.type === 'role' ? 'Rol Değiştir' :
                     bulkOperation.type === 'department' ? 'Departman Değiştir' :
                     'Sil'}
                  </span>
                </div>
                {bulkOperation.value && (
                  <div className="d-flex justify-content-between">
                    <span>Yeni Değer:</span>
                    <span className="fw-medium">{bulkOperation.value}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="col-lg-8">
          {/* Filters */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="">Tüm Roller</option>
                    <option value="User">Kullanıcı</option>
                    <option value="DepartmentAdmin">Departman Yöneticisi</option>
                    <option value="Admin">Sistem Yöneticisi</option>
                    <option value="SuperAdmin">Süper Yönetici</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Tüm Durumlar</option>
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Pasif</option>
                    <option value="Suspended">Askıda</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex align-items-center">
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <span className="fw-medium">
                  {filteredUsers.length} kullanıcı ({selectedUsers.length} seçili)
                </span>
              </div>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                  <p className="mt-2 text-muted">Yükleniyor...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>Kullanıcı</th>
                        <th>E-posta</th>
                        <th>Rol</th>
                        <th>Durum</th>
                        <th>Departman</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr 
                          key={user.id}
                          className={selectedUsers.includes(user.id) ? 'table-primary' : ''}
                        >
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelect(user.id)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <div>
                                <div className="fw-medium">{user.fullName}</div>
                                <small className="text-muted">ID: {user.id.slice(0, 8)}...</small>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${getRoleBadge(user.role)}`}>
                              {user.role || 'User'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(user.status)}`}>
                              {user.status || 'Active'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {user.department?.name || 'Atanmamış'}
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
        </div>
      </div>
    </div>
  );
};

export default BulkUserOperations;