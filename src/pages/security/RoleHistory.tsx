import React from 'react';

const RoleHistory: React.FC = () => {
  return (
    <div className="role-history-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Yetki Değişiklik Geçmişi</h2>
        <p className="text-muted">Kullanıcı yetki değişikliklerini takip edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .role-history-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default RoleHistory;
