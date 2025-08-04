import React from 'react';

const MaintenanceHistory: React.FC = () => {
  return (
    <div className="maintenance-history-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Bakım Geçmişi</h2>
        <p className="text-muted">Geçmiş bakım kayıtlarını görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .maintenance-history-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default MaintenanceHistory;
