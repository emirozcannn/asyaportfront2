import React from 'react';

const SuspiciousActivity: React.FC = () => {
  return (
    <div className="suspicious-activity-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Şüpheli Aktiviteler</h2>
        <p className="text-muted">Şüpheli sistem aktivitelerini tespit edin ve inceleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .suspicious-activity-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default SuspiciousActivity;
