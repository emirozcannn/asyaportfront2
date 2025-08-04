import React from 'react';

const ProcurementRequests: React.FC = () => {
  return (
    <div className="procurement-requests-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Satın Alma Talepleri</h2>
        <p className="text-muted">Satın alma taleplerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .procurement-requests-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ProcurementRequests;
