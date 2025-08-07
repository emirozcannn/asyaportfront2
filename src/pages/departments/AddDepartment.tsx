// ==============================================
// AddDepartment.tsx - Pure Bootstrap
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
      
      // Call success callback
      if (onSuccess) {
        onSuccess(newDepartment);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Modal render
  if (isModal) {
    return (
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-building-add me-2"></i>
                Yeni Departman Ekle
              </h5>
              {onCancel && (
                <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Hata:</strong>
                    <ul className="mb-0 mt-2">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="row g-3">
                  {/* Department Name */}
                  <div className="col-12">
                    <label className="form-label fw-medium">Departman Adı <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="örn: İnsan Kaynakları"
                      required
                    />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                  </div>

                  {/* Department Code */}
                  <div className="col-12">
                    <label className="form-label fw-medium">Departman Kodu <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="code"
                      className={`form-control ${fieldErrors.code ? 'is-invalid' : ''}`}
                      value={formData.code}
                      onChange={handleInputChange}
                      onBlur={handleCodeBlur}
                      placeholder="örn: HR"
                      maxLength={4}
                      required
                    />
                    {isValidating && (
                      <div className="form-text text-primary">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Kod kontrol ediliyor...
                      </div>
                    )}
                    {fieldErrors.code && <div className="invalid-feedback">{fieldErrors.code}</div>}
                    <div className="form-text text-muted">2-4 büyük harf (örn: HR, ICT, SEC)</div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                {onCancel && (
                  <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    <i className="bi bi-x-lg me-1"></i>
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || isValidating}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i>
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
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" onClick={onNavigateBack} className="text-decoration-none text-primary">
                  <i className="bi bi-house-door me-1"></i>
                  Departmanlar
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Yeni Departman Ekle</li>
            </ol>
          </nav>
          <div className="d-flex align-items-center mb-2">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <i className="bi bi-building-add text-primary fs-4"></i>
            </div>
            <div>
              <h2 className="mb-0 fw-bold text-dark">Yeni Departman Ekle</h2>
              <p className="text-muted mb-0 fs-6">Sisteme yeni departman kaydı oluşturun</p>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          {onNavigateBack && (
            <button 
              type="button" 
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={onNavigateBack}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Geri Dön
            </button>
          )}
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          {/* Main Form Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <i className="bi bi-info-circle text-primary"></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-dark">Departman Bilgileri</h5>
                  <small className="text-muted">Gerekli alanları doldurun</small>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="card-body p-4">
                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="alert alert-danger" role="alert">
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
                    <label className="form-label fw-medium text-dark">
                      <i className="bi bi-building me-1"></i>
                      Departman Adı <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control form-control-lg ${fieldErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="örn: İnsan Kaynakları"
                      required
                    />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                    <div className="form-text">Departmanın tam adını girin</div>
                  </div>

                  {/* Department Code */}
                  <div className="col-12">
                    <label className="form-label fw-medium text-dark">
                      <i className="bi bi-tag me-1"></i>
                      Departman Kodu <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="code"
                        className={`form-control form-control-lg ${fieldErrors.code ? 'is-invalid' : ''}`}
                        value={formData.code}
                        onChange={handleInputChange}
                        onBlur={handleCodeBlur}
                        placeholder="örn: HR"
                        maxLength={4}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                          const generatedCode = generateCodeFromName(formData.name);
                          setFormData(prev => ({ ...prev, code: generatedCode }));
                        }}
                        title="Departman adından otomatik kod oluştur"
                        disabled={!formData.name}
                      >
                        <i className="bi bi-magic"></i>
                      </button>
                    </div>
                    {isValidating && (
                      <div className="form-text text-primary mt-2">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Kod benzersizliği kontrol ediliyor...
                      </div>
                    )}
                    {fieldErrors.code && <div className="invalid-feedback">{fieldErrors.code}</div>}
                    <div className="form-text">2-4 karakter uzunluğunda büyük harflerden oluşmalıdır</div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="card-footer bg-light border-top d-flex justify-content-end gap-2">
                {onNavigateBack && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={onNavigateBack}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg d-flex align-items-center"
                  disabled={isLoading || isValidating}
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
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-warning bg-opacity-10 border-bottom">
              <div className="d-flex align-items-center">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                <h6 className="mb-0 fw-bold text-dark">Yardımcı İpuçları</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-start mb-3">
                <div className="bg-primary bg-opacity-15 rounded p-2 me-3 flex-shrink-0">
                  <i className="bi bi-tag text-primary"></i>
                </div>
                <div>
                  <h6 className="fw-medium mb-1">Departman Kodu</h6>
                  <p className="text-muted small mb-0">
                    Departman adından otomatik kod oluşturabilir veya kendiniz belirleyebilirsiniz. 
                    Kod benzersiz olmalıdır.
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <div className="bg-success bg-opacity-15 rounded p-2 me-3 flex-shrink-0">
                  <i className="bi bi-check-circle text-success"></i>
                </div>
                <div>
                  <h6 className="fw-medium mb-1">Otomatik Kontrol</h6>
                  <p className="text-muted small mb-0">
                    Sistem otomatik olarak kod benzersizliğini kontrol eder ve uyarır.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div className="bg-info bg-opacity-15 rounded p-2 me-3 flex-shrink-0">
                  <i className="bi bi-info-circle text-info"></i>
                </div>
                <div>
                  <h6 className="fw-medium mb-1">Kod Standartları</h6>
                  <p className="text-muted small mb-0">
                    Kodlar 2-4 karakter uzunluğunda ve sadece büyük harflerden oluşmalıdır.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Examples Card */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-info bg-opacity-10">
              <div className="d-flex align-items-center">
                <i className="bi bi-list-check text-info me-2"></i>
                <h6 className="mb-0 fw-bold text-dark">Örnek Departmanlar</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-6">
                  <div className="p-2 bg-light rounded text-center">
                    <div className="fw-medium">İnsan Kaynakları</div>
                    <span className="badge bg-primary">HR</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 bg-light rounded text-center">
                    <div className="fw-medium">Bilgi İşlem</div>
                    <span className="badge bg-primary">IT</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 bg-light rounded text-center">
                    <div className="fw-medium">Mali İşler</div>
                    <span className="badge bg-primary">FIN</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 bg-light rounded text-center">
                    <div className="fw-medium">Satış</div>
                    <span className="badge bg-primary">SALE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;