// src/pages/users/UserEditModal.tsx
import React, { useState, useEffect } from 'react';
import { updateUser } from '../../api/users/updateUser';
import { getAllDepartments } from '../../api/departments/getAllDepartments';
import type { User, UserRole, UpdateUserRequest } from '../../api/types/user';
import type { Department } from '../../api/types/department';

interface UserEditModalProps {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ show, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'User' as UserRole,
    employeeNumber: '',
    departmentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  // const [loadingDepartments, setLoadingDepartments] = useState(false); // Geçici olarak kaldırıldı

  // Modal açıldığında user verilerini forma yükle
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        role: (user.role || 'User') as UserRole,
        employeeNumber: user.employeeNumber || '',
        departmentId: '' // Başlangıçta boş - kullanıcı değiştirmek isterse seçer
      });
      setError(null);
    }
  }, [user]);

  // Departmanları yükle
  useEffect(() => {
    if (show) {
      loadDepartments();
    }
  }, [show]);

  const loadDepartments = async () => {
    try {
      const deps = await getAllDepartments();
      console.log('🔍 Loaded departments from API:', deps);
      console.log('🔍 Department IDs:', deps.map(d => ({ id: d.id, name: d.name, code: d.code })));
      setDepartments(deps);
    } catch (err) {
      console.error('❌ Departmanlar yüklenemedi:', err);
      setError('Departmanlar yüklenemedi. Departman seçimi devre dışı bırakıldı.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Backend'in beklediği formata dönüştür
      const updateData: UpdateUserRequest = {
        id: user.id,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role, // ROL GÜNCELLEMESİ TEKRAR ETKİNLEŞTİRİLDİ
        employeeNumber: formData.employeeNumber || '',
      };

      console.log('🔍 Rol güncellemesi etkinleştirildi:', formData.role);

      // DEPARTMAN KONTROLÜ - TEST MODU
      console.log('🧪 DEPARTMAN GÜNCELLEMESİ TEST MODUNDA!');
      
      if (formData.departmentId === 'REMOVE_DEPARTMENT') {
        updateData.departmentId = null;
        console.log('🗑️ Departman kaldırma isteği');
      } else if (formData.departmentId && formData.departmentId.trim() !== '') {
        console.log('🔍 Departman seçimi:', formData.departmentId);
        const selectedDept = departments.find(d => d.id === formData.departmentId);
        if (selectedDept) {
          updateData.departmentId = formData.departmentId;
          console.log('✅ Geçerli departman seçildi:', selectedDept);
        } else {
          console.warn('⚠️ Seçilen departman listede bulunamadı');
        }
      }
      // NOT: Boş seçim yapılmışsa departmentId değiştirilmiyor

      console.log('📤 Form data:', formData);
      console.log('📤 Original user data:', user);
      console.log('📤 Sending update data:', updateData);
      console.log('📤 Department operation:', 
        updateData.departmentId === null ? 'REMOVING department' :
        updateData.departmentId ? `SETTING to: ${updateData.departmentId}` : 
        'NOT CHANGING department'
      );

      // API çağrısı
      const updatedUser = await updateUser(updateData);
      
      // Başarılı güncelleme
      console.log('Update successful:', updatedUser);
      onSuccess(updatedUser);
      onClose();
      
      // Başarı mesajı (opsiyonel)
      // alert('Kullanıcı başarıyla güncellendi!');
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Kullanıcı güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !user) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1}
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header border-bottom">
              <h5 className="modal-title">
                <i className="bi bi-pencil-square me-2 text-primary"></i>
                Kullanıcı Düzenle
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}

                {/* User ID Info */}
                <div className="mb-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Kullanıcı ID: <code>{user.id}</code>
                  </small>
                </div>

                <div className="row g-3">
                  {/* Ad Soyad */}
                  <div className="col-md-6">
                    <label htmlFor="fullName" className="form-label">
                      Ad Soyad <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Örn: Ahmet Yılmaz"
                      />
                    </div>
                  </div>

                  {/* E-posta */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      E-posta <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="ornek@asyaport.com"
                      />
                    </div>
                  </div>

                  {/* Rol */}
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label">
                      Rol <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-check"></i>
                      </span>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="User">Kullanıcı</option>
                        <option value="ServiceStaff">Servis Personeli</option>
                        <option value="departmentAdmin">Departman Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">Süper Admin</option>
                      </select>
                    </div>
                    <small className="text-muted">
                      Kullanıcının sistem içindeki yetki seviyesi
                    </small>
                  </div>

                  {/* Personel No */}
                  <div className="col-md-6">
                    <label htmlFor="employeeNumber" className="form-label">
                      Personel No
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-badge"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="employeeNumber"
                        name="employeeNumber"
                        value={formData.employeeNumber}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="Örn: ASY-2024-001"
                      />
                    </div>
                  </div>

                  {/* Departman - Test modunda */}
                  <div className="col-md-12">
                    <label htmlFor="departmentId" className="form-label">
                      Departman
                      <span className="badge bg-warning ms-2">TEST MODU</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-building"></i>
                      </span>
                      <select
                        className="form-select"
                        id="departmentId"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="">Departman değiştirme (mevcut korunacak)</option>
                        <option value="REMOVE_DEPARTMENT">🗑️ Departmanı Kaldır</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} {dept.code ? `(${dept.code})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="alert alert-info mt-2 mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Test Modu:</strong> Departman güncellemesi test edilebilir duruma getirildi.
                      <br />
                      <small>
                        <strong>Dikkat:</strong> Frontend departman API'si ile backend Users API'si farklı veritabanları kullanıyor olabilir.
                        <br />
                        <strong>Test sonrası:</strong> Hata alırsanız, departman güncellemesini tekrar devre dışı bırakacağız.
                      </small>
                    </div>
                    {user?.department && (
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Mevcut departman: <strong>{user.department.name}</strong>
                      </small>
                    )}
                  </div>
                </div>

                {/* Oluşturma ve Güncelleme Tarihleri */}
                {user.createdAt && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <div className="row">
                      <div className="col-md-6">
                        <small className="text-muted">
                          <i className="bi bi-calendar-plus me-1"></i>
                          Oluşturulma: {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                      {user.updatedAt && (
                        <div className="col-md-6">
                          <small className="text-muted">
                            <i className="bi bi-calendar-check me-1"></i>
                            Son Güncelleme: {new Date(user.updatedAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Güncelleniyor...</span>
                      </span>
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
    </>
  );
};

export default UserEditModal;