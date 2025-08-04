import React from 'react';

const Reminders: React.FC = () => {
  return (
    <div className="reminders-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Otomatik Hatırlatmalar</h2>
        <p className="text-muted">İade hatırlatma ayarlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .reminders-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default Reminders;
