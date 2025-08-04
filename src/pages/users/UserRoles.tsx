import React from 'react';

const UserRoles: React.FC = () => {
  return (
    <div className="backup-restore-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Yedekleme/Geri Yükleme</h2>
        <p className="text-muted">Sistem yedekleme ve geri yükleme işlemleri</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .backup-restore-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default UserRoles;
