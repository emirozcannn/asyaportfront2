// src/components/UserManagement/UserDetailModal.tsx - API'siz versiyon
import React, { useState } from 'react';

// Types
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  employeeNumber: string;
  createdAt: string;
  status?: 'Active' | 'Inactive';
}

interface UserDetailModalProps {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onEdit?: (userId: string) => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ 
  show, 
  user, 
  onClose, 
  onEdit 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'bg-danger text-white';
      case 'Admin': return 'bg-warning text-dark';
      case 'departmentAdmin': return 'bg-info text-white';
      case 'User': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'Süper Admin';
      case 'Admin': return 'Admin';
      case 'departmentAdmin': return 'Departman Admin';
      case 'User': return 'Kullanıcı';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === '0001-01-01T02:00:00') {
      return 'Belirtilmemiş';
    }
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    if (dateString === '0001-01-01T02:00:00') {
      return 0;
    }
    const diffTime = new Date().getTime() - new Date(dateString).getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleClose = () => {
    setActiveTab('overview');
    onClose();
  };

  if (!show || !user) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2 text-primary"></i>
              Kullanıcı Detayları
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* User Profile Section */}
            <div className="row mb-4">
              <div className="col-md-4 text-center">
                {/* Avatar */}
                <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person fs-1 text-primary"></i>
                </div>
                
                {/* User Info */}
                <h5 className="fw-bold mb-1">{user.fullName}</h5>
                <p className="text-muted mb-2 small">{user.email}</p>
                <span className={`badge ${getRoleBadgeColor(user.role)} mb-2`}>
                  {getRoleDisplayName(user.role)}
                </span>
                
                {/* Status */}
                <div className="d-flex justify-content-center">
                  {user.status !== 'Inactive' ? (
                    <span className="badge bg-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Aktif
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      <i className="bi bi-x-circle me-1"></i>
                      Pasif
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-8">
                {/* Contact Info */}
                <h6 className="fw-semibold mb-3">
                  <i className="bi bi-info-circle me-2 text-info"></i>
                  Kullanıcı Bilgileri
                </h6>
                
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-envelope text-muted me-2"></i>
                      <div>
                        <small className="text-muted d-block">E-posta</small>
                        <span className="small">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-badge text-muted me-2"></i>
                      <div>
                        <small className="text-muted d-block">Personel No</small>
                        <code className="bg-light px-2 py-1 rounded small">{user.employeeNumber}</code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-shield-check text-muted me-2"></i>
                      <div>
                        <small className="text-muted d-block">Rol</small>
                        <span className="small">{getRoleDisplayName(user.role)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-plus text-muted me-2"></i>
                      <div>
                        <small className="text-muted d-block">Kayıt Tarihi</small>
                        <span className="small">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-hash text-muted me-2"></i>
                      <div>
                        <small className="text-muted d-block">Kullanıcı ID</small>
                        <code className="bg-light px-2 py-1 rounded small">{user.id}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <ul className="nav nav-pills nav-fill mb-3">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Genel Bakış
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('assignments')}
                >
                  <i className="bi bi-box-seam me-1"></i>
                  Zimmetler
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  <i className="bi bi-clock-history me-1"></i>
                  Aktivite
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="card bg-primary bg-opacity-10 border-0 text-center">
                        <div className="card-body py-3">
                          <i className="bi bi-box-seam fs-4 text-primary mb-2"></i>
                          <h6 className="fw-bold text-primary mb-1">0</h6>
                          <small className="text-muted">Aktif Zimmet</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-success bg-opacity-10 border-0 text-center">
                        <div className="card-body py-3">
                          <i className="bi bi-check-circle fs-4 text-success mb-2"></i>
                          <h6 className="fw-bold text-success mb-1">0</h6>
                          <small className="text-muted">Teslim Edildi</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-info bg-opacity-10 border-0 text-center">
                        <div className="card-body py-3">
                          <i className="bi bi-calendar-event fs-4 text-info mb-2"></i>
                          <h6 className="fw-bold text-info mb-1">
                            {getDaysAgo(user.createdAt)}
                          </h6>
                          <small className="text-muted">Gün Önce Katıldı</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Stats */}
                  <div className="mt-4">
                    <h6 className="fw-semibold mb-3">Özet Bilgiler</h6>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-2 bg-light rounded">
                          <i className="bi bi-person-check text-success me-2"></i>
                          <div>
                            <small className="text-muted d-block">Hesap Durumu</small>
                            <span className="small fw-medium">
                              {user.status !== 'Inactive' ? 'Aktif Kullanıcı' : 'Pasif Kullanıcı'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-2 bg-light rounded">
                          <i className="bi bi-shield-check text-primary me-2"></i>
                          <div>
                            <small className="text-muted d-block">Yetki Seviyesi</small>
                            <span className="small fw-medium">{getRoleDisplayName(user.role)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignments Tab */}
              {activeTab === 'assignments' && (
                <div className="tab-pane fade show active">
                  <div className="text-center py-4">
                    <i className="bi bi-box-seam fs-2 text-muted"></i>
                    <h6 className="text-muted mt-2">Zimmet Bulunamadı</h6>
                    <p className="text-muted small mb-3">Bu kullanıcıya henüz zimmet atanmamış</p>
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-plus me-1"></i>
                      Zimmet Ata
                    </button>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="tab-pane fade show active">
                  <div className="text-center py-4">
                    <i className="bi bi-activity fs-2 text-muted"></i>
                    <h6 className="text-muted mt-2">Aktivite Geçmişi</h6>
                    <p className="text-muted small mb-3">
                      Kullanıcı aktivite geçmişi burada görünecek
                    </p>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item d-flex align-items-center">
                        <i className="bi bi-person-plus text-success me-3"></i>
                        <div>
                          <div className="fw-medium small">Hesap Oluşturuldu</div>
                          <small className="text-muted">{formatDate(user.createdAt)}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              <i className="bi bi-x-lg me-1"></i>
              Kapat
            </button>
            {onEdit && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => onEdit(user.id)}
              >
                <i className="bi bi-pencil me-1"></i>
                Düzenle
              </button>
            )}
            <button type="button" className="btn btn-outline-success">
              <i className="bi bi-plus me-1"></i>
              Zimmet Ata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;