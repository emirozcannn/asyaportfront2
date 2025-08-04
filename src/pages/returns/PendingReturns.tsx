import React from 'react';

const PendingReturns: React.FC = () => {
  return (
    <div className="pending-returns-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Bekleyen İadeler</h2>
        <p className="text-muted">İade edilmesi gereken zimmet öğelerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .pending-returns-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default PendingReturns;
