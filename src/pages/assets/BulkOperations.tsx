import React from 'react';

const BulkOperations: React.FC = () => {
  return (
    <div className="bulk-operations-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Toplu İşlemler</h2>
        <p className="text-muted">Zimmet toplu işlemleri gerçekleştirin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .bulk-operations-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default BulkOperations;
