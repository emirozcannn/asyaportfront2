import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Mock data - daha organize edilmiş hali
  const getMockUsers = useCallback((): User[] => [
    {
      id: '1b900b67-1347-4a31-b6e0-2a1cd43bf1db',
      employeeNumber: 'AP022',
      firstName: 'Emir',
      lastName: 'Özcan',
      email: 'sSaha.planlama@asyaport.com',
      role: 'ZimmetManager',
      departmentId: '63331552-f957-4d27-ab7c-bd5f8661bae2',
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: 'YWxwZXIxZW1pcnNhbHRfa2V5'
    },
    {
      id: '1e8418c7-0a27-4679-b2f7-c29a5d536150',
      employeeNumber: 'AP010',
      firstName: 'Şarkana',
      lastName: 'Doğan',
      email: 'bt.mudur@asyaport.com',
      role: 'Manager',
      departmentId: 'a99dceab-cf11-4787-b447-fe57ff6d3af0',
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '2300d4e5-d75b-49c4-be9b-0598a575c8f',
      employeeNumber: 'AP007',
      firstName: 'Zeynep',
      lastName: 'Kara',
      email: 'teknik.mudur@asyaport.com',
      role: 'Manager',
      departmentId: 'c621f3a8-a543-4f5f-af38-480f2d1534f1',
      isActive: true,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '30549f61-ed08-4867-bce0-b80a64ae7194',
      employeeNumber: 'AP001',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ik.muduru@asyaport.com',
      role: 'Admin',
      departmentId: 'ca34d08e-5db8-4307-b6df-b3edd0cfb65c',
      isActive: true,
      createdAt: new Date(Date.now() - 518400000).toISOString()
    },
    {
      id: '5da41160-674a-4cfb-910a-8c53e78f50a8',
      employeeNumber: 'AP004',
      firstName: 'Ali',
      lastName: 'Özkan',
      email: 'operasyon.mudur@asyaport.com',
      role: 'Manager',
      departmentId: '299f14dc-5b25-484b-9041-f3bfdf8c2417',
      isActive: true,
      createdAt: new Date(Date.now() - 691200000).toISOString()
    }
  ], []);

  const getMockDepartments = useCallback((): Department[] => [
    { id: '299f14dc-5b25-484b-9041-f3bfdf8c2417', name: 'Operasyon Departmanı', description: 'Liman operasyon işlemleri' },
    { id: 'c621f3a8-a543-4f5f-af38-480f2d1534f1', name: 'Teknik Departman', description: 'Teknik bakım ve destek' },
    { id: 'a99dceab-cf11-4787-b447-fe57ff6d3af0', name: 'Bilgi İşlem Departmanı', description: 'IT ve sistem yönetimi' },
    { id: '63331552-f957-4d27-ab7c-bd5f8661bae2', name: 'Planlama Departmanı', description: 'Operasyonel planlama' },
    { id: 'ca34d08e-5db8-4307-b6df-b3edd0cfb65c', name: 'İnsan Kaynakları Departmanı', description: 'Personel yönetimi' }
  ], []);

  // Geliştirilmiş API çağrısı fonksiyonu
  const safeApiRequest = async (url: string, options?: RequestInit): Promise<any> => {
    try {
      console.log(`API Request: ${url}`, options);
      const response = await apiRequest(url, options);
      console.log(`API Response from ${url}:`, response);
      return response;
    } catch (error: any) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  };

  // Kullanıcıları yükleme - geliştirilmiş versiyon
  const loadUsers = async (): Promise<User[]> => {
    try {
      // İlk olarak ana endpoint'i dene
      try {
        const usersData = await safeApiRequest('/api/Users');
        if (Array.isArray(usersData) && usersData.length > 0) {
          console.log('Users loaded from main endpoint:', usersData.length);
          return usersData;
        }
      } catch (mainError) {
        console.warn('Main Users endpoint failed, trying email-based approach');
      }

      // Email-based yaklaşım - bilinen email adreslerini dene
      const knownEmails = [
        'sSaha.planlama@asyaport.com',
        'bt.mudur@asyaport.com',
        'teknik.mudur@asyaport.com',
        'ik.muduru@asyaport.com',
        'operasyon.mudur@asyaport.com'
      ];

      const userPromises = knownEmails.map(async (email) => {
        try {
          return await safeApiRequest(`/api/Users/email/${encodeURIComponent(email)}`);
        } catch (error) {
          console.warn(`Failed to load user with email: ${email}`);
          return null;
        }
      });

      const userResults = await Promise.allSettled(userPromises);
      const validUsers = userResults
        .filter((result): result is PromiseFulfilledResult<User> => 
          result.status === 'fulfilled' && result.value && result.value.id
        )
        .map(result => result.value);

      if (validUsers.length > 0) {
        console.log('Users loaded via email lookup:', validUsers.length);
        return validUsers;
      }

      throw new Error('No users could be loaded from API');
    } catch (error) {
      console.warn('All API methods failed, using mock data');
      return getMockUsers();
    }
  };

  // Departmanları yükleme
  const loadDepartments = async (): Promise<Department[]> => {
    try {
      const departmentsData = await safeApiRequest('/api/Departments');
      if (Array.isArray(departmentsData) && departmentsData.length > 0) {
        console.log('Departments loaded from API:', departmentsData.length);
        return departmentsData;
      }
      throw new Error('No departments from API');
    } catch (error) {
      console.warn('Departments API failed, using mock data');
      return getMockDepartments();
    }
  };

  // Ana veri yükleme fonksiyonu
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const [usersData, departmentsData] = await Promise.all([
        loadUsers(),
        loadDepartments()
      ]);
      
      setUsers(usersData);
      setDepartments(departmentsData);
      
      // API bağlantısı sorunlu ise kullanıcıyı bilgilendir
      if (usersData === getMockUsers()) {
        setError('API bağlantısında sorun var. Örnek veriler gösteriliyor.');
      }
    } catch (err: any) {
      console.error('Load data error:', err);
      setUsers(getMockUsers());
      setDepartments(getMockDepartments());
      setError('Veri yüklenirken hata oluştu. Örnek veriler gösteriliyor.');
    } finally {
      setLoading(false);
    }
  }, [getMockUsers, getMockDepartments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Rol görüntüleme
  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: { name: string; color: string } } = {
      'Admin': { name: 'Sistem Yöneticisi', color: 'danger' },
      'ZimmetManager': { name: 'Zimmet Yöneticisi', color: 'primary' },
      'Employee': { name: 'Çalışan', color: 'success' },
      'Manager': { name: 'Yönetici', color: 'warning' }
    };
    return roleMap[role] || { name: role, color: 'secondary' };
  };

  // Departman adı alma
  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Belirtilmemiş';
  };

  // Filtreleme
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

  // Unique roller
  const uniqueRoles = [...new Set(users.map(u => u.role))];

  // Tarih formatlama
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // CRUD İşlemleri

  // Kullanıcı görüntüleme
  const handleViewUser = async (userId: string) => {
    try {
      setLoading(true);
      let userData;
      
      try {
        userData = await safeApiRequest(`/api/Users/${userId}`);
      } catch (apiError) {
        // API başarısız olursa mevcut listeden bul
        userData = users.find(u => u.id === userId);
        if (!userData) {
          throw new Error('Kullanıcı bulunamadı');
        }
      }
      
      setSelectedUser(userData);
      setShowViewModal(true);
    } catch (err: any) {
      console.error('View user error:', err);
      showErrorMessage('Kullanıcı bilgileri alınırken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı düzenleme
  const handleEditUser = async (userId: string) => {
    try {
      let userData;
      
      try {
        userData = await safeApiRequest(`/api/Users/${userId}`);
      } catch (apiError) {
        userData = users.find(u => u.id === userId);
        if (!userData) {
          throw new Error('Kullanıcı bulunamadı');
        }
      }
      
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
      console.error('Edit user preparation error:', err);
      showErrorMessage('Kullanıcı bilgileri alınırken hata oluştu: ' + err.message);
    }
  };

  // Kullanıcı güncelleme - geliştirilmiş versiyon
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      // Sadece gerekli alanları gönder
      const updateData = {
        id: editFormData.id,
        employeeNumber: editFormData.employeeNumber,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        passwordHash: editFormData.passwordHash,
        departmentId: editFormData.departmentId,
        role: editFormData.role,
        isActive: editFormData.isActive,
        createdAt: editFormData.createdAt
      };

      try {
        await safeApiRequest(`/api/Users/${editFormData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        // API başarılıysa veriyi yeniden yükle
        await loadData();
        showSuccessMessage('Kullanıcı başarıyla güncellendi!');
      } catch (apiError) {
        // API başarısız olursa local state'i güncelle
        console.warn('API update failed, updating local state');
        setUsers(prev => prev.map(user => 
          user.id === editFormData.id 
            ? { ...user, ...updateData }
            : user
        ));
        showSuccessMessage('Kullanıcı güncellendi (yerel olarak)');
      }

      setShowEditModal(false);
      setError('');
    } catch (err: any) {
      console.error('Update user error:', err);
      showErrorMessage('Kullanıcı güncellenirken hata oluştu: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Kullanıcı silme
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    try {
      try {
        await safeApiRequest(`/api/Users/${selectedUser.id}`, {
          method: 'DELETE'
        });
        await loadData(); // Başarılıysa veriyi yeniden yükle
        showSuccessMessage('Kullanıcı başarıyla silindi!');
      } catch (apiError) {
        // API başarısız olursa local state'ten kaldır
        console.warn('API delete failed, removing from local state');
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        showSuccessMessage('Kullanıcı silindi (yerel olarak)');
      }

      setShowDeleteModal(false);
      setSelectedUser(null);
      setError('');
    } catch (err: any) {
      console.error('Delete user error:', err);
      showErrorMessage('Kullanıcı silinirken hata oluştu: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Kullanıcı durumu değiştirme
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      
      try {
        await safeApiRequest(`/api/Users/${endpoint}/${userId}`, {
          method: 'PUT'
        });
        await loadData(); // Başarılıysa veriyi yeniden yükle
        showSuccessMessage(`Kullanıcı ${!currentStatus ? 'aktif' : 'pasif'} edildi!`);
      } catch (apiError) {
        // API başarısız olursa local state'i güncelle
        console.warn('API status toggle failed, updating local state');
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
        showSuccessMessage(`Kullanıcı ${!currentStatus ? 'aktif' : 'pasif'} edildi (yerel olarak)!`);
      }
    } catch (err: any) {
      console.error('Toggle user status error:', err);
      showErrorMessage('Kullanıcı durumu değiştirilirken hata oluştu: ' + err.message);
    }
  };

  // Yardımcı fonksiyonlar
  const showSuccessMessage = (message: string) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
    successDiv.style.zIndex = '9999';
    successDiv.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
    document.body.appendChild(successDiv);
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  };

  const showErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  // Form değişiklik handler
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Yeni kullanıcı ekleme
  const handleAddUser = () => {
    navigate('/dashboard/users/add');
  };

  // Rol seçenekleri
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
              {loading ? 'Yükleniyor...' : 'Yenile'}
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
                    <h3 className="mb-0 fw-bold text-warning">{users.filter(u => u.role === 'Admin' || u.role === 'Manager').length}</h3>
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

        {/* Error Alert */}
        {error && (
          <div className="alert alert-warning border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
              <div>
                <strong>Uyarı!</strong>
                <div>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
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
                                className={`btn btn-sm btn-outline-${user.isActive ? 'warning' : 'success'}`}
                                title={user.isActive ? 'Pasif Et' : 'Aktif Et'}
                                onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                style={{ borderRadius: '0' }}
                              >
                                <i className={`bi bi-${user.isActive ? 'pause' : 'play'}`}></i>
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
                        style={{ borderRadius: '8px' }}
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
                        style={{ borderRadius: '8px' }}
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
                        style={{ borderRadius: '8px' }}
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
                        style={{ borderRadius: '8px' }}
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
                        style={{ borderRadius: '8px' }}
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
                        style={{ borderRadius: '8px' }}
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

      {/* Styles */}
      <style>{`
        .users-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .table > tbody > tr {
          transition: background-color 0.2s ease;
        }
        
        .table > tbody > tr:hover {
          background-color: #f8f9fa !important;
        }
        
        .btn-group .btn {
          border: 1px solid #dee2e6;
          transition: all 0.2s ease;
        }
        
        .btn-group .btn:hover {
          z-index: 2;
          transform: translateY(-1px);
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
        
        .alert {
          animation: slideIn 0.3s ease;
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
        
        /* Loading states */
        .btn:disabled .spinner-border {
          width: 1rem;
          height: 1rem;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .d-flex.gap-2 {
            flex-direction: column;
          }
          
          .btn-group {
            flex-direction: column;
          }
          
          .btn-group .btn {
            border-radius: 8px !important;
            margin-bottom: 2px;
          }
        }
        
        /* Success message styling */
        .alert-success {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          border: none;
          color: #155724;
        }
        
        /* Error message styling */
        .alert-warning {
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border: none;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default Users;