// src/pages/users/Users.tsx - Departman entegrasyonlu versiyon
import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../../api/users';
import { getAllDepartments } from '../../api/departments/getAllDepartments';
import type { Department } from '../../api/types/department';

// Local types - import sorunlarını önlemek için
interface User {
  id: string;
  fullName: string;
  email: string;
  departmentId?: string; // API'den gelen departmentId
  department?: {
    id?: string;
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editModal, setEditModal] = useState<{ show: boolean; user?: User }>({ show: false });
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; user?: User }>({ show: false });
  const [editForm, setEditForm] = useState<User | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Departmanları yükleme
  const loadDepartments = async () => {
    try {
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
    } catch (err) {
      console.error('Departmanlar yüklenemedi:', err);
    }
  };

  // Departman adını bulma fonksiyonu
  const getDepartmentName = (departmentId?: string): string => {
    if (!departmentId) return 'Atanmamış';
    const department = departments.find(dept => dept.id === departmentId);
    return department?.name || 'Bilinmeyen Departman';
  };

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
    // Önce departmanları, sonra kullanıcıları yükle
    const initializeData = async () => {
      await loadDepartments();
      await loadUsers();
    };
    initializeData();
  }, []);

  // Arama ve filtreleme işlemi
  const handleFilter = () => {
    const filters: UserFilters = {};
    
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }
    
    if (selectedDepartment) {
      filters.departmentId = selectedDepartment;
    }
    
    if (selectedStatus) {
      filters.status = selectedStatus;
    }
    
    loadUsers(filters);
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedStatus('');
    loadUsers();
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

  // Edit modal aç/kapat
  const openEditModal = (user: User) => {
    setEditForm({
      ...user,
      departmentId: user.departmentId || user.department?.id || ''
    });
    setEditModal({ show: true, user });
  };

  const closeEditModal = () => {
    setEditModal({ show: false });
    setEditForm(null);
  };

  // Delete modal aç/kapat
  const openDeleteModal = (user: User) => setDeleteModal({ show: true, user });
  const closeDeleteModal = () => setDeleteModal({ show: false });

  // Kullanıcı silme işlemi
  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    try {
      await deleteUser(deleteModal.user.id);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.user!.id));
      closeDeleteModal();
    } catch (err) {
      alert('Kullanıcı silinemedi');
    }
  };

  // Kullanıcı güncelleme işlemi
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setEditLoading(true);
    try {
      await updateUser(editForm.id, editForm);
      setUsers(prev => prev.map(u => u.id === editForm.id ? editForm : u));
      closeEditModal();
    } catch (err) {
      alert('Kullanıcı güncellenemedi');
    } finally {
      setEditLoading(false);
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
          <p className="text-muted mb-0">
            Sistem kullanıcılarını görüntüle ve yönet 
            {departments.length > 0 && ` • ${departments.length} departman`}
          </p>
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
            <div className="col-md-4">
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
                  onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Tüm Departmanlar</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="Active">Aktif</option>
                <option value="Inactive">Pasif</option>
                <option value="Suspended">Askıya Alınmış</option>
              </select>
            </div>
            <div className="col-md-2">
              <div className="d-flex gap-1">
                <button className="btn btn-outline-primary flex-fill" onClick={handleFilter}>
                  <i className="bi bi-funnel me-1"></i>
                  Filtrele
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                  title="Filtreleri Temizle"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
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
              <p className="mt-2 text-muted">
                {departments.length === 0 ? 'Departmanlar ve kullanıcılar yükleniyor...' : 'Kullanıcılar yükleniyor...'}
              </p>
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
                        <span className="badge bg-light text-dark border">
                          {getDepartmentName(user.departmentId || user.department?.id)}
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
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openEditModal(user)}
                            title="Düzenle"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => openDeleteModal(user)}
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

      {/* Edit Modal */}
      {editModal.show && editForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Kullanıcıyı Düzenle</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ad Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.fullName}
                      onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-posta</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Departman</label>
                    <select
                      className="form-select"
                      value={editForm.departmentId || ''}
                      onChange={e => setEditForm({ ...editForm, departmentId: e.target.value })}
                    >
                      <option value="">Departman Seçin</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      value={editForm.role || ''}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    >
                      <option value="User">Kullanıcı</option>
                      <option value="DepartmentAdmin">Departman Yöneticisi</option>
                      <option value="Admin">Sistem Yöneticisi</option>
                      <option value="SuperAdmin">Süper Yönetici</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Durum</label>
                    <select
                      className="form-select"
                      value={editForm.status || ''}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="Active">Aktif</option>
                      <option value="Inactive">Pasif</option>
                      <option value="Suspended">Askıya Alınmış</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={editLoading}>
                    {editLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Güncelleniyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i>
                        Güncelle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && deleteModal.user && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Kullanıcıyı Sil
                </h5>
                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>{deleteModal.user.fullName}</strong> adlı kullanıcıyı silmek istediğinizden emin misiniz?
                </p>
                <div className="alert alert-warning">
                  Bu işlem geri alınamaz!
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                  İptal
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>
                  <i className="bi bi-trash me-1"></i>
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;