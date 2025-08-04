import React from 'react';

const ThirdPartyIntegrations: React.FC = () => {
  return (
    <div className="third-party-integrations-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Üçüncü Parti Entegrasyonlar</h2>
        <p className="text-muted">Harici sistem entegrasyonlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .third-party-integrations-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ThirdPartyIntegrations;
