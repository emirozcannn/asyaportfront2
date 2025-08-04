import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="documentation-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Sistem Dokümantasyonu</h2>
        <p className="text-muted">Sistem kullanım dokümantasyonu ve kılavuzları</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .documentation-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default Documentation;
