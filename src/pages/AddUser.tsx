import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, registerUser } from '../api/supabaseAuth';

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  employeeNumber: string;
  role: string;
  departmentId: string;
}

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<NewUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeNumber: '',
    role: 'Employee',
    departmentId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setFormLoading(true);
      // Try to load departments from API
      try {
        const departmentsData = await apiRequest('/api/Departments');
        setDepartments(departmentsData || []);
      } catch (apiError) {
        // If departments API doesn't exist, use mock data based on backend user data
        console.warn('Departments API not available, using mock data');
        setDepartments([
          { id: '299f14dc-5b25-484b-9041-f3bfdf8c2417', name: 'Operasyon Departmanı' },
          { id: 'c621f3a8-a543-4f5f-af38-480f2d1534f1', name: 'Teknik Departman' },
          { id: 'a99dceab-cf11-4787-b447-fe57ff6d3af0', name: 'Bilgi İşlem Departmanı' },
          { id: '63331552-f957-4d27-ab7c-bd5f8661bae2', name: 'Planlama Departmanı' },
          { id: 'ca34d08e-5db8-4307-b6df-b3edd0cfb65c', name: 'İnsan Kaynakları Departmanı' }
        ]);
      }
    } catch (err: any) {
      console.error('Load departments error:', err);
      setError('Departmanlar yüklenirken hata oluştu');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'Ad alanı zorunludur';
    if (!formData.lastName.trim()) return 'Soyad alanı zorunludur';
    if (!formData.email.trim()) return 'Email adresi zorunludur';
    if (!formData.email.includes('@')) return 'Geçerli bir email adresi giriniz';
    if (!formData.password) return 'Şifre zorunludur';
    if (formData.password.length < 6) return 'Şifre en az 6 karakter olmalıdır';
    if (formData.password !== formData.confirmPassword) return 'Şifreler eşleşmiyor';
    if (!formData.employeeNumber.trim()) return 'Çalışan numarası zorunludur';
    if (!formData.departmentId) return 'Departman seçimi zorunludur';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      console.log('Creating user with data:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        employeeNumber: formData.employeeNumber,
        role: formData.role,
        departmentId: formData.departmentId
      });

      // Hash the password (simple hash for demo - in production use bcrypt)
      const hashPassword = (password: string): string => {
        // Simple hash implementation - replace with proper bcrypt in production
        return btoa(password + 'salt_key'); // Base64 encoding as simple hash
      };

      // Register user with auth system first
      const authResult = await registerUser(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`
      );

      console.log('Auth registration successful:', authResult);

      // Create user profile with additional details and hashed password
      const userProfileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        employeeNumber: formData.employeeNumber,
        role: formData.role,
        departmentId: formData.departmentId,
        passwordHash: hashPassword(formData.password), // Add hashed password
        isActive: true
      };

      const profileResult = await apiRequest('/api/Users', {
        method: 'POST',
        body: JSON.stringify(userProfileData)
      });

      console.log('User profile created:', profileResult);

      setSuccess('Kullanıcı başarıyla oluşturuldu! Kullanıcı listesine yönlendiriliyorsunuz...');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        employeeNumber: '',
        role: 'Employee',
        departmentId: ''
      });

      // Redirect to users list after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/users');
      }, 2000);

    } catch (err: any) {
      console.error('Create user error:', err);
      
      let errorMessage = 'Kullanıcı oluşturulurken hata oluştu';
      if (err.message?.includes('email')) {
        errorMessage = 'Bu email adresi zaten kullanımda';
      } else if (err.message?.includes('employee')) {
        errorMessage = 'Bu çalışan numarası zaten kullanımda';
      } else if (err.message?.includes('PasswordHash')) {
        errorMessage = 'Şifre hash\'leme hatası oluştu';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  // Role options
  const roleOptions = [
    { value: 'Employee', label: 'Çalışan', color: 'success' },
    { value: 'ZimmetManager', label: 'Zimmet Yöneticisi', color: 'primary' },
    { value: 'Manager', label: 'Yönetici', color: 'warning' },
    { value: 'Admin', label: 'Sistem Yöneticisi', color: 'danger' }
  ];

  if (formLoading) {
    return (
      <div className="add-user-page">
        <div className="container-fluid px-4 py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="text-muted">Form yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-user-page">
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1 fw-bold text-dark">Yeni Kullanıcı Ekle</h2>
            <p className="text-muted mb-0">Sisteme yeni kullanıcı ekleyin ve gerekli bilgileri doldurun</p>
          </div>
          <button 
            className="btn btn-outline-secondary btn-lg shadow-sm"
            onClick={handleCancel}
            style={{ borderRadius: '12px' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Geri Dön
          </button>
        </div>

        {/* Form Card */}
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-header bg-gradient text-white border-0 py-4" 
                style={{ 
                  borderRadius: '20px 20px 0 0',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-2 me-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <i className="bi bi-person-plus fs-4"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">Kullanıcı Bilgileri</h4>
                    <small className="opacity-75">Tüm alanları eksiksiz doldurunuz</small>
                  </div>
                </div>
              </div>

              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                      <div>
                        <strong>Hata!</strong>
                        <div>{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3 fs-4"></i>
                      <div>
                        <strong>Başarılı!</strong>
                        <div>{success}</div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="mb-5">
                    <h5 className="fw-bold text-primary mb-3">
                      <i className="bi bi-person-circle me-2"></i>
                      Kişisel Bilgiler
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label fw-semibold">
                          Ad <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Adınızı giriniz"
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label fw-semibold">
                          Soyad <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Soyadınızı giriniz"
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label fw-semibold">
                          Email Adresi <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ornek@asyaport.com"
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Information */}
                  <div className="mb-5">
                    <h5 className="fw-bold text-warning mb-3">
                      <i className="bi bi-shield-lock me-2"></i>
                      Güvenlik Bilgileri
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label htmlFor="password" className="form-label fw-semibold">
                          Şifre <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg pe-5"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="En az 6 karakter"
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ borderRadius: '8px' }}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                          Şifre Tekrar <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control form-control-lg pe-5"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Şifreyi tekrar giriniz"
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ borderRadius: '8px' }}
                          >
                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div className="mb-5">
                    <h5 className="fw-bold text-success mb-3">
                      <i className="bi bi-building me-2"></i>
                      Çalışma Bilgileri
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label htmlFor="employeeNumber" className="form-label fw-semibold">
                          Çalışan Numarası <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="employeeNumber"
                          name="employeeNumber"
                          value={formData.employeeNumber}
                          onChange={handleInputChange}
                          placeholder="AP001"
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="role" className="form-label fw-semibold">
                          Rol <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        >
                          {roleOptions.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="departmentId" className="form-label fw-semibold">
                          Departman <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="departmentId"
                          name="departmentId"
                          value={formData.departmentId}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                        >
                          <option value="">Departman seçiniz</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex gap-3 justify-content-end pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={handleCancel}
                      disabled={loading}
                      style={{ borderRadius: '12px' }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-4"
                      disabled={loading}
                      style={{ borderRadius: '12px' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Oluşturuluyor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Kullanıcı Oluştur
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .add-user-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .form-control.is-invalid {
          border-color: #dc3545;
        }
        
        .btn:disabled {
          opacity: 0.65;
        }
        
        .position-relative .btn {
          border: none;
          background: transparent;
        }
        
        .position-relative .btn:hover {
          background: rgba(0, 0, 0, 0.05);
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
      `}</style>
    </div>
  );
};

export default AddUser;