// src/pages/maintenance/ServiceRequestDetailModal.tsx
import React, { useState } from 'react';

interface ServiceRequest {
  id: string;
  assignedItem: string;
  problemDate: string;
  problemType: string;
  description: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

interface ServiceRequestDetailModalProps {
  show: boolean;
  request: ServiceRequest | null;
  onClose: () => void;
  onEdit: (requestId: string) => void;
  onStatusUpdate?: () => void;
}

const ServiceRequestDetailModal: React.FC<ServiceRequestDetailModalProps> = ({
  show,
  request,
  onClose,
  onEdit,
  onStatusUpdate
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!show || !request) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'InProgress': return 'bg-info';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'Pending': return 'Beklemede';
      case 'InProgress': return 'İşlemde';
      case 'Completed': return 'Tamamlandı';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getProblemTypeIcon = (problemType: string) => {
    switch (problemType.toLowerCase()) {
      case 'hardware': return 'bi-cpu';
      case 'software': return 'bi-code-slash';
      case 'network': return 'bi-wifi';
      case 'maintenance': return 'bi-tools';
      default: return 'bi-exclamation-triangle';
    }
  };

  const handleStatusUpdate = async (newStatus: ServiceRequest['status']) => {
    try {
      setIsUpdatingStatus(true);
      await updateServiceRequestStatus(request.id, newStatus);
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      alert('Durum güncellenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getNextStatusActions = (currentStatus: ServiceRequest['status']) => {
    const actions: { status: ServiceRequest['status']; label: string; color: string; icon: string }[] = [];
    
    switch (currentStatus) {
      case 'Pending':
        actions.push(
          { status: 'InProgress', label: 'İşleme Al', color: 'btn-info', icon: 'bi-play-fill' },
          { status: 'Cancelled', label: 'İptal Et', color: 'btn-danger', icon: 'bi-x-circle' }
        );
        break;
      case 'InProgress':
        actions.push(
          { status: 'Completed', label: 'Tamamla', color: 'btn-success', icon: 'bi-check-circle' },
          { status: 'Pending', label: 'Beklemeye Al', color: 'btn-warning', icon: 'bi-pause-fill' },
          { status: 'Cancelled', label: 'İptal Et', color: 'btn-danger', icon: 'bi-x-circle' }
        );
        break;
      case 'Completed':
        actions.push(
          { status: 'InProgress', label: 'Yeniden Aç', color: 'btn-info', icon: 'bi-arrow-clockwise' }
        );
        break;
      case 'Cancelled':
        actions.push(
          { status: 'Pending', label: 'Yeniden Aç', color: 'btn-warning', icon: 'bi-arrow-clockwise' }
        );
        break;
    }
    
    return actions;
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <i className={`bi ${getProblemTypeIcon(request.problemType)} text-primary fs-4`}></i>
              </div>
              <div>
                <h5 className="modal-title mb-1">Servis Talebi Detayları</h5>
                <p className="text-muted mb-0">ID: {request.id}</p>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-4">
              {/* Temel Bilgiler */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Temel Bilgiler
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Atanan Varlık</label>
                        <p className="mb-0 fw-medium">{request.assignedItem}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Problem Türü</label>
                        <p className="mb-0 fw-medium">{request.problemType}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Problem Tarihi</label>
                        <p className="mb-0">
                          {new Date(request.problemDate).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Oluşturma Tarihi</label>
                        <p className="mb-0">
                          {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Açıklama */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-card-text me-2"></i>
                      Açıklama
                    </h6>
                    <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                      {request.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Durum */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-flag me-2"></i>
                      Talep Durumu
                    </h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className={`badge ${getStatusBadgeColor(request.status)} fs-6 px-3 py-2`}>
                          {getStatusDisplayName(request.status)}
                        </span>
                      </div>
                      
                      {/* Durum Güncelleme Butonları */}
                      <div className="d-flex gap-2">
                        {getNextStatusActions(request.status).map((action) => (
                          <button
                            key={action.status}
                            className={`btn btn-sm ${action.color}`}
                            onClick={() => handleStatusUpdate(action.status)}
                            disabled={isUpdatingStatus}
                            title={action.label}
                          >
                            {isUpdatingStatus ? (
                              <span className="spinner-border spinner-border-sm me-1"></span>
                            ) : (
                              <i className={`bi ${action.icon} me-1`}></i>
                            )}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline (Placeholder - gelecekte aktiviteler için) */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-clock-history me-2"></i>
                      Aktivite Geçmişi
                    </h6>
                    <div className="timeline">
                      <div className="d-flex align-items-start mb-3">
                        <div className="bg-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                          <i className="bi bi-plus text-white small"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">Talep Oluşturuldu</p>
                          <small className="text-muted">
                            {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      </div>
                      
                      {request.status !== 'Pending' && (
                        <div className="d-flex align-items-start mb-3">
                          <div className={`rounded-circle p-2 me-3 d-flex align-items-center justify-content-center ${getStatusBadgeColor(request.status)}`} style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                            <i className="bi bi-arrow-right text-white small"></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-medium">Durum: {getStatusDisplayName(request.status)}</p>
                            <small className="text-muted">Güncel durum</small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <div className="d-flex justify-content-between w-100">
              <button 
                type="button" 
                className="btn btn-outline-primary"
                onClick={() => onEdit(request.id)}
              >
                <i className="bi bi-pencil me-1"></i>
                Düzenle
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetailModal;