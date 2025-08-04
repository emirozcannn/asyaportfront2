import React from 'react';

const ExportReports: React.FC = () => {
  return (
    <div className="export-reports-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Excel/PDF Export</h2>
        <p className="text-muted">Raporları Excel ve PDF formatında dışa aktarın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .export-reports-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ExportReports;
