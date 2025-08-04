import React from 'react';

const AutoApprove: React.FC = () => {
  return (
    <div className="auto-approve-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Otomatik Onaylar</h2>
        <p className="text-muted">Otomatik onay kurallarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .auto-approve-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AutoApprove;
