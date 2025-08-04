import React from 'react';

const CostCenters: React.FC = () => {
  return (
    <div className="cost-centers-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Maliyet Merkezleri</h2>
        <p className="text-muted">Maliyet merkezlerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .cost-centers-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default CostCenters;
