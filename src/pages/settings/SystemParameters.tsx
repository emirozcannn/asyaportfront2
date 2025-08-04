import React from 'react';

const SystemParameters: React.FC = () => {
  return (
    <div className="system-parameters-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Sistem Parametreleri</h2>
        <p className="text-muted">Sistem parametrelerini yapılandırın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .system-parameters-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default SystemParameters;
