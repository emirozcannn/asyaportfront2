import React, { useState, useEffect } from 'react';
import {
  getAllDepartments,
  getDepartmentPermissions,
  createDepartmentPermission,
  updateDepartmentPermission,
  deleteDepartmentPermission
} from '../../api/departments';
import type { Department, DepartmentCategoryPermission } from '../../api/departments';
// Dinamik kategori ve izinler için API fonksiyonlarını ekle
import { getAllCategories, getAllPermissions } from '../../api/departments';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  type: 'can_assign' | 'can_manage';
  category_id: string;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // ...existing code...

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Departmanları çek
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);

      // Kategorileri çek
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);

      // İzinleri çek
      const permissionsData = await getAllPermissions();
      setPermissions(permissionsData);

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
          can_assign: permissionType === 'can_assign' ? granted : existingPermission.can_assign,
          can_manage: permissionType === 'can_manage' ? granted : existingPermission.can_manage
        };
        await updateDepartmentPermission(existingPermission.id, updateData);

        // Update local state
        setDepartmentPermissions(prev => 
          prev.map(p => 
            p.id === existingPermission.id 
              ? { ...p, ...updateData }
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
      getCategoryPermissions(category.id).forEach(permission => {
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
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed shadow-lg border-0`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.borderRadius = '12px';
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'danger' ? 'exclamation-triangle-fill' : 'info-circle-fill'} me-2"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentNode) alertDiv.remove();
    }, 4000);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(category =>
    selectedCategory === 'all' || category.id === selectedCategory
  );

  // Her kategoriye ait izinleri bul
  const getCategoryPermissions = (categoryId: string) => {
    return permissions.filter(p => p.category_id === categoryId);
  };

  // İstatistikler
  const selectedDepartmentData = departments.find(d => d.id === selectedDepartment);
  const totalPermissions = categories.reduce((acc, cat) => acc + getCategoryPermissions(cat.id).length, 0);
  const grantedPermissions = categories.reduce((acc, cat) => {
    return acc + getCategoryPermissions(cat.id).filter(perm => 
      getPermissionStatus(cat.id, perm.type)
    ).length;
  }, 0);

  if (isLoading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }}></div>
            <h4 className="text-dark fw-bold mb-2">İzinler Yükleniyor...</h4>
            <p className="text-muted">Departman izinleri hazırlanıyor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-3">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-decoration-none text-primary">
                      <i className="bi bi-house-door me-1"></i>
                      Ana Sayfa
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#" className="text-decoration-none text-primary">Departmanlar</a>
                  </li>
                  <li className="breadcrumb-item active text-muted" aria-current="page">İzin Ayarları</li>
                </ol>
              </nav>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-shield-lock text-warning fs-4"></i>
                </div>
                <div>
                  <h2 className="mb-1 fw-bold text-dark">Departman İzin Ayarları</h2>
                  <p className="text-muted mb-0">Departmanların sistem erişim izinlerini yönetin</p>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3 align-items-center">
              {pendingChanges > 0 && (
                <div className="alert alert-warning py-2 px-3 mb-0 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  <strong>{pendingChanges}</strong> kaydedilmemiş değişiklik
                </div>
              )}
              <button
                className="btn btn-success btn-lg shadow-sm"
                onClick={saveAllPermissions}
                disabled={isSaving || !selectedDepartment || pendingChanges === 0}
                style={{ borderRadius: '6px', padding: '12px 24px' }}
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
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4 border-0 shadow-sm" role="alert" style={{ borderRadius: '8px' }}>
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
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
            <div className="card-header border-0 p-4" style={{ backgroundColor: '#e7f3ff', borderRadius: '8px 8px 0 0' }}>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-building text-primary fs-4"></i>
                </div>
                <h5 className="mb-0 fw-bold text-dark">Departman Seçimi</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <select
                className="form-select form-select-lg mb-3 shadow-sm border-0 bg-light"
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                style={{ borderRadius: '8px', padding: '12px 16px' }}
              >
                <option value="">🏢 Departman seçin...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>

              {selectedDepartmentData && (
                <div className="p-3 bg-light rounded" style={{ borderRadius: '8px' }}>
                  <h6 className="fw-bold mb-3 text-dark">{selectedDepartmentData.name}</h6>
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="p-3 bg-primary bg-opacity-10 rounded" style={{ borderRadius: '6px' }}>
                        <div className="fw-semibold text-primary">Kod</div>
                        <div className="small text-muted">{selectedDepartmentData.code}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-info bg-opacity-10 rounded" style={{ borderRadius: '6px' }}>
                        <div className="fw-semibold text-info">Tarih</div>
                        <div className="small text-muted">{new Date(selectedDepartmentData.createdAt).toLocaleDateString('tr-TR')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permission Statistics */}
          {selectedDepartment && (
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
              <div className="card-header border-0 p-4" style={{ backgroundColor: '#d4edda', borderRadius: '8px 8px 0 0' }}>
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded p-2 me-3">
                    <i className="bi bi-bar-chart text-success fs-4"></i>
                  </div>
                  <h5 className="mb-0 fw-bold text-dark">İzin İstatistikleri</h5>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-6 text-center">
                    <div className="p-3 bg-primary bg-opacity-10 rounded" style={{ borderRadius: '8px' }}>
                      <h3 className="text-primary fw-bold mb-1">{totalPermissions}</h3>
                      <small className="text-muted fw-medium">Toplam İzin</small>
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    <div className="p-3 bg-success bg-opacity-10 rounded" style={{ borderRadius: '8px' }}>
                      <h3 className="text-success fw-bold mb-1">{grantedPermissions}</h3>
                      <small className="text-muted fw-medium">Aktif İzin</small>
                    </div>
                  </div>
                </div>
                
                <div className="progress mb-3" style={{ height: '12px', borderRadius: '6px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${totalPermissions > 0 ? (grantedPermissions / totalPermissions) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="badge bg-success fs-6 px-3 py-2" style={{ borderRadius: '6px' }}>
                    %{totalPermissions > 0 ? Math.round((grantedPermissions / totalPermissions) * 100) : 0} tamamlandı
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
            <div className="card-header border-0 p-4" style={{ backgroundColor: '#d1ecf1', borderRadius: '8px 8px 0 0' }}>
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-funnel text-info fs-4"></i>
                </div>
                <h5 className="mb-0 fw-bold text-dark">Filtreler</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Kategori</label>
                <select
                  className="form-select shadow-sm border-0 bg-light"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ borderRadius: '6px', padding: '10px 14px' }}
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
                <label className="form-label fw-semibold text-dark mb-2">Arama</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0" style={{ borderRadius: '6px 0 0 6px' }}>
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control shadow-sm border-0 bg-light"
                    placeholder="İzin ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '0 6px 6px 0', padding: '10px 14px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {selectedDepartment && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
              <div className="card-header border-0 p-4" style={{ backgroundColor: '#fff3cd', borderRadius: '8px 8px 0 0' }}>
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded p-2 me-3">
                    <i className="bi bi-lightning text-warning fs-4"></i>
                  </div>
                  <h5 className="mb-0 fw-bold text-dark">Hızlı İşlemler</h5>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success shadow-sm"
                    onClick={() => handleBulkAction('enable-all')}
                    style={{ borderRadius: '6px', padding: '10px 16px' }}
                  >
                    <i className="bi bi-check-all me-2"></i>
                    Tümünü Etkinleştir
                  </button>
                  <button
                    className="btn btn-danger shadow-sm"
                    onClick={() => handleBulkAction('disable-all')}
                    style={{ borderRadius: '6px', padding: '10px 16px' }}
                  >
                    <i className="bi bi-x-octagon me-2"></i>
                    Tümünü Kapat
                  </button>
                  <hr className="my-2" />
                  <button
                    className="btn btn-outline-primary shadow-sm"
                    onClick={() => handleBulkAction('enable-assign')}
                    style={{ borderRadius: '6px', padding: '10px 16px' }}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Atama İzinleri
                  </button>
                  <button
                    className="btn btn-outline-warning shadow-sm"
                    onClick={() => handleBulkAction('enable-manage')}
                    style={{ borderRadius: '6px', padding: '10px 16px' }}
                  >
                    <i className="bi bi-gear me-2"></i>
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
            <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
              <div className="card-body text-center py-5">
                <div className="bg-light rounded-circle p-4 mb-4 d-inline-block">
                  <i className="bi bi-shield-exclamation text-muted fs-1"></i>
                </div>
                <h4 className="text-dark fw-bold mb-3">Departman Seçin</h4>
                <p className="text-muted mb-4">
                  İzinleri yönetmek için öncelikle sol panelden bir departman seçmelisiniz.
                </p>
                <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>İpucu:</strong> Departman seçtikten sonra kategori bazlı izinleri yönetebilirsiniz.
                </div>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
              <div className="card-body text-center py-5">
                <div className="bg-light rounded-circle p-4 mb-4 d-inline-block">
                  <i className="bi bi-search text-muted fs-1"></i>
                </div>
                <h4 className="text-dark fw-bold mb-3">Kategori bulunamadı</h4>
                <p className="text-muted mb-4">
                  {searchTerm ? 
                    `"${searchTerm}" aramanıza uygun kategori bulunamadı.` : 
                    'Seçilen filtreye uygun kategori bulunamadı.'
                  }
                </p>
                <button
                  className="btn btn-outline-primary shadow-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  style={{ borderRadius: '6px', padding: '10px 20px' }}
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
                <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <div className={`card-header border-0 p-4 bg-${category.color} bg-opacity-10`} style={{ borderRadius: '8px 8px 0 0' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className={`bg-${category.color} bg-opacity-10 rounded p-3 me-3`}>
                          <i className={`${category.icon} text-${category.color} fs-4`}></i>
                        </div>
                        <div>
                          <h4 className="mb-1 fw-bold text-dark">{category.name}</h4>
                          <p className="text-muted mb-0">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge bg-${category.color} px-3 py-2 fw-semibold`} style={{ fontSize: '0.9rem', borderRadius: '6px' }}>
                            {getCategoryPermissions(category.id).filter(p => getPermissionStatus(category.id, p.type)).length} / {getCategoryPermissions(category.id).length} aktif
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-4">
                      {getCategoryPermissions(category.id).map(permission => (
                        <div key={permission.id} className="col-md-6">
                          <div className="border-0 bg-light rounded p-4 h-100 shadow-sm" style={{ borderRadius: '8px' }}>
                            <div className="d-flex align-items-start justify-content-between">
                              <div className="flex-fill me-3">
                                <div className="d-flex align-items-center mb-2">
                                  <h6 className="mb-0 fw-bold text-dark">{permission.name}</h6>
                                  <span className={`badge ms-2 px-2 py-1 ${permission.type === 'can_assign' ? 'bg-info' : 'bg-warning'}`} style={{ fontSize: '0.75rem', borderRadius: '4px' }}>
                                    {permission.type === 'can_assign' ? 'ATAMA' : 'YÖNETİM'}
                                  </span>
                                </div>
                                <p className="text-muted mb-3 small">{permission.description}</p>
                                <div className={`small fw-medium text-${getPermissionStatus(category.id, permission.type) ? 'success' : 'muted'}`}>
                                  <i className={`bi bi-${getPermissionStatus(category.id, permission.type) ? 'check-circle-fill' : 'dash-circle'} me-1`}></i>
                                  {getPermissionStatus(category.id, permission.type) ? 'ETKİN' : 'PASİF'}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input shadow-sm"
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
          <div className="card border-0 shadow-lg" style={{ borderRadius: '12px' }}>
            <div className="card-body d-flex align-items-center gap-3 py-3 px-4">
              <div className="text-warning">
                <i className="bi bi-exclamation-triangle fs-4"></i>
              </div>
              <div>
                <div className="fw-semibold text-dark">Kaydedilmemiş Değişiklikler</div>
                <small className="text-muted">{pendingChanges} izin değişikliği bekliyor</small>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary shadow-sm"
                  onClick={() => window.location.reload()}
                  style={{ borderRadius: '6px', padding: '8px 16px' }}
                >
                  İptal Et
                </button>
                <button
                  className="btn btn-success shadow-sm"
                  onClick={saveAllPermissions}
                  disabled={isSaving}
                  style={{ borderRadius: '6px', padding: '8px 20px' }}
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

      <style jsx>{`
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          border-color: rgba(13, 110, 253, 0.5);
        }
        .form-check-input:checked {
          background-color: #198754;
          border-color: #198754;
        }
        .form-check-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
        }
        .alert {
          animation: slideInRight 0.3s ease-out;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PermissionSettings;