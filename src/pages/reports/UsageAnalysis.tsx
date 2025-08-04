import React from 'react';

const UsageAnalysis: React.FC = () => {
  return (
    <div className="usage-analysis-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Kullanım Analizi</h2>
        <p className="text-muted">Zimmet kullanım istatistiklerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .usage-analysis-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default UsageAnalysis;
