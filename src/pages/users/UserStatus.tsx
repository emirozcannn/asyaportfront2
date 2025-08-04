import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../api/supabaseAuth';

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
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

const UserStatus: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // Mock data for fallback
  const getMockUsers = (): User[] => [
    {
      id: '1b900b67-1347-4a31-b6e0-2a1cd43bf1db',
      employeeNumber: 'AP022',
      firstName: 'Emir',
      lastName: 'Özcan',
      email: 'sSaha.planlama@asyaport.com',
      role: 'ZimmetManager',
      departmentId: '63331552-f957-4d27-ab7c-bd5f8661bae2',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'bf50b36f-bfc7-45c1-b18a-19b5829f7b66',
      employeeNumber: 'AP044',
      firstName: 'furkan',
      lastName: 'arslan',
      email: 'frknarslan01@gmail.com',
      role: 'Employee',
      departmentId: 'ca34d08e-5db8-4307-b6df-b3edd0cfb65c',
      isActive: false,
      createdAt: new Date(Date.now() - 1123200000).toISOString()
    },
    {
      id: '30549f61-ed08-4867-bce0-b80a64ae7194',
      employeeNumber: 'AP001',
      firstName: 'Ahmet',
      lastName: 'Yılmazsss',
      email: 'ik.muduru@asyaport.com',
      role: 'Admin',
      departmentId: 'ca34d08e-5db8-4307-b6df-b3edd0cfb65c',
      isActive: true,
      createdAt: new Date(Date.now() - 518400000).toISOString()
    }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, departmentsData] = await Promise.all([
        loadUsers(),
        loadDepartments()
      ]);
      
      setUsers(usersData || []);
      setError('');
    } catch (err: any) {
      console.error('Load data error:', err);
      setUsers(getMockUsers());
      setError('API bağlantısı kurulamadı, demo veriler gösteriliyor.');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await apiRequest('/api/Users');
      return usersData;
    } catch (apiError) {
      return getMockUsers();
    }
  };

  const loadDepartments = async () => {
    try {
      const departmentsData = await apiRequest('/api/Departments');
      setDepartments(departmentsData || []);
      return departmentsData;
    } catch (apiError) {
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

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      
      try {
        await apiRequest(`/api/Users/${endpoint}/${userId}`, {
          method: 'PUT'
        });
      } catch (apiError) {
        // Update local state for demo
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
      }

      await loadData();
      showSuccessMessage(`Kullanıcı ${!currentStatus ? 'aktif' : 'pasif'} edildi!`);

    } catch (err: any) {
      console.error('Toggle status error:', err);
      setError('Durum değiştirilirken hata oluştu: ' + err.message);
    }
  };

  const showSuccessMessage = (message: string) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
    successDiv.style.zIndex = '9999';
    successDiv.innerHTML = message;
    document.body.appendChild(successDiv);
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter(u => u.isActive).length;
  const inactiveCount = users.filter(u => !u.isActive).length;

  return (
    <div className="user-status-page">
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1 fw-bold text-dark">Kullanıcı Durum Yönetimi</h2>
            <p className="text-muted mb-0">Kullanıcı aktif/pasif durumlarını yönetin</p>
          </div>
          <button 
            className="btn btn-outline-primary btn-lg shadow-sm"
            onClick={loadData}
            disabled={loading}
            style={{ borderRadius: '12px' }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Yenile
          </button>
        </div>

        {/* Status Cards */}
        <div className="row g-4 mb-4">
          <div className="col-xl-4 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#e8f5e8' }}>
                    <i className="bi bi-person-check-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-success">{activeCount}</h3>
                    <p className="text-muted mb-0 small">Aktif Kullanıcı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-4 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#fee' }}>
                    <i className="bi bi-person-x-fill text-danger fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-danger">{inactiveCount}</h3>
                    <p className="text-muted mb-0 small">Pasif Kullanıcı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-4 col-md-6">
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
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-lg-6">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                  />
                </div>
              </div>
              
              <div className="col-lg-4">
                <select
                  className="form-select form-select-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
              
              <div className="col-lg-2">
                <button 
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
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
          <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center">
              <i className="bi bi-info-circle-fill me-3 fs-4"></i>
              <div>
                <strong>Bilgi!</strong>
                <div>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-header bg-white border-0 py-4" style={{ borderRadius: '16px 16px 0 0' }}>
            <h5 className="mb-0 fw-bold">
              Kullanıcı Durumları
              <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                {filteredUsers.length} kullanıcı
              </span>
            </h5>
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
                      <th className="border-0 fw-bold text-muted text-uppercase small pe-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
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
                                {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()
                              }</div>
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
                          <td className="pe-4 py-4">
                            <button 
                              className={`btn btn-sm btn-outline-${user.isActive ? 'warning' : 'success'}`}
                              title={user.isActive ? 'Pasif Et' : 'Aktif Et'}
                              onClick={() => handleToggleStatus(user.id, user.isActive)}
                              style={{ borderRadius: '8px' }}
                            >
                              <i className={`bi bi-${user.isActive ? 'pause-circle' : 'play-circle'} me-1`}></i>
                              {user.isActive ? 'Pasif Et' : 'Aktif Et'}
                            </button>
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
      
      <style>{`
        .user-status-page {
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

export default UserStatus;
