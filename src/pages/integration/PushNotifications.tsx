import React from 'react';

const PushNotifications: React.FC = () => {
  return (
    <div className="push-notifications-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Push Bildirimler</h2>
        <p className="text-muted">Push bildirim ayarlarını yapılandırın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .push-notifications-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default PushNotifications;
