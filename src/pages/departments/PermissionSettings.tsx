import React from 'react';

const PermissionSettings: React.FC = () => {
  return (
    <div className="permission-settings-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Yetki Ayarları</h2>
        <p className="text-muted">Departman yetki ayarlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .permission-settings-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default PermissionSettings;
