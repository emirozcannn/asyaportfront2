import React from 'react';

const GeneralReports: React.FC = () => {
  return (
    <div className="general-reports-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Genel Raporlar</h2>
        <p className="text-muted">Sistem geneli raporları görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .general-reports-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default GeneralReports;
