import React from 'react';

const ApprovalSettings: React.FC = () => {
  return (
    <div className="approval-settings-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Onay Süreç Ayarları</h2>
        <p className="text-muted">Onay süreçlerini yapılandırın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .approval-settings-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ApprovalSettings;
