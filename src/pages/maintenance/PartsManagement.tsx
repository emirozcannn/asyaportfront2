import React from 'react';

const PartsManagement: React.FC = () => {
  return (
    <div className="parts-management-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Yedek Parça Yönetimi</h2>
        <p className="text-muted">Yedek parça stok ve yönetim işlemleri</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .parts-management-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default PartsManagement;
