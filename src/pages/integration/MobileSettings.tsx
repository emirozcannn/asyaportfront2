import React from 'react';

const MobileSettings: React.FC = () => {
  return (
    <div className="mobile-settings-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Mobil Uygulama Ayarları</h2>
        <p className="text-muted">Mobil uygulama konfigürasyonlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .mobile-settings-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default MobileSettings;
