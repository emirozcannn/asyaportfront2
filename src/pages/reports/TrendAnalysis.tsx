import React from 'react';

const TrendAnalysis: React.FC = () => {
  return (
    <div className="trend-analysis-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Trend Analizleri</h2>
        <p className="text-muted">Zimmet trend verilerini inceleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .trend-analysis-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default TrendAnalysis;
