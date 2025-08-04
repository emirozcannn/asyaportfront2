import React from 'react';

const IPRestrictions: React.FC = () => {
  return (
    <div className="ip-restrictions-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">IP Kısıtlamaları</h2>
        <p className="text-muted">IP tabanlı erişim kısıtlamalarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .ip-restrictions-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default IPRestrictions;
