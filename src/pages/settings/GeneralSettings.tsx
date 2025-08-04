import React from 'react';

const GeneralSettings: React.FC = () => {
  return (
    <div className="general-settings-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Genel Ayarlar</h2>
        <p className="text-muted">Sistem genel ayarlarını yapılandırın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .general-settings-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default GeneralSettings;
