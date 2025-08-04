import React from 'react';

const ReportsOverview: React.FC = () => {
  return (
    <div className="reports-overview-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Genel Dashboard</h2>
        <p className="text-muted">Tüm rapor özetlerini ve dashboard verilerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .reports-overview-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ReportsOverview;
