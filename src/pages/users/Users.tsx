// src/pages/users/Users.tsx - UserDetailModal entegreli versiyon
import React, { useState, useEffect } from 'react';
import { deleteUser } from '../../api/users';
import { getAllUsers } from '../../api/users/getAllUsers';
import UserDetailModal from './UserDetailModal';

// API'den gelen User type (API response'a uygun)
interface ApiUser {
  id: string;
  email: string;
  full_name: string;  // API'den gelen field name
  role: string;
  employee_number: string;
  created_at: string;
}

// Frontend'de kullandığımız normalize edilmiş User type
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  employeeNumber: string;
  createdAt: string;
  status: 'Active' | 'Inactive'; // Default status
}

interface UserFilters {
  search?: string;
  role?: string;
}

// API response'unu frontend formatına çevir
const normalizeUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  fullName: apiUser.full_name,
  email: apiUser.email,
  role: apiUser.role,
  employeeNumber: apiUser.employee_number,
  createdAt: apiUser.created_at,
  status: 'Active' // Default status (API'de status field'ı yok)
});

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; user?: User }>({ show: false });
  const [selectedRole, setSelectedRole] = useState('');
  
  // UserDetail Modal states
  const [userDetailModal, setUserDetailModal] = useState<{ show: boolean; user: User | null }>({
    show: false,
    user: null
  });

  // Kullanıcıları yükle
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUsers = await getAllUsers();
      const normalizedUsers = apiUsers.map(normalizeUser);
      setUsers(normalizedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Client-side filtreleme (API filtreleme olmadığı için)
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !selectedRole || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

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
    if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // UserDetail modal aç
  const openUserDetailModal = (user: User) => {
    setUserDetailModal({ show: true, user });
  };

  // UserDetail modal kapat
  const closeUserDetailModal = () => {
    setUserDetailModal({ show: false, user: null });
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
      setSelectedUsers(prev => prev.filter(id => id !== deleteModal.user!.id));
      closeDeleteModal();
    } catch (err) {
      alert('Kullanıcı silinemedi: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    }
  };

  // CSV Export
  const handleExport = () => {
    const csvContent = [
      ['Ad Soyad', 'E-posta', 'Rol', 'Personel No', 'Oluşturma Tarihi'],
      ...filteredUsers.map(user => [
        user.fullName,
        user.email,
        getRoleDisplayName(user.role),
        user.employeeNumber,
        new Date(user.createdAt).toLocaleDateString('tr-TR')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kullanicilar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'bg-danger';
      case 'Admin': return 'bg-warning';
      case 'departmentAdmin': return 'bg-info';
      case 'User': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'Süper Admin';
      case 'Admin': return 'Admin';
      case 'departmentAdmin': return 'Departman Admin';
      case 'User': return 'Kullanıcı';
      default: return role;
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">👥 Kullanıcı Yönetimi</h4>
          <p className="text-muted mb-0">
            Sistem kullanıcılarını görüntüle ve yönet • {users.length} kullanıcı
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
                  placeholder="Kullanıcı ara (isim, email, personel no)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Tüm Roller</option>
                <option value="SuperAdmin">Süper Admin</option>
                <option value="Admin">Admin</option>
                <option value="departmentAdmin">Departman Admin</option>
                <option value="User">Kullanıcı</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('');
                }}
              >
                <i className="bi bi-x-lg me-1"></i>
                Temizle
              </button>
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
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
              <span className="fw-medium">
                {filteredUsers.length} kullanıcı
                {selectedUsers.length > 0 && ` (${selectedUsers.length} seçili)`}
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
              <p className="mt-2 text-muted">Kullanıcılar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <h6 className="text-danger">Hata!</h6>
              <p className="text-muted">{error}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={loadUsers}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Tekrar Dene
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-3">
                <i className="bi bi-person-x fs-1"></i>
              </div>
              <h6 className="text-muted">Kullanıcı Bulunamadı</h6>
              <p className="text-muted">
                {searchTerm || selectedRole ? 'Arama kriterlerinizi değiştirip tekrar deneyin' : 'Henüz kullanıcı eklenmemiş'}
              </p>
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
                    <th>Personel No</th>
                    <th>Oluşturma Tarihi</th>
                    <th style={{ width: '100px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
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
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
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
                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td>
                        <code className="bg-light px-2 py-1 rounded">{user.employeeNumber}</code>
                      </td>
                      <td>
                        <small className="text-muted">
                          {user.createdAt !== '0001-01-01T02:00:00' ? 
                            new Date(user.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'Belirtilmemiş'
                          }
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openUserDetailModal(user)}
                            title="Görüntüle"
                          >
                            <i className="bi bi-eye"></i>
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
      </div>

      {/* UserDetail Modal */}
      <UserDetailModal
        show={userDetailModal.show}
        user={userDetailModal.user}
        onClose={closeUserDetailModal}
        onEdit={(userId) => {
          closeUserDetailModal();
          // TODO: EditUser modal'ını aç veya sayfasına yönlendir
          console.log('Edit user:', userId);
        }}
      />

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
                  <strong>{deleteModal.user.fullName}</strong> ({deleteModal.user.email}) adlı kullanıcıyı silmek istediğinizden emin misiniz?
                </p>
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
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