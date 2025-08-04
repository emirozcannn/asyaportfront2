// src/pages/users/Users.tsx - Düzeltilmiş versiyon
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/users';

// Local types - import sorunlarını önlemek için
interface User {
  id: string;
  fullName: string;
  email: string;
  department?: {
    name: string;
  };
  role?: string;
  status?: string;
  lastLogin?: string;
}

interface UserFilters {
  search?: string;
  departmentId?: string;
  role?: string;
  status?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Kullanıcıları yükleme
  const loadUsers = async (filters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getAllUsers(filters);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Arama işlemi
  const handleSearch = () => {
    loadUsers({ search: searchTerm });
  };

  // Kullanıcı seçme/seçimi kaldırma
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Tümünü seç/seçimi kaldır
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'SuperAdmin': return 'bg-danger';
      case 'Admin': return 'bg-warning';
      case 'DepartmentAdmin': return 'bg-info';
      default: return 'bg-primary';
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Suspended': return 'bg-danger';
      default: return 'bg-success';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">👥 Kullanıcı Yönetimi</h4>
          <p className="text-muted mb-0">Sistem kullanıcılarını görüntüle ve yönet</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => window.location.href = '/dashboard/users/add'}
          >
            <i className="bi bi-person-plus me-1"></i>
            Yeni Kullanıcı
          </button>
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
                  placeholder="Kullanıcı ara (isim, email)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-primary" onClick={handleSearch}>
                  Ara
                </button>
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Tüm Departmanlar</option>
                <option value="it">BT Departmanı</option>
                <option value="hr">İK Departmanı</option>
                <option value="ops">Operasyon</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="suspended">Askıya Alınmış</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
              <span className="fw-medium">
                {users.length} kullanıcı {selectedUsers.length > 0 && `(${selectedUsers.length} seçili)`}
              </span>
            </div>
            {selectedUsers.length > 0 && (
              <div className="d-flex gap-2">
                <button className="btn btn-outline-warning btn-sm">
                  <i className="bi bi-pencil me-1"></i>
                  Toplu Düzenle
                </button>
                <button className="btn btn-outline-danger btn-sm">
                  <i className="bi bi-trash me-1"></i>
                  Sil ({selectedUsers.length})
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="mt-2 text-muted">Kullanıcılar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <h6 className="text-danger">Hata!</h6>
              <p className="text-muted">{error}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={() => loadUsers()}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Tekrar Dene
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-3">
                <i className="bi bi-person-x fs-1"></i>
              </div>
              <h6 className="text-muted">Kullanıcı Bulunamadı</h6>
              <p className="text-muted">Arama kriterlerinizi değiştirip tekrar deneyin</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Kullanıcı</th>
                    <th>E-posta</th>
                    <th>Departman</th>
                    <th>Rol</th>
                    <th>Durum</th>
                    <th>Son Giriş</th>
                    <th style={{ width: '100px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
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
                      <td>
                        <span className="text-muted">{user.email}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {user.department?.name || 'Atanmamış'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(user.status)}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                        </small>
                      </td>
                      <td>
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
                              <a className="dropdown-item" href="#">
                                <i className="bi bi-eye me-2"></i>Görüntüle
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="bi bi-pencil me-2"></i>Düzenle
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="bi bi-shield me-2"></i>Rol Değiştir
                              </a>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <a className="dropdown-item text-danger" href="#">
                                <i className="bi bi-trash me-2"></i>Sil
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="card-footer bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Toplam {users.length} kullanıcı gösteriliyor
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <span className="page-link">Önceki</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Sonraki</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;