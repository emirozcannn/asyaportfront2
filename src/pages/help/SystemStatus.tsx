import React from 'react';

const SystemStatus: React.FC = () => {
  return (
    <div className="system-status-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Sistem Durumu</h2>
        <p className="text-muted">Sistem performansı ve durum bilgileri</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .system-status-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default SystemStatus;
