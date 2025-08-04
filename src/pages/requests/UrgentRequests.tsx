import React from 'react';

const UrgentRequests: React.FC = () => {
  return (
    <div className="urgent-requests-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Acil Talepler</h2>
        <p className="text-muted">Acil zimmet taleplerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .urgent-requests-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default UrgentRequests;
