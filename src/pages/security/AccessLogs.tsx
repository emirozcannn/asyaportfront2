import React from 'react';

const AccessLogs: React.FC = () => {
  return (
    <div className="access-logs-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Sistem Erişim Logları</h2>
        <p className="text-muted">Sistem erişim kayıtlarını görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .access-logs-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AccessLogs;
