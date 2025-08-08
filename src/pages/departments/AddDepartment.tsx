// ==============================================
// AddDepartment.tsx - Modern Bootstrap Design
// ==============================================
import React, { useState } from 'react';
import { 
  createDepartment, 
  getAllDepartments,
  type CreateDepartmentDto,
  type Department
} from '../../api/departments';

interface AddDepartmentProps {
  onSuccess?: (department: Department) => void;
  onCancel?: () => void;
  isModal?: boolean;
  onNavigateBack?: () => void;
}

export const AddDepartment: React.FC<AddDepartmentProps> = ({ 
  onSuccess, 
  onCancel, 
  isModal = false,
  onNavigateBack
}) => {
  const [formData, setFormData] = useState<CreateDepartmentDto>({
    name: '',
    code: ''
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Client-side validation
  const validateCreateDepartment = (data: CreateDepartmentDto): string[] => {
    const errors: string[] = [];
    const newFieldErrors: { [key: string]: string } = {};
    
    if (!data.name.trim()) {
      errors.push('Departman adı gereklidir');
      newFieldErrors.name = 'Departman adı gereklidir';
    } else if (data.name.trim().length < 2) {
      errors.push('Departman adı en az 2 karakter olmalıdır');
      newFieldErrors.name = 'Departman adı en az 2 karakter olmalıdır';
    }
    
    if (!data.code.trim()) {
      errors.push('Departman kodu gereklidir');
      newFieldErrors.code = 'Departman kodu gereklidir';
    } else if (data.code.length < 2 || data.code.length > 4) {
      errors.push('Departman kodu 2-4 karakter olmalıdır');
      newFieldErrors.code = 'Departman kodu 2-4 karakter olmalıdır';
    } else if (!/^[A-Z]+$/.test(data.code)) {
      errors.push('Departman kodu sadece büyük harflerden oluşmalıdır');
      newFieldErrors.code = 'Sadece büyük harflerden oluşmalıdır';
    }
    
    setFieldErrors(newFieldErrors);
    return errors;
  };

  // Check if department code is unique
  const isDepartmentCodeUnique = async (code: string): Promise<boolean> => {
    try {
      const departments = await getAllDepartments();
      return !departments.some(dept => dept.code.toLowerCase() === code.toLowerCase());
    } catch (error) {
      console.error('Error checking code uniqueness:', error);
      return true;
    }
  };

  // Auto-generate department code from name
  const generateCodeFromName = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }
    return words.map(word => word.charAt(0)).join('').toUpperCase().substring(0, 4);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'code') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Auto-generate code from name
    if (name === 'name' && !formData.code) {
      const generatedCode = generateCodeFromName(value);
      setFormData(prev => ({
        ...prev,
        name: value,
        code: generatedCode
      }));
    }
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCodeBlur = async () => {
    if (formData.code && formData.code.length >= 2) {
      setIsValidating(true);
      try {
        const isUnique = await isDepartmentCodeUnique(formData.code);
        if (!isUnique) {
          setErrors(['Bu departman kodu zaten kullanılıyor']);
          setFieldErrors(prev => ({ ...prev, code: 'Bu kod zaten kullanılıyor' }));
        }
      } catch (error) {
        console.error('Error validating code:', error);
      }
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateCreateDepartment(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Check uniqueness again before submitting
      const isCodeUnique = await isDepartmentCodeUnique(formData.code);
      if (!isCodeUnique) {
        setErrors(['Bu departman kodu zaten kullanılıyor']);
        setFieldErrors(prev => ({ ...prev, code: 'Bu kod zaten kullanılıyor' }));
        setIsLoading(false);
        return;
      }

      const newDepartment = await createDepartment(formData);
      
      // Reset form
      setFormData({ name: '', code: '' });
      setFieldErrors({});
      
      // Show success alert
      showAlert('Departman başarıyla oluşturuldu!', 'success');
      
      // Call success callback
      if (onSuccess) {
        onSuccess(newDepartment);
      }
      
      // Redirect to departments list if not in modal mode
      if (!isModal && onNavigateBack) {
        // Small delay to show success message
        setTimeout(() => {
          onNavigateBack();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error creating department:', error);
      const errorMessage = error instanceof Error ? error.message : 'Departman oluşturulamadı';
      
      if (errorMessage.includes('foreign key constraint') || errorMessage.includes('duplicate')) {
        setErrors(['Bu departman kodu zaten kullanılıyor']);
        setFieldErrors(prev => ({ ...prev, code: 'Bu kod zaten kullanılıyor' }));
      } else {
        setErrors([errorMessage]);
      }
      showAlert('Departman oluşturulamadı', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
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

  // Modal render
  if (isModal) {
    return (
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <div className="modal-header border-0 p-4 bg-primary">
              <h4 className="modal-title text-white fw-bold mb-0">
                <i className="bi bi-building-add me-3"></i>
                Yeni Departman Ekle
              </h4>
              {onCancel && (
                <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="alert alert-danger border-0 shadow-sm" role="alert" style={{ borderRadius: '8px' }}>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Lütfen aşağıdaki hataları düzeltin:</strong>
                    </div>
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="row g-4">
                  {/* Department Name */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-building me-2"></i>
                      Departman Adı <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control shadow-sm border-0 bg-light ${fieldErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="örn: İnsan Kaynakları"
                      required
                      style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                    />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                  </div>

                  {/* Department Code */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-tag me-2"></i>
                      Departman Kodu <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="code"
                        className={`form-control shadow-sm border-0 bg-light ${fieldErrors.code ? 'is-invalid' : ''}`}
                        value={formData.code}
                        onChange={handleInputChange}
                        onBlur={handleCodeBlur}
                        placeholder="örn: HR"
                        maxLength={4}
                        required
                        style={{ borderRadius: '6px 0 0 6px', padding: '12px 16px', fontSize: '1rem' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary border-0 bg-light"
                        onClick={() => {
                          const generatedCode = generateCodeFromName(formData.name);
                          setFormData(prev => ({ ...prev, code: generatedCode }));
                        }}
                        title="Departman adından otomatik kod oluştur"
                        disabled={!formData.name}
                        style={{ borderRadius: '0 6px 6px 0' }}
                      >
                        <i className="bi bi-magic"></i>
                      </button>
                    </div>
                    {isValidating && (
                      <div className="form-text text-primary mt-2">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Kod kontrol ediliyor...
                      </div>
                    )}
                    {fieldErrors.code && <div className="invalid-feedback">{fieldErrors.code}</div>}
                    <div className="form-text text-muted">2-4 büyük harf (örn: HR, IT, SEC)</div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-4 bg-light">
                {onCancel && (
                  <button 
                    type="button" 
                    className="btn btn-light shadow-sm" 
                    onClick={onCancel}
                    style={{ borderRadius: '6px', padding: '10px 20px' }}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary shadow-sm"
                  disabled={isLoading || isValidating}
                  style={{ borderRadius: '6px', padding: '10px 20px' }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Departman Oluştur
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Full page render
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
                    <a href="#" onClick={onNavigateBack} className="text-decoration-none text-primary">
                      <i className="bi bi-house-door me-1"></i>
                      Departmanlar
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-muted" aria-current="page">Yeni Departman Ekle</li>
                </ol>
              </nav>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-building-add text-primary fs-4"></i>
                </div>
                <div>
                  <h2 className="mb-1 fw-bold text-dark">Yeni Departman Ekle</h2>
                  <p className="text-muted mb-0">Sisteme yeni departman kaydı oluşturun</p>
                </div>
              </div>
            </div>
            <div>
              {onNavigateBack && (
                <button 
                  type="button" 
                  className="btn btn-outline-secondary shadow-sm"
                  onClick={onNavigateBack}
                  style={{ borderRadius: '6px', padding: '10px 20px' }}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Geri Dön
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Main Form Card */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
            <div className="card-header border-0 p-4" style={{ backgroundColor: '#ffffff', borderRadius: '8px 8px 0 0' }}>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-info-circle text-primary fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold text-dark">Departman Bilgileri</h4>
                  <p className="text-muted mb-0">Gerekli alanları doldurun</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="card-body p-4">
                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert" style={{ borderRadius: '8px' }}>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Lütfen aşağıdaki hataları düzeltin:</strong>
                    </div>
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="row g-4">
                  {/* Department Name */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-building me-2"></i>
                      Departman Adı <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control form-control-lg shadow-sm border-0 bg-light ${fieldErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="örn: İnsan Kaynakları"
                      required
                      style={{ borderRadius: '8px', padding: '16px 20px', fontSize: '1.1rem' }}
                    />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                    <div className="form-text text-muted mt-2">Departmanın tam adını girin</div>
                  </div>

                  {/* Department Code */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-tag me-2"></i>
                      Departman Kodu <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <input
                        type="text"
                        name="code"
                        className={`form-control shadow-sm border-0 bg-light ${fieldErrors.code ? 'is-invalid' : ''}`}
                        value={formData.code}
                        onChange={handleInputChange}
                        onBlur={handleCodeBlur}
                        placeholder="örn: HR"
                        maxLength={4}
                        required
                        style={{ borderRadius: '8px 0 0 8px', padding: '16px 20px', fontSize: '1.1rem' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary border-0 bg-light shadow-sm"
                        onClick={() => {
                          const generatedCode = generateCodeFromName(formData.name);
                          setFormData(prev => ({ ...prev, code: generatedCode }));
                        }}
                        title="Departman adından otomatik kod oluştur"
                        disabled={!formData.name}
                        style={{ borderRadius: '0 8px 8px 0', padding: '16px 20px' }}
                      >
                        <i className="bi bi-magic fs-5"></i>
                      </button>
                    </div>
                    {isValidating && (
                      <div className="form-text text-primary mt-2">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Kod benzersizliği kontrol ediliyor...
                      </div>
                    )}
                    {fieldErrors.code && <div className="invalid-feedback">{fieldErrors.code}</div>}
                    <div className="form-text text-muted mt-2">2-4 karakter uzunluğunda büyük harflerden oluşmalıdır</div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="card-footer border-0 p-4 bg-light d-flex justify-content-end gap-3" style={{ borderRadius: '0 0 8px 8px' }}>
                {onNavigateBack && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary shadow-sm"
                    onClick={onNavigateBack}
                    style={{ borderRadius: '6px', padding: '12px 24px' }}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg shadow-sm"
                  disabled={isLoading || isValidating}
                  style={{ borderRadius: '6px', padding: '12px 32px' }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Departman Oluştur
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar - Help */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
            <div className="card-header border-0 p-4" style={{ backgroundColor: '#fff3cd', borderRadius: '8px 8px 0 0' }}>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-lightbulb text-warning fs-4"></i>
                </div>
                <h5 className="mb-0 fw-bold text-dark">Yardımcı İpuçları</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="d-flex align-items-start mb-4">
                <div className="bg-primary bg-opacity-10 rounded p-2 me-3 flex-shrink-0">
                  <i className="bi bi-tag text-primary"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-2">Departman Kodu</h6>
                  <p className="text-muted small mb-0">
                    Departman adından otomatik kod oluşturabilir veya kendiniz belirleyebilirsiniz. 
                    Kod benzersiz olmalıdır.
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <div className="bg-success bg-opacity-10 rounded p-2 me-3 flex-shrink-0">
                  <i className="bi bi-check-circle text-success"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-2">Otomatik Kontrol</h6>
                  <p className="text-muted small mb-0">
                    Sistem otomatik olarak kod benzersizliğini kontrol eder ve uyarır.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div className="bg-info bg-opacity-10 rounded p-2 me-3 flex-shrink-0">
                  <i className="bi bi-info-circle text-info"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-2">Kod Standartları</h6>
                  <p className="text-muted small mb-0">
                    Kodlar 2-4 karakter uzunluğunda ve sadece büyük harflerden oluşmalıdır.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Examples Card */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <div className="card-header border-0 p-4" style={{ backgroundColor: '#d1ecf1', borderRadius: '8px 8px 0 0' }}>
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-list-check text-info fs-4"></i>
                </div>
                <h5 className="mb-0 fw-bold text-dark">Örnek Departmanlar</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded text-center" style={{ borderRadius: '8px' }}>
                    <div className="fw-semibold mb-2 text-dark">İnsan Kaynakları</div>
                    <span className="badge bg-primary px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '6px' }}>HR</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded text-center" style={{ borderRadius: '8px' }}>
                    <div className="fw-semibold mb-2 text-dark">Bilgi İşlem</div>
                    <span className="badge bg-primary px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '6px' }}>IT</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded text-center" style={{ borderRadius: '8px' }}>
                    <div className="fw-semibold mb-2 text-dark">Mali İşler</div>
                    <span className="badge bg-primary px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '6px' }}>FIN</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded text-center" style={{ borderRadius: '8px' }}>
                    <div className="fw-semibold mb-2 text-dark">Satış</div>
                    <span className="badge bg-primary px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '6px' }}>SALE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          border-color: rgba(13, 110, 253, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AddDepartment;