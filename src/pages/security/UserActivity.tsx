import React from 'react';

const UserActivity: React.FC = () => {
  return (
    <div className="user-activity-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Kullanıcı Aktiviteleri</h2>
        <p className="text-muted">Kullanıcı aktivitelerini izleyin ve analiz edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .user-activity-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default UserActivity;
