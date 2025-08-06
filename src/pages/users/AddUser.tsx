// src/pages/users/AddUser.tsx - Düzeltilmiş versiyon
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/users';

// Local types - import sorunlarını önlemek için
interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role?: string;
  departmentId?: string;
}

type UserRole = 'SuperAdmin' | 'Admin' | 'DepartmentAdmin' | 'User';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    role: 'User',
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Form validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Ad Soyad zorunludur';
    }

    if (!formData.email.trim()) {
      errors.email = 'E-posta zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.password) {
      errors.password = 'Şifre zorunludur';
    } else if (formData.password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Backend expects departmentId as UUID or null, not 'it', 'hr', etc.
      const payload = {
        ...formData,
        departmentId: formData.departmentId ? formData.departmentId : undefined
      };

      await createUser(payload);

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/users');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcı oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (success) {
    return (
      <div className="container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="text-success mb-3">
                  <i className="bi bi-check-circle fs-1"></i>
                </div>
                <h4 className="text-success mb-3">Kullanıcı Başarıyla Oluşturuldu! 🎉</h4>
                <p className="text-muted mb-4">
                  <strong>{formData.fullName}</strong> adlı kullanıcı sisteme başarıyla eklendi.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={() => navigate('/dashboard/users')}
                  >
                    <i className="bi bi-list me-1"></i>
                    Kullanıcı Listesi
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        password: '',
                        role: 'User',
                      });
                    }}
                  >
                    <i className="bi bi-plus me-1"></i>
                    Yeni Kullanıcı Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">👤 Yeni Kullanıcı Ekle</h4>
          <p className="text-muted mb-0">Sisteme yeni kullanıcı ekleyin</p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard/users')}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Geri Dön
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-person-plus me-2 text-primary"></i>
                Kullanıcı Bilgileri
              </h6>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Ad Soyad */}
                  <div className="col-md-6">
                    <label htmlFor="fullName" className="form-label">
                      Ad Soyad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Kullanıcının tam adını girin"
                    />
                    {formErrors.fullName && (
                      <div className="invalid-feedback">{formErrors.fullName}</div>
                    )}
                  </div>

                  {/* E-posta */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      E-posta Adresi <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="kullanici@asyaport.com"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>

                  {/* Şifre */}
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                      Şifre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="En az 6 karakter"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                    )}
                    <div className="form-text">
                      Güvenli bir şifre oluşturun (büyük harf, küçük harf, sayı)
                    </div>
                  </div>

                  {/* Rol */}
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label">
                      Kullanıcı Rolü
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="User">👤 Kullanıcı</option>
                      <option value="DepartmentAdmin">👥 Departman Yöneticisi</option>
                      <option value="Admin">⚡ Sistem Yöneticisi</option>
                      <option value="SuperAdmin">🔧 Süper Yönetici</option>
                    </select>
                    <div className="form-text">
                      Kullanıcının sistem üzerindeki yetkilerini belirler
                    </div>
                  </div>

                  {/* Departman */}
                  <div className="col-md-12">
                    <label htmlFor="departmentId" className="form-label">
                      Departman (Opsiyonel)
                    </label>
                    <select
                      className="form-select"
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Departman Seçin</option>
                      {/* TODO: Replace these with real department UUIDs from your backend */}
                      <option value="">Seçim Yok</option>
                      {/* <option value="30549f61-ed08-4867-bce0-b80a64ae7199">BT Departmanı</option> */}
                      {/* <option value="...">İnsan Kaynakları</option> */}
                      {/* <option value="...">Operasyon</option> */}
                      {/* <option value="...">Mali İşler</option> */}
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/dashboard/users')}
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
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i>
                        Kullanıcı Oluştur
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">
                <i className="bi bi-info-circle me-2 text-info"></i>
                Önemli Bilgiler
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-shield-check me-2 text-success"></i>
                  Yeni kullanıcı sisteme giriş yapmak için e-posta ve şifreyi kullanacak
                </li>
                <li className="mb-2">
                  <i className="bi bi-envelope me-2 text-info"></i>
                  Kullanıcıya otomatik hoş geldin e-postası gönderilecek
                </li>
                <li className="mb-0">
                  <i className="bi bi-key me-2 text-warning"></i>
                  Kullanıcı ilk girişte şifresini değiştirebilir
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;