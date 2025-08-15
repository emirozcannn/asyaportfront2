// src/pages/maintenance/MaintenanceEventModal.tsx
import React, { useState } from 'react';

interface MaintenanceEvent {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  assignedTo: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Overdue';
  createdAt: string;
}

interface MaintenanceEventModalProps {
  show: boolean;
  event: MaintenanceEvent | null;
  onClose: () => void;
  onEdit: (eventId: string) => void;
  onStatusUpdate?: () => void;
}

const MaintenanceEventModal: React.FC<MaintenanceEventModalProps> = ({
  show,
  event,
  onClose,
  onEdit,
  onStatusUpdate
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!show || !event) return null;

  const getMaintenanceTypeIcon = (type: MaintenanceEvent['maintenanceType']) => {
    switch (type) {
      case 'Preventive': return 'bi-shield-check';
      case 'Corrective': return 'bi-tools';
      case 'Emergency': return 'bi-exclamation-triangle';
      case 'Inspection': return 'bi-search';
      default: return 'bi-gear';
    }
  };

  const getMaintenanceTypeColor = (type: MaintenanceEvent['maintenanceType']) => {
    switch (type) {
      case 'Preventive': return 'success';
      case 'Corrective': return 'warning';
      case 'Emergency': return 'danger';
      case 'Inspection': return 'info';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: MaintenanceEvent['priority']) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: MaintenanceEvent['status']) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'InProgress': return 'info';
      case 'Completed': return 'success';
      case 'Cancelled': return 'secondary';
      case 'Overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusDisplayName = (status: MaintenanceEvent['status']) => {
    switch (status) {
      case 'Scheduled': return 'Planlandı';
      case 'InProgress': return 'Devam Ediyor';
      case 'Completed': return 'Tamamlandı';
      case 'Cancelled': return 'İptal Edildi';
      case 'Overdue': return 'Gecikmiş';
      default: return status;
    }
  };

  const getPriorityDisplayName = (priority: MaintenanceEvent['priority']) => {
    switch (priority) {
      case 'Critical': return 'Kritik';
      case 'High': return 'Yüksek';
      case 'Medium': return 'Orta';
      case 'Low': return 'Düşük';
      default: return priority;
    }
  };

  const getMaintenanceTypeDisplayName = (type: MaintenanceEvent['maintenanceType']) => {
    switch (type) {
      case 'Preventive': return 'Önleyici Bakım';
      case 'Corrective': return 'Düzeltici Bakım';
      case 'Emergency': return 'Acil Bakım';
      case 'Inspection': return 'İnceleme';
      default: return type;
    }
  };

  const handleStatusUpdate = async (newStatus: MaintenanceEvent['status']) => {
    try {
      setIsUpdatingStatus(true);
      await updateMaintenanceStatus(event.id, newStatus);
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      alert('Durum güncellenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getNextStatusActions = (currentStatus: MaintenanceEvent['status']) => {
    const actions: { status: MaintenanceEvent['status']; label: string; color: string; icon: string }[] = [];
    
    switch (currentStatus) {
      case 'Scheduled':
        actions.push(
          { status: 'InProgress', label: 'Başla', color: 'btn-info', icon: 'bi-play-fill' },
          { status: 'Cancelled', label: 'İptal Et', color: 'btn-danger', icon: 'bi-x-circle' }
        );
        break;
      case 'InProgress':
        actions.push(
          { status: 'Completed', label: 'Tamamla', color: 'btn-success', icon: 'bi-check-circle' },
          { status: 'Scheduled', label: 'Duraklat', color: 'btn-warning', icon: 'bi-pause-fill' }
        );
        break;
      case 'Completed':
        actions.push(
          { status: 'InProgress', label: 'Yeniden Aç', color: 'btn-info', icon: 'bi-arrow-clockwise' }
        );
        break;
      case 'Cancelled':
        actions.push(
          { status: 'Scheduled', label: 'Yeniden Planla', color: 'btn-primary', icon: 'bi-arrow-clockwise' }
        );
        break;
      case 'Overdue':
        actions.push(
          { status: 'InProgress', label: 'Başla', color: 'btn-info', icon: 'bi-play-fill' },
          { status: 'Scheduled', label: 'Yeniden Planla', color: 'btn-primary', icon: 'bi-calendar' }
        );
        break;
    }
    
    return actions;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} dakika`;
    if (mins === 0) return `${hours} saat`;
    return `${hours} saat ${mins} dakika`;
  };

  const isEventOverdue = () => {
    const now = new Date();
    const eventDate = new Date(event.scheduledDate);
    return event.status === 'Scheduled' && eventDate < now;
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center w-100">
              <div className={`bg-${getMaintenanceTypeColor(event.maintenanceType)} bg-opacity-10 rounded-circle p-3 me-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                <i className={`bi ${getMaintenanceTypeIcon(event.maintenanceType)} text-${getMaintenanceTypeColor(event.maintenanceType)} fs-4`}></i>
              </div>
              <div className="flex-grow-1">
                <h5 className="modal-title mb-1">{event.title}</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge bg-${getStatusColor(event.status)}`}>
                    {getStatusDisplayName(event.status)}
                  </span>
                  <span className={`badge bg-${getPriorityColor(event.priority)}`}>
                    {getPriorityDisplayName(event.priority)}
                  </span>
                  {isEventOverdue() && (
                    <span className="badge bg-danger">
                      <i className="bi bi-clock me-1"></i>
                      Gecikmiş
                    </span>
                  )}
                </div>
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
                      Bakım Bilgileri
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Bakım Türü</label>
                        <p className="mb-0 fw-medium">
                          <i className={`bi ${getMaintenanceTypeIcon(event.maintenanceType)} me-2 text-${getMaintenanceTypeColor(event.maintenanceType)}`}></i>
                          {getMaintenanceTypeDisplayName(event.maintenanceType)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Planlanan Tarih & Saat</label>
                        <p className="mb-0">
                          {new Date(event.scheduledDate).toLocaleDateString('tr-TR', {
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
                        <label className="form-label text-muted small">Tahmini Süre</label>
                        <p className="mb-0">
                          <i className="bi bi-clock me-2 text-info"></i>
                          {formatDuration(event.duration)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Atanan Kişi</label>
                        <p className="mb-0">
                          <i className="bi bi-person me-2 text-primary"></i>
                          {event.assignedTo || 'Atanmamış'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ekipman Bilgileri */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-gear me-2"></i>
                      Ekipman Bilgileri
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Ekipman Adı</label>
                        <p className="mb-0 fw-medium">{event.equipmentName}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Ekipman ID</label>
                        <p className="mb-0">
                          <code className="bg-white px-2 py-1 rounded">{event.equipmentId}</code>
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
                      {event.description || 'Açıklama bulunmuyor.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Durum Yönetimi */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-flag me-2"></i>
                      Durum Yönetimi
                    </h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className={`badge ${getStatusColor(event.status)} bg-${getStatusColor(event.status)} fs-6 px-3 py-2`}>
                          {getStatusDisplayName(event.status)}
                        </span>
                        <small className="text-muted d-block mt-1">
                          Oluşturulma: {new Date(event.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                      
                      {/* Durum Güncelleme Butonları */}
                      <div className="d-flex gap-2 flex-wrap">
                        {getNextStatusActions(event.status).map((action) => (
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

              {/* Zaman Çizelgesi */}
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-3">
                      <i className="bi bi-clock-history me-2"></i>
                      Zaman Çizelgesi
                    </h6>
                    <div className="timeline">
                      {/* Oluşturulma */}
                      <div className="d-flex align-items-start mb-3">
                        <div className="bg-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                          <i className="bi bi-plus text-white small"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">Bakım Planlandı</p>
                          <small className="text-muted">
                            {new Date(event.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      </div>
                      
                      {/* Planlanan Tarih */}
                      <div className="d-flex align-items-start mb-3">
                        <div className={`rounded-circle p-2 me-3 d-flex align-items-center justify-content-center bg-${getStatusColor(event.status)}`} style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                          <i className="bi bi-calendar text-white small"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">
                            Planlanan Tarih
                            {isEventOverdue() && (
                              <span className="badge bg-danger ms-2 small">Gecikmiş</span>
                            )}
                          </p>
                          <small className="text-muted">
                            {new Date(event.scheduledDate).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      </div>

                      {/* Mevcut Durum */}
                      {event.status !== 'Scheduled' && (
                        <div className="d-flex align-items-start mb-3">
                          <div className={`rounded-circle p-2 me-3 d-flex align-items-center justify-content-center bg-${getStatusColor(event.status)}`} style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                            <i className="bi bi-flag text-white small"></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-medium">Durum: {getStatusDisplayName(event.status)}</p>
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
                onClick={() => onEdit(event.id)}
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

export default MaintenanceEventModal;