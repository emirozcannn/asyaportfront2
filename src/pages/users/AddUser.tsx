// src/pages/users/AddUser.tsx - Database schema'ya uygun versiyon
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/users';
import { getAllDepartments } from '../../api/departments/getAllDepartments';
import type { Department } from '../../api/types/department';

// API request format (database schema'ya uygun)
interface CreateUserRequest {
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  department_id: string;  // ZORUNLU
  role: string;
  is_active: boolean;
  // created_at field'ını eklemeyin - database DEFAULT now() kullanacak
}

// Form data type (UI için)
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  employeeNumber: string;
  departmentId: string;
  role: string;
}

// Database schema'daki valid roller
const VALID_ROLES = [
  { value: 'User', label: '👤 Kullanıcı', description: 'Temel kullanıcı yetkileri' },
  { value: 'ServiceStaff', label: '🔧 Servis Personeli', description: 'Bakım ve servis işlemleri' },
  { value: 'departmentAdmin', label: '👥 Departman Yöneticisi', description: 'Departman yönetimi' },
  { value: 'SuperAdmin', label: '⚡ Süper Yönetici', description: 'Tüm sistem yetkileri' }
];

// Basit password hash fonksiyonu (production'da daha güçlü olmalı)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Employee number generator
const generateEmployeeNumber = (): string => {
  const prefix = 'AP';
  const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `${prefix}${number}`;
};

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    employeeNumber: generateEmployeeNumber(),
    departmentId: '',
    role: 'User',
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Departmanları yükle
  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
    } catch (err) {
      console.error('Departmanlar yüklenemedi:', err);
      setError('Departmanlar yüklenemedi');
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Ad zorunludur';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Soyad zorunludur';
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

    if (!formData.employeeNumber.trim()) {
      errors.employeeNumber = 'Personel numarası zorunludur';
    }

    if (!formData.departmentId) {
      errors.departmentId = 'Departman seçimi zorunludur';
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

      // Password'u hash'le
      const hashedPassword = await hashPassword(formData.password);

      // API request payload'ını hazırla (database schema'ya uygun)
      // created_at field'ını eklemeyin - database DEFAULT now() kullanacak
      const payload: CreateUserRequest = {
        employee_number: formData.employeeNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password_hash: hashedPassword,
        department_id: formData.departmentId,
        role: formData.role,
        is_active: true
        // created_at: EKLEMEYIN - database default'u kullanacak
      };

      await createUser(payload);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard/users');
      }, 2000);
    } catch (err) {
      let errorMessage = 'Kullanıcı oluşturulamadı';
      
      if (err instanceof Error) {
        if (err.message.includes('chk_users_role')) {
          errorMessage = 'Geçersiz rol seçimi. Lütfen geçerli bir rol seçin.';
        } else if (err.message.includes('email') && err.message.includes('unique')) {
          errorMessage = 'Bu e-posta adresi zaten kullanılıyor';
        } else if (err.message.includes('employee_number') && err.message.includes('unique')) {
          errorMessage = 'Bu personel numarası zaten kullanılıyor';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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

  // Generate new employee number
  const handleGenerateEmployeeNumber = () => {
    setFormData(prev => ({
      ...prev,
      employeeNumber: generateEmployeeNumber()
    }));
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
                  <strong>{formData.firstName} {formData.lastName}</strong> adlı kullanıcı sisteme başarıyla eklendi.
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
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        employeeNumber: generateEmployeeNumber(),
                        departmentId: '',
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

              {loadingDepartments && (
                <div className="alert alert-info d-flex align-items-center" role="alert">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  <div>Departmanlar yükleniyor...</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Ad */}
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      Ad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Kullanıcının adı"
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback">{formErrors.firstName}</div>
                    )}
                  </div>

                  {/* Soyad */}
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                      Soyad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Kullanıcının soyadı"
                    />
                    {formErrors.lastName && (
                      <div className="invalid-feedback">{formErrors.lastName}</div>
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

                  {/* Personel Numarası */}
                  <div className="col-md-6">
                    <label htmlFor="employeeNumber" className="form-label">
                      Personel Numarası <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className={`form-control ${formErrors.employeeNumber ? 'is-invalid' : ''}`}
                        id="employeeNumber"
                        name="employeeNumber"
                        value={formData.employeeNumber}
                        onChange={handleInputChange}
                        placeholder="AP1234"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleGenerateEmployeeNumber}
                        title="Yeni numara üret"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                      {formErrors.employeeNumber && (
                        <div className="invalid-feedback">{formErrors.employeeNumber}</div>
                      )}
                    </div>
                  </div>

                  {/* Şifre */}
                  <div className="col-md-12">
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

                  {/* Departman */}
                  <div className="col-md-6">
                    <label htmlFor="departmentId" className="form-label">
                      Departman <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.departmentId ? 'is-invalid' : ''}`}
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      disabled={loadingDepartments}
                    >
                      <option value="">Departman Seçin</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.departmentId && (
                      <div className="invalid-feedback">{formErrors.departmentId}</div>
                    )}
                  </div>

                  {/* Rol */}
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label">
                      Kullanıcı Rolü <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      {VALID_ROLES.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">
                      {VALID_ROLES.find(r => r.value === formData.role)?.description}
                    </div>
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
                    disabled={loading || loadingDepartments}
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
                  <i className="bi bi-building me-2 text-info"></i>
                  Departman seçimi zorunludur ve değiştirilebilir
                </li>
                <li className="mb-2">
                  <i className="bi bi-key me-2 text-warning"></i>
                  Şifre güvenli bir şekilde hash'lenerek saklanır
                </li>
                <li className="mb-0">
                  <i className="bi bi-person-badge me-2 text-primary"></i>
                  Personel numarası benzersiz olmalıdır (örn: AP1234)
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