import React from 'react';

const APIManagement: React.FC = () => {
  return (
    <div className="api-management-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">API Yönetimi</h2>
        <p className="text-muted">API anahtarları ve erişim ayarlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .api-management-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default APIManagement;
