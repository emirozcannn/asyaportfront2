import React from 'react';

const CostAnalysis: React.FC = () => {
  return (
    <div className="cost-analysis-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Maliyet Analizleri</h2>
        <p className="text-muted">Zimmet maliyetlerini analiz edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .cost-analysis-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default CostAnalysis;
