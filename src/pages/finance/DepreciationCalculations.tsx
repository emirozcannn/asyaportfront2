import React from 'react';

const DepreciationCalculations: React.FC = () => {
  return (
    <div className="depreciation-calculations-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Amortisman Hesaplamaları</h2>
        <p className="text-muted">Zimmet amortisman hesaplamalarını görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .depreciation-calculations-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default DepreciationCalculations;
