import React from 'react';

const SecurityPolicies: React.FC = () => {
  return (
    <div className="security-policies-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Güvenlik Politikaları</h2>
        <p className="text-muted">Sistem güvenlik politikalarını yapılandırın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .security-policies-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default SecurityPolicies;
