import React from 'react';

const UserReports: React.FC = () => {
  return (
    <div className="user-reports-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Kullanıcı Raporları</h2>
        <p className="text-muted">Kullanıcı bazlı raporları görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .user-reports-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default UserReports;
