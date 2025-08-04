import React from 'react';

const OverdueReturns: React.FC = () => {
  return (
    <div className="overdue-returns-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Geciken İadeler</h2>
        <p className="text-muted">İade tarihi geçmiş zimmet öğelerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .overdue-returns-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default OverdueReturns;
