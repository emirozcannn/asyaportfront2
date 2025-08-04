import React from 'react';

const CompletedReturns: React.FC = () => {
  return (
    <div className="completed-returns-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Tamamlanan İadeler</h2>
        <p className="text-muted">İade işlemi tamamlanmış zimmet öğelerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .completed-returns-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default CompletedReturns;
