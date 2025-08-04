import React from 'react';

const mockProfile = {
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  email: 'ahmet@asyaport.com',
  role: 'Admin',
  department: 'Operasyon Departmanı',
  employeeNumber: '1001',
  isActive: true,
  joined: '2022-01-15'
};

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Profilim</h2>
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', maxWidth: 500, margin: '0 auto' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-gradient d-flex align-items-center justify-content-center text-white fw-bold me-3"
                style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '24px' }}>
                {mockProfile.firstName[0]}{mockProfile.lastName[0]}
              </div>
              <div>
                <div className="fw-semibold text-dark" style={{ fontSize: '20px' }}>
                  {mockProfile.firstName} {mockProfile.lastName}
                </div>
                <small className="text-muted">{mockProfile.email}</small>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Rol</label>
              <div>
                <span className="badge bg-danger">{mockProfile.role}</span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Departman</label>
              <div>{mockProfile.department}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Çalışan No</label>
              <div>{mockProfile.employeeNumber}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Durum</label>
              <div>
                {mockProfile.isActive ? (
                  <span className="badge bg-success">Aktif</span>
                ) : (
                  <span className="badge bg-danger">Pasif</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Sisteme Katılım</label>
              <div>{mockProfile.joined}</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-2px); }
        .form-label { margin-bottom: 0.25rem; }
        .badge { font-weight: 500; letter-spacing: 0.025em; }
      `}</style>
    </div>
  );
};

export default Profile;
