import React from 'react';

const PendingRequests: React.FC = () => {
  return (
    <div className="pending-requests-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Bekleyen Talepler</h2>
        <p className="text-muted">Onay bekleyen zimmet taleplerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .pending-requests-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default PendingRequests;
