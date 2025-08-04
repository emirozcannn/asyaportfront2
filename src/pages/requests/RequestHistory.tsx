import React from 'react';

const RequestHistory: React.FC = () => {
  return (
    <div className="request-history-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Talep Geçmişi</h2>
        <p className="text-muted">Tüm zimmet talep geçmişini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .request-history-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default RequestHistory;
