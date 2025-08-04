import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/supabaseAuth';

interface User {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  passwordHash?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface EditUserData {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: string;
  isActive: boolean;
  passwordHash: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserData>({
    id: '',
    employeeNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'Employee',
    departmentId: '',
    isActive: true,
    passwordHash: '',
    createdAt: ''
  });

  // Operation loading states
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, departmentsData] = await Promise.all([
        apiRequest('/api/Users'),
        loadDepartments()
      ]);
      
      setUsers(usersData || []);
      setError('');
    } catch (err: any) {
      console.error('Load data error:', err);
      setError('Veriler yüklenirken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const departmentsData = await apiRequest('/api/Departments');
      setDepartments(departmentsData || []);
      return departmentsData;
    } catch (apiError) {
      // If departments API doesn't exist, use mock data
      console.warn('Departments API not available, using mock data');
      const mockDepartments = [
        { id: '299f14dc-5b25-484b-9041-f3bfdf8c2417', name: 'Operasyon Departmanı' },
        { id: 'c621f3a8-a543-4f5f-af38-480f2d1534f1', name: 'Teknik Departman' },
        { id: 'a99dceab-cf11-4787-b447-fe57ff6d3af0', name: 'Bilgi İşlem Departmanı' },
        { id: '63331552-f957-4d27-ab7c-bd5f8661bae2', name: 'Planlama Departmanı' },
        { id: 'ca34d08e-5db8-4307-b6df-b3edd0cfb65c', name: 'İnsan Kaynakları Departmanı' }
      ];
      setDepartments(mockDepartments);
      return mockDepartments;
    }
  };

  // Role mapping
  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: { name: string; color: string } } = {
      'Admin': { name: 'Sistem Yöneticisi', color: 'danger' },
      'ZimmetManager': { name: 'Zimmet Yöneticisi', color: 'primary' },
      'Employee': { name: 'Çalışan', color: 'success' },
      'Manager': { name: 'Yönetici', color: 'warning' }
    };
    
    return roleMap[role] || { name: role, color: 'secondary' };
  };

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Belirtilmemiş';
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesDepartment = !filterDepartment || user.departmentId === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Get unique roles
  const uniqueRoles = [...new Set(users.map(u => u.role))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // CRUD Operations

  // View User Details
  const handleViewUser = async (userId: string) => {
    try {
      const userData = await apiRequest(`/api/Users/${userId}`);
      setSelectedUser(userData);
      setShowViewModal(true);
    } catch (err: any) {
      console.error('Get user error:', err);
      setError('Kullanıcı bilgileri alınırken hata oluştu: ' + err.message);
    }
  };

  // Edit User
  const handleEditUser = async (userId: string) => {
    try {
      const userData = await apiRequest(`/api/Users/${userId}`);
      setEditFormData({
        id: userData.id,
        employeeNumber: userData.employeeNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        departmentId: userData.departmentId,
        isActive: userData.isActive,
        passwordHash: userData.passwordHash || '',
        createdAt: userData.createdAt
      });
      setShowEditModal(true);
    } catch (err: any) {
      console.error('Get user for edit error:', err);
      setError('Kullanıcı bilgileri alınırken hata oluştu: ' + err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      // API expects the ID in the path and the same ID in body
      const updateData = {
        ...editFormData,
        id: editFormData.id // Ensure ID matches
      };

      await apiRequest(`/api/Users/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      setShowEditModal(false);
      setError('');
      await loadData(); // Refresh the list
      
      // Show success message briefly
      setError(''); // Clear any previous errors
      const successDiv = document.createElement('div');
      successDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
      successDiv.style.zIndex = '9999';
      successDiv.innerHTML = 'Kullanıcı başarıyla güncellendi!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);

    } catch (err: any) {
      console.error('Update user error:', err);
      setError('Kullanıcı güncellenirken hata oluştu: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    try {
      await apiRequest(`/api/Users/${selectedUser.id}`, {
        method: 'DELETE'
      });

      setShowDeleteModal(false);
      setSelectedUser(null);
      setError('');
      await loadData(); // Refresh the list

      // Show success message briefly
      const successDiv = document.createElement('div');
      successDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
      successDiv.style.zIndex = '9999';
      successDiv.innerHTML = 'Kullanıcı başarıyla silindi!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);

    } catch (err: any) {
      console.error('Delete user error:', err);
      setError('Kullanıcı silinirken hata oluştu: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Navigate to Add User
  const handleAddUser = () => {
    navigate('/dashboard/users/add');
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Role options for edit form
  const roleOptions = [
    { value: 'Employee', label: 'Çalışan' },
    { value: 'ZimmetManager', label: 'Zimmet Yöneticisi' },
    { value: 'Manager', label: 'Yönetici' },
    { value: 'Admin', label: 'Sistem Yöneticisi' }
  ];

  return (
    <div className="users-page">
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1 fw-bold text-dark">Kullanıcı Yönetimi</h2>
            <p className="text-muted mb-0">Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin</p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success btn-lg shadow-sm"
              onClick={handleAddUser}
              style={{ borderRadius: '12px' }}
            >
              <i className="bi bi-person-plus me-2"></i>
              Yeni Kullanıcı
            </button>
            <button 
              className="btn btn-outline-primary btn-lg shadow-sm"
              onClick={loadData}
              disabled={loading}
              style={{ borderRadius: '12px' }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Yenile
            </button>
            <button 
              className="btn btn-secondary btn-lg shadow-sm"
              onClick={() => window.print()}
              style={{ borderRadius: '12px' }}
            >
              <i className="bi bi-printer me-2"></i>
              Yazdır
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#e3f2fd' }}>
                    <i className="bi bi-people-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-primary">{users.length}</h3>
                    <p className="text-muted mb-0 small">Toplam Kullanıcı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#e8f5e8' }}>
                    <i className="bi bi-person-check-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-success">{users.filter(u => u.isActive).length}</h3>
                    <p className="text-muted mb-0 small">Aktif Kullanıcı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#fff3e0' }}>
                    <i className="bi bi-shield-check-fill text-warning fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-warning">{users.filter(u => u.role === 'Admin').length}</h3>
                    <p className="text-muted mb-0 small">Yönetici</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#fce4ec' }}>
                    <i className="bi bi-building-fill text-danger fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-danger">{departments.length}</h3>
                    <p className="text-muted mb-0 small">Departman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-lg-4">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Ad, soyad, email veya çalışan numarası ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                  />
                </div>
              </div>
              
              <div className="col-lg-3">
                <select
                  className="form-select form-select-lg"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                >
                  <option value="">Tüm Roller</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role).name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-lg-3">
                <select
                  className="form-select form-select-lg"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                >
                  <option value="">Tüm Departmanlar</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-lg-2">
                <button 
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('');
                    setFilterDepartment('');
                  }}
                  style={{ borderRadius: '12px' }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
              <div>
                <strong>Hata!</strong>
                <div>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-header bg-white border-0 py-4" style={{ borderRadius: '16px 16px 0 0' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                Kullanıcı Listesi 
                <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                  {filteredUsers.length} kullanıcı
                </span>
              </h5>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={loadData}
                disabled={loading}
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Yenile
              </button>
            </div>
          </div>
          
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Yükleniyor...</span>
                </div>
                <p className="text-muted">Kullanıcılar yükleniyor...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                <h5 className="text-muted">Kullanıcı bulunamadı</h5>
                <p className="text-muted">Arama kriterlerinizi değiştirmeyi deneyin</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 fw-bold text-muted text-uppercase small ps-4">Kullanıcı</th>
                      <th className="border-0 fw-bold text-muted text-uppercase small">Çalışan No</th>
                      <th className="border-0 fw-bold text-muted text-uppercase small">Departman</th>
                      <th className="border-0 fw-bold text-muted text-uppercase small">Rol</th>
                      <th className="border-0 fw-bold text-muted text-uppercase small">Durum</th>
                      <th className="border-0 fw-bold text-muted text-uppercase small">Kayıt Tarihi</th>
                      <th className="border-0 fw-bold text-muted text-uppercase small pe-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const roleInfo = getRoleDisplayName(user.role);
                      return (
                        <tr key={user.id} className="border-0">
                          <td className="ps-4 py-4">
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle bg-gradient d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                style={{ 
                                  width: '48px', 
                                  height: '48px',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  fontSize: '16px'
                                }}
                              >
                                {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">
                                  {user.firstName} {user.lastName}
                                </div>
                                <small className="text-muted">{user.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2" style={{ borderRadius: '8px' }}>
                              {user.employeeNumber}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-dark">{getDepartmentName(user.departmentId)}</span>
                          </td>
                          <td className="py-4">
                            <span className={`badge bg-${roleInfo.color} bg-opacity-10 text-${roleInfo.color} px-3 py-2`} style={{ borderRadius: '8px' }}>
                              {roleInfo.name}
                            </span>
                          </td>
                          <td className="py-4">
                            {user.isActive ? (
                              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2" style={{ borderRadius: '8px' }}>
                                <i className="bi bi-check-circle me-1"></i>
                                Aktif
                              </span>
                            ) : (
                              <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2" style={{ borderRadius: '8px' }}>
                                <i className="bi bi-x-circle me-1"></i>
                                Pasif
                              </span>
                            )}
                          </td>
                          <td className="py-4">
                            <span className="text-muted">{formatDate(user.createdAt)}</span>
                          </td>
                          <td className="pe-4 py-4">
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                title="Düzenle"
                                onClick={() => handleEditUser(user.id)}
                                style={{ borderRadius: '8px 0 0 8px' }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-info"
                                title="Detaylar"
                                onClick={() => handleViewUser(user.id)}
                                style={{ borderRadius: '0' }}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                title="Sil"
                                onClick={() => handleDeleteUser(user)}
                                style={{ borderRadius: '0 8px 8px 0' }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
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
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-info text-white" style={{ borderRadius: '16px 16px 0 0' }}>
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  Kullanıcı Detayları
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ad Soyad</label>
                    <p className="form-control-plaintext">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email</label>
                    <p className="form-control-plaintext">{selectedUser.email}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Çalışan Numarası</label>
                    <p className="form-control-plaintext">{selectedUser.employeeNumber}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Rol</label>
                    <p className="form-control-plaintext">
                      <span className={`badge bg-${getRoleDisplayName(selectedUser.role).color} bg-opacity-10 text-${getRoleDisplayName(selectedUser.role).color} px-3 py-2`}>
                        {getRoleDisplayName(selectedUser.role).name}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Departman</label>
                    <p className="form-control-plaintext">{getDepartmentName(selectedUser.departmentId)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Durum</label>
                    <p className="form-control-plaintext">
                      {selectedUser.isActive ? (
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                          <i className="bi bi-check-circle me-1"></i>
                          Aktif
                        </span>
                      ) : (
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                          <i className="bi bi-x-circle me-1"></i>
                          Pasif
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Kayıt Tarihi</label>
                    <p className="form-control-plaintext">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-primary text-white" style={{ borderRadius: '16px 16px 0 0' }}>
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Kullanıcı Düzenle
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Ad <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Soyad <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Çalışan Numarası <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="employeeNumber"
                        value={editFormData.employeeNumber}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Rol <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="role"
                        value={editFormData.role}
                        onChange={handleEditFormChange}
                        required
                      >
                        {roleOptions.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Departman <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="departmentId"
                        value={editFormData.departmentId}
                        onChange={handleEditFormChange}
                        required
                      >
                        <option value="">Departman seçiniz</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isActive"
                          id="isActive"
                          checked={editFormData.isActive}
                          onChange={handleEditFormChange}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="isActive">
                          Aktif Kullanıcı
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                    disabled={editLoading}
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Güncelleniyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-danger text-white" style={{ borderRadius: '16px 16px 0 0' }}>
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Kullanıcı Sil
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center">
                  <div 
                    className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-person-x text-danger" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="mb-3">Kullanıcıyı silmek istediğinizden emin misiniz?</h5>
                  <p className="text-muted mb-4">
                    <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> ({selectedUser.email}) 
                    kullanıcısı kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                  </p>
                  <div className="alert alert-warning border-0" style={{ borderRadius: '12px' }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Uyarı:</strong> Bu işlem geri alınamaz!
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  İptal
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDeleteUser}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-2"></i>
                      Evet, Sil
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .users-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .table > tbody > tr:hover {
          background-color: #f8f9fa !important;
        }
        
        .btn-group .btn {
          border: 1px solid #dee2e6;
        }
        
        .btn-group .btn:hover {
          z-index: 2;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .badge {
          font-weight: 500;
          letter-spacing: 0.025em;
        }
        
        .table-responsive {
          border-radius: 0 0 16px 16px;
        }
        
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
        
        .modal {
          backdrop-filter: blur(4px);
        }
        
        .modal-content {
          border: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .modal-header {
          border-bottom: none;
        }
        
        .modal-footer {
          border-top: 1px solid #e9ecef;
        }
        
        .btn:disabled {
          opacity: 0.65;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .alert {
          animation: slideIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Users;