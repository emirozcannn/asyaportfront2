import React from 'react';

const PerformanceTracking: React.FC = () => {
  return (
    <div className="performance-tracking-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Performans Takibi</h2>
        <p className="text-muted">Personel performans verilerini takip edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .performance-tracking-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default PerformanceTracking;
