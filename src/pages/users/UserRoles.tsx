// src/pages/users/UserRoles.tsx - Düzeltilmiş versiyon
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/users';

// Local types
interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  userCount?: number;
}

const UserRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Mock data for roles
  const mockRoles: Role[] = [
    {
      id: '1',
      name: 'SuperAdmin',
      displayName: '🔧 Süper Yönetici',
      permissions: [
        'Sistem yönetimi',
        'Tüm modüllere erişim',
        'Kullanıcı yönetimi',
        'Rol atama',
        'Sistem ayarları',
        'Veri yedekleme'
      ],
      userCount: 2
    },
    {
      id: '2',
      name: 'Admin',
      displayName: '⚡ Sistem Yöneticisi',
      permissions: [
        'Kullanıcı yönetimi',
        'Departman yönetimi',
        'Zimmet yönetimi',
        'Rapor görüntüleme',
        'Sistem ayarları (sınırlı)'
      ],
      userCount: 5
    },
    {
      id: '3',
      name: 'DepartmentAdmin',
      displayName: '👥 Departman Yöneticisi',
      permissions: [
        'Departman kullanıcıları yönetimi',
        'Departman zimmetleri',
        'Talep onaylama',
        'Departman raporları'
      ],
      userCount: 8
    },
    {
      id: '4',
      name: 'User',
      displayName: '👤 Kullanıcı',
      permissions: [
        'Zimmet görüntüleme',
        'Talep oluşturma',
        'Profil yönetimi',
        'Zimmet iade'
      ],
      userCount: 45
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Kullanıcıları yükle
      const usersData = await getAllUsers();
      setUsers(usersData);
      
      // Rolleri yükle (mock data kullan)
      setRoles(mockRoles);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Rol atama (mock function - backend endpoint yoksa)
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      return;
    }

    try {
      setAssignLoading(true);
      
      // Mock API call - gerçek backend'de assignUserRole çağrılacak
      // await assignUserRole(selectedUser, selectedRole.name);
      
      // Simüle et
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kullanıcıları yeniden yükle
      await loadData();
      
      // Formu temizle
      setSelectedUser('');
      setSelectedRole(null);
      
      alert('Rol başarıyla atandı!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Rol atanamadı');
    } finally {
      setAssignLoading(false);
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'SuperAdmin': return 'danger';
      case 'Admin': return 'warning';
      case 'DepartmentAdmin': return 'info';
      default: return 'primary';
    }
  };

  const getPermissionIcon = (permission: string) => {
    if (permission.includes('Sistem')) return 'bi-gear-fill';
    if (permission.includes('Kullanıcı')) return 'bi-people-fill';
    if (permission.includes('Departman')) return 'bi-building';
    if (permission.includes('Zimmet')) return 'bi-box-seam';
    if (permission.includes('Rapor')) return 'bi-graph-up';
    if (permission.includes('Talep')) return 'bi-clipboard-check';
    return 'bi-check-circle';
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Rol bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-triangle fs-1 mb-3"></i>
          <h5>Hata!</h5>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={loadData}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🛡️ Kullanıcı Rolleri</h4>
          <p className="text-muted mb-0">Sistem rollerini yönet ve kullanıcılara ata</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-shield-plus me-1"></i>
            Yeni Rol
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-person-gear me-1"></i>
            Toplu Rol Atama
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Rol Kartları */}
        <div className="col-lg-8">
          <div className="row g-3">
            {roles.map((role) => (
              <div key={role.id} className="col-md-6">
                <div className={`card border-0 shadow-sm h-100 ${selectedRole?.id === role.id ? 'border-primary' : ''}`}>
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <span className={`badge bg-${getRoleColor(role.name)} me-2`}>
                        {role.displayName}
                      </span>
                      <small className="text-muted">{role.userCount} kullanıcı</small>
                    </div>
                    <button 
                      className={`btn btn-outline-${selectedRole?.id === role.id ? 'primary' : 'secondary'} btn-sm`}
                      onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
                    >
                      {selectedRole?.id === role.id ? 'Seçili' : 'Seç'}
                    </button>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title mb-3">Yetkiler:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {role.permissions.map((permission, index) => (
                        <span key={index} className="badge bg-light text-dark d-flex align-items-center">
                          <i className={`bi ${getPermissionIcon(permission)} me-1`}></i>
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="bi bi-people me-1"></i>
                        {role.userCount} aktif kullanıcı
                      </small>
                      <div className="dropdown">
                        <button
                          className="btn btn-outline-secondary btn-sm dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          İşlemler
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="bi bi-eye me-2"></i>Detayları Gör
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="bi bi-pencil me-2"></i>Düzenle
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="bi bi-people me-2"></i>Kullanıcıları Gör
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rol Atama Paneli */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-person-gear me-2 text-primary"></i>
                Rol Atama
              </h6>
            </div>
            <div className="card-body">
              {selectedRole ? (
                <>
                  <div className="alert alert-info d-flex align-items-center">
                    <i className="bi bi-info-circle me-2"></i>
                    <div>
                      <strong>{selectedRole.displayName}</strong> rolü seçildi
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="userSelect" className="form-label">
                      Kullanıcı Seç <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="userSelect"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value="">Kullanıcı seçin...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    onClick={handleAssignRole}
                    disabled={!selectedUser || assignLoading}
                  >
                    {assignLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Atanıyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i>
                        Rol Ata
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-muted mb-3">
                    <i className="bi bi-shield fs-1"></i>
                  </div>
                  <p className="text-muted">
                    Rol atamak için önce bir rol seçin
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* İstatistikler */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-graph-up me-2 text-success"></i>
                Rol İstatistikleri
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <div className="text-center">
                    <div className="fw-bold text-primary fs-4">{roles.length}</div>
                    <small className="text-muted">Toplam Rol</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <div className="fw-bold text-success fs-4">{users.length}</div>
                    <small className="text-muted">Toplam Kullanıcı</small>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Yöneticiler</small>
                <span className="badge bg-warning">
                  {roles.filter(r => r.name.includes('Admin')).reduce((sum, r) => sum + (r.userCount || 0), 0)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Normal Kullanıcılar</small>
                <span className="badge bg-primary">
                  {roles.find(r => r.name === 'User')?.userCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
      