import React from 'react';

const SessionManagement: React.FC = () => {
  return (
    <div className="session-management-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Oturum Yönetimi</h2>
        <p className="text-muted">Aktif kullanıcı oturumlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .session-management-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default SessionManagement;
