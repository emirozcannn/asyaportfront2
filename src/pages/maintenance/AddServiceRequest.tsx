// src/pages/maintenance/AddServiceRequest.tsx
import React, { useState } from 'react';


interface ServiceRequestForm {
  assignedItem: string;
  problemDate: string;
  problemType: string;
  description: string;
}

const AddServiceRequest: React.FC = () => {
  const [formData, setFormData] = useState<ServiceRequestForm>({
    assignedItem: '',
    problemDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
    problemType: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ServiceRequestForm>>({});

  const problemTypes = [
    { value: 'Hardware', label: 'Donanım', icon: 'bi-cpu' },
    { value: 'Software', label: 'Yazılım', icon: 'bi-code-slash' },
    { value: 'Network', label: 'Ağ', icon: 'bi-wifi' },
    { value: 'Maintenance', label: 'Bakım', icon: 'bi-tools' },
    { value: 'Other', label: 'Diğer', icon: 'bi-question-circle' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata temizle
    if (errors[name as keyof ServiceRequestForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ServiceRequestForm> = {};

    if (!formData.assignedItem.trim()) {
      newErrors.assignedItem = 'Atanan varlık gereklidir';
    }

    if (!formData.problemType) {
      newErrors.problemType = 'Problem türü seçilmelidir';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
    }

    if (!formData.problemDate) {
      newErrors.problemDate = 'Problem tarihi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // ISO format'a çevir
      const submitData = {
        ...formData,
        problemDate: new Date(formData.problemDate).toISOString()
      };

      await createServiceRequest(submitData);
      
      // Başarılı mesajı göster ve listeye yönlendir
      alert('Servis talebi başarıyla oluşturuldu!');
      window.location.href = '/dashboard/maintenance/service-requests';
      
    } catch (error) {
      alert('Hata: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Değişiklikler kaydedilmeyecek. Çıkmak istediğinizden emin misiniz?')) {
      window.location.href = '/dashboard/maintenance/service-requests';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={handleCancel}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <div>
          <h4 className="mb-1 fw-bold">🔧 Yeni Servis Talebi</h4>
          <p className="text-muted mb-0">Yeni bir servis talebi oluşturun</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Problem Türü */}
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Problem Türü <span className="text-danger">*</span>
                    </label>
                    <select
                      name="problemType"
                      className={`form-select ${errors.problemType ? 'is-invalid' : ''}`}
                      value={formData.problemType}
                      onChange={handleInputChange}
                    >
                      <option value="">Problem türünü seçin</option>
                      {problemTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.problemType && (
                      <div className="invalid-feedback">{errors.problemType}</div>
                    )}
                  </div>

                  {/* Atanan Varlık */}
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Atanan Varlık <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="assignedItem"
                      className={`form-control ${errors.assignedItem ? 'is-invalid' : ''}`}
                      placeholder="Örn: Laptop-001, Server-05"
                      value={formData.assignedItem}
                      onChange={handleInputChange}
                    />
                    {errors.assignedItem && (
                      <div className="invalid-feedback">{errors.assignedItem}</div>
                    )}
                    <div className="form-text">
                      Problem yaşanan cihaz veya sistem adını girin
                    </div>
                  </div>

                  {/* Problem Tarihi */}
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Problem Tarihi <span className="text-danger">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="problemDate"
                      className={`form-control ${errors.problemDate ? 'is-invalid' : ''}`}
                      value={formData.problemDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().slice(0, 16)}
                    />
                    {errors.problemDate && (
                      <div className="invalid-feedback">{errors.problemDate}</div>
                    )}
                    <div className="form-text">
                      Problemin yaşandığı tarih ve saat
                    </div>
                  </div>

                  {/* Boş alan (grid için) */}
                  <div className="col-md-6"></div>

                  {/* Açıklama */}
                  <div className="col-12">
                    <label className="form-label fw-medium">
                      Açıklama <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="description"
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows={4}
                      placeholder="Problemin detaylı açıklamasını yazın..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                    <div className="form-text">
                      En az 10 karakter. Problemin ne olduğunu, nasıl oluştuğunu ve mevcut durumunu detaylandırın.
                    </div>
                  </div>

                  {/* Seçilen problem türü için önizleme */}
                  {formData.problemType && (
                    <div className="col-12">
                      <div className="alert alert-info border-0">
                        <div className="d-flex align-items-center">
                          <div className="bg-info bg-opacity-20 rounded-circle p-2 me-3">
                            <i className={`bi ${problemTypes.find(t => t.value === formData.problemType)?.icon} text-info`}></i>
                          </div>
                          <div>
                            <h6 className="alert-heading mb-1">
                              {problemTypes.find(t => t.value === formData.problemType)?.label} Problemi
                            </h6>
                            <p className="mb-0 small">
                              Bu tür problemler genellikle teknik ekip tarafından incelenir ve çözüm süreci başlatılır.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Butonları */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Oluşturuluyor...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Talebi Oluştur
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Yardım Kutusu */}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-lightbulb me-2 text-warning"></i>
                İpuçları
              </h6>
              <ul className="mb-0 small text-muted">
                <li className="mb-2">
                  <strong>Atanan Varlık:</strong> Problemli cihazın tam adını veya kodunu yazın (Örn: "Muhasebe-PC-01", "3. Kat Yazıcı")
                </li>
                <li className="mb-2">
                  <strong>Açıklama:</strong> Problemi mümkün olduğunca detaylı açıklayın. Hata mesajları varsa aynen yazın.
                </li>
                <li className="mb-0">
                  <strong>Problem Tarihi:</strong> Problemin ilk kez ne zaman fark edildiğini belirtin.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceRequest;