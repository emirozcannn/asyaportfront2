import React, { useState, useEffect } from 'react';
import {
  getAllDepartments,
  getDepartmentPermissions,
  createDepartmentPermission,
  updateDepartmentPermission,
  deleteDepartmentPermission
} from '../../api/departments';
import type { Department, DepartmentCategoryPermission } from '../../api/departments';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  type: 'can_assign' | 'can_manage';
}

export const PermissionSettings: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departmentPermissions, setDepartmentPermissions] = useState<DepartmentCategoryPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pendingChanges, setPendingChanges] = useState<number>(0);

  // Mock categories and permissions - replace with actual API data
  const categories: Category[] = [
    {
      id: '1',
      name: 'Asset Yönetimi',
      description: 'Zimmet kayıtları ve asset yönetimi işlemleri',
      icon: 'bi-box-seam',
      color: 'primary',
      permissions: [
        { id: '1-assign', name: 'Asset Atama', description: 'Asset\'leri kullanıcılara atayabilme yetkisi', type: 'can_assign' },
        { id: '1-manage', name: 'Asset Yönetimi', description: 'Asset\'leri oluşturma, düzenleme, silme yetkisi', type: 'can_manage' }
      ]
    },
    {
      id: '2',
      name: 'Kullanıcı Yönetimi',
      description: 'Sistem kullanıcıları ve rol yönetimi',
      icon: 'bi-people',
      color: 'success',
      permissions: [
        { id: '2-assign', name: 'Kullanıcı Atama', description: 'Kullanıcıları departmanlara atayabilme', type: 'can_assign' },
        { id: '2-manage', name: 'Kullanıcı Yönetimi', description: 'Kullanıcı oluşturma, düzenleme, silme', type: 'can_manage' }
      ]
    },
    {
      id: '3',
      name: 'Raporlama',
      description: 'Sistem raporları ve veri analizi',
      icon: 'bi-graph-up',
      color: 'info',
      permissions: [
        { id: '3-assign', name: 'Rapor Paylaşma', description: 'Raporları paylaşabilme ve dağıtabilme', type: 'can_assign' },
        { id: '3-manage', name: 'Rapor Yönetimi', description: 'Rapor oluşturma, düzenleme ve silme', type: 'can_manage' }
      ]
    },
    {
      id: '4',
      name: 'Sistem Yönetimi',
      description: 'Sistem ayarları ve konfigürasyon',
      icon: 'bi-gear',
      color: 'warning',
      permissions: [
        { id: '4-assign', name: 'Ayar Uygulama', description: 'Sistem ayarlarını uygulayabilme', type: 'can_assign' },
        { id: '4-manage', name: 'Sistem Yönetimi', description: 'Sistem ayarlarını değiştirebilme', type: 'can_manage' }
      ]
    },
    {
      id: '5',
      name: 'Güvenlik',
      description: 'Güvenlik ayarları ve erişim kontrolü',
      icon: 'bi-shield-check',
      color: 'danger',
      permissions: [
        { id: '5-assign', name: 'Güvenlik Atama', description: 'Güvenlik rollerini atayabilme', type: 'can_assign' },
        { id: '5-manage', name: 'Güvenlik Yönetimi', description: 'Güvenlik ayarlarını yönetebilme', type: 'can_manage' }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
      
      if (departmentsData.length > 0) {
        setSelectedDepartment(departmentsData[0].id);
        await loadDepartmentPermissions(departmentsData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartmentPermissions = async (departmentId: string) => {
    try {
      const permissions = await getDepartmentPermissions();
      const filteredPermissions = permissions.filter(p => p.department_id === departmentId);
      setDepartmentPermissions(filteredPermissions);
      setPendingChanges(0);
    } catch (error) {
      console.error('Error loading department permissions:', error);
    }
  };

  const handleDepartmentChange = async (departmentId: string) => {
    if (pendingChanges > 0) {
      if (!window.confirm('⚠️ Kaydedilmemiş değişiklikler var!\n\nDepartman değiştirirseniz yapılan değişiklikler kaybolacak. Devam etmek istiyor musunuz?')) {
        return;
      }
    }
    
    setSelectedDepartment(departmentId);
    if (departmentId) {
      await loadDepartmentPermissions(departmentId);
    } else {
      setDepartmentPermissions([]);
    }
  };

  const handlePermissionToggle = async (categoryId: string, permissionType: 'can_assign' | 'can_manage', granted: boolean) => {
    if (!selectedDepartment) return;

    try {
      const existingPermission = departmentPermissions.find(
        p => p.category_id === categoryId && p.department_id === selectedDepartment
      );

      if (existingPermission) {
        // Update existing permission
        const updateData = {
          ...existingPermission,
          [permissionType]: granted
        };
        
        await updateDepartmentPermission(existingPermission.id, {
          can_assign: updateData.can_assign,
          can_manage: updateData.can_manage,
          department_id: updateData.department_id,
          category_id: updateData.category_id
        });

        // Update local state
        setDepartmentPermissions(prev => 
          prev.map(p => 
            p.id === existingPermission.id 
              ? { ...p, [permissionType]: granted }
              : p
          )
        );
      } else {
        // Create new permission
        const newPermission = {
          department_id: selectedDepartment,
          category_id: categoryId,
          can_assign: permissionType === 'can_assign' ? granted : false,
          can_manage: permissionType === 'can_manage' ? granted : false
        };

        const createdPermission = await createDepartmentPermission(newPermission);
        setDepartmentPermissions(prev => [...prev, createdPermission]);
      }

      setPendingChanges(prev => prev + 1);
      showAlert(`İzin ${granted ? 'verildi' : 'kaldırıldı'} ✅`, 'success');
    } catch (error) {
      console.error('Error updating permission:', error);
      showAlert('İzin güncellenirken hata oluştu ❌', 'danger');
    }
  };

  const getPermissionStatus = (categoryId: string, permissionType: 'can_assign' | 'can_manage'): boolean => {
    const permission = departmentPermissions.find(p => p.category_id === categoryId);
    return permission ? permission[permissionType] : false;
  };

  const saveAllPermissions = async () => {
    if (!selectedDepartment) return;

    setIsSaving(true);
    try {
      // This would typically batch update all permissions
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setPendingChanges(0);
      showAlert('Tüm izinler başarıyla kaydedildi! 🎉', 'success');
    } catch (error) {
      showAlert('İzinler kaydedilirken hata oluştu ❌', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkAction = (action: 'enable-all' | 'disable-all' | 'enable-assign' | 'enable-manage') => {
    categories.forEach(category => {
      category.permissions.forEach(permission => {
        switch (action) {
          case 'enable-all':
            handlePermissionToggle(category.id, permission.type, true);
            break;
          case 'disable-all':
            handlePermissionToggle(category.id, permission.type, false);
            break;
          case 'enable-assign':
            if (permission.type === 'can_assign') {
              handlePermissionToggle(category.id, permission.type, true);
            }
            break;
          case 'enable-manage':
            if (permission.type === 'can_manage') {
              handlePermissionToggle(category.id, permission.type, true);
            }
            break;
        }
      });
    });
  };

  const showAlert = (message: string, type: 'success' | 'danger' | 'info' | 'warning' = 'info') => {
    // Create and show Bootstrap alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 4000);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(category =>
    selectedCategory === 'all' || category.id === selectedCategory
  );

  // Calculate permission statistics
  const selectedDepartmentData = departments.find(d => d.id === selectedDepartment);
  const totalPermissions = categories.reduce((acc, cat) => acc + cat.permissions.length, 0);
  const grantedPermissions = categories.reduce((acc, cat) => {
    return acc + cat.permissions.filter(perm => 
      getPermissionStatus(cat.id, perm.type)
    ).length;
  }, 0);

  if (isLoading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '4rem', height: '4rem' }}></div>
          <h4 className="text-muted">İzinler yükleniyor...</h4>
          <p className="text-muted">Departman izinleri hazırlanıyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" className="text-decoration-none text-primary">
                  <i className="bi bi-house-door me-1"></i>
                  Ana Sayfa
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="#" className="text-decoration-none text-primary">Departmanlar</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">İzin Ayarları</li>
            </ol>
          </nav>
          <div className="d-flex align-items-center mb-2">
            <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
              <i className="bi bi-shield-lock text-warning fs-4"></i>
            </div>
            <div>
              <h2 className="mb-0 fw-bold text-dark">Departman İzin Ayarları</h2>
              <p className="text-muted mb-0 fs-6">Departmanların sistem erişim izinlerini yönetin</p>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          {pendingChanges > 0 && (
            <div className="alert alert-warning py-2 px-3 mb-0 me-2">
              <i className="bi bi-exclamation-triangle me-1"></i>
              <strong>{pendingChanges}</strong> kaydedilmemiş değişiklik
            </div>
          )}
          <button
            className="btn btn-success btn-lg d-flex align-items-center"
            onClick={saveAllPermissions}
            disabled={isSaving || !selectedDepartment || pendingChanges === 0}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Kaydediliyor...
              </>
            ) : (
              <>
                <i className="bi bi-cloud-upload me-2"></i>
                Tümünü Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <div>
              <strong>Hata!</strong> {error}
            </div>
          </div>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        {/* Left Sidebar */}
        <div className="col-lg-3">
          {/* Department Selection */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary bg-opacity-10 border-bottom">
              <div className="d-flex align-items-center">
                <i className="bi bi-building text-primary me-2"></i>
                <h6 className="mb-0 fw-bold text-dark">Departman Seçimi</h6>
              </div>
            </div>
            <div className="card-body">
              <select
                className="form-select form-select-lg mb-3"
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="">🏢 Departman seçin...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>

              {selectedDepartmentData && (
                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2 text-dark">{selectedDepartmentData.name}</h6>
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="p-2 bg-primary bg-opacity-10 rounded">
                        <div className="fw-medium text-primary">Kod</div>
                        <div className="small">{selectedDepartmentData.code}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-info bg-opacity-10 rounded">
                        <div className="fw-medium text-info">Tarih</div>
                        <div className="small">{new Date(selectedDepartmentData.createdAt).toLocaleDateString('tr-TR')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permission Statistics */}
          {selectedDepartment && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-success bg-opacity-10 border-bottom">
                <div className="d-flex align-items-center">
                  <i className="bi bi-bar-chart text-success me-2"></i>
                  <h6 className="mb-0 fw-bold text-dark">İzin İstatistikleri</h6>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-2 mb-3">
                  <div className="col-6 text-center">
                    <div className="p-3 bg-primary bg-opacity-10 rounded">
                      <h4 className="text-primary fw-bold mb-0">{totalPermissions}</h4>
                      <small className="text-muted">Toplam İzin</small>
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    <div className="p-3 bg-success bg-opacity-10 rounded">
                      <h4 className="text-success fw-bold mb-0">{grantedPermissions}</h4>
                      <small className="text-muted">Aktif İzin</small>
                    </div>
                  </div>
                </div>
                
                <div className="progress mb-2" style={{ height: '12px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${totalPermissions > 0 ? (grantedPermissions / totalPermissions) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="badge bg-success fs-6">
                    %{totalPermissions > 0 ? Math.round((grantedPermissions / totalPermissions) * 100) : 0} tamamlandı
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info bg-opacity-10 border-bottom">
              <div className="d-flex align-items-center">
                <i className="bi bi-funnel text-info me-2"></i>
                <h6 className="mb-0 fw-bold text-dark">Filtreler</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-medium">Kategori</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">📋 Tüm Kategoriler</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Arama</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="İzin ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {selectedDepartment && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-warning bg-opacity-10 border-bottom">
                <div className="d-flex align-items-center">
                  <i className="bi bi-lightning text-warning me-2"></i>
                  <h6 className="mb-0 fw-bold text-dark">Hızlı İşlemler</h6>
                </div>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleBulkAction('enable-all')}
                  >
                    <i className="bi bi-check-all me-1"></i>
                    Tümünü Etkinleştir
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleBulkAction('disable-all')}
                  >
                    <i className="bi bi-x-octagon me-1"></i>
                    Tümünü Kapat
                  </button>
                  <hr className="my-2" />
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleBulkAction('enable-assign')}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Atama İzinleri
                  </button>
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => handleBulkAction('enable-manage')}
                  >
                    <i className="bi bi-gear me-1"></i>
                    Yönetim İzinleri
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          {!selectedDepartment ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-shield-exclamation text-muted display-1 opacity-25"></i>
                </div>
                <h4 className="text-muted mb-3">Departman Seçin</h4>
                <p className="text-muted mb-4">
                  İzinleri yönetmek için öncelikle sol panelden bir departman seçmelisiniz.
                </p>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>İpucu:</strong> Departman seçtikten sonra kategori bazlı izinleri yönetebilirsiniz.
                </div>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-search text-muted display-4 opacity-25"></i>
                </div>
                <h5 className="text-muted mb-3">Kategori bulunamadı</h5>
                <p className="text-muted">
                  {searchTerm ? 
                    `"${searchTerm}" aramanıza uygun kategori bulunamadı.` : 
                    'Seçilen filtreye uygun kategori bulunamadı.'
                  }
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredCategories.map(category => (
                <div key={category.id} className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className={`card-header bg-${category.color} bg-opacity-10 border-bottom`}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className={`bg-${category.color} bg-opacity-20 rounded-circle p-3 me-3`}>
                            <i className={`${category.icon} text-${category.color} fs-4`}></i>
                          </div>
                          <div>
                            <h5 className="mb-1 fw-bold text-dark">{category.name}</h5>
                            <p className="text-muted mb-0">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="d-flex align-items-center gap-2">
                            <span className={`badge bg-${category.color} bg-opacity-25 text-${category.color} fs-6 px-3 py-2`}>
                              {category.permissions.filter(p => getPermissionStatus(category.id, p.type)).length} / {category.permissions.length} aktif
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body p-4">
                      <div className="row g-4">
                        {category.permissions.map(permission => (
                          <div key={permission.id} className="col-md-6">
                            <div className="border rounded p-4 h-100">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="flex-fill me-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <h6 className="mb-0 fw-bold text-dark">{permission.name}</h6>
                                    <span className={`badge ${permission.type === 'can_assign' ? 'bg-info' : 'bg-warning'} bg-opacity-25 ${permission.type === 'can_assign' ? 'text-info' : 'text-warning'} ms-2`}>
                                      {permission.type === 'can_assign' ? 'ATAMA' : 'YÖNETİM'}
                                    </span>
                                  </div>
                                  <p className="text-muted mb-3 small">{permission.description}</p>
                                  <div className={`small text-${getPermissionStatus(category.id, permission.type) ? 'success' : 'muted'}`}>
                                    <i className={`bi bi-${getPermissionStatus(category.id, permission.type) ? 'check-circle-fill' : 'dash-circle'} me-1`}></i>
                                    {getPermissionStatus(category.id, permission.type) ? 'ETKİN' : 'PASİF'}
                                  </div>
                                </div>
                                
                                <div className="flex-shrink-0">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      style={{ width: '3rem', height: '1.5rem' }}
                                      checked={getPermissionStatus(category.id, permission.type)}
                                      onChange={(e) => handlePermissionToggle(category.id, permission.type, e.target.checked)}
                                      id={`${category.id}-${permission.type}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Changes Sticky Footer */}
      {pendingChanges > 0 && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x"
          style={{ zIndex: 1050 }}
        >
          <div className="card border-0 shadow-lg">
            <div className="card-body d-flex align-items-center gap-3 py-3">
              <div className="text-warning">
                <i className="bi bi-exclamation-triangle fs-5"></i>
              </div>
              <div>
                <div className="fw-medium">Kaydedilmemiş Değişiklikler</div>
                <small className="text-muted">{pendingChanges} izin değişikliği bekliyor</small>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => window.location.reload()}
                >
                  İptal Et
                </button>
                <button
                  className="btn btn-success"
                  onClick={saveAllPermissions}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Kaydet ({pendingChanges})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionSettings;