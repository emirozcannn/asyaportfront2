// src/pages/maintenance/AddMaintenanceEventModal.tsx
import React, { useState, useEffect } from 'react';
import { createMaintenanceSchedule } from '../../api/maintenance/createMaintenanceSchedule';

interface MaintenanceEventForm {
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  assignedTo: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection' | '';
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | '';
}

interface AddMaintenanceEventModalProps {
  show: boolean;
  selectedDate?: string;
  onClose: () => void;
  onEventCreated: () => void;
}

const AddMaintenanceEventModal: React.FC<AddMaintenanceEventModalProps> = ({
  show,
  selectedDate,
  onClose,
  onEventCreated
}) => {
  const [formData, setFormData] = useState<MaintenanceEventForm>({
    title: '',
    description: '',
    scheduledDate: '',
    duration: 60, // Default 1 saat
    assignedTo: '',
    equipmentId: '',
    equipmentName: '',
    maintenanceType: '',
    priority: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<MaintenanceEventForm>>({});

  const maintenanceTypes = [
    { value: 'Preventive', label: 'Önleyici Bakım', icon: 'bi-shield-check', color: 'success' },
    { value: 'Corrective', label: 'Düzeltici Bakım', icon: 'bi-tools', color: 'warning' },
    { value: 'Emergency', label: 'Acil Bakım', icon: 'bi-exclamation-triangle', color: 'danger' },
    { value: 'Inspection', label: 'İnceleme', icon: 'bi-search', color: 'info' }
  ];

  const priorities = [
    { value: 'Low', label: 'Düşük', color: 'secondary' },
    { value: 'Medium', label: 'Orta', color: 'info' },
    { value: 'High', label: 'Yüksek', color: 'warning' },
    { value: 'Critical', label: 'Kritik', color: 'danger' }
  ];

  const durationPresets = [
    { minutes: 30, label: '30 dakika' },
    { minutes: 60, label: '1 saat' },
    { minutes: 120, label: '2 saat' },
    { minutes: 240, label: '4 saat' },
    { minutes: 480, label: '8 saat' }
  ];

  // Modal açıldığında form'u reset et ve selectedDate'i set et
  useEffect(() => {
    if (show) {
      const initialDate = selectedDate || new Date().toISOString().slice(0, 16);
      setFormData({
        title: '',
        description: '',
        scheduledDate: initialDate,
        duration: 60,
        assignedTo: '',
        equipmentId: '',
        equipmentName: '',
        maintenanceType: '',
        priority: ''
      });
      setErrors({});
    }
  }, [show, selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
    
    // Hata temizle
    if (errors[name as keyof MaintenanceEventForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDurationPresetClick = (minutes: number) => {
    setFormData(prev => ({ ...prev, duration: minutes }));
    if (errors.duration) {
      setErrors(prev => ({ ...prev, duration: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MaintenanceEventForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!formData.maintenanceType) {
      newErrors.maintenanceType = 'Bakım türü seçilmelidir';
    }

    if (!formData.priority) {
      newErrors.priority = 'Öncelik seçilmelidir';
    }

    if (!formData.equipmentName.trim()) {
      newErrors.equipmentName = 'Ekipman adı gereklidir';
    }

    if (!formData.equipmentId.trim()) {
      newErrors.equipmentId = 'Ekipman ID gereklidir';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Planlanan tarih gereklidir';
    } else {
      const selectedDateTime = new Date(formData.scheduledDate);
      const now = new Date();
      if (selectedDateTime < now) {
        newErrors.scheduledDate = 'Planlanan tarih gelecekte olmalıdır';
      }
    }

    if (formData.duration < 15) {
      newErrors.duration = 'Süre en az 15 dakika olmalıdır';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
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
      
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        duration: formData.duration,
        assignedTo: formData.assignedTo.trim(),
        equipmentId: formData.equipmentId.trim(),
        equipmentName: formData.equipmentName.trim(),
        maintenanceType: formData.maintenanceType,
        priority: formData.priority
      };

      await createMaintenanceSchedule(submitData);
      onEventCreated();
      
    } catch (error) {
      alert('Hata: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Değişiklikler kaydedilmeyecek. Çıkmak istediğinizden emin misiniz?')) {
      onClose();
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} dakika`;
    if (mins === 0) return `${hours} saat`;
    return `${hours} saat ${mins} dakika`;
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title fw-bold">🔧 Yeni Bakım Planla</h5>
              <p className="text-muted mb-0 small">Yeni bir bakım etkinliği oluşturun</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Başlık */}
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Başlık <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Örn: Klima filtre değişimi, Jeneratör bakımı"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                {/* Bakım Türü ve Öncelik */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Bakım Türü <span className="text-danger">*</span>
                  </label>
                  <select
                    name="maintenanceType"
                    className={`form-select ${errors.maintenanceType ? 'is-invalid' : ''}`}
                    value={formData.maintenanceType}
                    onChange={handleInputChange}
                  >
                    <option value="">Bakım türünü seçin</option>
                    {maintenanceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.maintenanceType && (
                    <div className="invalid-feedback">{errors.maintenanceType}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Öncelik <span className="text-danger">*</span>
                  </label>
                  <select
                    name="priority"
                    className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="">Öncelik seçin</option>
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  {errors.priority && (
                    <div className="invalid-feedback">{errors.priority}</div>
                  )}
                </div>

                {/* Ekipman Bilgileri */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Ekipman Adı <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="equipmentName"
                    className={`form-control ${errors.equipmentName ? 'is-invalid' : ''}`}
                    placeholder="Örn: Merkezi Klima Sistemi, Jeneratör-01"
                    value={formData.equipmentName}
                    onChange={handleInputChange}
                  />
                  {errors.equipmentName && (
                    <div className="invalid-feedback">{errors.equipmentName}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Ekipman ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="equipmentId"
                    className={`form-control ${errors.equipmentId ? 'is-invalid' : ''}`}
                    placeholder="Örn: EQ-001, GEN-05"
                    value={formData.equipmentId}
                    onChange={handleInputChange}
                  />
                  {errors.equipmentId && (
                    <div className="invalid-feedback">{errors.equipmentId}</div>
                  )}
                </div>

                {/* Tarih ve Süre */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Planlanan Tarih & Saat <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    className={`form-control ${errors.scheduledDate ? 'is-invalid' : ''}`}
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {errors.scheduledDate && (
                    <div className="invalid-feedback">{errors.scheduledDate}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Tahmini Süre <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="duration"
                      className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                      placeholder="60"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="15"
                    />
                    <span className="input-group-text">dakika</span>
                  </div>
                  {errors.duration && (
                    <div className="invalid-feedback">{errors.duration}</div>
                  )}
                  
                  {/* Süre Presetleri */}
                  <div className="d-flex gap-1 mt-2 flex-wrap">
                    {durationPresets.map(preset => (
                      <button
                        key={preset.minutes}
                        type="button"
                        className={`btn btn-sm ${formData.duration === preset.minutes ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleDurationPresetClick(preset.minutes)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  
                  {formData.duration > 0 && (
                    <small className="text-muted">
                      {formatDuration(formData.duration)}
                    </small>
                  )}
                </div>

                {/* Atanan Kişi */}
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Atanan Kişi
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    className="form-control"
                    placeholder="Teknisyen adını girin (isteğe bağlı)"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                  />
                  <div className="form-text">
                    Boş bırakılırsa daha sonra atanabilir
                  </div>
                </div>

                {/* Açıklama */}
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Açıklama <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows={3}
                    placeholder="Yapılacak bakım işlemlerini detaylı olarak açıklayın..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                  <div className="form-text">
                    En az 10 karakter. Yapılacak işlemleri, gerekli malzemeleri ve dikkat edilecek noktaları belirtin.
                  </div>
                </div>

                {/* Önizleme */}
                {formData.maintenanceType && formData.priority && (
                  <div className="col-12">
                    <div className="alert alert-light border">
                      <div className="d-flex align-items-center">
                        <div className={`bg-${maintenanceTypes.find(t => t.value === formData.maintenanceType)?.color} bg-opacity-20 rounded-circle p-2 me-3`}>
                          <i className={`bi ${maintenanceTypes.find(t => t.value === formData.maintenanceType)?.icon} text-${maintenanceTypes.find(t => t.value === formData.maintenanceType)?.color}`}></i>
                        </div>
                        <div>
                          <h6 className="alert-heading mb-1">
                            {maintenanceTypes.find(t => t.value === formData.maintenanceType)?.label} - 
                            <span className={`badge bg-${priorities.find(p => p.value === formData.priority)?.color} ms-2`}>
                              {priorities.find(p => p.value === formData.priority)?.label}
                            </span>
                          </h6>
                          <p className="mb-0 small text-muted">
                            Bu bakım etkinliği takvime eklenecek ve ilgili ekibe bildirilecektir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="modal-footer border-0 pt-0">
            <div className="d-flex justify-content-end gap-2 w-100">
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
                onClick={handleSubmit}
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
                    Bakım Planla
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenanceEventModal;