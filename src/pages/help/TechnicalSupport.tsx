import React from 'react';

const TechnicalSupport: React.FC = () => {
  return (
    <div className="technical-support-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Teknik Destek</h2>
        <p className="text-muted">Teknik destek talebi oluşturun ve takip edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .technical-support-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default TechnicalSupport;
